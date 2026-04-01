module.exports = {
  user: process.env.SQLSERVER_USER || '',
  password: process.env.SQLSERVER_PASSWORD || '',
  server: process.env.SQLSERVER_HOST || '',
  database: process.env.SQLSERVER_DATABASE || '',
      options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs,
  },
  connectionTimeout: 60000,
  requestTimeout: 60000
}; 