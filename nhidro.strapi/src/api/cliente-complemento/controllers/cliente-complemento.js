'use strict';

/**
 *  cliente controller
 */

module.exports = {
    buscarCliente: async (ctx) => {
        const { codigo } = ctx.params;

        const cliente = await strapi.services["api::cliente-complemento.cliente-complemento"].buscarCliente(codigo);
        return {
          error: false,
          data: cliente
        };
    },
    inserirCliente: async (ctx, next) => {
        const cliente = ctx.request.body;
        const clienteEntry = await strapi.services["api::cliente-complemento.cliente-complemento"].inserirCliente(cliente);

        return {
            error: false,
            data: clienteEntry
        };
    },
    alterarCliente: async (ctx, next) => {
        const cliente = ctx.request.body;

        const clienteEntry = await strapi.services["api::cliente-complemento.cliente-complemento"].alterarCliente(cliente);

        return {
            error: false,
            data: clienteEntry
        };
    }
};
