'use strict';

/**
 *  empresa-banco controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::empresa-banco.empresa-banco', ({ strapi }) => ({
  getEmpresasBanco: async (ctx, next) => {
    const lista = await strapi.services["api::empresa-banco.empresa-banco"].getEmpresasBanco();
    return {
      error: false,
      data: lista
    };
  }
}));
