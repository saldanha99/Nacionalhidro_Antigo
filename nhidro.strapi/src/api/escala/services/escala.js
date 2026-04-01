'use strict';

const { Enum_StatusEscalas, Enum_StatusAgendamentos, Enum_StatusOperacional } = require('../../../../utils/enums');

/**
 * escala service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::escala.escala', ({ strapi }) => ({
  cadastrar: async (data) => {
    if (data.EscalaVeiculos) {
      for (let ev of data.EscalaVeiculos) {
        if (ev.id) await strapi.entityService.delete('api::escala-veiculo.escala-veiculo', ev.id)
        const veiculo = await strapi.entityService.create('api::escala-veiculo.escala-veiculo', {
          data: ev
        });
        ev.id = veiculo.id;
      };
    }
    
    for (let ef of data.EscalaFuncionarios) {
      if (ef.id) await strapi.entityService.delete('api::escala-funcionario.escala-funcionario', ef.id)
      const funcionario = await strapi.entityService.create('api::escala-funcionario.escala-funcionario', {
        data: ef
      });
      ef.id = funcionario.id;
    };

    const entryEscala = await strapi.entityService.create('api::escala.escala', {
      data: data
    });

    data.id = entryEscala.id;

    if (data.EscalaVeiculos) {
      for (const ev of data.EscalaVeiculos) {
        const agendamento = {
          Escala: data.id,
          Data: data.Data,
          Hora: data.Hora,
          Status: ev.Manutencao ? Enum_StatusAgendamentos.Manutencao : Enum_StatusAgendamentos.Confirmado,
          Cliente: data.Cliente,
          Veiculo: ev.Veiculo,
          Equipamento: data.Equipamento,
          Observacoes: data.Observacoes
        }
        await strapi.entityService.create('api::agendamento-servico.agendamento-servico', {
          data: agendamento
        });
      }
    }

    return entryEscala;
  },
  alterar: async (data) => {
    if (data.EscalaVeiculos) {
      for (let ev of data.EscalaVeiculos) {
        if (ev.id) await strapi.entityService.delete('api::escala-veiculo.escala-veiculo', ev.id)
        const veiculo = await strapi.entityService.create('api::escala-veiculo.escala-veiculo', {
          data: ev
        });
        ev.id = veiculo.id;
      };
    }
    for (let ef of data.EscalaFuncionarios) {
      if (ef.id) await strapi.entityService.delete('api::escala-funcionario.escala-funcionario', ef.id)
      const funcionario = await strapi.entityService.create('api::escala-funcionario.escala-funcionario', {
        data: ef
      });
      ef.id = funcionario.id;
    };
    const entry = await strapi.entityService.update('api::escala.escala', data.id, {
      populate: '*',
      data: data
    });

    if (!entry.AgendamentoServicos) entry.AgendamentoServicos = [];

    for (let agenda of entry.AgendamentoServicos) {
      await strapi.entityService.delete('api::agendamento-servico.agendamento-servico', agenda.id);
    };

    if (entry.Status !== Enum_StatusEscalas.Cancelado) {
      entry.AgendamentoServicos = []
      if (data.EscalaVeiculos) {
        for (let veiculo of entry.EscalaVeiculos) {
          const agendamento = {
            Escala: entry.id,
            Data: entry.Data,
            Hora: entry.Hora,
            Status: veiculo.Manutencao ? Enum_StatusAgendamentos.Manutencao : Enum_StatusAgendamentos.Confirmado,
            Cliente: entry.Cliente,
            Veiculo: veiculo.Veiculo,
            Equipamento: entry.Equipamento,
            Observacoes: entry.Observacoes
          }

          await strapi.entityService.create('api::agendamento-servico.agendamento-servico', {
            data: agendamento
          });
        }
      }
    }

    return entry;
  }
}));
