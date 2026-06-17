module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/faturamentos/gerar',
        handler: 'faturamento.gerar',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/enviar',
        handler: 'faturamento.enviar',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/cancelar',
        handler: 'faturamento.cancelar',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/clonar',
        handler: 'faturamento.clonar',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/buscar',
        handler: 'faturamento.buscar',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/buscar-por-cliente',
        handler: 'faturamento.buscar_por_cliente',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/focus-webhook-nfse',
        handler: 'faturamento.focus_web_hook_nfse',
        config: {
          auth: false,
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/focus-webhook-cte',
        handler: 'faturamento.focus_web_hook_cte',
        config: {
          auth: false,
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/emitir-nfs',
        handler: 'faturamento.emitir_nfse',
        config: {
          auth: false,
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/buscar-relatorio',
        handler: 'faturamento.buscar_relatorio',
        config: {
          policies: [],
          middlewares: []
        }
      },
      {
        method: 'POST',
        path: '/faturamentos/consultar-nfse',
        handler: 'faturamento.consultar_nfse',
        config: {
          auth: false,
          policies: [],
          middlewares: []
        }
      }
    ],
  };
  