'use strict';

/**
 *  cargo controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cargo.cargo');
