'use strict';

/**
 * cliente-integracao service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cliente-integracao.cliente-integracao');
