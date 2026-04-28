"use strict";
const { BlobServiceClient } = require("@azure/storage-blob");
const email = require("../../../services/email/index");
const fs = require("fs");
const path = require("path");

/**
 * configuracao service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::configuracao.configuracao",
  ({ strapi }) => ({
    upload: async (file, name, type) => {
      let azureInfo = strapi.config.get("server.azure", {});
      if (!azureInfo || !azureInfo.connectionSrtring) {
        console.warn("Azure Storage Connection String not found. Saving locally to public/uploads.");
        
        const uploadDir = path.resolve("public/uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, name);
        fs.writeFileSync(filePath, file);
        
        const baseUrl = process.env.URL || "https://apivps.nacionalhidro.com.br";
        return `${baseUrl}/uploads/${name}`;
      }
      
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
        await email.sendMail(
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
      let connStr = azureInfo ? azureInfo.connectionSrtring : null;
      if (!connStr) {
          console.error("Azure Storage Connection String not found. Cannot get file.");
          return null;
      }
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
