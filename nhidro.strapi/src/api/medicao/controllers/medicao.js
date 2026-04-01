'use strict';

/**
 *  medicao controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::medicao.medicao', ({ strapi }) => ({
    cadastrar: async (ctx, next) => {
        const data = ctx.request.body?.data;
  
        await strapi.services["api::medicao.medicao"].cadastrar(data);
  
        return {
            error: false,
            data: data
        };
    },
    alterar: async (ctx, next) => {
        const data = ctx.request.body?.data;
  
        await strapi.services["api::medicao.medicao"].alterar(data);
  
        return {
            error: false,
            data: data
        };
    },
    cancelar: async (ctx, next) => {
        const data = ctx.request.body?.data;
        const lista = await strapi.services["api::medicao.medicao"].cancelar(data);
        return {
          error: false,
          data: lista
        };
    },
    imprimir: async (ctx, next) => {
        const data = ctx.request.body;
        const buffer = await strapi.services["api::medicao.medicao"].imprimir(data);
  
        return {
            error: false,
            data: buffer.data
        };
    },
    enviar: async (ctx, next) => {
        const data = ctx.request.body?.data;
        try {
            await strapi.services["api::medicao.medicao"].enviar(data);
        } catch (err) {
            return ctx.badRequest(err.message);
        }

        return {
            error: false,
            data: data
        };
    },
    reprovar: async (ctx, next) => {
        const data = ctx.request.body?.data;
        const sent = await strapi.services["api::medicao.medicao"].reprovar(data);
  
        return {
            error: false,
            data: data
        };
    },
    aprovar: async (ctx, next) => {
        const data = ctx.request.body?.data;
        const sent = await strapi.services["api::medicao.medicao"].aprovar(data);
  
        return {
            error: false,
            data: sent
        };
    },
    buscar: async (ctx, next) => {
        const data = ctx.request.body?.params;
        const list = await strapi.services["api::medicao.medicao"].buscar(data);
  
        return {
            error: false,
            data: list
        };
    },
    buscar_precificacao: async (ctx, next) => {
        const data = ctx.request.body?.params;
        const list = await strapi.services["api::medicao.medicao"].buscar_precificacao(data);
  
        return {
            error: false,
            data: list
        };
    },
    buscar_por_cliente: async (ctx, next) => {
        const data = ctx.request.body?.params;
        const list = await strapi.services["api::medicao.medicao"].buscar_por_cliente(data);
  
        return {
            error: false,
            data: list
        };
    },
    buscar_relatorio: async (ctx, next) => {
        const data = ctx.request.body?.params;
        const list = await strapi.services["api::medicao.medicao"].buscar_relatorio(data);
  
        return {
            error: false,
            data: list
        };
    }

}));
