"use strict";
const { BlobServiceClient } = require("@azure/storage-blob");
const email = require("../../../services/email/index");

/**
 * configuracao service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::configuracao.configuracao",
  ({ strapi }) => ({
    upload: async (file, name, type) => {
      let azureInfo = strapi.config.get("server.azure", {});
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        azureInfo.connectionSrtring
      );
      const containerClient = blobServiceClient.getContainerClient(
        azureInfo.containerName
      );
      const blockBlobClient = containerClient.getBlockBlobClient(name);
      const uploadBlobResponse = await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: {
          blobContentType: type,
        },
      });
      return uploadBlobResponse._response.request.url;
    },
    send: async (title, files, copy) => {
      try {
        let message = "Seguem os documentos solicitados!";
        const attachments = [];
        for (const file of files) {
          if (file.UrlArquivo) {
            attachments.push({
              NomeArquivo: `${file.Descricao}.${file.TipoArquivo}`,
              UrlArquivo: file.UrlArquivo,
              IsUrl: true,
            });
          }
        }

        const emails = copy ? copy.split(";") : [];
        email.sendMail(
          "doc@nacionalhidro.com.br",
          title,
          message,
          attachments,
          emails
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    getFile: async (fileName) => {
      let azureInfo = strapi.config.get("server.azure", {});
      let connStr = azureInfo.connectionSrtring;
      let defaultContainer = azureInfo.containerName;
      console.log(fileName);
      console.log(connStr);
      console.log(defaultContainer);
      const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
      const containerClient =
        blobServiceClient.getContainerClient(defaultContainer);
      console.log(containerClient);
      const blockBlobClient = containerClient.getBlockBlobClient(
        `${fileName}`
      );
      console.log(blockBlobClient);

      const downloadBlockBlobResponse = await blockBlobClient.download(0);
      return downloadBlockBlobResponse.readableStreamBody;
    },
  })
);
