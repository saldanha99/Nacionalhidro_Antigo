const nodemailer = require('nodemailer');
let aws = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const AWS_ACCESS_KEY_ID = process.env.AWS_SES_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SES_SECRET_ACCESS_KEY;
const SMTP_USER = process.env.SMTP_USER || 'sistema@nacionalhidro.com.br';
const SMTP_PASS = process.env.SMTP_PASS || 'zvzihtqkhosgzpbk';

let transport;

if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
  // Use AWS SES if credentials are configured
  const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: 'us-east-1',
    credentials: {
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      accessKeyId: AWS_ACCESS_KEY_ID
    }
  });

  transport = nodemailer.createTransport({
    SES: { ses, aws }
  });
  console.log("Using AWS SES transporter");
} else {
  // Use SMTP (Gmail Default)
  transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    pool: true, // Reuse connections
    maxConnections: 1, // Limit for Gmail stability
    maxMessages: 100, // Limit before reconnecting
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  console.log("Using SMTP transporter (Gmail)");
}

const _from = process.env.EMAIL_FROM || 'Nacional Hidro <sistema@nacionalhidro.com.br>';
const _urlStorage = path.resolve("./public/uploads");

module.exports = {
  async sendMail(to, subject, text, files = [], cc) {
    try {
      let attachments = [
        {
          filename: 'logo.png',
          path: path.join(__dirname, 'images', 'logo.png'),
          cid: 'logo'
        }
      ];

      files.forEach(element => {
        if (element.IsBuffer) {
          attachments.push({
            filename: element.NomeArquivo,
            content: element.Content
          });
        } else if (element.IsUrl && element.UrlArquivo) {
          // Tentar localizar arquivo no disco local (public/uploads) primeiro
          let localFilePath = null;
          try {
            const urlParts = element.UrlArquivo.split('/');
            const filename = urlParts[urlParts.length - 1];
            const candidate = path.join(_urlStorage, filename);
            if (fs.existsSync(candidate)) {
              localFilePath = candidate;
            }
          } catch (e) { /* ignore */ }

          attachments.push({
            filename: element.NomeArquivo,
            path: localFilePath || element.UrlArquivo
          });
        } else if (element.IsBase64) {
          attachments.push({
            filename: element.NomeArquivo,
            path: element.Text
          });
        } else {
          attachments.push({
            filename: element.NomeArquivo,
            path: path.join(_urlStorage, element.NomeArquivo)
          });
        }
      });

      // Sanitizar lista de CC
      let cleanCc = undefined;
      if (Array.isArray(cc)) {
        const filtered = cc.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
        if (filtered.length > 0) {
          cleanCc = Array.from(new Set(filtered));
        }
      } else if (typeof cc === 'string' && cc.trim().length > 0) {
        cleanCc = cc.trim();
      }

      console.log(`[sendMail] Destinatário: ${to}, CC: ${JSON.stringify(cleanCc)}, Anexos: ${attachments.length}`);

      const message = {
        from: _from,
        cc: cleanCc,
        to: to,
        subject: subject,
        html: text,
        attachments: attachments
      };

      let send = await transport.sendMail(message);
      console.log('[sendMail] Resposta do servidor de e-mail:', send?.response || send);
      return true;
    } catch (error) {
      console.error('[sendMail] Erro ao enviar e-mail:', error.message || error);
      throw error;
    }
  }
}