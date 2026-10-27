'use strict';

/**
 * Nota cancelada para consulta (27/10/2026, pedido da Andréa, faturamento): "ter a
 * opção de visualizar a nota cancelada sem ter que entrar no site da prefeitura".
 *
 * - Emissor antigo de Campinas (ABRASF): o DANFSe da Focus já sai com "CANCELADA"
 *   depois do cancelamento, então vai como está.
 * - Padrão nacional: o DANFSe continua igual ao da emissão. O sistema carimba
 *   "CANCELADA" com a data e o motivo do evento de cancelamento (XML -can.xml).
 * - Nota que a Focus ainda dá como autorizada: cancelada só no sistema; o carimbo
 *   avisa que na prefeitura ela segue valendo.
 */
const { PDFDocument, StandardFonts, rgb, degrees } = require('pdf-lib');

const tag = (xml, nome) => {
  const m = new RegExp(`<${nome}>([^<]*)</${nome}>`).exec(String(xml || ''));
  return m ? m[1].trim() : '';
};

/** "2026-10-14T16:47:21-03:00" -> "14/10/2026 16:47" (hora local do evento). */
function dataHoraBr(valor) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(String(valor || ''));
  if (!m) return '';
  return `${m[3]}/${m[2]}/${m[1]}${m[4] ? ` ${m[4]}:${m[5]}` : ''}`;
}

/** Data e motivo do XML de cancelamento (padrão nacional ou resposta ABRASF). */
function lerCancelamento(xml) {
  if (!xml) return {};
  const quando = tag(xml, 'dhEvento') || tag(xml, 'dhProc') || tag(xml, 'DataHora');
  return { data: dataHoraBr(quando), motivo: tag(xml, 'xMotivo') };
}

/** Helvetica só tem WinAnsi: troca o que ela não desenha em vez de quebrar. */
function textoSeguro(texto) {
  return String(texto || '')
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7e -ÿ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Quebra o texto em linhas que caibam na largura. */
function quebrar(texto, fonte, tamanho, largura) {
  const linhas = [];
  let atual = '';
  for (const palavra of textoSeguro(texto).split(' ')) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (atual && fonte.widthOfTextAtSize(tentativa, tamanho) > largura) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = tentativa;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

/**
 * Carimba todas as páginas: faixa no topo com o título e as linhas de detalhe, e a
 * palavra grande na diagonal, translúcida para a nota continuar legível.
 */
async function carimbar(pdf, { titulo, linhas = [], marca = 'CANCELADA', cor = rgb(0.78, 0.07, 0.07) }) {
  const doc = await PDFDocument.load(pdf, { ignoreEncryption: true });
  const negrito = await doc.embedFont(StandardFonts.HelveticaBold);
  const normal = await doc.embedFont(StandardFonts.Helvetica);
  for (const pagina of doc.getPages()) {
    const { width, height } = pagina.getSize();

    // Diagonal
    // Cabe na diagonal com folga, por mais longa que seja a palavra
    const diagonal = Math.sqrt(width * width + height * height);
    const tamanhoMarca = Math.min(Math.min(width, height) / 6, (diagonal * 0.62) / negrito.widthOfTextAtSize(marca, 1));
    const larguraMarca = negrito.widthOfTextAtSize(marca, tamanhoMarca);
    const angulo = Math.atan2(height, width);
    pagina.drawText(marca, {
      x: width / 2 - (Math.cos(angulo) * larguraMarca) / 2 + (Math.sin(angulo) * tamanhoMarca) / 3,
      y: height / 2 - (Math.sin(angulo) * larguraMarca) / 2 - (Math.cos(angulo) * tamanhoMarca) / 3,
      size: tamanhoMarca,
      font: negrito,
      color: cor,
      opacity: 0.18,
      rotate: degrees((angulo * 180) / Math.PI),
    });

    // Faixa no topo
    const margem = 14;
    const largura = width - margem * 2;
    const detalhes = linhas.flatMap((l) => quebrar(l, normal, 8, largura - 12));
    const altura = 8 + 13 + detalhes.length * 10 + 4;
    const topo = height - 6;
    pagina.drawRectangle({
      x: margem, y: topo - altura, width: largura, height: altura,
      color: rgb(1, 1, 1), opacity: 0.94, borderColor: cor, borderWidth: 1.5,
    });
    pagina.drawText(textoSeguro(titulo), { x: margem + 6, y: topo - 8 - 10, size: 11, font: negrito, color: cor });
    detalhes.forEach((linha, i) => {
      pagina.drawText(linha, { x: margem + 6, y: topo - 8 - 13 - 9 - i * 10, size: 8, font: normal, color: rgb(0.15, 0.15, 0.15) });
    });
  }
  return Buffer.from(await doc.save());
}

/**
 * Monta o carimbo conforme a situação na Focus.
 * `situacao`: { statusFocus, nacional, cancelamento: {data, motivo}, motivoSistema,
 *               dataSistema, numero, consultadoEm }
 */
function textoDoCarimbo(s) {
  const nota = s.numero ? `NFS-e nº ${s.numero}` : 'Esta nota';
  if (s.statusFocus && s.statusFocus !== 'cancelado') {
    return {
      titulo: 'ATENÇÃO: CANCELADA SÓ NO SISTEMA',
      marca: 'CANCELADA NO SISTEMA',
      linhas: [
        `${nota} foi cancelada no sistema em ${s.dataSistema || '-'}, mas na prefeitura ela consta como "${s.statusFocus}" (consulta à Focus em ${s.consultadoEm}).`,
        'Para valer, o cancelamento precisa ser feito também na prefeitura.',
        s.motivoSistema ? `Motivo informado no sistema: ${s.motivoSistema}` : '',
      ].filter(Boolean),
    };
  }
  const c = s.cancelamento || {};
  return {
    titulo: `NFS-e CANCELADA${c.data ? ` EM ${c.data}` : ''}`,
    marca: 'CANCELADA',
    linhas: [
      `${nota} cancelada na prefeitura${s.nacional ? ' (evento registrado no Ambiente Nacional da NFS-e)' : ''}.`,
      c.motivo || s.motivoSistema ? `Motivo: ${c.motivo || s.motivoSistema}` : '',
      `Cópia para consulta, gerada pelo sistema em ${s.consultadoEm}. Não tem valor fiscal.`,
    ].filter(Boolean),
  };
}

module.exports = { lerCancelamento, dataHoraBr, textoSeguro, carimbar, textoDoCarimbo };
