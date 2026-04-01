 module.exports = {
  '30 8 * * 1-5': async ({ strapi }) => {
    console.log(new Date());
    await strapi.services["api::medicao.medicao"].cobranca_automatica();
  }
};