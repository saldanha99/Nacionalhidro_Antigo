'use strict';

/**
 *  equipamento controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::equipamento.equipamento', ({ strapi }) => ({
    buscarEquipamentos: async (ctx, next) => {
      const lista = await strapi.services["api::equipamento.equipamento"].buscarEquipamentos();
      return {
        error: false,
        data: lista
      };
    },
    criarEquipamento: async (ctx, next) => {
      const data = ctx.request.body;

      await strapi.services["api::equipamento.equipamento"].criarEquipamento(data);

      return {
          error: false,
          data: data
      };
    },
    atualizarEquipamento: async (ctx, next) => {
      const data = ctx.request.body;

      await strapi.services["api::equipamento.equipamento"].atualizarEquipamento(data);

      return {
          error: false,
          data: data
      };
    }
}));
