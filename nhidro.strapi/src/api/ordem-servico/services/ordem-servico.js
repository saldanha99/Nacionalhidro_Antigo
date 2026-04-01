"use strict";

/**
 * `ordem-servico` service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const relatorio = require("../../../services/files/index");
var moment = require("moment");
moment.locale('pt-br');
const {
  Enum_StatusAgendamentos,
  Enum_StatusOrdens,
  Enum_StatusEscalas, Enum_StatusPropostas,
  Enum_StatusPrecificacao,
  Enum_StatusMedicao,
} = require("../../../../utils/enums");

const salvarDados = async (ordem) => {
  let escala = ordem.Escala;

  if (ordem.Status === Enum_StatusOrdens.Cancelado && escala?.id) {
    await strapi.entityService.update('api::escala.escala', escala.id, {
      data: {Status: Enum_StatusEscalas.Cancelado}
    });
    delete ordem.Escala;
  } else if (escala?.id > 0 && ordem.Status != Enum_StatusOrdens.Cancelado) {
    let agendas = await strapi.entityService.findMany('api::agendamento-servico.agendamento-servico', {
      filters: {
        Escala: {
          id: escala.id
        }
      }
    });
    for (let agenda of agendas) {
      await strapi.entityService.delete('api::agendamento-servico.agendamento-servico', agenda.id);
    };

    if (escala?.EscalaVeiculos?.length) {
      for (let ev of escala?.EscalaVeiculos) {
        if (ev.id) await strapi.entityService.delete('api::escala-veiculo.escala-veiculo', ev.id);
        const veiculo = await strapi.entityService.create('api::escala-veiculo.escala-veiculo', {
          data: ev
        });
        ev.id = veiculo.id;
      };
    };

    if (escala?.EscalaFuncionarios?.length) {
      for (let ef of escala?.EscalaFuncionarios) {
        if (ef.id) await strapi.entityService.delete('api::escala-funcionario.escala-funcionario', ef.id);
        const funcionario = await strapi.entityService.create('api::escala-funcionario.escala-funcionario', {
          data: ef
        });
        ef.id = funcionario.id;
      };
    };

    if (escala?.EscalaVeiculos?.length) {
      for (let veiculo of escala?.EscalaVeiculos) {
        const agendamento = {
          Escala: escala.id,
          Data: escala.Data,
          Hora: escala.Hora,
          Status: veiculo.Manutencao ? Enum_StatusAgendamentos.Manutencao : Enum_StatusAgendamentos.Confirmado,
          Cliente: escala.Cliente,
          Veiculo: veiculo.Veiculo,
          Equipamento: escala.Equipamento
        }
        await strapi.entityService.create('api::agendamento-servico.agendamento-servico', {
          data: agendamento
        });
      };
    };

    await strapi.entityService.update('api::escala.escala', escala.id, {
      data: escala
    });

    ordem.Escala = escala;
  } else if (ordem.Status != Enum_StatusOrdens.Cancelado && escala && (escala.EscalaFuncionarios?.length || escala.EscalaVeiculos?.length)) {
    escala.Cliente = ordem.Cliente;
    escala.Empresa = ordem.Empresa;
    escala.Data = ordem.DataInicial;
    escala.Hora = ordem.HoraInicial;
    escala.DataCriacao = ordem.DataCriacao;
    escala.CriadoPor = ordem.CriadoPor;
    escala.Status = Enum_StatusEscalas.Aberta;

    if (escala?.EscalaVeiculos?.length) {
      for (let ev of escala?.EscalaVeiculos) {
        const veiculo = await strapi.entityService.create('api::escala-veiculo.escala-veiculo', {
          data: ev
        });
        ev.id = veiculo.id;
      };
    };

    if (escala?.EscalaFuncionarios?.length) {
      for (let ef of escala?.EscalaFuncionarios) {
        const funcionario = await strapi.entityService.create('api::escala-funcionario.escala-funcionario', {
          data: ef
        });
        ef.id = funcionario.id;
      };
    };

    const entryEscala = await strapi.entityService.create('api::escala.escala', {
      data: escala
    });

    escala.id = entryEscala.id;

    if (escala?.EscalaVeiculos?.length) {
      for (let veiculo of escala?.EscalaVeiculos) {
        const agendamento = {
          Escala: escala.id,
          Data: escala.Data,
          Hora: escala.Hora,
          Status: veiculo.Manutencao ? Enum_StatusAgendamentos.Manutencao : Enum_StatusAgendamentos.Confirmado,
          Cliente: escala.Cliente,
          Veiculo: veiculo.Veiculo,
          Equipamento: escala.Equipamento
        }
        await strapi.entityService.create('api::agendamento-servico.agendamento-servico', {
          data: agendamento
        });
      };
    };

    ordem.Escala = escala;
  } else {
    delete ordem.Escala;
  }

  if (ordem.Servicos?.length) {
    for (let servico of ordem.Servicos) {
      if (servico.id > 0) {
        await strapi.entityService.delete('api::servico.servico', servico.id);
        delete servico.id
      }
      const entryServico = await strapi.entityService.create('api::servico.servico', {
        data: servico
      });
      servico.id = entryServico.id;
    };
  } else delete ordem.Servicos;

  return ordem;
};

const precificar = async (ordem) => {
  for (let servico of ordem.Servicos) {
    if (servico.ServicosHorasAdicionais?.length) {
      const horas_adicionais = servico.ServicosHorasAdicionais;
      servico.ServicosHorasAdicionais = [];
      for (let horas of horas_adicionais) {
        if (horas.id) await strapi.entityService.delete("api::servico-hora-adicional.servico-hora-adicional", horas.id);
        servico.ServicosHorasAdicionais.push(await strapi.entityService.create("api::servico-hora-adicional.servico-hora-adicional", { data: horas }));
      }
    }
    await strapi.entityService.update("api::servico.servico", servico.id, { data: servico });
  }

  return ordem;
};

const possuiOrdensEmAtraso = async (ordem) => {
  const ordens = await strapi.entityService.findMany(
    "api::ordem-servico.ordem-servico",
    {
      filters: {
        $and: [
          {
            Proposta: {
              id: ordem.Proposta.id,
            },
          },
          {
            DataInicial: {
              $gte: moment(ordem.DataMin).format('YYYY-MM-DD')
            }
          },
          {
            DataInicial: {
              $lte: moment(ordem.DataMax).format('YYYY-MM-DD')
            }
          },
          {
            Status: Enum_StatusOrdens.Aberta
          }
        ]
      }
    }
  );

  let ordens_text = '';
  ordens.map(x => ordens_text = `${ordens_text}${x.Codigo}/${x.Numero}; `);

  console.log(ordens_text);

  return ordens_text;
};

module.exports = createCoreService(
  "api::ordem-servico.ordem-servico",
  ({ strapi }) => ({
    cadastrar: async (data) => {
      let escala = data.Escala;
      delete data.Escala;
      let servicos = data.Servicos;
      delete data.Servicos;

      const entry = await strapi.entityService.create(
        "api::ordem-servico.ordem-servico",
        {
          data: data,
        }
      );

      entry.Escala = escala;
      entry.Empresa = data.Empresa;
      entry.Cliente = data.Cliente;
      entry.Contato = data.Contato;
      entry.Equipamento = data.Equipamento;
      entry.Servicos = servicos;
      entry.CriadoPor = data.CriadoPor;

      const ordem = await salvarDados(entry);

      await strapi.entityService.update(
        "api::ordem-servico.ordem-servico",
        ordem.id,
        {
          data: ordem,
        }
      );

      // await relatorio.gerarRelatorioOrdemServico(entry);

      if (data.Status === Enum_StatusOrdens.Executada) return await possuiOrdensEmAtraso(data);

      return null;
    },
    alterar: async (data) => {
      const ordem = await salvarDados(data);

      await strapi.entityService.update(
        "api::ordem-servico.ordem-servico",
        ordem.id,
        {
          data: ordem,
        }
      );
      // if (data.Status === Enum_StatusOrdens.Aberta)
      //   await relatorio.gerarRelatorioOrdemServico(data);

      if (data.Status === Enum_StatusOrdens.Executada) return await possuiOrdensEmAtraso(data);

      return null;
    },
    visualizar: async (data) => {
        const item = await strapi.entityService.findOne("api::ordem-servico.ordem-servico", data.id, {populate: ["Equipamento", "Cliente", "Contato", "Servicos"]})
        let buffer = await relatorio.gerarRelatorioOrdemServico(item);
        if (!buffer?.pdf) buffer = await relatorio.gerarRelatorioOrdemServico(item)
        return buffer.pdf;
    },
    imprimir: async (data) => {
      console.log(data);
      let ordens = await strapi.entityService.findMany(
        "api::ordem-servico.ordem-servico",
        {
          filters: {
            id: {
              $in: data,
            },
          },
          populate: ["Equipamento", "Cliente", "Contato", "Servicos"],
        }
      );

      const buffer = await relatorio.gerarRelatorioOrdemServicoLote(ordens);
      console.log(buffer);
      return buffer.pdf;
    },
    precificar: async (data) => {
      const ordem = await precificar(data);

      await strapi.entityService.update(
        "api::ordem-servico.ordem-servico",
        ordem.id,
        {
          data: ordem,
        }
      );

      if (ordem.StatusPrecificacao === Enum_StatusPrecificacao.EmMedicao) {
        const medicao = await strapi.db.query("api::medicao.medicao").findOne({
          where: {
            Ordens: {
              id: ordem.id
            },
            Status: {
              $ne: Enum_StatusMedicao.Cancelado
            }
          },
          populate: ['Ordens']
        });

        let totalServico = 0;
        let totalHora = 0;
        let adicional = 0;
        let desconto = 0;
        let totalCobranca = 0;
        medicao.Ordens.forEach(os => {
          totalServico += os.PrecificacaoTotalServico || 0;
          totalHora += os.PrecificacaoTotalHora || 0;
          adicional += os.PrecificacaoValorExtra || 0;
          desconto += os.PrecificacaoDesconto || 0;
          totalCobranca += os.PrecificacaoValorTotal || 0;
        });

        medicao.TotalServico = totalServico;
        medicao.TotalHora = totalHora;
        medicao.Adicional = adicional;
        medicao.Desconto = desconto;
        medicao.ValorRL = totalCobranca * (medicao.PorcentagemRL / 100 || 0);
        medicao.ValorServico = totalCobranca - medicao.ValorRL;
        medicao.ValorCte = totalCobranca;
        medicao.ValorTotal = totalCobranca;

        console.log(medicao);

        await strapi.entityService.update(
          "api::medicao.medicao",
          medicao.id,
          {
            data: medicao,
          }
        );
      }

      return ordem;
    },
    verificarPendencias: async (data) => {
      return await possuiOrdensEmAtraso(data);
    },
    buscar: async (params) => {
      const query = `SELECT 
    t0.id, 
    t0.status,
    p0.codigo proposta,
    t0.codigo,
    t0.numero,
    e0.descricao AS empresa, 
    c0.razao_social AS cliente, 
    c1.nome AS contato, 
    e1.equipamento, 
    t0.data_inicial, 
    t0.hora_inicial, 
    cp0.email usuario,
    t0.data_criacao,
    t0.data_baixa,
    t0.data_cancelamento,
    t0.motivo_cancelamento,
    t0.url_arquivo
    FROM ordem_servicos AS t0
    LEFT JOIN ordem_servicos_proposta_links AS t1 ON t0.id = t1.ordem_servico_id
    LEFT JOIN ordem_servicos_empresa_links AS t2 ON t0.id = t2.ordem_servico_id
    LEFT JOIN ordem_servicos_cliente_links AS t3 ON t0.id = t3.ordem_servico_id
    LEFT JOIN ordem_servicos_criado_por_links AS t4 ON t0.id = t4.ordem_servico_id
    LEFT JOIN ordem_servicos_equipamento_links AS t5 ON t0.id = t5.ordem_servico_id
    LEFT JOIN ordem_servicos_contato_links AS t6 ON t0.id = t6.ordem_servico_id
    LEFT JOIN propostas AS p0 ON t1.proposta_id = p0.id
    LEFT JOIN clientes AS c0 ON t3.cliente_id = c0.id
    LEFT JOIN contatos AS c1 ON t6.contato_id = c1.id
    LEFT JOIN empresas AS e0 ON t2.empresa_id = e0.id
    LEFT JOIN up_users AS cp0 ON t4.user_id = cp0.id
    LEFT JOIN equipamentos AS e1 ON t5.equipamento_id = e1.id
    WHERE t0.data_inicial BETWEEN '${params.Data1}' AND '${params.Data2}' AND t0.status = ${params.Status}`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    },
    buscar_propostas: async (params) => {
      const query = `SELECT 
    t0.id,
    t0.status,
    t0.codigo,
    t0.revisao,
    e0.descricao AS empresa,
    c0.razao_social AS cliente,
    c0.cnpj AS cliente_cnpj,
    v0.username, 
    t0.data_proposta, 
    t0.data_validade, 
    t0.data_status
    FROM propostas AS t0
    LEFT JOIN propostas_empresa_links AS t1 ON t0.id = t1.proposta_id
    LEFT JOIN propostas_cliente_links AS t2 ON t0.id = t2.proposta_id
    LEFT JOIN propostas_usuario_links AS t3 ON t0.id = t3.proposta_id
    LEFT JOIN propostas_contato_links AS t4 ON t0.id = t4.proposta_id
    LEFT JOIN empresas AS e0 ON t1.empresa_id = e0.id
    LEFT JOIN clientes AS c0 ON t2.cliente_id = c0.id
    LEFT JOIN up_users AS v0 ON t3.user_id = v0.id
    WHERE t0.data_proposta BETWEEN '${params.Data1}' AND '${params.Data2}' AND t0.status = ${Enum_StatusPropostas.Aprovada} AND (t0.inativa IS NULL OR t0.inativa = 0)`;
      const resp = await strapi.db.connection.raw(query);

      return resp[0];
    }
  })
);
