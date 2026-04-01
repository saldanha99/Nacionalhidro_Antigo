var crypto = require('crypto');

module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "smtp.gmail.com", //SMTP Host
        port: 465, //SMTP Port
        //secure: true,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
        settings: {
          defaultFrom: process.env.EMAIL_FROM || 'Sistema <noreply@nacionalhidro.com.br>',
        },
        // rejectUnauthorized: true,
        // requireTLS: true,
        // connectionTimeout: 1,
      },
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      jwt: {
          expiresIn: '30d',
      }
    }
  }
});
