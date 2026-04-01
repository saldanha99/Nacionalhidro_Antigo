'use strict';

/**
 * cliente router.
 */

module.exports = {
    routes: [
        {
         method: 'GET',
         path: '/cliente/buscar-clientes',
         handler: 'cliente.buscarClientes',
         config: {
           policies: [],
           middlewares: [],
         },
        },
        {
         method: 'POST',
         path: '/cliente/cadastrarCliente',
         handler: 'cliente.cadastrarCliente',
         config: {
           policies: [],
           middlewares: [],
         },
        },
        {
         method: 'POST',
         path: '/cliente/atualizarCliente',
         handler: 'cliente.atualizarCliente',
         config: {
           policies: [],
           middlewares: [],
         },
        },
        {
         method: 'GET',
         path: '/cliente/get-role/:userId',
         handler: 'cliente.getRole',
         config: {
           policies: [],
           middlewares: [],
         },
        },
        {
          method: 'POST',
          path: '/cliente/enviar-email',
          handler: 'cliente.enviarEmails',
          config: {
            policies: [],
            middlewares: []
          }
        }
    ]
};
