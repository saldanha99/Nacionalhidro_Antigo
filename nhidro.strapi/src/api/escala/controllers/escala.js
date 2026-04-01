'use strict';

/**
 *  escala controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::escala.escala', ({ strapi }) => ({
    cadastrar: async (ctx, next) => {
        const data = ctx.request.body?.data;
  
        await strapi.services["api::escala.escala"].cadastrar(data);
  
        return {
            error: false,
            data: data
        };
    },
    alterar: async (ctx, next) => {
        const data = ctx.request.body?.data;
  
        await strapi.services["api::escala.escala"].alterar(data);
  
        return {
            error: false,
            data: data
        };
    }
}));
