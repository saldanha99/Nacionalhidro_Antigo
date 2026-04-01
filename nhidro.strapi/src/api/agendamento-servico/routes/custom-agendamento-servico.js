'use strict';

/**
 * cliente router.
 */

module.exports = {
    routes: [
        {
         method: 'POST',
         path: '/agendamento-servicos/cadastrar',
         handler: 'agendamento-servico.cadastrar',
         config: {
           policies: [],
           middlewares: [],
         },
        },
        {
         method: 'POST',
         path: '/agendamento-servicos/alterar',
         handler: 'agendamento-servico.alterar',
         config: {
           policies: [],
           middlewares: [],
         },
        },
        {
         method: 'POST',
         path: '/agendamento-servicos/deletar',
         handler: 'agendamento-servico.deletar',
         config: {
           policies: [],
           middlewares: [],
         },
        }
    ]
};
