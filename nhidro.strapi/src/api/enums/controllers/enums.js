'use strict';

/**
 * A set of functions called "actions" for `enums`
 */

module.exports = {
  async getEnum(ctx) {
    const contentType =
      strapi.contentTypes[
        `api::${ctx.request.query.tabela}.${ctx.request.query.tabela}`
      ];

    return contentType.attributes[ctx.request.query.atributo].enum;
  },
};
