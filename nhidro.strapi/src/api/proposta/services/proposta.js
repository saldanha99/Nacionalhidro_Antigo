'use strict';

/**
 * proposta service.
 */
const { Enum_StatusPropostas } = require("../../../../utils/enums");
const relatorio = require("../../../services/files/index");
const email = require("../../../services/email/index");
var moment = require("moment");
moment.locale('pt-br');

const { createCoreService } = require('@strapi/strapi').factories;

// Função genérica para salvar ou atualizar elementos relacionados
const salvarRelacionados = async (entity, itens, strapi) => {
  if (!Array.isArray(itens) || itens.length === 0) return;

  const tasks = itens.map(async (item) => {
    // Criar novo registro, se necessário
    if (item.id === 0) {
      const novoItem = await strapi.entityService.create(entity, { data: item });
      return { ...item, id: novoItem.id };
    }

    // Atualizar ou recriar itens existentes
    if (item.id > 0) {
      await strapi.entityService.delete(entity, item.id);
      delete item.id;
    }

    const novoItem = await strapi.entityService.create(entity, { data: item });
    return { ...item, id: novoItem.id };
  });

  return Promise.all(tasks);
};

// Serviço principal para salvar dados da proposta
const salvarDadosProposta = async (proposta, strapi) => {
  const { 
    Acessorios, 
    PropostaEquipes, 
    PropostaResponsabilidades, 
    PropostaEquipamentos 
  } = proposta;

  proposta.Acessorios = await salvarRelacionados("api::acessorio.acessorio", Acessorios, strapi);
  proposta.PropostaEquipes = await salvarRelacionados("api::proposta-equipe.proposta-equipe", PropostaEquipes, strapi);
  proposta.PropostaResponsabilidades = await salvarRelacionados(
    "api::proposta-responsabilidade.proposta-responsabilidade",
    PropostaResponsabilidades,
    strapi
  );
  proposta.PropostaEquipamentos = await salvarRelacionados(
    "api::proposta-equipamento.proposta-equipamento",
    PropostaEquipamentos,
    strapi
  );

  return proposta;
};

module.exports = createCoreService("api::proposta.proposta", ({ strapi }) => ({
  cadastrar: async (data, user) => {
    // Remover dados relacionados temporariamente
    const { 
      PropostaEquipes, 
      Acessorios, 
      PropostaResponsabilidades, 
      PropostaEquipamentos 
    } = data;
    delete data.PropostaEquipes;
    delete data.Acessorios;
    delete data.PropostaResponsabilidades;
    delete data.PropostaEquipamentos;

    if (data.ehRevisao) {
      const ultimaRevisao = await strapi.db.query("api::proposta.proposta").findOne({
        where: { codigo: data.Codigo },
        orderBy: { Revisao: "desc" },
      });
      ultimaRevisao.Status = Enum_StatusPropostas.Revisada;

      await strapi.entityService.update("api::proposta.proposta", ultimaRevisao.id, { data: ultimaRevisao });
      data.Revisao = ultimaRevisao.Revisao + 1;
    } else {
      const maxCode = await strapi.entityService.findMany("api::proposta.proposta", {
        sort: { Codigo: "desc" },
        limit: 1,
      });
      data.Codigo = (maxCode[0]?.Codigo || 0) + 1;
    }

    const entry = await strapi.entityService.create("api::proposta.proposta", { data });
    entry.PropostaEquipes = PropostaEquipes;
    entry.Acessorios = Acessorios;
    entry.PropostaResponsabilidades = PropostaResponsabilidades;
    entry.PropostaEquipamentos = PropostaEquipamentos;
    entry.Cliente = data.Cliente;
    entry.Contato = data.Contato;
    entry.Vendedor = data.Vendedor;
    entry.Usuario = data.Usuario;
    entry.Empresa = data.Empresa;

    try {
      // Salvar dados relacionados
      const propostaCompleta = await salvarDadosProposta(entry, strapi);

      // Atualizar a proposta com os dados relacionados
      await strapi.entityService.update("api::proposta.proposta", propostaCompleta.id, { data: propostaCompleta });

      // Gerar relatório
      await relatorio.gerarRelatorioProposta(propostaCompleta);

      return propostaCompleta;
    } catch (error) {
      // Registrar o erro, mas manter a proposta básica no banco
      console.error("Erro ao enriquecer dados ou gerar PDF da proposta:", error);
      throw error;
    }
  },
  alterar: async (data, user) => {
    if (!data.Codigo) {
      const maxCode = await strapi.entityService.findMany("api::proposta.proposta", {
        sort: { Codigo: "desc" },
        limit: 1,
      });
      data.Codigo = (maxCode[0]?.Codigo || 0) + 1;
    }

    try {
      const propostaCompleta = await salvarDadosProposta(data, strapi);
      await strapi.entityService.update("api::proposta.proposta", propostaCompleta.id, { data: propostaCompleta });
      await relatorio.gerarRelatorioProposta(propostaCompleta);

      return propostaCompleta;
    } catch (error) {
      throw error;
    }
  },
  enviar: async (data, user) => {
    const message = `
    <div
      class="container"
      style="max-width: 90%; margin: auto; padding-top: 20px"
    >
        <p style="font-size: 12.0pt;">Prezado,</p><br/><br/>
        <p style="font-size: 12.0pt;">Agradecemos a oportunidade de lhe apresentar essa proposta, visando efetivar essa negociação.</p>
        <p style="font-size: 12.0pt;">Desde já agradeço sua atenção e me coloco à disposição para qualquer esclarecimento que se fizer necessário.</p>
        <p style="font-size: 12.0pt;">Conte com meu total apoio.</p><br/>
        <p style="font-size: 12.0pt;"><i>Este é um e-mail automático de proposta.</i></p><br/>
        <p style="font-size: 12.0pt;">Atenciosamente,</p><br/>
        <img src="cid:logo" />
    </div>`;

    if (data.Contato && data.UrlArquivo) {
      const emails = data.EmailCopia ? data.EmailCopia.split(';') : [];
      emails.push('bruno@nacionalhidro.com.br');
      
      let emailTo = '';
      if (data.NaoEnviarEmail) {
        emailTo = user.email;
      } else if (data.Contato.Email) {
        emailTo = data.Contato.Email.toLowerCase();
        emails.push(user.email);
      } else {
        throw new Error('E-mail do contato não encontrado.');
      }

      const files = [
        {
          NomeArquivo: `${data.NomeArquivo || 'Proposta'}.pdf`,
          UrlArquivo: data.UrlArquivo,
          IsUrl: true
        }
      ];

      try {
        console.log(`[Proposta] Enviando e-mail para ${emailTo} (Código: ${data.Codigo})`);
        await email.sendMail(emailTo, 'Nacional Hidro - Proposta', message, files, emails);
        
        // Atualizar status apenas se o e-mail for enviado com sucesso
        await strapi.entityService.update('api::proposta.proposta', data.id, {
          data: { Enviada: true }
        });
        
        return { ...data, Enviada: true };
      } catch (err) {
        console.error(`[Proposta] Erro ao enviar e-mail da proposta ${data.Codigo}:`, err.message || err);
        throw new Error(`Falha no envio do e-mail: ${err.message || err}`);
      }
    } else {
      const missing = !data.Contato ? 'Contato' : 'Arquivo PDF (UrlArquivo)';
      throw new Error(`Dados insuficientes para envio: faltando ${missing}.`);
    }
  },
}));
