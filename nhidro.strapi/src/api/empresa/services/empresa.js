'use strict';
const _ = require('lodash');

/**
 * empresa service.
 */
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::empresa.empresa', ({ strapi }) => ({
  getEmpresas: async () => {
    let lista = await strapi.entityService.findMany('api::empresa.empresa', {
      sort: { id: 'DESC' },
      populate: ['EmpresaBanco']
    });

    return _.orderBy(lista, ['RazaoSocial'], 'asc');
  },
  createEmpresa: async (data) => {
    let empresasBanco = data.EmpresaBanco;
    delete data.EmpresaBanco;
    const entry = await strapi.entityService.create('api::empresa.empresa', {
      populate: '*',
      data: data
    });

    for (let empresa of empresasBanco) {
      const entryEmp = await strapi.entityService.create('api::empresa-banco.empresa-banco', {
        populate: '*',
        data: empresa
      });
      empresa.id = entryEmp.id;
    }

    entry.EmpresaBanco = empresasBanco;

    await strapi.entityService.update('api::empresa.empresa', entry.id, {
      populate: '*',
      data: entry
    });

    return entry;
  },
  updateEmpresa: async (data) => {
    let empresasBanco = data.EmpresaBanco;
    delete data.EmpresaBanco;
    for (let banco of empresasBanco) {
      if (banco?.id > 0) {
        await strapi.entityService.update('api::empresa-banco.empresa-banco', banco.id, {
          data: banco
        });
      } else {
        delete banco.id;
        const entryBanco = await strapi.entityService.create('api::empresa-banco.empresa-banco', {
          populate: '*',
          data: banco
        });
        banco.id = entryBanco.id;
      }
    }

    data.EmpresaBanco = empresasBanco;
    const entry = await strapi.entityService.update('api::empresa.empresa', data.id, {
      populate: ['EmpresaBanco'],
      data: data
    });

    return entry;

  }
}));
