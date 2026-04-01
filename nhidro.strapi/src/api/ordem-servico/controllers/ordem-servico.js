'use strict';

/**
 * A set of functions called "actions" for `ordem-servico`
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::ordem-servico.ordem-servico', ({ strapi }) => ({
    buscar: async (ctx, next) => {
        const data = ctx.request.body?.params;
        const os = await strapi.services["api::ordem-servico.ordem-servico"].buscar(data);

        return {
            error: false,
            data: os
        };
    },
    buscar_propostas: async (ctx, next) => {
        const data = ctx.request.body?.params;
        const propostas = await strapi.services["api::ordem-servico.ordem-servico"].buscar_propostas(data);

        return {
            error: false,
            data: propostas
        };
    },
    cadastrar: async (ctx, next) => {
        const data = ctx.request.body?.data;

        const resp = await strapi.services["api::ordem-servico.ordem-servico"].cadastrar(data);

        return {
            error: false,
            data: data,
            message: resp
        };
    },
    alterar: async (ctx, next) => {
        const data = ctx.request.body?.data;

        const resp = await strapi.services["api::ordem-servico.ordem-servico"].alterar(data);

        return {
            error: false,
            data: data,
            message: resp
        };
    },
    visualizar: async (ctx, next) => {
        const data = ctx.request.body;
        const buffer = await strapi.services["api::ordem-servico.ordem-servico"].visualizar(data);
  
        return {
            error: false,
            data: buffer.data
        };
    },
    imprimir: async (ctx, next) => {
        const data = ctx.request.body;
        const buffer = await strapi.services["api::ordem-servico.ordem-servico"].imprimir(data);

        return {
            error: false,
            data: buffer.data
        };
    },
    precificar: async (ctx, next) => {
        const data = ctx.request.body?.data;

        await strapi.services["api::ordem-servico.ordem-servico"].precificar(data);

        return {
            error: false,
            data: data
        };
    },
    verificarPendencias: async (ctx, next) => {
        const data = ctx.request.body;

        const resp = await strapi.services["api::ordem-servico.ordem-servico"].verificarPendencias(data);

        return {
            error: false,
            data: resp
        };
    }
}));
