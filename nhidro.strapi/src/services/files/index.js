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
  return '<img width="100%" style="margin-bottom: 1%" src="data:image/png;base64,' + await base64Encode('https://prodnhidro.blob.core.windows.net/storage/proposta.png') + '"/>';
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
  const ordens = _.orderBy(faturamento.Medicao.Ordens, ['DataInicial'], ['asc']);
  const data1 = moment(ordens[0].DataInicial).format("DD/MM/YYYY");
  const data2 = moment(ordens[ordens.length - 1].DataInicial).format("DD/MM/YYYY");

  const data_locacao = data1 === data2 ? data1 : `${data1} à ${data2}`;

  var view = {
    Destinatario: faturamento.Cliente,
    Emitente: faturamento.Empresa,
    DadosDeposito: `Banco: ${faturamento.EmpresaBanco?.Banco} Ag: ${faturamento.EmpresaBanco?.Agencia} C/C: ${faturamento.EmpresaBanco?.Conta}`.toLocaleUpperCase(),
    NaturezaOperacao: faturamento.NaturezaOperacao,
    RegimeTributario: faturamento.Empresa.RegimeTributario === Enum_RegimeTributario.SimplesNacional ? 'EMPRESA OPTANTE PELO SIMPLES NACIONAL' : 'EMPRESA OPTANTE PELO REGIME NORMAL',
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
    const random = (Math.random() + 1).toString(36).substring(4)
    var filename = `faturamento_${faturamento.Cliente.RazaoSocial}_${faturamento.id}_${random}.pdf`.toLocaleLowerCase();

    var path = await strapi.services["api::configuracao.configuracao"].upload(buffer, filename, 'application/pdf');

    console.log("PDF Generated")
    return {success: true, filename, path}
  },
  gerarRelatorioProposta: async (proposta, emailVendedor) => {
    try {
      const cargosUnicos = proposta.PropostaEquipes.filter(x => x.Cargo.UnicoEquipamento)
      const cargosEquipamentos = proposta.PropostaEquipes.filter(x => !x.Cargo.UnicoEquipamento)
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
        Assinatura: proposta.Usuario?.urlSignature || ''
      }
      const imgHeader = await imageBase64();
      const res = await getTemplateHtml("./templates/proposta.html");
      let rendered = mustache.render(res, view);
      rendered = rendered.replace('<script id="template" type="x-tmpl-mustache">', '<div>').replace('</script><!--remove-->', '</div>');
      var data = JSON.stringify({"html":rendered,"header":imgHeader});
      var config = {
        method: 'post',
        url: 'https://5o55bzdct8.execute-api.sa-east-1.amazonaws.com/prod',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      const response = await axios(config)
      const buffer = Buffer.from(response.data?.pdf?.data)
      let date = new Date().toISOString();
      date = date.replace('-','').replace('-','').replace('T','').replace(':','').replace(':','').slice(0,14);;
      var filename = `Proposta_${proposta.Cliente.RazaoSocial}_${proposta.Codigo}_${date}.pdf`.replace(/[\x00-\x1F\x7F]/g, '').trim().toLocaleLowerCase();

      proposta.NomeArquivo = filename;
      proposta.UrlArquivo = await strapi.services["api::configuracao.configuracao"].upload(buffer, filename, 'application/pdf');

      await strapi.entityService.update('api::proposta.proposta', proposta.id, {
        data: proposta
      });
  
      console.log("PDF Generated")
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