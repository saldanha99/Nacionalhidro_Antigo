'use strict';
const _ = require('lodash');
const email = require("../../../services/email/index");

/**
 * cliente service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cliente.cliente', ({ strapi }) => ({
    buscarClientes: async () => {
        const clientes = await strapi.entityService.findMany('api::cliente.cliente', {
            populate: ['Empresa', 'Contatos', 'Vendedor', 'Integracoes']
          });
        return _.orderBy(clientes, ['RazaoSocial'], ['asc']);
    },
    cadastrarCliente: async (data) => {
        let contatos = data.Contatos;
        let integracoes = data.Integracoes;

        delete data.Contatos;
        delete data.Integracoes;

        const entry = await strapi.entityService.create('api::cliente.cliente', {
            data: data
        });
        for (let contato of contatos) {
            const entryEmp = await strapi.entityService.create('api::contato.contato', {
                data: contato
            });
            contato.id = entryEmp.id;
        }

        entry.Contatos = contatos;

        if (integracoes.length) {
            for (let item of integracoes) {
                if (item.id > 0) {
                    await strapi.entityService.delete('api::cliente-integracao.cliente-integracao', item.id);
                    delete item.id
                }
                const entryCP = await strapi.entityService.create('api::cliente-integracao.cliente-integracao', {
                    data: item
                });
                item.id = entryCP.id;
            }
        }

        entry.Integracoes = integracoes;

        await strapi.entityService.update('api::cliente.cliente', entry.id, {
            data: entry
        });

        return entry;
    },
    atualizarCliente: async (data) => {
        let contatos = data.Contatos;
        let integracoes = data.Integracoes;
        delete data.Contatos;
        delete data.Integracoes;

        for (let contato of contatos) {
            if (contato?.id > 0) {
                await strapi.entityService.update('api::contato.contato', contato.id, {
                    data: contato
                });
            } else {
                delete contato.id;
                const entryContato = await strapi.entityService.create('api::contato.contato', {
                    data: contato
                });
                contato.id = entryContato.id;
            }
        }

        data.Contatos = contatos;

        if (integracoes.length) {
            for (let item of integracoes) {
                if (item.id > 0) {
                    await strapi.entityService.delete('api::cliente-integracao.cliente-integracao', item.id);
                    delete item.id
                }
                const entryCP = await strapi.entityService.create('api::cliente-integracao.cliente-integracao', {
                    data: item
                });
                item.id = entryCP.id;
            }
        }

        data.Integracoes = integracoes;

        const entry = await strapi.entityService.update('api::cliente.cliente', data.id, {
            data: data
        });

        return entry;
    },
    getAllClientes: async () => {
        const getAllClientes = await listQueries().getAllClientes;
        const result = await strapi.services["api::sql-server.sql-server"].get(getAllClientes);
        return result;
    },
    getClienteById: async (codigo) => {
        let getClienteById = await listQueries().getClienteById;
        getClienteById = getClienteById.replace('{ClienteCodigo}', codigo);
        const result = await strapi.services["api::sql-server.sql-server"].get(getClienteById);
        return result;
    },
    userRole: async (idUser) => {
        const knex = strapi.db.connection;
        const userRole = await 
            knex.select('name')
                .from('up_roles')
                .innerJoin('up_users_role_links', 'up_roles.id', 'up_users_role_links.role_id')
                .where('up_users_role_links.user_id', '=' , idUser)
                .first();
        return userRole.name
    },
    enviarEmails: async (data) => {
        if (data.clientes.length && data.assunto)
        {
            const contatos = data.clientes.map(x => x.Contatos);
            const emails = [];
            contatos.forEach(contato => {
                const emailsContato = contato.map(x => x.Email)
                emailsContato.forEach(x => emails.push(x))
            });
            const files = data.arquivos && data.arquivos.length ? data.arquivos.map(x => { return { Text: x.value, NomeArquivo: x.name, IsBase64: true } }) : []
            email.sendMail(emails, data.assunto, data.mensagem, files);
        }
    }
}));
