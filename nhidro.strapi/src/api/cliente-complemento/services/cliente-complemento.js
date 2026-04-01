'use strict';

/**
 * `cliente` service.
 */

module.exports = {
    buscarCliente: async (codigo) => {
        const listaClientes = await strapi.entityService.findMany('api::cliente-complemento.cliente-complemento', {
            filters: { ClienteCodigo: codigo },
            populate: { Empresa: true }
          });
        
        return listaClientes[0];
    },
    inserirCliente: async (cliente) => {
        const entryCliente = await strapi.entityService.create('api::cliente-complemento.cliente-complemento', {
            populate: 'Empresa',
            data: cliente
        });

        return entryCliente;
    },
    alterarCliente: async (cliente) => {
        const entryCliente = await strapi.entityService.update('api::cliente-complemento.cliente-complemento', cliente.id, {
            data: cliente
        });

        return entryCliente;
    }
};
