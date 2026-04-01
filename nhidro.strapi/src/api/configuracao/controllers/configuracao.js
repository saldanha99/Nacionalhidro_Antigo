'use strict';

/**
 *  configuracao controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::configuracao.configuracao', ({ strapi }) => ({
    upload: async (ctx, next) => {
        let result = await strapi.services["api::configuracao.configuracao"].upload(Buffer.from(ctx.request.body.buffer.data), ctx.request.body.filename, ctx.request.body.type);  
      
        return {
            error: false,
            url: result
        };;
    },
    send: async (ctx, next) => {
        let result = await strapi.services["api::configuracao.configuracao"].send(ctx.request.body.title, ctx.request.body.files, ctx.request.body.copy);  
      
        return {
            error: false,
            success: result
        };;
    },
    download: async (ctx, next) => {
      try {
        console.log(ctx.request.body);
        const { remoteName, fileName } = ctx.request.body;
        const data = await strapi.services["api::configuracao.configuracao"].getFile(remoteName);  

        ctx.body = data;
      } catch (err) {
        console.log(err.message);
        return ctx.badRequest(err.message);
      }
    },
}));
