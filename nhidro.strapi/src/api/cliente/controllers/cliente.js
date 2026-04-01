'use strict';

/**
 *  cliente controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cliente.cliente', ({ strapi }) => ({
    getAllClientes: async (ctx, next) => {
        let result = await strapi.services["api::cliente.cliente"].getAllClientes();  
      
        return result;
    },
    
    getRole: async (ctx, next) => {
        const { userId } = ctx.params;
        let userRole = await strapi.services["api::cliente.cliente"].userRole(userId);  
        return userRole;
    },
    buscarClientes: async (ctx, next) => {
        let result = await strapi.services["api::cliente.cliente"].buscarClientes();  
    
        return {
        error: false,
        data: result
        };
    },
    cadastrarCliente: async (ctx, next) => {
        let result = await strapi.services["api::cliente.cliente"].cadastrarCliente(ctx.request.body);  
    
        return {
        error: false,
        data: result
        };
    },
    atualizarCliente: async (ctx, next) => {
        let result = await strapi.services["api::cliente.cliente"].atualizarCliente(ctx.request.body);  
    
        return {
        error: false,
        data: result
        };
    },
    enviarEmails: async (ctx, next) => {
        const data = ctx.request.body?.data;  
  
        await strapi.services["api::cliente.cliente"].enviarEmails(data);
  
        return {
            error: false,
            data: data
        };
    }
}));
