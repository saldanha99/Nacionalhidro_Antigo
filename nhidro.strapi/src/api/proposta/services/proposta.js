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
const salvarRelacionados = async (entity, itens, strapi, preservarOriginais = false) => {
  if (!Array.isArray(itens) || itens.length === 0) return;

  const tasks = itens.map(async (item) => {
    const itemParaSalvar = { ...item };

    // Criar novo registro, se necessário
    if (itemParaSalvar.id === 0) {
      delete itemParaSalvar.id;
      const novoItem = await strapi.entityService.create(entity, { data: itemParaSalvar });
      return { ...itemParaSalvar, id: novoItem.id };
    }

    // Em uma revisão, clonar o item sem apagar o vínculo da revisão anterior.
    // Em uma alteração normal, manter o comportamento de recriação existente.
    if (itemParaSalvar.id > 0) {
      if (!preservarOriginais) {
        await strapi.entityService.delete(entity, itemParaSalvar.id);
      }
      delete itemParaSalvar.id;
    }

    const novoItem = await strapi.entityService.create(entity, { data: itemParaSalvar });
    return { ...itemParaSalvar, id: novoItem.id };
  });

  return Promise.all(tasks);
};

// Acessórios com id são cadastros compartilhados e devem apenas ser vinculados.
// Somente acessórios novos, cadastrados dentro da proposta, precisam ser criados.
const salvarAcessorios = async (itens, strapi) => {
  if (!Array.isArray(itens) || itens.length === 0) return;

  return Promise.all(itens.map(async (item) => {
    if (item.id > 0) return item;

    const itemParaSalvar = { ...item };
    delete itemParaSalvar.id;
    const novoItem = await strapi.entityService.create("api::acessorio.acessorio", { data: itemParaSalvar });
    return { ...itemParaSalvar, id: novoItem.id };
  }));
};

// Serviço principal para salvar dados da proposta
const salvarDadosProposta = async (proposta, strapi, preservarRelacionados = false) => {
  const { 
    Acessorios, 
    PropostaEquipes, 
    PropostaResponsabilidades, 
    PropostaEquipamentos 
  } = proposta;

  proposta.Acessorios = await salvarAcessorios(Acessorios, strapi);
  proposta.PropostaEquipes = await salvarRelacionados("api::proposta-equipe.proposta-equipe", PropostaEquipes, strapi, preservarRelacionados);
  proposta.PropostaResponsabilidades = await salvarRelacionados(
    "api::proposta-responsabilidade.proposta-responsabilidade",
    PropostaResponsabilidades,
    strapi,
    preservarRelacionados
  );
  proposta.PropostaEquipamentos = await salvarRelacionados(
    "api::proposta-equipamento.proposta-equipamento",
    PropostaEquipamentos,
    strapi,
    preservarRelacionados
  );

  return proposta;
};

module.exports = createCoreService("api::proposta.proposta", ({ strapi }) => ({
  cadastrar: async (data, user) => {
    const ehRevisao = Boolean(data.ehRevisao);

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

    if (ehRevisao) {
      const ultimaRevisao = await strapi.db.query("api::proposta.proposta").findOne({
        where: { codigo: data.Codigo },
        orderBy: { Revisao: "desc" },
      });
      ultimaRevisao.Status = Enum_StatusPropostas.Revisada;

      await strapi.entityService.update("api::proposta.proposta", ultimaRevisao.id, { data: ultimaRevisao });
      data.Revisao = ultimaRevisao.Revisao + 1;
      data.Enviada = false;
      data.UrlArquivo = null;
      data.NomeArquivo = null;
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
      if (ehRevisao) {
        console.log(`[Proposta ${data.Codigo}] Clonando dados relacionados para a revisão ${data.Revisao} sem alterar a revisão anterior.`);
      }
      const propostaCompleta = await salvarDadosProposta(entry, strapi, ehRevisao);

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
    // Qualquer alteração invalida o PDF anterior. Se a nova geração falhar,
    // o envio tentará gerar novamente em vez de anexar um arquivo desatualizado.
    data.UrlArquivo = null;
    data.NomeArquivo = null;

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
    let propostaCompleta = { ...data };

    // Auto-heal: se data.id existir, buscar o registro completo do banco com todas as relações
    if (data?.id) {
      try {
        const dbProposta = await strapi.entityService.findOne("api::proposta.proposta", data.id, {
          populate: [
            "Acessorios",
            "Cliente.Contatos",
            "Contato",
            "Usuario",
            "PropostaEquipes.Cargo",
            "PropostaEquipes.Equipamento",
            "PropostaEquipamentos.Equipamento.Veiculos",
            "PropostaResponsabilidades.Responsabilidade",
            "Empresa",
            "Vendedor"
          ]
        });
        if (dbProposta) {
          propostaCompleta = {
            ...dbProposta,
            ...data,
            Contato: dbProposta.Contato || data.Contato,
            Cliente: dbProposta.Cliente || data.Cliente,
            PropostaEquipes: dbProposta.PropostaEquipes || data.PropostaEquipes,
            PropostaEquipamentos: dbProposta.PropostaEquipamentos || data.PropostaEquipamentos,
            PropostaResponsabilidades: dbProposta.PropostaResponsabilidades || data.PropostaResponsabilidades,
            Usuario: dbProposta.Usuario || data.Usuario,
            Empresa: dbProposta.Empresa || data.Empresa,
            Vendedor: dbProposta.Vendedor || data.Vendedor
          };
          if (!propostaCompleta.UrlArquivo && dbProposta.UrlArquivo) {
            propostaCompleta.UrlArquivo = dbProposta.UrlArquivo;
          }
          if (!propostaCompleta.NomeArquivo && dbProposta.NomeArquivo) {
            propostaCompleta.NomeArquivo = dbProposta.NomeArquivo;
          }
        }
      } catch (dbErr) {
        console.warn(`[Proposta] Aviso: Não foi possível buscar proposta ${data.id} completa no banco:`, dbErr?.message || dbErr);
      }
    }

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

    // Contato é obrigatório para qualquer envio
    if (!propostaCompleta.Contato) {
      throw new Error('Dados insuficientes para envio: faltando Contato.');
    }

    // Se o PDF não foi gerado no cadastro, regeneramos o PDF antes do envio
    if (!propostaCompleta.UrlArquivo) {
      console.warn(`[Proposta] UrlArquivo ausente na proposta ${propostaCompleta.Codigo} (id=${propostaCompleta.id}); regenerando PDF antes do envio.`);
      try {
        await relatorio._renderPropostaPdf(propostaCompleta);
      } catch (genErr) {
        console.error(`[Proposta] Falha ao regenerar PDF da proposta ${propostaCompleta.Codigo}:`, genErr?.message || genErr);
        throw new Error(`Não foi possível gerar o PDF da proposta: ${genErr?.message || genErr}`);
      }
    }

    if (!propostaCompleta.UrlArquivo) {
      throw new Error('Não foi possível gerar o PDF da proposta (URL vazia após geração).');
    }

    const emails = (propostaCompleta.EmailCopia ? propostaCompleta.EmailCopia.split(';') : [])
      .map(e => (typeof e === 'string' ? e.trim() : ''))
      .filter(Boolean);

    if (!emails.includes('bruno@nacionalhidro.com.br')) {
      emails.push('bruno@nacionalhidro.com.br');
    }

    let emailTo = '';
    if (propostaCompleta.NaoEnviarEmail) {
      emailTo = user?.email || propostaCompleta.Usuario?.email;
    } else if (propostaCompleta.Contato?.Email) {
      emailTo = propostaCompleta.Contato.Email.toLowerCase().trim();
      if (user?.email && !emails.includes(user.email.trim())) {
        emails.push(user.email.trim());
      }
    } else {
      throw new Error('E-mail do contato não encontrado. Verifique se o contato da proposta tem um e-mail cadastrado.');
    }

    if (!emailTo) {
      throw new Error('Endereço de e-mail de destino não foi definido.');
    }

    const files = [
      {
        NomeArquivo: `${propostaCompleta.NomeArquivo || 'Proposta'}.pdf`,
        UrlArquivo: propostaCompleta.UrlArquivo,
        IsUrl: true
      }
    ];

    try {
      console.log(`[Proposta] Enviando e-mail para ${emailTo} (Código: ${propostaCompleta.Codigo})`);
      await email.sendMail(emailTo, 'Nacional Hidro - Proposta', message, files, emails);

      // Atualizar status apenas se o e-mail for enviado com sucesso
      await strapi.entityService.update('api::proposta.proposta', propostaCompleta.id, {
        data: { Enviada: true }
      });

      return { ...propostaCompleta, Enviada: true };
    } catch (err) {
      console.error(`[Proposta] Erro ao enviar e-mail da proposta ${propostaCompleta.Codigo}:`, err.message || err);
      throw new Error(`Falha no envio do e-mail: ${err.message || err}`);
    }
  },
}));
