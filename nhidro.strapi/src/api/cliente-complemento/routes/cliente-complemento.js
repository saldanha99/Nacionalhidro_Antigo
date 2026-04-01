module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/cliente-complementos/get/:codigo',
            handler: 'cliente-complemento.buscarCliente',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/cliente-complementos/create',
            handler: 'cliente-complemento.inserirCliente',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/cliente-complementos/update',
            handler: 'cliente-complemento.alterarCliente',
            config: {
                policies: [],
                middlewares: []
            }
        }
    ]
};
