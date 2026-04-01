module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/empresas-bancos',
      handler: 'empresa-banco.getEmpresasBanco',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
