module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/enums/getEnum',
     handler: 'enums.getEnum',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
