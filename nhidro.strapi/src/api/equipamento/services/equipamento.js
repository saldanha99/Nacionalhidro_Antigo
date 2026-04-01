'use strict';
const _ = require('lodash');

/**
 * equipamento service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::equipamento.equipamento', ({ strapi }) => ({
  buscarEquipamentos: async () => {
    let lista = await strapi.entityService.findMany('api::equipamento.equipamento', {
      populate: ['Veiculos', 'EquipamentoResponsabilidades.Responsabilidade', 'Imagem', 'EquipamentoAcessorios.Acessorio', 'NaturezaContabil']
    });

    return _.orderBy(lista, 'Equipamento', 'asc');
  },
  criarEquipamento: async (data) => {
    let equipamentoResponsabilidades = data.EquipamentoResponsabilidades;
    let equipamentoAcessorios = data.EquipamentoAcessorios;
    delete data.EquipamentoResponsabilidades;
    delete data.EquipamentoAcessorios;
    const entry = await strapi.entityService.create('api::equipamento.equipamento', {
      populate: '*',
      data: data
    });

    for (let er of equipamentoResponsabilidades) {
      const entryEquipamentoResponsabilidade = await strapi.entityService.create('api::equipamento-responsabilidade.equipamento-responsabilidade', {
        populate: '*',
        data: er
      });
      er.id = entryEquipamentoResponsabilidade.id;
    }

    entry.EquipamentoResponsabilidades = equipamentoResponsabilidades;

    for (let ea of equipamentoAcessorios) {
      const entryEquipamentoAcessorios = await strapi.entityService.create('api::equipamento-acessorio.equipamento-acessorio', {
        populate: '*',
        data: ea
      });
      ea.id = entryEquipamentoAcessorios.id;
    }

    entry.EquipamentoAcessorios = equipamentoAcessorios;

    await strapi.entityService.update('api::equipamento.equipamento', entry.id, {
      populate: '*',
      data: entry
    });

    return entry;
  },
  atualizarEquipamento: async (data) => {
    let equipamentoResponsabilidades = data.EquipamentoResponsabilidades;
    let equipamentoAcessorios = data.EquipamentoAcessorios;
    delete data.EquipamentoResponsabilidades;
    delete data.EquipamentoAcessorios;
    for (let er of equipamentoResponsabilidades) {
      if (er?.id > 0) {
        await strapi.entityService.update('api::equipamento-responsabilidade.equipamento-responsabilidade', er.id, {
          data: er
        });
      } else {
        delete er.id;
        const entryEquipamentoResponsabilidade = await strapi.entityService.create('api::equipamento-responsabilidade.equipamento-responsabilidade', {
          populate: '*',
          data: er
        });
        er.id = entryEquipamentoResponsabilidade.id;
      }
    }

    for (let ea of equipamentoAcessorios) {
      if (ea?.id > 0) {
        await strapi.entityService.update('api::equipamento-acessorio.equipamento-acessorio', ea.id, {
          data: ea
        });
      } else {
        delete ea.id;
        const entryEquipamentoAcessorio = await strapi.entityService.create('api::equipamento-acessorio.equipamento-acessorio', {
          populate: '*',
          data: ea
        });
        ea.id = entryEquipamentoAcessorio.id;
      }
    }

    data.EquipamentoResponsabilidades = equipamentoResponsabilidades;
    data.EquipamentoAcessorios = equipamentoAcessorios;
    const entry = await strapi.entityService.update('api::equipamento.equipamento', data.id, {
      populate: ['EquipamentoResponsabilidades', 'EquipamentoAcessorios'],
      data: data
    });

    return entry;

  }
}));
