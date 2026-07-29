'use strict';
const fs = require('fs')
const path = require('path')
const utils = require('util')
const readFile = utils.promisify(fs.readFile)
var mustache = require('mustache');
var moment = require("moment");
const { formatNumberReal, minTommss } = require("../../../utils/functions");
const { Enum_RegimeTributario, Enum_TipoResponsabilidade } = require("../../../utils/enums");
const axios = require('axios').default;
const _ = require('lodash');
const sharp = require('sharp');

function compararPorData(a, b) {
  const dataA = moment(a.DataInicial, 'DD/MM/YYYY');
  const dataB = moment(b.DataInicial, 'DD/MM/YYYY');
  return dataA - dataB;
}

async function getTemplateHtml(file) {
  console.log("Loading template file in memory")
  try {
    const invoicePath = path.resolve(file);
    return await readFile(invoicePath, 'utf8');
  } catch (err) {
    console.log(err);
    return Promise.reject("Could not load html template");
  }
}

async function base64Encode(url) {
  let image = await axios.get(url, {responseType: 'arraybuffer'});
  let returnedB64 = Buffer.from(image.data).toString('base64');
  return returnedB64;
}

async function imageBase64() {
  try {
    return '<img width="100%" style="margin-bottom: 1%" src="data:image/png;base64,' + await base64Encode('https://prodnhidro.blob.core.windows.net/storage/proposta.png') + '"/>';
  } catch (error) {
    console.warn("Não foi possível baixar imagem de cabeçalho da Azure. Usando fallback local.");
    try {
      const localPath = path.resolve("./public/uploads/proposta.png");
      if (fs.existsSync(localPath)) {
        const data = fs.readFileSync(localPath);
        return '<img width="100%" style="margin-bottom: 1%" src="data:image/png;base64,' + data.toString('base64') + '"/>';
      }
    } catch (e) { /* ignore */ }
    return '';
  }
}

async function getAssinaturaBase64(url) {
  if (!url) return '';
  try {
    // 1. Tentar ler do filesystem local (se a imagem for do Strapi local)
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const localPath = path.resolve("./public/uploads/", filename);
    
    if (fs.existsSync(localPath)) {
      let dataBuffer = fs.readFileSync(localPath);
      if (dataBuffer.length > 50 * 1024) {
        try {
          dataBuffer = await sharp(dataBuffer)
            .resize({ width: 300 })
            .png({ quality: 80, compressionLevel: 8 })
            .toBuffer();
        } catch (sharpError) {
          console.warn(`[Proposta] Falha ao comprimir imagem local com sharp:`, sharpError.message);
        }
      }
      let ext = 'png';
      if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
        ext = 'jpeg';
      }
      return `data:image/${ext};base64,${dataBuffer.toString('base64')}`;
    }
    
    // 2. Fallback: baixar via axios caso não exista localmente (ex: Azure Blob)
    const image = await axios.get(url, { responseType: 'arraybuffer' });
    let dataBuffer = Buffer.from(image.data);
    if (dataBuffer.length > 50 * 1024) {
      try {
        dataBuffer = await sharp(dataBuffer)
          .resize({ width: 300 })
          .png({ quality: 80, compressionLevel: 8 })
          .toBuffer();
      } catch (sharpError) {
        console.warn(`[Proposta] Falha ao comprimir imagem remota com sharp:`, sharpError.message);
      }
    }
    let ext = 'png';
    if (url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg')) {
      ext = 'jpeg';
    }
    return `data:image/${ext};base64,${dataBuffer.toString('base64')}`;
  } catch (error) {
    console.warn(`[Proposta] Não foi possível converter a assinatura para base64:`, error.message || error);
    return url;
  }
}

// URL do lambda responsável por renderizar HTML -> PDF
const PDF_LAMBDA_URL = 'https://5o55bzdct8.execute-api.sa-east-1.amazonaws.com/prod';

// Chama o lambda de geração de PDF com retry, timeout e validação da resposta.
// Retorna um Buffer do PDF. Lança erro descritivo se todas as tentativas falharem.
async function gerarPdfViaLambda(payload, label = 'PDF', maxTentativas = 3) {
  let ultimoErro;
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      // Se a primeira tentativa falhar (ex: HTTP 502/413 devido a header base64 volumoso),
      // tenta enviar apenas { html: payload.html } pois a imagem de cabeçalho já está na URL da Azure no template HTML.
      const currentPayload = (tentativa > 1 && payload.header) ? { html: payload.html } : payload;
      const response = await axios({
        method: 'post',
        url: PDF_LAMBDA_URL,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(currentPayload),
        timeout: 60000,
      });
      const pdfData = response.data?.pdf?.data;
      if (!Array.isArray(pdfData) || pdfData.length === 0) {
        throw new Error(`resposta do lambda sem dados de PDF (status ${response.status})`);
      }
      if (tentativa > 1) {
        console.log(`[${label}] PDF gerado na tentativa ${tentativa}/${maxTentativas}.`);
      }
      return Buffer.from(pdfData);
    } catch (error) {
      ultimoErro = error;
      const motivo = error?.response?.status
        ? `HTTP ${error.response.status}`
        : (error?.code || error?.message || error);
      console.warn(`[${label}] Falha ao gerar PDF (tentativa ${tentativa}/${maxTentativas}): ${motivo}`);
      if (tentativa < maxTentativas) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * tentativa)); // backoff: 1s, 2s
      }
    }
  }
  throw new Error(`Não foi possível gerar o PDF (${label}) após ${maxTentativas} tentativas: ${ultimoErro?.message || ultimoErro}`);
}

const groupBy = (list, coluna1) => {
  const mapped = {};
  list.forEach(item => {
    if (item.Equipamento.Equipamento in mapped) return mapped[item.Equipamento.Equipamento].push(item);
  
    mapped[item.Equipamento.Equipamento] = [item];
  });
  
  const expectedFormat = Object.keys(mapped).map(key => {
    const o = {};
    o.key = key;
    o.values = mapped[key];
    
    return o;
  });
  return expectedFormat;
};

async function getHTMLOrdemServico (ordem) {
  ordem.Servicos?.forEach(element => {
    element.Equipamento = ordem.Equipamento.Equipamento
  });
  var view = {
    NumeroOS: `${ordem.Codigo}/${ordem.Numero}`,
    Data: moment(ordem.DataInicial).utc().format("DD/MM/YYYY"),
    Cliente: ordem.Cliente,
    Contato: ordem.Contato,
    Equipamento: ordem.Equipamento.Equipamento,
    Servicos: ordem.Servicos,
    Observacao: ordem.Observacoes
  }
  const res = await getTemplateHtml("./templates/ordem_servico.html");
  let rendered = mustache.render(res, view);
  return rendered
}

async function getHTMLMedicao (medicao) {
  medicao.Servicos = [];
  let desconto = 0;
  let extra = 0;
  let totalServico = 0;
  medicao.Ordens.forEach(obj => {
    desconto += obj.PrecificacaoDesconto || 0;
    extra += obj.PrecificacaoValorExtra || 0;
    obj.Servicos.forEach(s => {
      medicao.Servicos.push({
        DataInicial: moment(obj.DataInicial).utc().format("DD/MM/YYYY"),
        Codigo: obj.Codigo,
        Numero: obj.Numero,
        Placa: obj.Escala?.EscalaVeiculos?.map(item => { return `${item.Veiculo?.Placa}; ` }),
        Equipamento: obj.Equipamento.Equipamento,
        DescricaoServico: `${s.Discriminacao}; ${s.ObservacaoCobranca || ''}`,
        TipoCobranca: `${s.TipoPrecificacao === 1 ? 'FIXO' : 'HORA'}`,
        ValorUnitario: s.TipoPrecificacao === 1 ? formatNumberReal(s.ValorUnitario) : formatNumberReal(s.ValorHora),
        HoraEntradaSaida: obj.HoraEntrada && s.TipoPrecificacao !== 1 ? `${moment(obj.HoraEntrada, "HH:mm").format("HH:mm")} / ${moment(obj.HoraSaida, "HH:mm").format("HH:mm")}` : '-',
        Qtd: s.TipoPrecificacao !== 1 ? minTommss(s.Quantidade) : '-',
        QuantidadeHorasAdicionais: s.TipoPrecificacao !== 1 ? moment(obj.HoraAdicional, "HH:mm").format("HH:mm") : '-',
        ValorExtraHora: s.TipoPrecificacao === 1 ? '-' : formatNumberReal(s.ValorExtraHora),
        ValorTotal: formatNumberReal(s.ValorTotal)
      })
      totalServico += s.ValorTotal
    })
  })
  console.log(medicao.Servicos);
  const ordens = medicao.Servicos.sort(compararPorData)
  const data1 = ordens[0].DataInicial;
  const data2 = ordens[ordens.length - 1].DataInicial;

  const periodo = data1 === data2 ? data1 : `${data1} à ${data2}`;

  var view = {
    footer: {
      endereco: medicao.Empresa.Endereco,
      email: 'CONTATO@NACIONALHIDRO.COM.BR',
      website: 'http://www.nacionalhidro.com.br',
      telefone: medicao.Empresa.Telefone
    },
    headers: ['Data', 'OS', 'Placa', 'Equipamento', 'Desc. Serviço', 'Tipo Cobrança', 'VL Unit/Hora', 'Hr Inicio / Fim', 'Total Hora', 'Total Hora Adc.', 'VL Hr Extra', 'VL Total'],
    Medicao: `${medicao.Codigo}/${medicao.Revisao}`,
    Proposta: `${medicao.Ordens[0].Proposta?.Codigo}/${medicao.Ordens[0].Proposta?.Revisao}`,
    Cliente: medicao.Cliente,
    ContatoNome: medicao.Contato?.Nome,
    ContatoEmail: medicao.Contato?.Email?.toLocaleLowerCase(),
    ContatoTelefone: medicao.Contato?.Telefone,
    Solicitante: medicao.Solicitante,
    DataEmissao: medicao.DataCobranca ? moment(medicao.DataEmissao).utc().format("DD/MM/YYYY") : "À emitir",
    ordens: ordens,
    Desconto: formatNumberReal(desconto),
    Extra: formatNumberReal(extra),
    TotalServicos: formatNumberReal(totalServico),
    ValorServico:  medicao.Cte ? null : formatNumberReal(medicao.ValorServico),
    ValorCte: medicao.Cte ? formatNumberReal(medicao.ValorCte) : null,
    ValorTotal: formatNumberReal(medicao.ValorTotal),
    ValorLocacao:  medicao.Cte ? null : formatNumberReal(medicao.ValorRL),
    PorcentagemLocacao: medicao.Cte ? '0' : medicao.PorcentagemRL,
    PorcentagemServico: medicao.Cte ? '0' : 100 - medicao.PorcentagemRL,
    PorcentagemCTE: medicao.Cte ? '100' : '0',
    Periodo: periodo,
    contato: {
      nome: "ANDREA DE CERQUEIRA",
      email: "financeiro@nacionalhidro.com.br",
      telefone: "(19) 97170.1760"
    }
  }
  const res = await getTemplateHtml("./templates/relatorio_cobranca.html");
  let rendered = mustache.render(res, view);
  return rendered
}

async function getHTMLReciboLocacao (faturamento) {
  let data_locacao = faturamento.DataEmissao ? moment(faturamento.DataEmissao).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY");
  
  if (faturamento.Medicao?.Ordens && faturamento.Medicao.Ordens.length > 0) {
    const ordens = _.orderBy(faturamento.Medicao.Ordens, ['DataInicial'], ['asc']);
    const data1 = moment(ordens[0].DataInicial).format("DD/MM/YYYY");
    const data2 = moment(ordens[ordens.length - 1].DataInicial).format("DD/MM/YYYY");
    data_locacao = data1 === data2 ? data1 : `${data1} à ${data2}`;
  }

  var view = {
    Destinatario: faturamento.Cliente || {},
    Emitente: faturamento.Empresa || {},
    DadosDeposito: `Banco: ${faturamento.EmpresaBanco?.Banco || ''} Ag: ${faturamento.EmpresaBanco?.Agencia || ''} C/C: ${faturamento.EmpresaBanco?.Conta || ''}`.toLocaleUpperCase(),
    NaturezaOperacao: faturamento.NaturezaOperacao || '',
    RegimeTributario: faturamento.Empresa?.RegimeTributario === Enum_RegimeTributario.SimplesNacional ? 'EMPRESA OPTANTE PELO SIMPLES NACIONAL' : 'EMPRESA OPTANTE PELO REGIME NORMAL',
    DataEmissao: moment(faturamento.DataEmissao).utc().format("DD/MM/YYYY"),
    Vencimento: moment(faturamento.DataVencimento).utc().format("DD/MM/YYYY"),
    Periodo: data_locacao,
    ValorRL: formatNumberReal(faturamento.ValorRateado),
    ReciboLocacaoId: faturamento.Nota,
    NumeroPedido: faturamento.NumeroPedido,
    DadosComplementares: faturamento.DadosComplementares,
    Descricao: faturamento.Descricao
  }
  const res = await getTemplateHtml("./templates/recibo_locacao.html");
  let rendered = mustache.render(res, view);
  return rendered
}

module.exports = {
  gerarRelatorioLocacao: async (faturamento) => {
    var rendered = await getHTMLReciboLocacao(faturamento);
    var data = JSON.stringify({"html":rendered});
    var config = {
      method: 'post',
      url: 'https://5o55bzdct8.execute-api.sa-east-1.amazonaws.com/prod',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
  
    const response = await axios(config);
    const buffer = Buffer.from(response.data?.pdf?.data);
    const random = (Math.random() + 1).toString(36).substring(4);
    const nomeClienteSanitizado = faturamento.Cliente?.RazaoSocial?.replace(/[^a-zA-Z0-9]/g, '_') || 'cliente';
    var filename = `faturamento_${nomeClienteSanitizado}_${faturamento.id}_${random}.pdf`.toLowerCase();

    var path = await strapi.services["api::configuracao.configuracao"].upload(buffer, filename, 'application/pdf');

    console.log("PDF Generated")
    return {success: true, filename, path}
  },
  // Núcleo da geração do PDF da proposta. LANÇA erro descritivo em caso de falha
  // (para que quem chama — ex.: enviar() — possa reportar o motivo real).
  _renderPropostaPdf: async (proposta) => {
    if (!Array.isArray(proposta.PropostaEquipes) || !Array.isArray(proposta.PropostaEquipamentos)) {
      throw new Error('Proposta incompleta (equipes/equipamentos ausentes) para gerar o PDF.');
    }

      const cargosUnicos = proposta.PropostaEquipes.filter(x => x.Cargo?.UnicoEquipamento)
      const cargosEquipamentos = proposta.PropostaEquipes.filter(x => !x.Cargo?.UnicoEquipamento)
      const EquipesEquipamento = groupBy(cargosEquipamentos, 'Equipamento');

      const equipamentos = proposta.PropostaEquipamentos.filter((value, index) => {
        const _value = JSON.stringify(value.Equipamento);
        return index === proposta.PropostaEquipamentos.findIndex(obj => {
          return JSON.stringify(obj.Equipamento) === _value;
        });
      });
      var view = {
        Id: `${proposta.Codigo}${proposta.Revisao > 0 ? '/REV ' + proposta.Revisao : ''}`,
        Cidade: 'Campinas',
        Data: moment().utc().format("DD/MM/YYYY"),
        Cliente: proposta.Cliente?.RazaoSocial,
        Empresa: proposta.Empresa,
        EnderecoCliente: proposta.Cliente?.Cidade ? `${proposta.Cliente.Cidade}, ${proposta.Cliente.EstadoSigla ?? ''}` : '',
        Contato: proposta.Contato?.Nome,
        SetorContato: proposta.Contato?.Setor,
        TelefoneContato: proposta.Contato?.Telefone,
        CelularContato: proposta.Contato?.Celular,
        EmailContato: proposta.Contato?.Email,
        Introducao: proposta.Introducao,
        Objetivo: proposta.Objetivo?.replace(/\n/g, "<br />").replace(/R\$/g, '<b>R$').replace(/[)]/g, ')</b>'),
        Equipamentos: equipamentos,
        EquipesEquipamento: EquipesEquipamento,
        EquipesUnicas: cargosUnicos,
        Acessorios: proposta.Acessorios,
        RespContratante: proposta.PropostaResponsabilidades?.filter(x => x.Responsavel !== Enum_TipoResponsabilidade.Contratado),
        RespContratada: proposta.PropostaResponsabilidades?.filter(x => x.Responsavel !== Enum_TipoResponsabilidade.Contratante),
        DescricaoValores: proposta.DescricaoValores?.replace(/\n/g, "<br />").replace(/R\$/g, '<b>R$').replace(/[)]/g, ')</b>'),
        DescricaoGarantia: proposta.DescricaoGarantia,
        CondicaoPagamento: proposta.CondicaoPagamento?.replace(/\n/g, "<br />"),
        ValidadeProposta: proposta.ValidadeProposta?.replace(/\n/g, "<br />"),
        Vendedor: proposta.Vendedor?.Nome,
        Assinatura: proposta.Usuario?.urlSignature ? await getAssinaturaBase64(proposta.Usuario.urlSignature) : ''
      }
      const imgHeader = await imageBase64();
      const res = await getTemplateHtml("./templates/proposta.html");
      let rendered = mustache.render(res, view);
      rendered = rendered.replace('<script id="template" type="x-tmpl-mustache">', '<div>').replace('</script><!--remove-->', '</div>');
      const buffer = await gerarPdfViaLambda({ html: rendered, header: imgHeader }, `Proposta ${proposta.Codigo}`);
      const date = new Date().getTime();
      const nomeClienteSanitizado = proposta.Cliente?.RazaoSocial?.replace(/[^a-zA-Z0-9]/g, '_') || 'cliente';
      var filename = `Proposta_${nomeClienteSanitizado}_${proposta.Codigo}_${date}.pdf`.toLowerCase();

      proposta.NomeArquivo = filename;
      proposta.UrlArquivo = await strapi.services["api::configuracao.configuracao"].upload(buffer, filename, 'application/pdf');

      if (!proposta.UrlArquivo) {
        throw new Error('Upload do PDF retornou URL vazia (verifique armazenamento Azure/local).');
      }

      await strapi.entityService.update('api::proposta.proposta', proposta.id, {
        data: proposta
      });

      console.log(`[Proposta ${proposta.Codigo}] PDF gerado e salvo.`);
      return proposta;
  },
  // Wrapper tolerante: gera o PDF mas NÃO propaga falha, para que o cadastro/alteração
  // da proposta sobreviva mesmo se o PDF falhar (o envio regenera depois).
  gerarRelatorioProposta: async (proposta, emailVendedor) => {
    try {
      await module.exports._renderPropostaPdf(proposta);
    } catch (error) {
      console.error(`gerarRelatorioProposta falhou para proposta id=${proposta.id} codigo=${proposta.Codigo}:`, error?.message || error);
    }
  },
  gerarRelatorioOrdemServico: async (ordem, retry = 0) => {
    try {
      var rendered = await getHTMLOrdemServico(ordem);
      var data = JSON.stringify({"html":rendered});

      var config = {
        method: 'post',
        url: 'https://5o55bzdct8.execute-api.sa-east-1.amazonaws.com/prod',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      const response = await axios(config);
      console.log(response.data);
      return response.data;
      // const buffer = Buffer.from(response.data?.pdf?.data);
      // const random = (Math.random() + 1).toString(36).substring(4)
      // var filename = `Ordem_Servico_${ordem.Cliente.RazaoSocial}_${ordem.Codigo}_${random}.pdf`.toLocaleLowerCase();

      // ordem.NomeArquivo = filename;
      // ordem.UrlArquivo = await strapi.services["api::configuracao.configuracao"].upload(buffer, filename, 'application/pdf');

      // await strapi.entityService.update('api::ordem-servico.ordem-servico', ordem.id, {
      //   data: ordem
      // });
  
      // console.log("PDF Generated")
    } catch (error) {
      console.log(error);
    }
  },
  gerarRelatorioOrdemServicoLote: async (ordens, retry = 0) => {
    try {
      var rendered = ''
      for(var ordem of ordens) {
        rendered += await getHTMLOrdemServico(ordem) + '<br /> <br />';
      }
      var data = JSON.stringify({"html":rendered});
      var config = {
        method: 'post',
        url: 'https://5o55bzdct8.execute-api.sa-east-1.amazonaws.com/prod',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      const response = await axios(config);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw "error"
    }
  },
  gerarRelatorioMedicao: async (medicao, retry = 0) => {
    try {
      var rendered = await getHTMLMedicao(medicao);
      var data = JSON.stringify({"html":rendered});
      var config = {
        method: 'post',
        url: 'https://5o55bzdct8.execute-api.sa-east-1.amazonaws.com/prod',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      const response = await axios(config);
      console.log("PDF Generated")
      return response.data
    } catch (error) {
      console.log(error);
    }
  }
}