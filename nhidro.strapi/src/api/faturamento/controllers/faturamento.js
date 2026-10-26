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
    /**
     * Baixa o arquivo da fatura com o nome "NF 8336 - CLIENTE.pdf"; com mais de uma,
     * um ZIP com pasta por empresa e por tipo (pedido da Andréa, 26/10/2026).
     */
    baixar_arquivos: async (ctx, next) => {
        const body = ctx.request.body?.data || ctx.request.body || {};
        const ids = (Array.isArray(body.ids) ? body.ids : []).map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 400);
        if (!ids.length) return ctx.badRequest('Nenhuma fatura escolhida.');
        const resp = await strapi.services["api::faturamento.faturamento"].baixar_arquivos(ids, Boolean(body.zip));
        if (!resp.arquivo) return ctx.badRequest(resp.erro || 'Nenhuma fatura com arquivo.');
        ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(resp.nome)}`);
        ctx.set('Access-Control-Expose-Headers', 'Content-Disposition, X-Arquivos-Faltando');
        if (resp.faltando) ctx.set('X-Arquivos-Faltando', String(resp.faltando));
        ctx.type = resp.tipo;
        ctx.body = resp.arquivo;
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
            data: resp.retorno?.success ? resp.referencia : resp.retorno
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
