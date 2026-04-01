module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/medicoes/cadastrar',
      handler: 'medicao.cadastrar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/alterar',
      handler: 'medicao.alterar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/imprimir',
      handler: 'medicao.imprimir',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/cancelar',
      handler: 'medicao.cancelar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/enviar',
      handler: 'medicao.enviar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/reprovar',
      handler: 'medicao.reprovar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/aprovar',
      handler: 'medicao.aprovar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/buscar',
      handler: 'medicao.buscar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/buscar-precificacao',
      handler: 'medicao.buscar_precificacao',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/buscar-por-cliente',
      handler: 'medicao.buscar_por_cliente',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/medicoes/buscar-relatorio',
      handler: 'medicao.buscar_relatorio',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ],
};
