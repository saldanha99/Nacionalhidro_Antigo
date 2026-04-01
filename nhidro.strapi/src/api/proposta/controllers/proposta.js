'use strict';

/**
 *  proposta controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::proposta.proposta', ({ strapi }) => ({
    cadastrar: async (ctx, next) => {
        const data = ctx.request.body?.data;
        const user = ctx.state.user;
  
        await strapi.services["api::proposta.proposta"].cadastrar(data, user);
  
        return {
            error: false,
            data: data
        };
    },
    alterar: async (ctx, next) => {
        const data = ctx.request.body?.data;
        const user = ctx.state.user;
  
        await strapi.services["api::proposta.proposta"].alterar(data, user);
  
        return {
            error: false,
            data: data
        };
    },
    enviar: async (ctx, next) => {
        const data = ctx.request.body?.data;
        const user = ctx.state.user;
  
  
        await strapi.services["api::proposta.proposta"].enviar(data, user);
  
        return {
            error: false,
            data: data
        };
    }
}));
