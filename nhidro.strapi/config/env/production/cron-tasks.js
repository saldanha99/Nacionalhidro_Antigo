module.exports = {
    cobrancaAutomatica: {
        task: async ({ strapi }) => {
            console.log(new Date());
            await strapi.services["api::medicao.medicao"].cobranca_automatica();
        },
        options: {
            rule: '30 8 * * 1-5',
            tz: 'America/Sao_Paulo'
        }
    },
    dailyBackup: {
        task: async ({ strapi }) => {
            await strapi.plugin('strapi-plugin-akatecnologia')
                .service('aka-backup').doBackupWithCompress();
        },
        options: {
            rule: '0 7 * * 1-5',
            tz: 'America/Sao_Paulo'
        }
    }
};