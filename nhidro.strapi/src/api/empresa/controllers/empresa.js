'use strict';

/**
 *  empresa controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::empresa.empresa', ({ strapi }) => ({
    getEmpresas: async (ctx, next) => {
      const lista = await strapi.services["api::empresa.empresa"].getEmpresas();
      return {
        error: false,
        data: lista
      };
    },
    createEmpresa: async (ctx, next) => {
      const data = ctx.request.body;

      await strapi.services["api::empresa.empresa"].createEmpresa(data);

      return {
          error: false,
          data: data
      };
    },
    updateEmpresa: async (ctx, next) => {
      const data = ctx.request.body;

      await strapi.services["api::empresa.empresa"].updateEmpresa(data);

      return {
          error: false,
          data: data
      };
    }
}));