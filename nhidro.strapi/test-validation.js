const { createCoreService } = require('@strapi/strapi').factories;

async function run() {
  // It's hard to test without strapi running and db connected.
  // We can just start strapi in a background process, or query what's causing 500.
}
run();
