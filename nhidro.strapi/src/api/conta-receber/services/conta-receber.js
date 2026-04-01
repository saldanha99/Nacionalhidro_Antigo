"use strict";

const { Enum_StatusContasReceber, Enum_StatusParcelaReceber, Enum_StatusFaturamento } = require("../../../../utils/enums");
var moment = require("moment");
moment.locale('pt-br');

/**
 * conta-receber service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::conta-receber.conta-receber",
  ({ strapi }) => ({
    buscar: async (params) => {
      const query = `SELECT 
          t0.id, 
          t0.status, 
          e0.descricao AS empresa, 
          c0.razao_social AS cliente,
          c0.id cliente_id,
          c0.cnpj cliente_cnpj,
          c1.nome AS contato, 
          t0.nota, 
          t0.tipo_fatura, 
          t0.data_emissao, 
          t0.valor_total,
          t0.data_vencimento, 
          cp0.email AS usuario, 
          t0.created_at, 
          t0.motivo_cancelamento, 
          t0.data_cancelamento, 
          t0.insercao_manual,
          (
            SELECT GROUP_CONCAT(cc.descricao SEPARATOR ', ')
            FROM centros_custo cc
            LEFT JOIN contas_centros_custos_centro_custo_links AS cc1 ON cc.id = cc1.centro_custo_id
            LEFT JOIN contas_receber_conta_centros_custos_links AS cc2 ON cc1.conta_centro_custo_id =cc2.conta_centro_custo_id
            WHERE cc2.conta_receber_id = t0.id
          ) AS centros_custo,
          (
            SELECT GROUP_CONCAT(nc.descricao SEPARATOR ', ')
            FROM naturezas_contabeis nc
            LEFT JOIN contas_naturezas_contabeis_natureza_contabil_links AS nc1 ON nc.id = nc1.natureza_contabil_id
            LEFT JOIN contas_receber_conta_naturezas_contabeis_links AS nc2 ON nc1.conta_natureza_contabil_id = nc2.conta_natureza_contabil_id
            WHERE nc2.conta_receber_id = t0.id
          ) AS naturezas_contabeis
        FROM contas_receber AS t0
        LEFT JOIN contas_receber_cliente_links AS t1 ON t0.id = t1.conta_receber_id
        LEFT JOIN contas_receber_contato_links AS t2 ON t0.id = t2.conta_receber_id
        LEFT JOIN contas_receber_empresa_links AS t3 ON t0.id = t3.conta_receber_id
        LEFT JOIN contas_receber_criado_por_links AS t6 ON t0.id = t6.conta_receber_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN contatos AS c1 ON t2.contato_id = c1.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN up_users AS cp0 ON t6.user_id = cp0.id
        WHERE DATE_FORMAT(t0.created_at, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')
        AND t0.status ${params.Cancelado ? "= " + Enum_StatusContasReceber.Cancelado : 
        "in (" + Enum_StatusContasReceber.EmAberto + ", " + Enum_StatusContasReceber.EmCorrecao + ")"}`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    buscar_parcelas: async (params) => {
      const query = `SELECT c0.id, c0.status_recebimento, t0.id conta, t0.data_envio, e0.descricao empresa, c1.razao_social cliente, c1.id cliente_id, c1.cnpj cliente_cnpj, c2.nome contato, t0.nota, t0.tipo_fatura, t0.data_emissao, 
      c0.valor_parcela, c0.numero_parcela, c0.data_vencimento_real, c0.data_vencimento, c0.valor_a_receber, c0.valor_recebido, f0.url_arquivo_nota, cp0.email usuario, cr0.quantidade_parcela, t0.insercao_manual, c0.created_at, 
      t0.valor_total, c0.valor_acrescimo, c0.valor_decrescimo, t0.observacoes,
      (
        SELECT GROUP_CONCAT(cc.descricao SEPARATOR ', ')
        FROM centros_custo cc
        LEFT JOIN contas_centros_custos_centro_custo_links AS cc1 ON cc.id = cc1.centro_custo_id
        LEFT JOIN contas_receber_conta_centros_custos_links AS cc2 ON cc1.conta_centro_custo_id =cc2.conta_centro_custo_id
        WHERE cc2.conta_receber_id = t0.id
      ) AS centros_custo,
      (
        SELECT GROUP_CONCAT(nc.descricao SEPARATOR ', ')
        FROM naturezas_contabeis nc
        LEFT JOIN contas_naturezas_contabeis_natureza_contabil_links AS nc1 ON nc.id = nc1.natureza_contabil_id
        LEFT JOIN contas_receber_conta_naturezas_contabeis_links AS nc2 ON nc1.conta_natureza_contabil_id = nc2.conta_natureza_contabil_id
        WHERE nc2.conta_receber_id = t0.id
      ) AS naturezas_contabeis
      FROM contas_receber AS t0
      LEFT JOIN contas_receber_conta_recebimento_links AS t1 ON t0.id = t1.conta_receber_id
      LEFT JOIN contas_receber_empresa_links AS t2 ON t0.id = t2.conta_receber_id
      LEFT JOIN contas_receber_cliente_links AS t3 ON t0.id = t3.conta_receber_id
      LEFT JOIN contas_receber_contato_links AS t4 ON t0.id = t4.conta_receber_id
      LEFT JOIN contas_receber_faturamento_links AS t5 ON t0.id = t5.conta_receber_id
      LEFT JOIN conta_recebimentos_conta_recebimento_parcela_links AS t6 ON t1.conta_recebimento_id = t6.conta_recebimento_id
      LEFT JOIN conta_recebimento_parcelas AS c0 ON t6.conta_recebimento_parcela_id = c0.id
      LEFT JOIN contas_receber_criado_por_links AS t7 ON t0.id = t7.conta_receber_id
      LEFT JOIN empresas AS e0 ON t2.empresa_id = e0.id
      LEFT JOIN clientes AS c1 ON t3.cliente_id = c1.id
      LEFT JOIN contatos AS c2 ON t4.contato_id = c2.id
      LEFT JOIN faturamentos AS f0 ON t5.faturamento_id = f0.id
      LEFT JOIN up_users AS cp0 ON t7.user_id = cp0.id
      LEFT JOIN conta_recebimentos AS cr0 ON t1.conta_recebimento_id = cr0.id
      WHERE DATE_FORMAT(c0.data_vencimento_real, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')
      AND t0.status in (${Enum_StatusContasReceber.Pendente}, ${Enum_StatusContasReceber.RecebidoParcial}, ${Enum_StatusContasReceber.Recebido})
      AND c0.status_recebimento != ${params.Recebido ? Enum_StatusParcelaReceber.Pendente : Enum_StatusParcelaReceber.Recebido}
      ORDER BY c0.data_vencimento_real`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    adicionar: async (data, user) => {
      let contascentrocusto = data.ContaCentrosCustos ?? {};
      let contasnaturezacontabil = data.ContaNaturezasContabeis ?? {};
      let contarecebimento = data.ContaRecebimento;
      let contarecebimentoparcela = data?.ContaRecebimento?.ContaRecebimentoParcela;
      delete data.ContaCentrosCustos;
      delete data.ContaNaturezasContabeis;
      delete data.ContaRecebimento;
      delete data.createdBy;
      data.Status = Enum_StatusContasReceber.EmAberto;
      data.CriadoPor = user;
      const entry = await strapi.entityService.create('api::conta-receber.conta-receber', {
        data: data
      });
  
      if (contascentrocusto.length > 0) {
        for (let cc of contascentrocusto) {
          if (cc.CentroCusto) {
            const entryCC = await strapi.entityService.create('api::conta-centro-custo.conta-centro-custo', {
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
              data: cn
            });
            cn.id = entryCN.id;
          }
        }
      }
  
      if (contarecebimento) {
        delete contarecebimento.ContaRecebimentoParcela;
  
        for (let cpp of contarecebimentoparcela) {
          cpp.StatusRecebimento = Enum_StatusParcelaReceber.Pendente;
  
          let dtVencimento = new Date(cpp.DataVencimento);
          if (dtVencimento.getUTCDay() === 6)
            cpp.DataVencimentoReal = moment(dtVencimento.setDate(dtVencimento.getUTCDate() + 2)).format('YYYY-MM-DD');
          else if (dtVencimento.getUTCDay() === 0)
            cpp.DataVencimentoReal = moment(dtVencimento.setDate(dtVencimento.getUTCDate() + 1)).format('YYYY-MM-DD');
          else cpp.DataVencimentoReal = moment(dtVencimento).format('YYYY-MM-DD')
  
          const entryCPP = await strapi.entityService.create('api::conta-recebimento-parcela.conta-recebimento-parcela', {
            data: cpp
          });
          cpp.id = entryCPP.id;
        }

        let entryContaRecebimento = {}
        contarecebimento.ContaRecebimentoParcela = contarecebimentoparcela;
        entryContaRecebimento = await strapi.entityService.create('api::conta-recebimento.conta-recebimento', {
          data: contarecebimento
        });
        contarecebimento.id = entryContaRecebimento.id;
        entry.ContaRecebimento = contarecebimento;
      }
  
      entry.ContaCentrosCustos = contascentrocusto.length > 0 ? contascentrocusto.filter(x => x.id != 0) : null;
      entry.ContaNaturezasContabeis = contasnaturezacontabil.length > 0 ? contasnaturezacontabil.filter(x => x.id != 0) : null;
      delete entry.createdBy;
      delete entry.updatedBy;
  
      await strapi.entityService.update('api::conta-receber.conta-receber', entry.id, {
        data: entry
      });
      
      if (data.Faturamento?.id) {
        await strapi.entityService.update('api::faturamento.faturamento', data.Faturamento.id, {
          data: {
            StatusRecebimento: 'Cadastrado'
          }
        });
      }
  
      return entry;
    },
    alterar: async (data, user) => {
      let contarecebimento = data.ContaRecebimento;
      let contarecebimentoparcela = data.ContaRecebimento.ContaRecebimentoParcela;
      let contascentrocusto = data.ContaCentrosCustos;
      let contasnaturezacontabil = data.ContaNaturezasContabeis;
      delete data.ContaRecebimento;
      delete contarecebimento.ContaRecebimentoParcela;
  
      for (let cc of contascentrocusto) {
        if (cc.id > 0) {
          await strapi.entityService.delete('api::conta-centro-custo.conta-centro-custo', cc.id);
        }
  
        delete cc.id;
        const entryCC = await strapi.entityService.create('api::conta-centro-custo.conta-centro-custo', {
          data: cc
        });
        cc.id = entryCC.id;
      }
  
      for (let cn of contasnaturezacontabil) {
        if (cn.id > 0) {
          await strapi.entityService.delete('api::conta-natureza-contabil.conta-natureza-contabil', cn.id);
        }
  
        delete cn.id;
        const entryCN = await strapi.entityService.create('api::conta-natureza-contabil.conta-natureza-contabil', {
          data: cn
        });
        cn.id = entryCN.id;
      }
  
      for (let cpp of contarecebimentoparcela) {
        if (cpp.StatusRecebimento === Enum_StatusParcelaReceber.Pendente) {
          if (cpp.id > 0) {
            await strapi.entityService.delete('api::conta-recebimento-parcela.conta-recebimento-parcela', cpp.id);
          }
          let dtVencimento = new Date(cpp.DataVencimento);
          delete cpp.id;
          cpp.StatusRecebimento = Enum_StatusParcelaReceber.Pendente;
          if (dtVencimento.getUTCDay() === 6)
            cpp.DataVencimentoReal = moment(dtVencimento.setDate(dtVencimento.getUTCDate() + 2)).format('YYYY-MM-DD');
          else if (dtVencimento.getUTCDay() === 0)
            cpp.DataVencimentoReal = moment(dtVencimento.setDate(dtVencimento.getUTCDate() + 1)).format('YYYY-MM-DD');
          else cpp.DataVencimentoReal = moment(dtVencimento).format('YYYY-MM-DD')
    
          const entryCPP = await strapi.entityService.create('api::conta-recebimento-parcela.conta-recebimento-parcela', {
            data: cpp
          });
          cpp.id = entryCPP.id;
        }
      }
  
      let entryContaRecebimento = {}
      contarecebimento.ContaRecebimentoParcela = contarecebimentoparcela;
      if (contarecebimento.id)
        entryContaRecebimento = await strapi.entityService.update('api::conta-recebimento.conta-recebimento', contarecebimento.id, {
          data: contarecebimento
        });
      else
        entryContaRecebimento = await strapi.entityService.create('api::conta-recebimento.conta-recebimento', {
          data: contarecebimento
        });
      contarecebimento.id = entryContaRecebimento.id;
      data.ContaRecebimento = contarecebimento;
      const entry = await strapi.entityService.update('api::conta-receber.conta-receber', data.id, {
        data: data
      });
  
      return entry;
    },
    receber: async (data, user) => {
      let parcela = data.Parcela;
      const contaId = data.ContaId;
      delete data.ContaId;
  
      const entry = await strapi.entityService.create('api::parcela-recebimento.parcela-recebimento', {
        data: data
      });
  
      parcela.ValorRecebido += data.Valor
      parcela.StatusRecebimento = parcela.ValorAReceber == 0 ? Enum_StatusParcelaReceber.Recebido : Enum_StatusParcelaReceber.Parcial;
  
      await strapi.entityService.update('api::conta-recebimento-parcela.conta-recebimento-parcela', parcela.id, {
        data: parcela
      });
  
      let conta = await strapi.entityService.findOne('api::conta-receber.conta-receber', contaId, {
        populate: ['ContaRecebimento']
      });
  
      if (parcela.StatusRecebimento === Enum_StatusParcelaReceber.Recebido && parcela.NumeroParcela === conta.ContaRecebimento.QuantidadeParcela) {
        conta.Status = Enum_StatusContasReceber.Recebido;
        conta.DataRecebimento = new Date();
        await strapi.entityService.update('api::conta-receber.conta-receber', conta.id, {
          data: conta
        });
      }
  
      return entry;
    },
    buscar_por_cliente: async (params) => {
      const query = `SELECT 
          t0.id, 
          t0.status, 
          e0.descricao AS empresa,
          c0.razao_social AS cliente, 
          c0.id AS cliente_id, 
          c1.nome AS contato, 
          t0.nota, 
          t0.tipo_fatura, 
          t0.data_emissao, 
          t0.valor_total,
          t0.data_vencimento, 
          cp0.email AS usuario, 
          t0.created_at, 
          t0.motivo_cancelamento, 
          t0.data_cancelamento, 
          t0.insercao_manual,
          (
            SELECT GROUP_CONCAT(cc.descricao SEPARATOR ', ')
            FROM centros_custo cc
            LEFT JOIN contas_centros_custos_centro_custo_links AS cc1 ON cc.id = cc1.centro_custo_id
            LEFT JOIN contas_receber_conta_centros_custos_links AS cc2 ON cc1.conta_centro_custo_id =cc2.conta_centro_custo_id
            WHERE cc2.conta_receber_id = t0.id
          ) AS centros_custo,
          (
            SELECT GROUP_CONCAT(nc.descricao SEPARATOR ', ')
            FROM naturezas_contabeis nc
            LEFT JOIN contas_naturezas_contabeis_natureza_contabil_links AS nc1 ON nc.id = nc1.natureza_contabil_id
            LEFT JOIN contas_receber_conta_naturezas_contabeis_links AS nc2 ON nc1.conta_natureza_contabil_id = nc2.conta_natureza_contabil_id
            WHERE nc2.conta_receber_id = t0.id
          ) AS naturezas_contabeis
        FROM contas_receber AS t0
        LEFT JOIN contas_receber_cliente_links AS t1 ON t0.id = t1.conta_receber_id
        LEFT JOIN contas_receber_contato_links AS t2 ON t0.id = t2.conta_receber_id
        LEFT JOIN contas_receber_empresa_links AS t3 ON t0.id = t3.conta_receber_id
        LEFT JOIN contas_receber_criado_por_links AS t6 ON t0.id = t6.conta_receber_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN contatos AS c1 ON t2.contato_id = c1.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN up_users AS cp0 ON t6.user_id = cp0.id
      WHERE c0.id = ${params.cliente_id}`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0]
    },
    buscar_relatorio_simplificado: async (params) => {
      const query = `SELECT CASE             
      WHEN t0.status = 0 THEN 'Cancelado'             
      WHEN c0.status_recebimento = 0 THEN 'Pendente'             
      WHEN c0.status_recebimento = 1 THEN 'Parcial'              
      WHEN c0.status_recebimento = 2 THEN 'Recebido'              
      END AS status_recebimento, 
      c0.id, 
      t0.id conta, 
      e0.descricao empresa, 
      c1.razao_social cliente, 
      c1.id cliente_id, 
      c1.cnpj cliente_cnpj,
      t0.nota, 
      t0.tipo_fatura, 
      DATE_FORMAT(t0.data_emissao, '%d/%m/%Y') data_emissao, 
      c0.valor_parcela, 
      DATE_FORMAT(c0.data_vencimento_real, '%d/%m/%Y') data_vencimento_real, 
      DATE_FORMAT(c0.data_vencimento, '%d/%m/%Y') data_vencimento, 
      c0.valor_a_receber, 
      c0.valor_recebido, 
      c0.valor_acrescimo,
      c0.valor_decrescimo,
      CONCAT(c0.numero_parcela, ' de ', cr0.quantidade_parcela) parcela, 
      CASE WHEN t0.insercao_manual = 1 THEN 'Manual' ELSE 'Automático' END AS insercao_manual
      FROM contas_receber AS t0
      LEFT JOIN contas_receber_conta_recebimento_links AS t1 ON t0.id = t1.conta_receber_id
      LEFT JOIN contas_receber_empresa_links AS t2 ON t0.id = t2.conta_receber_id
      LEFT JOIN contas_receber_cliente_links AS t3 ON t0.id = t3.conta_receber_id
      LEFT JOIN contas_receber_faturamento_links AS t5 ON t0.id = t5.conta_receber_id
      LEFT JOIN conta_recebimentos_conta_recebimento_parcela_links AS t6 ON t1.conta_recebimento_id = t6.conta_recebimento_id
      LEFT JOIN conta_recebimento_parcelas AS c0 ON t6.conta_recebimento_parcela_id = c0.id
      LEFT JOIN empresas AS e0 ON t2.empresa_id = e0.id
      LEFT JOIN clientes AS c1 ON t3.cliente_id = c1.id
      LEFT JOIN faturamentos AS f0 ON t5.faturamento_id = f0.id
      LEFT JOIN conta_recebimentos AS cr0 ON t1.conta_recebimento_id = cr0.id
      WHERE DATE_FORMAT(c0.data_vencimento_real, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')
      ORDER BY c0.id DESC`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    buscar_relatorio_recebidas: async (params) => {
      const query = `SELECT CASE
      WHEN c0.status_recebimento = 0 THEN 'Pendente'
      WHEN c0.status_recebimento = 1 THEN 'Parcial'
      WHEN c0.status_recebimento = 2 THEN 'Recebido'
      END AS status_recebimento,
      c0.id,
      t0.id conta,
      DATE_FORMAT(t0.data_envio, '%d/%m/%Y') data_envio,
      e0.descricao empresa,
      c1.razao_social cliente,
      c1.id cliente_id,
      c1.cnpj cliente_cnpj,
      t0.nota,
      t0.tipo_fatura,
      DATE_FORMAT(t0.data_emissao, '%d/%m/%Y') data_emissao,
      DATE_FORMAT(t0.data_vencimento, '%d/%m/%Y') data_vencimento_fat,
      c0.valor_parcela,
      DATE_FORMAT(c0.data_vencimento_real, '%d/%m/%Y') data_vencimento_real,
      DATE_FORMAT(c0.data_vencimento, '%d/%m/%Y') data_vencimento,
      c0.valor_a_receber,
      c0.valor_recebido,
      c0.valor_acrescimo,
      c0.valor_decrescimo,
      CONCAT(c0.numero_parcela, ' de ', cr0.quantidade_parcela) parcela,
      pr0.valor,
      CASE WHEN t0.insercao_manual = 1 THEN 'Manual' ELSE 'Automático' END AS insercao_manual,
      DATE_FORMAT(pr0.data_recebimento, '%d/%m/%Y') data_recebimento,
      DATE_FORMAT(pr0.created_at, '%d/%m/%Y') data_baixa,
      CONCAT(eb0.banco, " - CC:", eb0.conta, " - AG:", eb0.agencia) AS empresa_banco,
      DATEDIFF(pr0.data_recebimento, c0.data_vencimento) AS dias_aberto
      FROM contas_receber AS t0
      LEFT JOIN contas_receber_conta_recebimento_links AS t1 ON t0.id = t1.conta_receber_id
      LEFT JOIN contas_receber_empresa_links AS t2 ON t0.id = t2.conta_receber_id
      LEFT JOIN contas_receber_cliente_links AS t3 ON t0.id = t3.conta_receber_id
      LEFT JOIN contas_receber_faturamento_links AS t5 ON t0.id = t5.conta_receber_id
      LEFT JOIN conta_recebimentos_conta_recebimento_parcela_links AS t6 ON t1.conta_recebimento_id = t6.conta_recebimento_id
      LEFT JOIN conta_recebimento_parcelas AS c0 ON t6.conta_recebimento_parcela_id = c0.id
      LEFT JOIN parcela_recebimentos_parcela_links AS t8 ON c0.id = t8.conta_recebimento_parcela_id
      LEFT JOIN parcela_recebimentos_empresa_banco_links AS t9 ON t8.parcela_recebimento_id = t9.parcela_recebimento_id
      LEFT JOIN empresas AS e0 ON t2.empresa_id = e0.id
      LEFT JOIN clientes AS c1 ON t3.cliente_id = c1.id
      LEFT JOIN faturamentos AS f0 ON t5.faturamento_id = f0.id
      LEFT JOIN conta_recebimentos AS cr0 ON t1.conta_recebimento_id = cr0.id
      LEFT JOIN parcela_recebimentos AS pr0 ON t8.parcela_recebimento_id = pr0.id
      LEFT JOIN empresas_bancos AS eb0 ON t9.empresa_banco_id = eb0.id
      WHERE DATE_FORMAT(pr0.data_recebimento, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d') AND c0.status_recebimento > 0 AND t0.status != 0
      ORDER BY c0.id DESC`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    buscar_relatorio_competencia: async (params) => {
      const query = `SELECT CASE             
        WHEN t0.status = 0 THEN 'Cancelado'             
        WHEN t0.status = 1 THEN 'Em aberto'              
        WHEN t0.status = 2 THEN 'Aguardando Receb.'              
        WHEN t0.status = 3 THEN 'Recebido Parcialmente'              
        WHEN t0.status = 4 THEN 'Recebido'
        WHEN t0.status = 5 THEN 'Em correção' 
        END AS status,
        t0.id,
        e0.descricao AS empresa, 
        c0.razao_social AS cliente, 
        c0.id AS cliente_id, 
        c0.cnpj AS cliente_cnpj, 
        t0.nota, 
        t0.tipo_fatura, 
        DATE_FORMAT(t0.data_emissao, '%d/%m/%Y') data_emissao, 
        t0.valor_total,
        t0.valor_bruto,
        DATE_FORMAT(t0.data_vencimento, '%d/%m/%Y') data_vencimento,
        CASE WHEN t0.insercao_manual = 1 THEN 'Manual' ELSE 'Automático' END AS insercao_manual,
        t0.observacoes,
        cr0.quantidade_parcela
        FROM contas_receber AS t0
        LEFT JOIN contas_receber_cliente_links AS t1 ON t0.id = t1.conta_receber_id
        LEFT JOIN contas_receber_contato_links AS t2 ON t0.id = t2.conta_receber_id
        LEFT JOIN contas_receber_empresa_links AS t3 ON t0.id = t3.conta_receber_id
        LEFT JOIN contas_receber_conta_recebimento_links AS t4 ON t0.id = t4.conta_receber_id
        LEFT JOIN contas_receber_criado_por_links AS t6 ON t0.id = t6.conta_receber_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN conta_recebimentos AS cr0 ON t4.conta_recebimento_id = cr0.id
        WHERE DATE_FORMAT(t0.data_emissao, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')
        ORDER BY t0.id DESC`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    buscar_relatorio_centro: async (params) => {
      const query = `SELECT CASE             
        WHEN t0.status = 0 THEN 'Cancelado'             
        WHEN t0.status = 1 THEN 'Em aberto'              
        WHEN t0.status = 2 THEN 'Aguardando Receb.'              
        WHEN t0.status = 3 THEN 'Recebido Parcialmente'              
        WHEN t0.status = 4 THEN 'Recebido'
        WHEN t0.status = 5 THEN 'Em correção' 
        END AS status,
        t0.id,
        e0.descricao AS empresa, 
        c0.razao_social AS cliente, 
        c0.id AS cliente_id, 
        c0.cnpj AS cliente_cnpj, 
        t0.nota, 
        t0.tipo_fatura, 
        DATE_FORMAT(t0.data_emissao, '%d/%m/%Y') data_emissao, 
        t0.valor_total,
        t0.valor_bruto,
        DATE_FORMAT(t0.data_vencimento, '%d/%m/%Y') data_vencimento,
        CASE WHEN t0.insercao_manual = 1 THEN 'Manual' ELSE 'Automático' END AS insercao_manual,
        cc0.descricao centro_custo,
        cc1.valor centro_valor,
        t0.observacoes,
        cr0.quantidade_parcela
        FROM contas_receber AS t0
        LEFT JOIN contas_receber_cliente_links AS t1 ON t0.id = t1.conta_receber_id
        LEFT JOIN contas_receber_contato_links AS t2 ON t0.id = t2.conta_receber_id
        LEFT JOIN contas_receber_empresa_links AS t3 ON t0.id = t3.conta_receber_id
        LEFT JOIN contas_receber_conta_recebimento_links AS t4 ON t0.id = t4.conta_receber_id
        LEFT JOIN contas_receber_criado_por_links AS t6 ON t0.id = t6.conta_receber_id
        LEFT JOIN contas_receber_conta_centros_custos_links AS t7 ON t0.id = t7.conta_receber_id
        LEFT JOIN contas_centros_custos_centro_custo_links AS t9 ON t7.conta_centro_custo_id = t9.conta_centro_custo_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN centros_custo AS cc0 ON t9.centro_custo_id = cc0.id
        LEFT JOIN contas_centros_custos cc1 ON t9.conta_centro_custo_id = cc1.id
        LEFT JOIN conta_recebimentos AS cr0 ON t4.conta_recebimento_id = cr0.id
        WHERE DATE_FORMAT(t0.data_emissao, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')
        ORDER BY t0.id DESC`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    buscar_relatorio_natureza: async (params) => {
      const query = `SELECT CASE             
        WHEN t0.status = 0 THEN 'Cancelado'             
        WHEN t0.status = 1 THEN 'Em aberto'              
        WHEN t0.status = 2 THEN 'Aguardando Receb.'              
        WHEN t0.status = 3 THEN 'Recebido Parcialmente'              
        WHEN t0.status = 4 THEN 'Recebido'
        WHEN t0.status = 5 THEN 'Em correção' 
        END AS status,
        t0.id,
        e0.descricao AS empresa, 
        c0.razao_social AS cliente, 
        c0.id AS cliente_id, 
        c0.cnpj AS cliente_cnpj, 
        t0.nota, 
        t0.tipo_fatura, 
        DATE_FORMAT(t0.data_emissao, '%d/%m/%Y') data_emissao, 
        t0.valor_total,
        t0.valor_bruto,
        DATE_FORMAT(t0.data_vencimento, '%d/%m/%Y') data_vencimento,
        CASE WHEN t0.insercao_manual = 1 THEN 'Manual' ELSE 'Automático' END AS insercao_manual,
        nc0.descricao natureza_contabil,
        nc1.valor natureza_valor,
        t0.observacoes,
        cr0.quantidade_parcela
        FROM contas_receber AS t0
        LEFT JOIN contas_receber_cliente_links AS t1 ON t0.id = t1.conta_receber_id
        LEFT JOIN contas_receber_contato_links AS t2 ON t0.id = t2.conta_receber_id
        LEFT JOIN contas_receber_empresa_links AS t3 ON t0.id = t3.conta_receber_id
        LEFT JOIN contas_receber_conta_recebimento_links AS t4 ON t0.id = t4.conta_receber_id
        LEFT JOIN contas_receber_criado_por_links AS t6 ON t0.id = t6.conta_receber_id
        LEFT JOIN contas_receber_conta_naturezas_contabeis_links AS t8 ON t0.id = t8.conta_receber_id
        LEFT JOIN contas_naturezas_contabeis_natureza_contabil_links AS t10 ON t8.conta_natureza_contabil_id = t10.conta_natureza_contabil_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN naturezas_contabeis AS nc0 ON t10.natureza_contabil_id = nc0.id
        LEFT JOIN contas_naturezas_contabeis nc1 ON t10.conta_natureza_contabil_id = nc1.id
        LEFT JOIN conta_recebimentos AS cr0 ON t4.conta_recebimento_id = cr0.id
        WHERE DATE_FORMAT(t0.data_emissao, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')
        ORDER BY t0.id DESC`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    buscar_relatorio_atraso: async (params) => {
      const query = `SELECT CASE
      WHEN c0.status_recebimento = 0 THEN 'Pendente'
      WHEN c0.status_recebimento = 1 THEN 'Parcial'
      WHEN c0.status_recebimento = 2 THEN 'Recebido'
      END AS status_recebimento,
      c0.id,
      t0.id conta,
      e0.descricao empresa,
      c1.razao_social cliente,
      c1.id cliente_id,
      c1.cnpj cliente_cnpj,
      t0.nota,
      t0.tipo_fatura,
      DATE_FORMAT(t0.data_emissao, '%d/%m/%Y') data_emissao,
      c0.valor_parcela,
      DATE_FORMAT(c0.data_vencimento_real, '%d/%m/%Y') data_vencimento_real,
      DATE_FORMAT(c0.data_vencimento, '%d/%m/%Y') data_vencimento,
      CASE WHEN c0.valor_a_receber IS NULL THEN c0.valor_parcela ELSE c0.valor_a_receber END valor_a_receber,
      c0.valor_recebido,
      c0.valor_acrescimo,
      c0.valor_decrescimo,
      CONCAT(c0.numero_parcela, ' de ', cr0.quantidade_parcela) parcela,
      CASE WHEN t0.insercao_manual = 1 THEN 'Manual' ELSE 'Automático' END AS insercao_manual,
      DATEDIFF(CURDATE(), c0.data_vencimento_real) AS dias_atraso,
      t0.observacoes
      FROM contas_receber AS t0
      LEFT JOIN contas_receber_conta_recebimento_links AS t1 ON t0.id = t1.conta_receber_id
      LEFT JOIN contas_receber_empresa_links AS t2 ON t0.id = t2.conta_receber_id
      LEFT JOIN contas_receber_cliente_links AS t3 ON t0.id = t3.conta_receber_id
      LEFT JOIN contas_receber_faturamento_links AS t5 ON t0.id = t5.conta_receber_id
      LEFT JOIN conta_recebimentos_conta_recebimento_parcela_links AS t6 ON t1.conta_recebimento_id = t6.conta_recebimento_id
      LEFT JOIN conta_recebimento_parcelas AS c0 ON t6.conta_recebimento_parcela_id = c0.id
      LEFT JOIN empresas AS e0 ON t2.empresa_id = e0.id
      LEFT JOIN clientes AS c1 ON t3.cliente_id = c1.id
      LEFT JOIN faturamentos AS f0 ON t5.faturamento_id = f0.id
      LEFT JOIN conta_recebimentos AS cr0 ON t1.conta_recebimento_id = cr0.id
      WHERE DATE_FORMAT(c0.data_vencimento_real, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d') AND c0.status_recebimento < 2 AND t0.status != 0 AND DATEDIFF(CURDATE(), c0.data_vencimento_real) > 0
      ORDER BY c0.id DESC`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    buscar_relatorio_antecipado: async (params) => {
      const query = `SELECT 
      cr.id conta,
      c0.razao_social cliente, 
      c0.id cliente_id, 
      c0.cnpj cliente_cnpj, 
      cr.nota, 
      cr.tipo_fatura,
      DATE_FORMAT(cr.data_emissao, '%d/%m/%Y') data_emissao,
      e0.descricao empresa,
      DATE_FORMAT(crp.data_vencimento, '%d/%m/%Y') data_vencimento,
      crp.valor_parcela,
      crp.valor_acrescimo,
      crp.valor_decrescimo,
      t0.taxa_juros,
      t0.valor_operacao, 
      t0.valor, 
      DATE_FORMAT(t0.data_recebimento, '%d/%m/%Y') data_recebimento,
      t0.observacao
      FROM parcela_recebimentos AS t0                              
      LEFT JOIN parcela_recebimentos_parcela_links AS t1 ON t0.id = t1.parcela_recebimento_id
      LEFT JOIN conta_recebimentos_conta_recebimento_parcela_links AS t2 ON t1.conta_recebimento_parcela_id = t2.conta_recebimento_parcela_id
      LEFT JOIN contas_receber_conta_recebimento_links AS t3 ON t2.conta_recebimento_id = t3.conta_recebimento_id
      LEFT JOIN	contas_receber_cliente_links AS t4 ON t3.conta_receber_id = t4.conta_receber_id
      LEFT JOIN	contas_receber_empresa_links AS t5 ON t3.conta_receber_id = t5.conta_receber_id
      LEFT JOIN conta_recebimento_parcelas AS crp ON t1.conta_recebimento_parcela_id = crp.id
      LEFT JOIN	contas_receber AS cr ON t3.conta_receber_id = cr.id
      LEFT JOIN clientes AS c0 ON t4.cliente_id = c0.id
      LEFT JOIN empresas AS e0 ON t5.empresa_id = e0.id
      WHERE DATE_FORMAT(t0.data_recebimento, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d') AND t0.antecipar = 1
      ORDER BY t0.data_recebimento DESC`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    buscar_relatorio_ciclo: async (params) => {
      const query = `SELECT 
      t0.id conta,
      DATE_FORMAT(m0.created_at, '%d/%m/%Y') data_medicao,
      CONCAT(m0.codigo, '/', m0.revisao) medicao,
      DATE_FORMAT(f0.data_emissao, '%d/%m/%Y') data_emissao,
      f0.nota,
      f0.tipo_fatura,
      e0.descricao empresa,
      c1.id cliente_id,
      c1.cnpj cliente_cnpj,
      c1.razao_social cliente,
      DATE_FORMAT(t0.data_recebimento, '%d/%m/%Y') data_recebimento,
      DATEDIFF(t0.data_recebimento, m0.created_at) AS ciclo_operacional,
      t0.observacoes
      FROM contas_receber AS t0
      LEFT JOIN contas_receber_empresa_links AS t2 ON t0.id = t2.conta_receber_id
      LEFT JOIN contas_receber_cliente_links AS t3 ON t0.id = t3.conta_receber_id
      LEFT JOIN contas_receber_faturamento_links AS t4 ON t0.id = t4.conta_receber_id
      LEFT JOIN faturamentos_medicao_links AS t5 ON t4.faturamento_id = t5.faturamento_id
      LEFT JOIN empresas AS e0 ON t2.empresa_id = e0.id
      LEFT JOIN clientes AS c1 ON t3.cliente_id = c1.id
      LEFT JOIN faturamentos AS f0 ON t4.faturamento_id = f0.id
      LEFT JOIN medicoes AS m0 ON t5.medicao_id = m0.id
      WHERE t0.status = 4 AND DATE_FORMAT(t0.data_recebimento, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')
      ORDER BY t0.data_recebimento DESC`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    validar_nota: async (nota, empresaId, tipo) => {
      let faturamento = await strapi.entityService.findMany('api::faturamento.faturamento', {
        filters: {
          $and: [
            {
              Empresa: {
                id: empresaId
              }
            },
            {
              Nota: nota
            },
            {
              Status: { $ne: Enum_StatusFaturamento.Cancelado }
            },
            {
              TipoFatura: tipo
            }
          ]
        }
      });

      let conta = await strapi.entityService.findMany('api::conta-receber.conta-receber', {
        filters: {
          $and: [
            {
              Empresa: {
                id: empresaId
              }
            },
            {
              Nota: nota
            },
            {
              Status: { $ne: Enum_StatusContasReceber.Cancelado }
            },
            {
              TipoFatura: tipo
            }
          ]
        }
      });
      console.log(conta);
      console.log(faturamento);
      return (!conta || conta.length == 0) && (!faturamento || faturamento.length == 0);
    }
  })
);
