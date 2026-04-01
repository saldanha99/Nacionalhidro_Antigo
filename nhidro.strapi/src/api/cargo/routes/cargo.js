'use strict';

/**
 * cargo router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::cargo.cargo');
