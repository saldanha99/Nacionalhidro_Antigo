'use strict';

/**
 *  faturamento controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::faturamento.faturamento', ({ strapi }) => ({
    gerar: async (ctx, next) => {
        const data = ctx.request.body?.data || ctx.request.body;
        const resp = await strapi.services["api::faturamento.faturamento"].gerar(data);
  
        return {
            error: !resp.success,
            data: resp
        };
    },
    enviar: async (ctx, next) => {
        const data = ctx.request.body?.data || ctx.request.body;
        const sent = await strapi.services["api::faturamento.faturamento"].enviar(data);
  
        return {
            error: !sent,
            data: data
        };
    },
    cancelar: async (ctx, next) => {
        const data = ctx.request.body?.data || ctx.request.body;
        const resp = await strapi.services["api::faturamento.faturamento"].cancelar(data);
  
        return {
            error: false,
            data: resp
        };
    },
    clonar: async (ctx, next) => {
        const data = ctx.request.body?.data || ctx.request.body;
        const resp = await strapi.services["api::faturamento.faturamento"].clonar(data);
  
        return {
            error: false,
            data: resp
        };
    },
    buscar: async (ctx, next) => {
        const data = ctx.request.body?.params || ctx.request.body;
        const faturamentos = await strapi.services["api::faturamento.faturamento"].buscar(data);
  
        return {
            error: false,
            data: faturamentos
        };
    },
    buscar_por_cliente: async (ctx, next) => {
        const data = ctx.request.body?.params || ctx.request.body;
        const list = await strapi.services["api::faturamento.faturamento"].buscar_por_cliente(data);
  
        return {
            error: false,
            data: list
        };
    },
    focus_web_hook_nfse: async (ctx, next) => {
        const data = ctx.request.body?.data || ctx.request.body;
        console.log(data);
        strapi.services["api::faturamento.faturamento"].focus_web_hook_nfse(data);

        return true;
    },
    focus_web_hook_cte: async (ctx, next) => {
        const data = ctx.request.body?.data || ctx.request.body;
        console.log('focus_web_hook_cte recebido:', JSON.stringify(data));
        try {
            await strapi.services["api::faturamento.faturamento"].focus_web_hook_cte(data);
        } catch (err) {
            console.error('focus_web_hook_cte erro:', err);
        }
        return true;
    },
    emitir_nfse: async (ctx, next) => {
        const data = ctx.request.body?.data || ctx.request.body;
        const resp = await strapi.services["api::faturamento.faturamento"].emitir_nfse(data);
  
        return {
            error: !resp.retorno?.success,
            data: resp.referencia
        };
    },
    buscar_relatorio: async (ctx, next) => {
        const data = ctx.request.body?.params || ctx.request.body;
        const faturamentos = await strapi.services["api::faturamento.faturamento"].buscar_relatorio(data);
  
        return {
            error: false,
            data: faturamentos
        };
    },
    consultar_nfse: async (ctx, next) => {
        const data = ctx.request.body?.data || ctx.request.body;
        const resp = await strapi.services["api::faturamento.faturamento"].consultar_nfse(data);
  
        return {
            error: !resp.success,
            data: resp
        };
    }
}));
