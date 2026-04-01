'use strict';

/**
 * conta-pagamento service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::conta-pagamento.conta-pagamento');
