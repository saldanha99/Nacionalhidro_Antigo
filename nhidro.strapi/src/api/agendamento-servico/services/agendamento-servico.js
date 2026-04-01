'use strict';
const { Enum_StatusAgendamentos, Enum_StatusEscalas, Enum_StatusOrdens } = require('../../../../utils/enums');

/**
 * agendamento-servico service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

const cadastrarEscala = async (equipamentoid, clienteid, agendamento, veiculo, proposta) => {
  let escalas = await strapi.entityService.findMany('api::escala.escala', {
    sort: { id: 'DESC' },
    populate: ['EscalaVeiculos.Veiculo', 'AgendamentoServicos'],
    filters: { 
      $and: [
        {
          Equipamento: {
            id: equipamentoid
          } 
        },
        {
          Cliente: {
            id: clienteid
          }
        },
        {
          Data: agendamento.Data
        },
        {
          Hora: agendamento.Hora
        }
      ]
    }
  });
  if (escalas.length > 0) {
    let escala = escalas[0];
    if (!escala.EscalaVeiculos) escala.EscalaVeiculos = [];
    escala.EscalaVeiculos.push({Veiculo: veiculo, Manutencao: veiculo.Manutencao});

    for (let ev of escala.EscalaVeiculos) {
      if (ev.id) await strapi.entityService.delete('api::escala-veiculo.escala-veiculo', ev.id)
      const veiculo = await strapi.entityService.create('api::escala-veiculo.escala-veiculo', {
        data: ev
      });
      ev.id = veiculo.id;
    };

    escala.AgendamentoServicos.push(agendamento);
    await strapi.entityService.update('api::escala.escala', escala.id, {
      data: escala
    });
  } else {
    const escala = {
        Equipamento: equipamentoid,
        Cliente: clienteid,
        EscalaVeiculos: [{Veiculo: veiculo, Manutencao: veiculo.Manutencao}],
        Data: agendamento.Data,
        Hora: agendamento.Hora,
        Status: Enum_StatusEscalas.Aberta,
        AgendamentoServicos: [agendamento.id],
        Observacoes: agendamento.Observacoes
    }

    for (let ev of escala.EscalaVeiculos) {
      const veiculo = await strapi.entityService.create('api::escala-veiculo.escala-veiculo', {
        data: ev
      });
      ev.id = veiculo.id;
    };

    const escalaEntry = await strapi.entityService.create('api::escala.escala', {
      data: escala
    });

    if (proposta?.id) {
      const ultimaOS = await strapi.db.query("api::ordem-servico.ordem-servico").findOne({
        select: 'Numero',
        where: {
          codigo: {
            $eq: proposta.Codigo,
          }
        },
        orderBy: {
          Numero: 'desc'
        }
      });
      const ordem = {
        Proposta: proposta.id,
        Codigo: proposta.Codigo,
        Numero: ultimaOS?.Numero ? ultimaOS.Numero + 1 : 1,
        Equipamento: equipamentoid,
        Cliente: clienteid,
        Escala: escalaEntry.id,
        DataInicial: agendamento.Data,
        HoraInicial: agendamento.Hora,
        DataCriacao: new Date(),
        Status: Enum_StatusOrdens.Aberta
      }
      await strapi.entityService.create('api::ordem-servico.ordem-servico', {
        data: ordem
      });
    }
  }
}

module.exports = createCoreService('api::agendamento-servico.agendamento-servico', ({ strapi }) => ({
    cadastrar: async (data) => {
      const veiculo = await strapi.db.query("api::veiculo.veiculo").findOne({
        where: {
          placa: {
            $eq: data.Veiculo,
          }
        }
      });
      const cliente = await strapi.db.query("api::cliente.cliente").findOne({
        where: {
          razao_social: {
            $eq: data.Cliente,
          }
        }
      });

      const agendamento = {
        Data: data.Data,
        Hora: data.Hora,
        Status: data.Status,
        Cliente: cliente,
        Veiculo: veiculo,
        Equipamento: data.Equipamento,
        Observacoes: data.Observacoes
      };
      const entry = await strapi.entityService.create('api::agendamento-servico.agendamento-servico', {
        data: agendamento
      });

      if (agendamento.Status === Enum_StatusAgendamentos.Confirmado && data.GerarEscala) {
        cadastrarEscala(data.Equipamento, cliente.id, entry, veiculo, data.Proposta);
      }

      return entry;
    },
    alterar: async (data) => {
      const agendamento = await strapi.entityService.findOne("api::agendamento-servico.agendamento-servico", data.Id, {
        populate: ['Veiculo', 'Cliente', 'Equipamento', 'Escala.EscalaVeiculos.Veiculo', 'Escala.AgendamentoServicos']
      });
      agendamento.Data = data.Data;
      agendamento.Hora = data.Hora;
      agendamento.Status = data.Status;
      agendamento.Observacoes = data.Observacoes;
      const entry = await strapi.entityService.update('api::agendamento-servico.agendamento-servico', agendamento.id, {
          data: agendamento
      });

      if (agendamento.Escala?.id && (agendamento.Status !== Enum_StatusAgendamentos.Confirmado || agendamento.Data != agendamento.Escala?.Data || agendamento.Hora != agendamento.Escala?.Hora)) {
        let escala = agendamento.Escala;
        escala.EscalaVeiculos = escala.EscalaVeiculos.filter(x => x.Veiculo?.id != agendamento.Veiculo.id);
        escala.AgendamentoServicos = escala.AgendamentoServicos.filter(x => x.id != agendamento.id);
        if (!escala.Veiculos || escala.Veiculos.length === 0) await strapi.entityService.delete('api::escala.escala', escala.id);
        else await strapi.entityService.update('api::escala.escala', escala.id, {
          data: escala
        });
      }

      if (agendamento.Status === Enum_StatusAgendamentos.Confirmado && data.GerarEscala) {
        cadastrarEscala(agendamento.Equipamento.id, agendamento.Cliente.id, agendamento, agendamento.Veiculo);
      }

      return entry;
    },
    deletar: async (id) => {
      const agendamento = await strapi.entityService.findOne("api::agendamento-servico.agendamento-servico", id, {
        populate: ['Veiculo', 'Escala.EscalaVeiculos.Veiculo', 'Escala.AgendamentoServicos', 'Escala.OrdemServico']
      });

      if (agendamento.Escala?.id) {
        let escala = agendamento.Escala;
        escala.EscalaVeiculos = escala.EscalaVeiculos.filter(x => x.Veiculo?.id != agendamento.Veiculo.id);
        escala.AgendamentoServicos = escala.AgendamentoServicos.filter(x => x.id != agendamento.id);
        if (!escala.EscalaVeiculos || escala.EscalaVeiculos.length === 0) await strapi.entityService.delete('api::escala.escala', escala.id);
        else await strapi.entityService.update('api::escala.escala', escala.id, {
          data: escala
        });
      }
      await strapi.entityService.delete('api::agendamento-servico.agendamento-servico', id);

      return true;
    }
}));
