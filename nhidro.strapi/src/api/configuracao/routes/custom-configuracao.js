'use strict';

/**
 * configuracao router.
 */

module.exports = {
    routes: [
        {
         method: 'POST',
         path: '/configuracoes/upload',
         handler: 'configuracao.upload',
         config: {
           policies: [],
           middlewares: [],
         }
        },
        {
         method: 'POST',
         path: '/configuracoes/send',
         handler: 'configuracao.send',
         config: {
           policies: [],
           middlewares: [],
         }
        },
        {
          method: "POST",
          path: "/configuracoes/download",
          handler: "configuracao.download",
          config: {
            policies: [],
            middlewares: [],
          }
        }
    ]
};
