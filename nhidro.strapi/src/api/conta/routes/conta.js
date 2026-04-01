module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/contas/status-a-cadastrar',
            handler: 'conta.getContasCadastrar',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/contas/status-a-pagar',
            handler: 'conta.getContasPagar',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/contas/status-pagas',
            handler: 'conta.getContasPagas',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/contas/status-cancelado',
            handler: 'conta.getContasCancelado',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/contas/buscar-listas',
            handler: 'conta.buscarListas',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/contas/validar-nota',
            handler: 'conta.validarNota',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'GET',
            path: '/contas/corrigir-parcela',
            handler: 'conta.corrigirParcela',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/contas/relatorio',
            handler: 'conta.getRelatorio',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/contas/adicionar',
            handler: 'conta.adicionar',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/contas/alterar',
            handler: 'conta.alterar',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/contas/cadastrar',
            handler: 'conta.cadastrar',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/contas/salvar-parcela',
            handler: 'conta.salvarParcela',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/contas/pagar',
            handler: 'conta.pagar',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/contas/corrigir',
            handler: 'conta.corrigir',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/contas/importar',
            handler: 'conta.importar',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/contas/cancelar',
            handler: 'conta.cancelar',
            config: {
                policies: [],
                middlewares: []
            }
        }
    ]
}
