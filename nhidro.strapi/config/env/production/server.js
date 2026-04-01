const cronTasks = require("./cron-tasks");

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url : 'https://nhidroapi.akasites.com',
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
  s3: { 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
    backupFolder: 'NHidro'
  },
  azure: { 
    connectionSrtring: process.env.AZURE_STORAGE_CONNECTION_STRING, 
    containerName: 'storage'
  }
});
