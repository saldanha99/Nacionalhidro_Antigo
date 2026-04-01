const nodemailer = require('nodemailer');
let aws = require('aws-sdk');
const path = require('path');

const AWS_ACCESS_KEY_ID = process.env.AWS_SES_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SES_SECRET_ACCESS_KEY;

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: 'us-east-1',
  credentials: {
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY_ID
  }
});

const transport = nodemailer.createTransport({
  SES: { ses, aws }
});

const _from = {
  name: 'Nacional Hidro',
  address: 'sistema@nacionalhidro.com.br'
};
const _urlStorage = `${path.resolve("./")}\\public\\relatorios`;

module.exports = {
  async sendMail(to, subject, text, files = [], cc) {
    try {
      let attachments = [
        {
          filename: 'logo.png',
          path: __dirname + '/images/logo.png',
          cid: 'logo'
        }
      ];
      files.forEach(element => {
        if (element.IsBuffer) {
          attachments.push({
            filename: element.NomeArquivo,
            content: element.Content
          })
        } else {
          attachments.push({
            filename: element.NomeArquivo,
            path: element.IsUrl ? element.UrlArquivo : element.IsBase64? element.Text : `${_urlStorage}\\${element.NomeArquivo}`.toString()
          })
        }
      });
      console.log(attachments);
      const message = {
        from: _from,
        cc: cc,
        to: to,
        subject: subject,
        html: text,
        attachments: attachments
      };
  
      let send = await transport.sendMail(message);
      console.log(send);
      return true;
    } catch (error) {
      console.error('sendMail erro:', error);
      throw error;
    }
  }
}