module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/contas-receber/buscar',
        handler: 'conta-receber.buscar',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/contas-receber/buscar-parcelas',
        handler: 'conta-receber.buscar_parcelas',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/contas-receber/adicionar',
        handler: 'conta-receber.adicionar',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/contas-receber/alterar',
        handler: 'conta-receber.alterar',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/contas-receber/receber',
        handler: 'conta-receber.receber',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/contas-receber/buscar-por-cliente',
        handler: 'conta-receber.buscar_por_cliente',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/contas-receber/buscar-relatorio',
        handler: 'conta-receber.buscar_relatorio',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
          method: 'GET',
          path: '/contas-receber/validar-nota/:nota/:empresa/:tipo',
          handler: 'conta-receber.validar_nota',
          config: {
              policies: [],
              middlewares: []
          }
      }
    ],
  };
  