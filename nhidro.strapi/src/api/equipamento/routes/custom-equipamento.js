'use strict';

/**
 * equipamento router.
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/equipamentos/buscarEquipamentos',
      handler: 'equipamento.buscarEquipamentos',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/equipamentos/criarEquipamento',
      handler: 'equipamento.criarEquipamento',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/equipamentos/atualizarEquipamento',
      handler: 'equipamento.atualizarEquipamento',
      config: {
        policies: [],
        middlewares: []
      }
    },
  ]
};
