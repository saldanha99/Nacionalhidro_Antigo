'use strict';

/**
 * proposta router.
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/propostas/cadastrar',
      handler: 'proposta.cadastrar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/propostas/alterar',
      handler: 'proposta.alterar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/propostas/enviar',
      handler: 'proposta.enviar',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
