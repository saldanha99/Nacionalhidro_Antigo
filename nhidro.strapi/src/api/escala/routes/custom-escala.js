module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/escalas/cadastrar',
      handler: 'escala.cadastrar',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/escalas/alterar',
      handler: 'escala.alterar',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ],
};
