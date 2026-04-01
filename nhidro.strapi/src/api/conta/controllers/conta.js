'use strict';

/**
 *  conta controller
 */
 const { Enum_StatusContas } = require("../../../../utils/enums");

module.exports = {
    getContasCadastrar: async (ctx, next) => {
      const lista = await strapi.services["api::conta.conta"].getContasByStatus(Enum_StatusContas.Criado);
      return {
        error: false,
        data: lista
      };
    },
    getContasPagar: async (ctx, next) => {
      const { dataInicial, dataFinal } = ctx.request.query;    
      const lista = await strapi.services["api::conta.conta"].getContasPagar(dataInicial, dataFinal);
      return {
        error: false,
        data: lista
      };
    },
    getContasPagas: async (ctx, next) => {
      const { dataInicial, dataFinal } = ctx.request.query; 
      const lista = await strapi.services["api::conta.conta"].getContasPagas(dataInicial, dataFinal);
      return {
        error: false,
        data: lista
      };
    },
    getContasCancelado: async (ctx, next) => {
      const lista = await strapi.services["api::conta.conta"].getContasByStatus(Enum_StatusContas.Cancelado);
      return {
        error: false,
        data: lista
      };
    },
    adicionar: async (ctx, next) => {
      const data = ctx.request.body;
      const user = ctx.state.user;

      await strapi.services["api::conta.conta"].adicionar(data, user);

      return {
          error: false,
          data: data
      };
    },
    alterar: async (ctx, next) => {
      const data = ctx.request.body;
      const user = ctx.state.user;

      await strapi.services["api::conta.conta"].alterar(data, user);

      return {
          error: false,
          data: data
      };
    },
    cadastrar: async (ctx, next) => {
      const data = ctx.request.body;
      const user = ctx.state.user;

      await strapi.services["api::conta.conta"].cadastrar(data, user);

      return {
          error: false,
          data: data
      };
    },
    salvarParcela: async (ctx, next) => {
      const data = ctx.request.body;
      const user = ctx.state.user;

      await strapi.services["api::conta.conta"].salvarParcela(data, user);

      return {
          error: false,
          data: data
      };
    },
    pagar: async (ctx, next) => {
      const data = ctx.request.body;
      const user = ctx.state.user;

      await strapi.services["api::conta.conta"].pagar(data, user);

      return {
          error: false,
          data: data
      };
    },
    corrigir: async (ctx, next) => {
      const data = ctx.request.body;
      const user = ctx.state.user;

      await strapi.services["api::conta.conta"].corrigir(data, user);

      return {
          error: false,
          data: data
      };
    },
    cancelar: async (ctx, next) => {
      const data = ctx.request.body;
      const user = ctx.state.user;

      await strapi.services["api::conta.conta"].cancelar(data, user);

      return {
          error: false,
          data: data
      };
    },
    importar: async (ctx, next) => {
      const data = ctx.request.body;
      const user = ctx.state.user;

      const retorno = await strapi.services["api::conta.conta"].importar(data, user);

      return {
          error: false,
          data: retorno
      };
    },
    buscarListas: async (ctx, next) => {
      const data = ctx.request.body;

      const retorno = await strapi.services["api::conta.conta"].buscarListas(data);

      return {
          error: false,
          data: retorno
      };
    },
    getRelatorio: async (ctx, next) => {
      const data = ctx.request.body;
      let lista;
      switch (data.relatorio) {
        case 'relatorio-simplificado':
          lista = await strapi.services["api::conta.conta"].getRelatorioSimplificado(data.dates[0], data.dates[1]);
          break;
        case 'relatorio-detalhado':
          lista = await strapi.services["api::conta.conta"].getRelatorioDetalhado(data.dates[0], data.dates[1]);
          break;
        case 'relatorio-pagas-periodo':
          lista = await strapi.services["api::conta.conta"].getRelatorioContasPagasPorPeriodo(data.dates[0], data.dates[1]);
          break;
        case 'relatorio-competencia':
          lista = await strapi.services["api::conta.conta"].getRelatorioCompetencia(data.dates[0], data.dates[1]);
          break;
        case 'relatorio-competencia-centro':
          lista = await strapi.services["api::conta.conta"].getRelatorioCompetenciaCentro(data.dates[0], data.dates[1]);
          break;
        case 'relatorio-competencia-natureza':
          lista = await strapi.services["api::conta.conta"].getRelatorioCompetenciaNatureza(data.dates[0], data.dates[1]);
          break;
        case 'relatorio-atraso':
          lista = await strapi.services["api::conta.conta"].getRelatorioContasAPagarEmAtraso(data.dates[0], data.dates[1]);
          break;
        default:
          lista = await strapi.services["api::conta.conta"].getRelatorioSimplificado(data.dates[0], data.dates[1]);
          break;
      }
      return {
        error: false,
        data: lista
      };
    },
    validarNota: async (ctx, next) => {
      const { numeroNF, fornecedorId } = ctx.request.query;    
      const validado = await strapi.services["api::conta.conta"].validarNotaFiscal(numeroNF, fornecedorId);
      return {
        error: false,
        data: validado
      };
    },
    corrigirParcela: async (ctx, next) => {
      const { contaId, parcela } = ctx.request.query;
      console.log(contaId);
      console.log(parcela);
      const ok = await strapi.services["api::conta.conta"].corrigirParcela(contaId, parcela);
      return {
        error: false,
        data: ok
      };
    }
};
