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

        try {
            await strapi.services["api::proposta.proposta"].enviar(data, user);
        } catch (err) {
            // Retorna a mensagem real do erro (400 legível) em vez de um 500 opaco,
            // para que o front e a aba de rede mostrem o motivo do problema.
            strapi.log.error(`[Proposta] Falha ao enviar proposta ${data?.Codigo}: ${err?.message || err}`);
            return ctx.badRequest(err?.message || 'Falha ao enviar a proposta.');
        }

        return {
            error: false,
            data: data
        };
    }
}));
