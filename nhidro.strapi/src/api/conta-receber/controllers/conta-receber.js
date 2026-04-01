'use strict';

/**
 *  conta-receber controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::conta-receber.conta-receber', ({ strapi }) => ({
    buscar: async (ctx, next) => {
        const data = ctx.request.body?.params;
        const conta = await strapi.services["api::conta-receber.conta-receber"].buscar(data);

        return {
            error: false,
            data: conta
        };
    },
    buscar_parcelas: async (ctx, next) => {
        const data = ctx.request.body?.params;
        const conta = await strapi.services["api::conta-receber.conta-receber"].buscar_parcelas(data);

        return {
            error: false,
            data: conta
        };
    },
    adicionar: async (ctx, next) => {
        const data = ctx.request.body;
        const user = ctx.state.user;

        await strapi.services["api::conta-receber.conta-receber"].adicionar(data, user);

        return {
            error: false,
            data: data
        };
    },
    alterar: async (ctx, next) => {
        const data = ctx.request.body;
        const user = ctx.state.user;

        await strapi.services["api::conta-receber.conta-receber"].alterar(data, user);

        return {
            error: false,
            data: data
        };
    },
    receber: async (ctx, next) => {
        const data = ctx.request.body;
        const user = ctx.state.user;

        await strapi.services["api::conta-receber.conta-receber"].receber(data, user);

        return {
            error: false,
            data: data
        };
    },
    buscar_por_cliente: async (ctx, next) => {
        const data = ctx.request.body?.params;
        const list = await strapi.services["api::conta-receber.conta-receber"].buscar_por_cliente(data);

        return {
            error: false,
            data: list
        };
    },
    buscar_relatorio: async (ctx, next) => {
        const data = ctx.request.body?.params;
        let conta;
        console.log(data);
        switch (data.relatorio) {
            case 'relatorio-simplificado':
                conta = await strapi.services["api::conta-receber.conta-receber"].buscar_relatorio_simplificado(data);
                break;
            case 'relatorio-recebidas':
                conta = await strapi.services["api::conta-receber.conta-receber"].buscar_relatorio_recebidas(data);
                break;
            case 'relatorio-competencia':
                conta = await strapi.services["api::conta-receber.conta-receber"].buscar_relatorio_competencia(data);
                break;
            case 'relatorio-centro':
                conta = await strapi.services["api::conta-receber.conta-receber"].buscar_relatorio_centro(data);
                break;
            case 'relatorio-natureza':
                conta = await strapi.services["api::conta-receber.conta-receber"].buscar_relatorio_natureza(data);
                break;
            case 'relatorio-atraso':
                conta = await strapi.services["api::conta-receber.conta-receber"].buscar_relatorio_atraso(data);
                break;
            case 'relatorio-antecipado':
                conta = await strapi.services["api::conta-receber.conta-receber"].buscar_relatorio_antecipado(data);
                break;
            case 'relatorio-ciclo':
                conta = await strapi.services["api::conta-receber.conta-receber"].buscar_relatorio_ciclo(data);
                break;
            default:
                conta = await strapi.services["api::conta-receber.conta-receber"].buscar_relatorio_simplificado(data);
                break;
        }

        return {
            error: false,
            data: conta
        };
    },
    validar_nota: async (ctx, next) => {
        const { nota, empresa, tipo } = ctx.request.params;  
        console.log(ctx.request.params);  
        const validado = await strapi.services["api::conta-receber.conta-receber"].validar_nota(nota, empresa, tipo);

        return {
            error: false,
            data: validado
        };
    }
}));