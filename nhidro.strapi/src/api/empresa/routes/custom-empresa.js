module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/empresas/getEmpresas',
            handler: 'empresa.getEmpresas',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/empresas/createEmpresa',
            handler: 'empresa.createEmpresa',
            config: {
                policies: [],
                middlewares: []
            }
        },
        {
            method: 'POST',
            path: '/empresas/updateEmpresa',
            handler: 'empresa.updateEmpresa',
            config: {
                policies: [],
                middlewares: []
            }
        },
    ]
}
