'use strict';

/**
 * cargo service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cargo.cargo');
