'use strict';

/**
 * conta service.
 */
const { Enum_StatusContas, Enum_StatusContasPagamento } = require("../../../../utils/enums");
const _ = require('lodash');
var moment = require("moment");
moment.locale('pt-br');

module.exports = {
  getContasByStatus: async (status) => {
    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: {
        Status: {
          $in: [status, Enum_StatusContas.Correcao]
        }
      },
      populate: ['Empresa', 'Fornecedor', 'Cliente', 'ContaProdutos', 'ContaCentrosCustos', 'ContaCentrosCustos.CentroCusto', 'ContaNaturezasContabeis', 'ContaNaturezasContabeis.NaturezaContabil', 'ContaPagamento', 'ContaPagamento.ContaPagamentoParcela', 'UsuarioLancamento']
    });

    return lista;
  },
  getContasPagarOld: async (dataInicial, dataFinal) => {

    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: { Status: { $in: [Enum_StatusContas.Baixado, Enum_StatusContas.Pago] } },
      populate: ['Empresa', 'Empresa.EmpresaBanco', 'Fornecedor', 'ContaCentrosCustos', 'ContaCentrosCustos.CentroCusto', 'ContaNaturezasContabeis', 'ContaNaturezasContabeis.NaturezaContabil', 'ContaPagamento', 'ContaPagamento.ContaPagamentoParcela', 'ContaPagamento.ContaPagamentoParcela.EmpresaBanco', 'UsuarioLancamento']
    });
    let parcelas = [];
    lista.forEach(item => {
      item.ContaPagamento.ContaPagamentoParcela.forEach(p => {

        if (p.StatusPagamento !== Enum_StatusContasPagamento.Pago &&
          new Date(p?.DataVencimentoReal) >= new Date(dataInicial) &&
          new Date(p?.DataVencimentoReal) <= new Date(dataFinal)) {
          p.TipoPix = p.TipoPix ?? item.Fornecedor.TipoPix;
          p.ChavePix = p.ChavePix ?? item.Fornecedor.ChavePix;
          p.Banco = p.Banco ?? item.Fornecedor.Banco;
          p.ContaBanco = p.ContaBanco ?? item.Fornecedor.ContaBanco;
          p.AgenciaBanco = p.AgenciaBanco ?? item.Fornecedor.AgenciaBanco;

          parcelas.push({
            id: item.id,
            Fornecedor: item.Fornecedor,
            Empresa: item.Empresa,
            ContaCentrosCustos: item.ContaCentrosCustos,
            ContaNaturezasContabeis: item.ContaNaturezasContabeis,
            ContaPagamento: item.ContaPagamento,
            Observacoes: item.Observacoes,
            NumeroParcela: `${p.NumeroParcela} de ${item.ContaPagamento.QuantidadeParcela}`,
            StatusPagamento: moment(new Date().setHours(0, 0, 0, 0)).isAfter(new Date(p?.DataVencimentoReal)) ? 'Pendente' : p?.StatusPagamento === Enum_StatusContasPagamento.Parcial ? 'Parcial' : p?.StatusPagamento === Enum_StatusContasPagamento.Pago ? 'Pago' : 'À vencer',
            Parcela: p,
            NumeroNF: item.NumeroNF,
            DataEmissaoNF: item.DataEmissaoNF,
            createdAt: item.createdAt,
            UsuarioLancamento: item.UsuarioLancamento
          });
        }

      })
    })


    return parcelas.sort((a, b) => (a.Parcela.DataVencimento > b.Parcela.DataVencimento) ? 1 : ((b.Parcela.DataVencimento > a.Parcela.DataVencimento) ? -1 : 0))
      ;
  },
  getContasPagar: async (dataInicial, dataFinal) => {

    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: { Status: { $in: [Enum_StatusContas.Baixado, Enum_StatusContas.Pago] } },
      populate: ['Empresa', 'Empresa.EmpresaBanco', 'Fornecedor', 'Cliente', 'ContaCentrosCustos', 'ContaCentrosCustos.CentroCusto', 'ContaNaturezasContabeis', 'ContaNaturezasContabeis.NaturezaContabil', 'ContaPagamento', 'ContaPagamento.ContaPagamentoParcela', 'ContaPagamento.ContaPagamentoParcela.EmpresaBanco', 'UsuarioLancamento']
    });
    let parcelas = [];
    lista.forEach(item => {
      item.ContaPagamento.ContaPagamentoParcela.forEach(p => {

        if (p.StatusPagamento !== Enum_StatusContasPagamento.Pago &&
          new Date(p?.DataVencimento) >= new Date(dataInicial) &&
          new Date(p?.DataVencimento) <= new Date(dataFinal)) {
          p.TipoPix = p.TipoPix ?? item.Fornecedor.TipoPix;
          p.ChavePix = p.ChavePix ?? item.Fornecedor.ChavePix;
          p.Banco = p.Banco ?? item.Fornecedor.Banco;
          p.ContaBanco = p.ContaBanco ?? item.Fornecedor.ContaBanco;
          p.AgenciaBanco = p.AgenciaBanco ?? item.Fornecedor.AgenciaBanco;

          parcelas.push({
            id: item.id,
            Fornecedor: { id: item.Fornecedor.id, Nome: item.Fornecedor.Nome },
            Empresa: { id: item.Empresa?.id, Descricao: item.Empresa?.Descricao, EmpresaBanco: item.Empresa?.EmpresaBanco },
            Cliente: { id: item.Cliente?.id, RazaoSocial: item.Cliente?.RazaoSocial },
            ContaCentrosCustos: item.ContaCentrosCustos.map(x => ({ CentroCusto: { Descricao: x.CentroCusto?.Descricao } })),
            ContaNaturezasContabeis: item.ContaNaturezasContabeis.map(x => ({ NaturezaContabil: { Descricao: x.NaturezaContabil?.Descricao } })),
            //ContaPagamento: item.ContaPagamento,
            Observacoes: item.Observacoes,
            NumeroParcela: `${p.NumeroParcela} de ${item.ContaPagamento.QuantidadeParcela}`,
            StatusPagamento: moment(new Date().setHours(0, 0, 0, 0)).isAfter(new Date(p?.DataVencimentoReal)) ? 'Pendente' : p?.StatusPagamento === Enum_StatusContasPagamento.Parcial ? 'Parcial' : p?.StatusPagamento === Enum_StatusContasPagamento.Pago ? 'Pago' : 'À vencer',
            Parcela: {
              id: p.id,
              ValorAPagar: p.ValorAPagar,
              DataVencimento: p.DataVencimento,
              DataVencimentoReal: p.DataVencimentoReal,
              ValorPago: p.ValorPago,
              ValorParcela: p.ValorParcela,
              ValorAcrescimo: p.ValorAcrescimo,
              ValorDecrescimo: p.ValorDecrescimo,
              TipoPix: p.TipoPix,
              ChavePix: p.ChavePix,
              Banco: p.Banco,
              ContaBanco: p.ContaBanco,
              AgenciaBanco: p.AgenciaBanco
            },
            NumeroNF: item.NumeroNF,
            DataEmissaoNF: item.DataEmissaoNF,
            createdAt: item.createdAt,
            UsuarioLancamento: item.UsuarioLancamento
          });
        }

      })
    })


    return parcelas.sort((a, b) => (a.Parcela.DataVencimento > b.Parcela.DataVencimento) ? 1 : ((b.Parcela.DataVencimento > a.Parcela.DataVencimento) ? -1 : 0))
      ;
  },
  getContasPagas: async (dataInicial, dataFinal) => {
    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      populate: ['createdBy', 'Empresa', 'Empresa.EmpresaBanco', 'Cliente', 'Fornecedor', 'ContaCentrosCustos', 'ContaCentrosCustos.CentroCusto', 'ContaNaturezasContabeis', 'ContaNaturezasContabeis.NaturezaContabil', 'ContaPagamento', 'ContaPagamento.ContaPagamentoParcela', 'ContaPagamento.ContaPagamentoParcela.ParcelasPagamento', 'ContaPagamento.ContaPagamentoParcela.ParcelasPagamento.EmpresaBanco', 'UsuarioLancamento']
    });

    let parcelas = [];
    lista.forEach(item => {
      item.ContaPagamento?.ContaPagamentoParcela?.forEach(p => {
        if (p.StatusPagamento !== Enum_StatusContasPagamento.Pendente &&
          new Date(p?.DataVencimento) >= new Date(dataInicial) &&
          new Date(p?.DataVencimento) <= new Date(dataFinal)) {
          parcelas.push({
            id: item.id,
            DataCriacao: item.createdAt,
            Fornecedor: item.Fornecedor,
            Cliente: item.Cliente,
            NumeroNF: item.NumeroNF,
            DataEmissaoNF: item.DataEmissaoNF,
            Empresa: item.Empresa,
            ContaCentrosCustos: item.ContaCentrosCustos,
            ContaNaturezasContabeis: item.ContaNaturezasContabeis,
            ContaPagamento: item.ContaPagamento,
            NumeroParcela: `${p.NumeroParcela} de ${item.ContaPagamento.QuantidadeParcela}`,
            Parcela: p,
            UsuarioCriacao: item.createdBy,
            Pagamentos: p.ParcelasPagamento,
            UsuarioLancamento: item.UsuarioLancamento,
            Observacoes: item.Observacoes
          });
        }
      })
    })
    return parcelas;
  },
  adicionar: async (data, user) => {
    let contasprodutos = data.ContaProdutos;
    let contascentrocusto = data.ContaCentrosCustos ?? {};
    let contasnaturezacontabil = data.ContaNaturezasContabeis ?? {};
    let contapagamento = data.ContaPagamento;
    let contapagamentoparcela = data?.ContaPagamento?.ContaPagamentoParcela;
    let valorTotal = 0;
    delete data.ContaProdutos;
    delete data.ContaCentrosCustos;
    delete data.ContaNaturezasContabeis;
    delete data.ContaPagamento;
    delete data.createdBy;
    data.Status = Enum_StatusContas.Criado;
    data.UsuarioLancamento = user;
    const entry = await strapi.entityService.create('api::conta.conta', {
      populate: '*',
      data: data
    });

    for (let cp of contasprodutos) {
      if (cp.Descricao && cp.Quantidade) {
        cp.ValorTotal = (cp.ValorUnitario || 0) * cp.Quantidade;
        const entryCP = await strapi.entityService.create('api::conta-produtos.conta-produtos', {
          populate: '*',
          data: cp
        });
        cp.id = entryCP.id;
  
        valorTotal += cp.ValorTotal;
      }
    }

    if (contascentrocusto.length > 0) {
      for (let cc of contascentrocusto) {
        if (cc.CentroCusto) {
          const entryCC = await strapi.entityService.create('api::conta-centro-custo.conta-centro-custo', {
            populate: '*',
            data: cc
          });
          cc.id = entryCC.id;
        }
      }
    }

    if (contasnaturezacontabil.length > 0) {
      for (let cn of contasnaturezacontabil) {
        if (cn.NaturezaContabil) {
          const entryCN = await strapi.entityService.create('api::conta-natureza-contabil.conta-natureza-contabil', {
            populate: '*',
            data: cn
          });
          cn.id = entryCN.id;
        }
      }
    }

    if (contapagamento) {
      delete contapagamento.ContaPagamentoParcela;

      for (let cpp of contapagamentoparcela) {
        cpp.StatusPagamento = Enum_StatusContasPagamento.Pendente;

        let dtVencimento = new Date(cpp.DataVencimento);
        if (dtVencimento.getUTCDay() === 6)
          cpp.DataVencimentoReal = moment(dtVencimento.setDate(dtVencimento.getUTCDate() + 2)).format('YYYY-MM-DD');
        else if (dtVencimento.getUTCDay() === 0)
          cpp.DataVencimentoReal = moment(dtVencimento.setDate(dtVencimento.getUTCDate() + 1)).format('YYYY-MM-DD');
        else cpp.DataVencimentoReal = moment(dtVencimento).format('YYYY-MM-DD')

        const entryCPP = await strapi.entityService.create('api::conta-pagamento-parcela.conta-pagamento-parcela', {
          populate: '*',
          data: cpp
        });
        cpp.id = entryCPP.id;
      }
      let entryContaPgto = {}
      contapagamento.ContaPagamentoParcela = contapagamentoparcela;
      entryContaPgto = await strapi.entityService.create('api::conta-pagamento.conta-pagamento', {
        populate: '*',
        data: contapagamento
      });
      contapagamento.id = entryContaPgto.id;
      entry.ContaPagamento = contapagamento;
    }

    entry.ContaProdutos = contasprodutos.filter(x => x.id);
    entry.ContaCentrosCustos = contascentrocusto.length > 0 ? contascentrocusto.filter(x => x.id) : null;
    entry.ContaNaturezasContabeis = contasnaturezacontabil.length > 0 ? contasnaturezacontabil.filter(x => x.id) : null;
    entry.ValorTotal = valorTotal;
    delete entry.createdBy;
    delete entry.updatedBy;

    await strapi.entityService.update('api::conta.conta', entry.id, {
      populate: '*',
      data: entry
    });

    return entry;
  },
  alterar: async (data, user) => {
    let contasprodutos = data.ContaProdutos;
    let contapagamento = data.ContaPagamento;
    let contapagamentoparcela = data.ContaPagamento.ContaPagamentoParcela;
    let contascentrocusto = data.ContaCentrosCustos;
    let contasnaturezacontabil = data.ContaNaturezasContabeis;
    let valorTotal = 0;
    delete data.ContaProdutos;
    delete data.ContaCentrosCustos;
    delete data.ContaNaturezasContabeis;
    delete data.ContaPagamento;
    delete contapagamento.ContaPagamentoParcela;

    for (let cc of contascentrocusto) {
      if (cc.id > 0) {
        await strapi.entityService.delete('api::conta-centro-custo.conta-centro-custo', cc.id);
      }
      delete cc.id;

      if (cc.CentroCusto) {
        const entryCC = await strapi.entityService.create('api::conta-centro-custo.conta-centro-custo', {
          data: cc
        });
        cc.id = entryCC.id;
      }
    }

    for (let cn of contasnaturezacontabil) {
      if (cn.id > 0) {
        await strapi.entityService.delete('api::conta-natureza-contabil.conta-natureza-contabil', cn.id);
      }
      delete cn.id;

      if (cn.NaturezaContabil) {
        const entryCN = await strapi.entityService.create('api::conta-natureza-contabil.conta-natureza-contabil', {
          data: cn
        });
        cn.id = entryCN.id;
      }
    }

    for (let cpp of contapagamentoparcela) {
      if (cpp.StatusPagamento === Enum_StatusContasPagamento.Pendente) {
        console.log(cpp.NumeroParcela);
        if (cpp.id > 0) {
          await strapi.entityService.delete('api::conta-pagamento-parcela.conta-pagamento-parcela', cpp.id);
        }
        let dtVencimento = new Date(cpp.DataVencimento);
        delete cpp.id;
        cpp.StatusPagamento = Enum_StatusContasPagamento.Pendente;
        if (dtVencimento.getUTCDay() === 6)
          cpp.DataVencimentoReal = moment(dtVencimento.setDate(dtVencimento.getUTCDate() + 2)).format('YYYY-MM-DD');
        else if (dtVencimento.getUTCDay() === 0)
          cpp.DataVencimentoReal = moment(dtVencimento.setDate(dtVencimento.getUTCDate() + 1)).format('YYYY-MM-DD');
        else cpp.DataVencimentoReal = moment(dtVencimento).format('YYYY-MM-DD')
  
        const entryCPP = await strapi.entityService.create('api::conta-pagamento-parcela.conta-pagamento-parcela', {
          data: cpp
        });
        cpp.id = entryCPP.id;
      }
    }

    let entryContaPgto = {}
    contapagamento.ContaPagamentoParcela = contapagamentoparcela;
    if (contapagamento.id)
      entryContaPgto = await strapi.entityService.update('api::conta-pagamento.conta-pagamento', contapagamento.id, {
        data: contapagamento
      });
    else
      entryContaPgto = await strapi.entityService.create('api::conta-pagamento.conta-pagamento', {
        data: contapagamento
      });
    contapagamento.id = entryContaPgto.id;

    for (let cp of contasprodutos) {
      if (cp.id > 0) {
        await strapi.entityService.delete('api::conta-produtos.conta-produtos', cp.id);
      }
      delete cp.id;

      if (cp.Descricao && cp.Quantidade) {
        cp.ValorTotal = cp.ValorUnitario && cp.Quantidade ? cp.ValorUnitario * cp.Quantidade : 0;
        const entryCP = await strapi.entityService.create('api::conta-produtos.conta-produtos', {
          populate: '*',
          data: cp
        });
        cp.id = entryCP.id;

        valorTotal += cp.ValorTotal;
      }
    }

    data.ContaProdutos = contasprodutos.filter(x => x.id);
    data.ContaCentrosCustos = contascentrocusto.length > 0 ? contascentrocusto.filter(x => x.id) : null;
    data.ContaNaturezasContabeis = contasnaturezacontabil.length > 0 ? contasnaturezacontabil.filter(x => x.id) : null;
    data.ContaPagamento = contapagamento;
    data.ValorTotal = valorTotal;
    const entry = await strapi.entityService.update('api::conta.conta', data.id, {
      populate: ['Empresa', 'Fornecedor', 'ContaProdutos'],
      data: data
    });

    return entry;
  },
  cadastrar: async (data, user) => {
    let conta = await strapi.entityService.findOne('api::conta.conta', data.id);
    conta.Status = Enum_StatusContas.Baixado;
    const entry = await strapi.entityService.update('api::conta.conta', conta.id, {
      data: conta
    });
    return entry;
  },
  salvarParcela: async (data, user) => {

    const entry = await strapi.entityService.update('api::conta-pagamento-parcela.conta-pagamento-parcela', data.id, {
      data: data
    });

    return entry;
  },
  pagar: async (data, user) => {
    let parcela = data.Parcela;
    const contaId = data.ContaId;
    delete data.ContaId;

    const entry = await strapi.entityService.create('api::parcela-pagamento.parcela-pagamento', {
      data: data
    });

    parcela.ValorPago += data.Valor
    parcela.StatusPagamento = parcela.ValorAPagar === 0 ? Enum_StatusContasPagamento.Pago : Enum_StatusContasPagamento.Parcial;

    await strapi.entityService.update('api::conta-pagamento-parcela.conta-pagamento-parcela', parcela.id, {
      data: parcela
    });

    let conta = await strapi.entityService.findOne('api::conta.conta', contaId, {
      populate: ['ContaPagamento', 'ContaPagamento.ContaPagamentoParcela']
    });

    if (parcela.StatusPagamento === Enum_StatusContasPagamento.Pago) {
      const todasPagas = conta.ContaPagamento.ContaPagamentoParcela.every(p => p.StatusPagamento === Enum_StatusContasPagamento.Pago);
      if (todasPagas) {
        conta.Status = Enum_StatusContas.Pago;
        await strapi.entityService.update('api::conta.conta', conta.id, {
          data: { Status: Enum_StatusContas.Pago }
        });
      }
    }

    return entry;
  },
  corrigir: async (data, user) => {
    const conta = await strapi.entityService.findOne('api::conta.conta', data.id);
    conta.Status = Enum_StatusContas.Correcao;
    const entry = await strapi.entityService.update('api::conta.conta', conta.id, {
      data: conta
    });
    return entry;
  },
  cancelar: async (data, user) => {
    let conta = await strapi.entityService.findOne('api::conta.conta', data.id);
    conta.Status = Enum_StatusContas.Cancelado;
    conta.MotivoCancelamento = data.MotivoCancelamento;
    const entry = await strapi.entityService.update('api::conta.conta', conta.id, {
      data: conta
    });
    return entry;
  },
  importar: async (data, user) => {
    let messages = [];

    for (let item of data) {
      let message = {
        msg: `XML ${item.FileName}: `,
        error: false
      }
      let fornecedor = {};
      let empresa = {};

      const getFornecedores = await strapi.entityService.findMany('api::fornecedor.fornecedor', {
        sort: { id: 'DESC' },
        filters: {
          $or: [
            {
              CNPJ: item.Fornecedor.CNPJ,
            },
            {
              Nome: item.Fornecedor.Nome,
            },
            {
              NomeFantasia: item.Fornecedor.NomeFantasia,
            },
            {
              Inscricao: item.Fornecedor.Inscricao,
            },
          ],
        },
      });

      if (getFornecedores.length > 0) {
        fornecedor = getFornecedores[0];
      }
      else {
        fornecedor = await strapi.entityService.create('api::fornecedor.fornecedor', {
          data: item.Fornecedor
        });
      }

      if (!(fornecedor.id > 0)) {
        message.error = true;
        message.msg += 'Dados do fornecedor inválidos!';
        messages.push(message);
        continue;
      }


      let contaNF = await strapi.entityService.findMany('api::conta.conta', {
        filters: {
          $and: [
            {
              Fornecedor: {
                id: fornecedor.id
              }
            },
            {
              NumeroNF: item.NumeroNF
            },
            {
              Status: {
                $ne: Enum_StatusContas.Cancelado
              }
            }
          ]
        }
      });

      if (contaNF && contaNF.length > 0) {
        message.error = true;
        message.msg += 'Nota já inclusa no sistema!';
        messages.push(message);
        continue;
      }

      const getEmpresas = await strapi.entityService.findMany('api::empresa.empresa', {
        sort: { id: 'DESC' }
      });

      empresa = getEmpresas.find(x => {
        const cnpj = x.CNPJ.replace('.', '').replace('.', '').replace('/', '').replace('-', '');
        const ie = x.InscricaoEstadual ? x.InscricaoEstadual.replace('.', '').replace('.', '').replace('.', '') : '';
        return cnpj === item.Empresa.CNPJ || x.Descricao === item.Empresa.Descricao || ie === item.Empresa.InscricaoEstadual
      });

      if (!(empresa?.id > 0)) {
        message.error = true;
        message.msg += 'Empresa destinatária inválida ou não cadastrada!';
        messages.push(message);
        continue;
      }

      const conta = {
        Fornecedor: fornecedor,
        Empresa: empresa,
        ContaProdutos: item.ContaProdutos,
        ContaPagamento: item.ContaPagamento,
        ValorTotal: item.ValorTotal,
        NumeroNF: item.NumeroNF,
        DataEmissaoNF: item.DataEmissaoNF,
        Status: Enum_StatusContas.Criado
      }

      const entry = await strapi.services["api::conta.conta"].adicionar(conta, user);

      if (entry.id > 0) {
        message.error = false;
        message.msg += 'Importado com sucesso!';
      }
      else {
        message.error = false;
        message.msg += 'Erro na importação!';
      }
      messages.push(message);
    }

    return messages;
  },
  buscarListas: async () => {
    const centroscusto = _.orderBy(await strapi.entityService.findMany('api::centro-custo.centro-custo', {
      filters: {
        $or: [
          {
            Inativo: {
              $null: true
            }
          },
          {
            Inativo: false
          }
        ]
      }
    }), ['Descricao'], ['asc']);
    const naturezascontabeis = _.orderBy(await strapi.entityService.findMany('api::natureza-contabil.natureza-contabil', {
      filters: {
        $or: [
          {
            Inativo: {
              $null: true
            }
          },
          {
            Inativo: false
          }
        ]
      },}), ['Descricao'], ['asc']);
    const fornecedores = _.orderBy(await strapi.entityService.findMany('api::fornecedor.fornecedor', {
      filters: {
        $or: [
          {
            Bloqueado: false
          },
          {
            Bloqueado: null
          }
        ]
      }
    }), ['Nome'], ['asc']);
    return {
      centroscusto,
      naturezascontabeis,
      fornecedores
    };
  },
  getRelatorioSimplificado: async (start, end) => {
    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: {
        Status: {
          $ne: Enum_StatusContas.Cancelado
        }
      },
      populate: {
        Empresa: {
          populate: { EmpresaBanco: true }
        },
        Fornecedor: true,
        ContaCentrosCustos: {
          populate: { CentroCusto: true }
        },
        ContaNaturezasContabeis: {
          populate: { NaturezaContabil: true }
        },
        ContaPagamento: {
          populate: {
            ContaPagamentoParcela: {
              filters: {
                DataVencimento: { $between: [start, end] }
              },
              populate: { EmpresaBanco: true }
            }
          }
        }
      }
    });
    let parcelas = [];
    lista.forEach(item => {
      item.ContaPagamento?.ContaPagamentoParcela?.forEach(p => {
        parcelas.push({
          id: item.id,
          NumeroNF: item.NumeroNF,
          Observacoes: item.Observacoes,
          DataEmissaoNF: item.DataEmissaoNF ?? '-',
          Vencimento: p.DataVencimento ?? '-',
          VencimentoReal: p.DataVencimentoReal ?? '-',
          RazaoFornecedor: item.Fornecedor?.Nome,
          FantasiaFornecedor: item.Fornecedor?.NomeFantasia,
          CNPJFornecedor: item.Fornecedor?.CNPJ?.toString(),
          Empresa: item.Empresa?.Descricao,
          ContaCentrosCustos: (item.ContaCentrosCustos && item.ContaCentrosCustos?.map(x => `${x.CentroCusto?.Descricao}; `)) || '-',
          ContaNaturezasContabeis: (item.ContaNaturezasContabeis && item.ContaNaturezasContabeis?.map(x => `${x.NaturezaContabil?.Descricao}; `)) || '-',
          Status: item?.Status === Enum_StatusContas.Pago ? 'Pago' : item?.Status === Enum_StatusContas.Baixado ? 'À vencer' : item?.Status === Enum_StatusContas.Criado ? 'À cadastrar' : 'Cancelado',
          NumeroParcela: `${p.NumeroParcela} de ${item.ContaPagamento?.QuantidadeParcela}`,
          ValorPago: p.ValorPago,
          ValorParcela: p.ValorParcela,
          ValorAcrescimo: p.ValorAcrescimo,
          ValorDecrescimo: p.ValorDecrescimo,
          ValorAPagar: p.ValorAPagar,
          StatusPagamento: p?.StatusPagamento === Enum_StatusContasPagamento.Pago ? 'Pago' : p?.StatusPagamento === Enum_StatusContasPagamento.Parcial ? 'Parcial' : p?.DataVencimentoReal > new Date() ? 'Pendente' : 'À vencer'
        });
      })
    })
    return parcelas.sort((a, b) => {
      a = a.Vencimento?.split('/').reverse().join('');
      b = b.Vencimento?.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
  },
  getRelatorioDetalhado: async (start, end) => {
    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: {
        Status: {
          $ne: Enum_StatusContas.Cancelado
        }
      },
      populate: {
        Empresa: {
          populate: { EmpresaBanco: true }
        },
        Fornecedor: true,
        Cliente: true,
        ContaCentrosCustos: {
          populate: { CentroCusto: true }
        },
        ContaNaturezasContabeis: {
          populate: { NaturezaContabil: true }
        },
        ContaPagamento: {
          populate: {
            ContaPagamentoParcela: {
              filters: {
                DataVencimento: { $between: [start, end] }
              },
              populate: { EmpresaBanco: true }
            }
          }
        }
      }
    });

    let parcelas = [];
    lista.forEach(item => {
      item.ContaPagamento?.ContaPagamentoParcela?.forEach(p => {
        item.ContaNaturezasContabeis?.forEach(nc => {
          item.ContaCentrosCustos?.forEach(cc => {
            parcelas.push({
              id: item.id,
              NumeroNF: item.NumeroNF,
              Observacoes: item.Observacoes,
              DataEmissaoNF: item.DataEmissaoNF ?? '-',
              Vencimento: p.DataVencimento ?? '-',
              VencimentoReal: p.DataVencimentoReal ?? '-',
              RazaoFornecedor: item.Fornecedor?.Nome,
              FantasiaFornecedor: item.Fornecedor?.NomeFantasia,
              CNPJFornecedor: item.Fornecedor?.CNPJ?.toString(),
              Empresa: item.Empresa?.Descricao,
              Cliente: item.Cliente?.RazaoSocial,
              ContaCentroCusto: cc?.CentroCusto?.Descricao || '-',
              ContaNaturezaContabil: nc?.NaturezaContabil?.Descricao || '-',
              Status: item?.Status === Enum_StatusContas.Pago ? 'Pago' : item?.Status === Enum_StatusContas.Baixado ? 'À vencer' : 'À cadastrar',
              NumeroParcela: `${p.NumeroParcela} de ${item.ContaPagamento?.QuantidadeParcela}`,
              ValorPago: p.ValorPago,
              ValorParcela: p.ValorParcela,
              ValorAcrescimo: p.ValorAcrescimo,
              ValorDecrescimo: p.ValorDecrescimo,
              ValorNatureza: nc.Valor / item.ContaPagamento?.QuantidadeParcela,
              ValorCentroCusto: cc.Valor / item.ContaPagamento?.QuantidadeParcela,
              ValorBruto: item.ContaPagamento?.QuantidadeParcela * p.ValorParcela,
              ValorCentroCustoBruto: cc.Valor,
              ValorNaturezaBruto: nc.Valor,
              ValorAPagar: p.ValorAPagar,
              StatusPagamento: p?.StatusPagamento === Enum_StatusContasPagamento.Pago ? 'Pago' : p?.StatusPagamento === Enum_StatusContasPagamento.Parcial ? 'Parcial' : p?.DataVencimentoReal > new Date() ? 'Pendente' : 'À vencer'
            });
          });
        });
      })
    })

    return parcelas.sort((a, b) => {
      a = a.Vencimento?.split('/').reverse().join('');
      b = b.Vencimento?.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
  },
  getRelatorioContasPagasPorPeriodo: async (start, end) => {
    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: {
        Status: {
          $ne: Enum_StatusContas.Cancelado
        }
      },
      populate: {
        Empresa: {
          populate: { EmpresaBanco: true }
        },
        Fornecedor: true,
        ContaCentrosCustos: {
          populate: { CentroCusto: true }
        },
        ContaNaturezasContabeis: {
          populate: { NaturezaContabil: true }
        },
        ContaPagamento: {
          populate: {
            ContaPagamentoParcela: {
              filters: {
                DataVencimentoReal: { $between: [start, end] }
              },
              populate: {
                ParcelasPagamento: {
                  populate: {
                    EmpresaBanco: true
                  }
                }
              }
            }
          }
        }
      }
    });
    let parcelas = [];
    lista.forEach(item => {
      item.ContaPagamento?.ContaPagamentoParcela?.forEach(p => {
        p?.ParcelasPagamento?.forEach(pp => {
          let cc = ''
          let nc = ''
          item.ContaCentrosCustos?.forEach(x => cc = `${cc}${x.CentroCusto?.Descricao}; `)
          item.ContaNaturezasContabeis?.forEach(x => nc = `${nc}${x.NaturezaContabil?.Descricao}; `)

          parcelas.push({
            id: item.id,
            NumeroNF: item.NumeroNF,
            Observacoes: item.Observacoes,
            DataEmissaoNF: item.DataEmissaoNF ?? '-',
            Vencimento: p.DataVencimento ?? '-',
            VencimentoReal: p.DataVencimentoReal ?? '-',
            RazaoFornecedor: item.Fornecedor?.Nome,
            FantasiaFornecedor: item.Fornecedor?.NomeFantasia,
            CNPJFornecedor: item.Fornecedor?.CNPJ?.toString(),
            Empresa: item.Empresa?.Descricao,
            ContaCentrosCustos: cc || '-',
            ContaNaturezasContabeis: nc || '-',
            Status: item?.Status === Enum_StatusContas.Pago ? 'Pago' : item?.Status === Enum_StatusContas.Baixado ? 'À vencer' : 'À cadastrar',
            NumeroParcela: `${p.NumeroParcela} de ${item.ContaPagamento?.QuantidadeParcela}`,
            EmpresaBanco: pp?.EmpresaBanco ? `${pp?.EmpresaBanco?.Banco} - Ag: ${pp?.EmpresaBanco?.Agencia} - CC: ${pp?.EmpresaBanco?.Conta}` : '-',
            ValorPago: pp?.Valor,
            ValorParcela: p.ValorParcela,
            ValorAcrescimo: p.ValorAcrescimo,
            ValorDecrescimo: p.ValorDecrescimo,
            ValorAPagar: p.ValorAPagar,
            StatusPagamento: p?.StatusPagamento === Enum_StatusContasPagamento.Pago ? 'Pago' : p?.StatusPagamento === Enum_StatusContasPagamento.Parcial ? 'Parcial' : p?.DataVencimentoReal > new Date() ? 'Pendente' : 'À vencer'
          });
        })
      })
    })

    return parcelas.sort((a, b) => {
      a = a.VencimentoReal?.split('/').reverse().join('');
      b = b.VencimentoReal?.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
  },
  getRelatorioCompetencia: async (start, end) => {
    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: {
        $and: [
          {
            Status: {
              $ne: Enum_StatusContas.Cancelado
            },
          },
          {
            DataEmissaoNF: { $between: [start, end] }
          }
        ]
      },
      populate: {
        Empresa: {
          populate: { EmpresaBanco: true }
        },
        Fornecedor: true,
        ContaPagamento: true
      }
    });

    let parcelas = [];
    lista.forEach(item => {
      parcelas.push({
        id: item.id,
        NumeroNF: item.NumeroNF,
        Observacoes: item.Observacoes,
        DataEmissaoNF: item.DataEmissaoNF ?? '-',
        RazaoFornecedor: item.Fornecedor?.Nome,
        FantasiaFornecedor: item.Fornecedor?.NomeFantasia,
        CNPJFornecedor: item.Fornecedor?.CNPJ?.toString(),
        Empresa: item.Empresa?.Descricao,
        Status: item?.Status === Enum_StatusContas.Pago ? 'Pago' : item?.Status === Enum_StatusContas.Baixado ? 'À vencer' : 'À cadastrar',
        ValorBruto: item.ValorTotal,
        QuantidadeParcela: item.ContaPagamento.QuantidadeParcela
      });
    })

    return parcelas.sort((a, b) => {
      a = a.DataEmissaoNF?.split('/').reverse().join('');
      b = b.DataEmissaoNF?.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
  },
  getRelatorioCompetenciaCentro: async (start, end) => {
    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: {
        $and: [
          {
            Status: {
              $ne: Enum_StatusContas.Cancelado
            },
          },
          {
            DataEmissaoNF: { $between: [start, end] }
          }
        ]
      },
      populate: {
        Empresa: {
          populate: { EmpresaBanco: true }
        },
        Cliente: true,
        Fornecedor: true,
        ContaCentrosCustos: {
          populate: { CentroCusto: true }
        },
        ContaPagamento: true
      }
    });

    let parcelas = [];
    lista.forEach(item => {
      item.ContaCentrosCustos?.forEach(cc => {
        parcelas.push({
          id: item.id,
          NumeroNF: item.NumeroNF,
          Observacoes: item.Observacoes,
          DataEmissaoNF: item.DataEmissaoNF ?? '-',
          RazaoFornecedor: item.Fornecedor?.Nome,
          FantasiaFornecedor: item.Fornecedor?.NomeFantasia,
          CNPJFornecedor: item.Fornecedor?.CNPJ?.toString(),
          Empresa: item.Empresa?.Descricao,
          Cliente: item.Cliente?.RazaoSocial,
          ContaCentroCusto: cc?.CentroCusto?.Descricao || '-',
          Status: item?.Status === Enum_StatusContas.Pago ? 'Pago' : item?.Status === Enum_StatusContas.Baixado ? 'À vencer' : 'À cadastrar',
          ValorCentroCusto: cc.Valor,
          ValorBruto: item.ValorTotal,
          QuantidadeParcela: item.ContaPagamento.QuantidadeParcela
        });
      });
    })

    return parcelas.sort((a, b) => {
      a = a.DataEmissaoNF?.split('/').reverse().join('');
      b = b.DataEmissaoNF?.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
  },
  getRelatorioCompetenciaNatureza: async (start, end) => {
    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: {
        $and: [
          {
            Status: {
              $ne: Enum_StatusContas.Cancelado
            },
          },
          {
            DataEmissaoNF: { $between: [start, end] }
          }
        ]
      },
      populate: {
        Empresa: {
          populate: { EmpresaBanco: true }
        },
        Cliente: true,
        Fornecedor: true,
        ContaNaturezasContabeis: {
          populate: { NaturezaContabil: true }
        },
        ContaPagamento: true
      }
    });

    let parcelas = [];
    lista.forEach(item => {
      item.ContaNaturezasContabeis?.forEach(nc => {
        parcelas.push({
          id: item.id,
          NumeroNF: item.NumeroNF,
          Observacoes: item.Observacoes,
          DataEmissaoNF: item.DataEmissaoNF ?? '-',
          RazaoFornecedor: item.Fornecedor?.Nome,
          FantasiaFornecedor: item.Fornecedor?.NomeFantasia,
          CNPJFornecedor: item.Fornecedor?.CNPJ?.toString(),
          Empresa: item.Empresa?.Descricao,
          Cliente: item.Cliente?.RazaoSocial,
          ContaNaturezaContabil: nc?.NaturezaContabil?.Descricao || '-',
          Status: item?.Status === Enum_StatusContas.Pago ? 'Pago' : item?.Status === Enum_StatusContas.Baixado ? 'À vencer' : 'À cadastrar',
          ValorNatureza: nc.Valor,
          ValorBruto: item.ValorTotal,
          QuantidadeParcela: item.ContaPagamento.QuantidadeParcela
        });
      })
    })

    return parcelas.sort((a, b) => {
      a = a.DataEmissaoNF?.split('/').reverse().join('');
      b = b.DataEmissaoNF?.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
  },
  getRelatorioContasAPagarEmAtraso: async (start, end) => {
    let lista = await strapi.entityService.findMany('api::conta.conta', {
      sort: { id: 'DESC' },
      filters: {
        Status: {
          $ne: Enum_StatusContas.Cancelado
        }
      },
      populate: {
        Empresa: {
          populate: { EmpresaBanco: true }
        },
        Fornecedor: true,
        ContaCentrosCustos: {
          populate: { CentroCusto: true }
        },
        ContaNaturezasContabeis: {
          populate: { NaturezaContabil: true }
        },
        ContaPagamento: {
          populate: {
            ContaPagamentoParcela: {
              filters: {
                $and: [
                  {
                    DataVencimento: { $between: [start, end] }
                  },
                  {
                    StatusPagamento: Enum_StatusContasPagamento.Pendente
                  }
                ]
              }
            }
          }
        }
      }
    });

    let parcelas = [];
    lista.forEach(item => {
      item.ContaPagamento?.ContaPagamentoParcela?.forEach(p => {
        const date1 = new Date(p.DataVencimento);
        const date2 = new Date();
        let diffDays = 0;
        const diffTime = Math.abs(date2 - date1);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        parcelas.push({
          id: item.id,
          NumeroNF: item.NumeroNF,
          Observacoes: item.Observacoes,
          DataEmissaoNF: item.DataEmissaoNF ?? '-',
          Vencimento: p.DataVencimento ?? '-',
          VencimentoReal: p.DataVencimentoReal ?? '-',
          RazaoFornecedor: item.Fornecedor?.Nome,
          FantasiaFornecedor: item.Fornecedor?.NomeFantasia,
          CNPJFornecedor: item.Fornecedor?.CNPJ?.toString(),
          Empresa: item.Empresa?.Descricao,
          ContaCentrosCustos: (item.ContaCentrosCustos && item.ContaCentrosCustos?.map(x => `${x.CentroCusto?.Descricao}; `)) || '-',
          ContaNaturezasContabeis: (item.ContaNaturezasContabeis && item.ContaNaturezasContabeis?.map(x => `${x.NaturezaContabil?.Descricao}; `)) || '-',
          Status: item?.Status === Enum_StatusContas.Pago ? 'Pago' : item?.Status === Enum_StatusContas.Baixado ? 'À vencer' : 'À cadastrar',
          NumeroParcela: `${p.NumeroParcela} de ${item.ContaPagamento?.QuantidadeParcela}`,
          ValorPago: p.ValorPago,
          ValorParcela: p.ValorParcela,
          ValorAcrescimo: p.ValorAcrescimo,
          ValorDecrescimo: p.ValorDecrescimo,
          ValorAPagar: p.ValorAPagar,
          QtdDiasAtraso: diffDays,
          StatusPagamento: p?.StatusPagamento === Enum_StatusContasPagamento.Pago ? 'Pago' : p?.StatusPagamento === Enum_StatusContasPagamento.Parcial ? 'Parcial' : p?.DataVencimentoReal > new Date() ? 'Pendente' : 'À vencer'
        });
      })
    })

    return parcelas.sort((a, b) => {
      a = a.Vencimento?.split('/').reverse().join('');
      b = b.Vencimento?.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
  },
  validarNotaFiscal: async (numeroNF, fornecedorId) => {
    let conta = await strapi.entityService.findMany('api::conta.conta', {
      filters: {
        $and: [
          {
            Fornecedor: {
              id: fornecedorId
            }
          },
          {
            NumeroNF: numeroNF
          },
          {
            Status: { $ne: Enum_StatusContas.Cancelado }
          }
        ]
      }
    });
    return !conta || conta.length == 0
  },
  corrigirParcela: async (contaId, parcela) => {
    const query = `CALL proc_atualizar_conta_pagamento_parcela('${contaId}', '${parcela}');`
    console.log(query);
    const resp = await strapi.db.connection.raw(query);
    console.log((resp));
    return resp[0];
  }
};
