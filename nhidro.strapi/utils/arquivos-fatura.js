'use strict';

/**
 * Download das faturas com o nome do cliente (26/10/2026, pedido da Andréa,
 * faturamento): "renomeada pelo Tipo - Número - Cliente, sem colocar o nosso nome",
 * e "identificar se é da Hidro ou da Locação sem estar no nome" -> no ZIP, uma pasta
 * por empresa e, dentro dela, uma por tipo (NF, RL, CTE).
 */
const http = require('http');
const https = require('https');

/** Pasta da empresa no ZIP (id da tabela `empresas`). */
const PASTA_POR_EMPRESA = { 1: 'LOCACAO', 2: 'HIDROSANEAMENTO', 3: 'CRS', 4: 'ALDBRAS' };

function pastaDaEmpresa(empresaId, descricao) {
  if (PASTA_POR_EMPRESA[empresaId]) return PASTA_POR_EMPRESA[empresaId];
  const primeira = String(descricao || 'EMPRESA').trim().split(/\s+/)[0];
  return limparNome(primeira).toUpperCase() || 'EMPRESA';
}

/** Tira o que o Windows e o macOS não aceitam em nome de arquivo. */
function limparNome(texto) {
  return String(texto || '')
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
    .replace(/[. ]+$/, '');
}

function extensaoDa(url) {
  const limpo = String(url || '').split('?')[0].toLowerCase();
  const m = /\.([a-z0-9]{2,5})$/.exec(limpo);
  return m ? m[1] : 'pdf';
}

/** "NF 8336 - CLIENTE LTDA.pdf" — tipo, número e cliente, sem o nome da Nacional Hidro. */
function nomeDoArquivo(f) {
  const tipo = limparNome(f.tipo_fatura || 'FATURA').toUpperCase();
  const numero = limparNome(f.nota || `fatura ${f.id}`);
  const cliente = limparNome(f.cliente || 'CLIENTE');
  return `${tipo} ${numero} - ${cliente}.${extensaoDa(f.url_arquivo_nota)}`;
}

/** Baixa o arquivo (segue até 5 redirecionamentos). */
function baixar(url, redirecionamentos = 5) {
  return new Promise((ok, ko) => {
    const cliente = String(url).startsWith('https:') ? https : http;
    const req = cliente.get(url, { timeout: 60000 }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirecionamentos > 0) {
        res.resume();
        return ok(baixar(new URL(res.headers.location, url).toString(), redirecionamentos - 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return ko(new Error(`HTTP ${res.statusCode} ao baixar ${url}`));
      }
      const partes = [];
      res.on('data', (p) => partes.push(p));
      res.on('end', () => ok(Buffer.concat(partes)));
      res.on('error', ko);
    });
    req.on('timeout', () => req.destroy(new Error('Tempo esgotado ao baixar o arquivo.')));
    req.on('error', ko);
  });
}

// --- ZIP (método "store": PDF já vem comprimido) --------------------------------

const TABELA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = TABELA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dataDos(d) {
  const hora = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
  const dia = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { hora, dia };
}

/** Monta um .zip com `[{ nome: 'PASTA/SUB/arquivo.pdf', dados: Buffer }]` (nomes em UTF-8). */
function montarZip(arquivos, quando = new Date()) {
  const { hora, dia } = dataDos(quando);
  const locais = [];
  const centrais = [];
  let deslocamento = 0;
  for (const a of arquivos) {
    const nome = Buffer.from(a.nome, 'utf8');
    const crc = crc32(a.dados);
    const tam = a.dados.length;
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8); local.writeUInt16LE(hora, 10); local.writeUInt16LE(dia, 12);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(tam, 18); local.writeUInt32LE(tam, 22);
    local.writeUInt16LE(nome.length, 26); local.writeUInt16LE(0, 28);
    locais.push(local, nome, a.dados);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(0, 10); central.writeUInt16LE(hora, 12);
    central.writeUInt16LE(dia, 14); central.writeUInt32LE(crc, 16); central.writeUInt32LE(tam, 20);
    central.writeUInt32LE(tam, 24); central.writeUInt16LE(nome.length, 28); central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32); central.writeUInt16LE(0, 34); central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38); central.writeUInt32LE(deslocamento, 42);
    centrais.push(central, nome);
    deslocamento += 30 + nome.length + tam;
  }
  const tamCentral = centrais.reduce((t, b) => t + b.length, 0);
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0); fim.writeUInt16LE(0, 4); fim.writeUInt16LE(0, 6);
  fim.writeUInt16LE(arquivos.length, 8); fim.writeUInt16LE(arquivos.length, 10);
  fim.writeUInt32LE(tamCentral, 12); fim.writeUInt32LE(deslocamento, 16); fim.writeUInt16LE(0, 20);
  return Buffer.concat([...locais, ...centrais, fim]);
}

/** Nomes repetidos na mesma pasta ganham " (2)", " (3)"... */
function semRepetir(caminho, usados) {
  if (!usados.has(caminho)) { usados.add(caminho); return caminho; }
  const ponto = caminho.lastIndexOf('.');
  for (let n = 2; ; n++) {
    const novo = `${caminho.slice(0, ponto)} (${n})${caminho.slice(ponto)}`;
    if (!usados.has(novo)) { usados.add(novo); return novo; }
  }
}

module.exports = { nomeDoArquivo, pastaDaEmpresa, limparNome, baixar, montarZip, crc32, semRepetir };
