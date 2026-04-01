'use strict';

const { Enum_StatusEscalas } = require('../../../../utils/enums');

/**
 *  agendamento-servico controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::agendamento-servico.agendamento-servico', ({ strapi }) => ({
    cadastrar: async (ctx) => {
        let result = await strapi.services["api::agendamento-servico.agendamento-servico"].cadastrar(ctx.request.body);  
    
        return {
            error: false,
            data: result
        };
    },
    alterar: async (ctx) => {
        let result = await strapi.services["api::agendamento-servico.agendamento-servico"].alterar(ctx.request.body);  
    
        return {
            error: false,
            data: result
        };
    },
    deletar: async (ctx) => {
        let result = await strapi.services["api::agendamento-servico.agendamento-servico"].deletar(ctx.request.body?.Id);  
    
        return {
            error: false,
            data: result
        };
    }
}));
