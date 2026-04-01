module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'nhidro'),
      user: env('DATABASE_USERNAME', ''),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', true)
    },
    acquireConnectionTimeout: 1000000,
    pool: {
      min: 0,
      max: 10,
      acquireTimeoutMillis: 300000,
      createTimeoutMillis: 300000,
      destroyTimeoutMillis: 300000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis:1000,
      createRetryIntervalMillis: 2000
    }
  }
});
 