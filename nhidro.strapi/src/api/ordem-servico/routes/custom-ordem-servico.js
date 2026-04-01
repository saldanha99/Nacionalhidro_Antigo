module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/ordem-servicos/buscar',
      handler: 'ordem-servico.buscar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/ordem-servicos/buscar-propostas',
      handler: 'ordem-servico.buscar_propostas',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/ordem-servicos/cadastrar',
      handler: 'ordem-servico.cadastrar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/ordem-servicos/alterar',
      handler: 'ordem-servico.alterar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/ordem-servicos/visualizar',
      handler: 'ordem-servico.visualizar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/ordem-servicos/imprimir',
      handler: 'ordem-servico.imprimir',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/ordem-servicos/precificar',
      handler: 'ordem-servico.precificar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/ordem-servicos/verificar-pendencias',
      handler: 'ordem-servico.verificarPendencias',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ],
};
