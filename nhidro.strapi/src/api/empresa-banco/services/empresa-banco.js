'use strict';
const _ = require('lodash');

/**
 * empresa-banco service.
 */
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::empresa-banco.empresa-banco', ({ strapi }) => ({
  getEmpresasBanco: async () => {
    let lista = await strapi.entityService.findMany('api::empresa-banco.empresa-banco', {
      sort: { id: 'DESC' },
      populate: ['Empresa']
    });

    return _.orderBy(lista, 'Banco', 'asc');
  }
}));
