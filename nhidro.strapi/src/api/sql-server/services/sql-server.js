'use strict';
const { get, create, update, find } = require("./index");

module.exports = {
  get: async (query) => {
    console.log(`Query: ${query} \n`);
    return get(query)
  },
  create: async (query) => {
    console.log(`Query: ${query} \n`);
    return create(query)
  },
  update: async (query) => {
    console.log(`Query: ${query} \n`);
    return update(query)
  },
  find: async (query) => {
    console.log(`Query: ${query} \n`);
    return find(query)
  }
};
