'use strict';

const { Enum_StatusPrecificacao, Enum_StatusMedicao, Enum_StatusFaturamento, Enum_StatusOrdens } = require('../../../../utils/enums');
const relatorio = require("../../../services/files/index");
const email = require("../../../services/email/index");
const moment = require("moment");
moment.locale("pt-br");

/**
 * medicao service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::medicao.medicao', ({ strapi }) => ({
    cadastrar: async (data) => {
        let maxCode = await strapi.entityService.findMany('api::medicao.medicao', {
          sort: { Codigo: 'desc' },
          limit: 1
        });
        data.Codigo = maxCode[0]?.Codigo ? maxCode[0]?.Codigo + 1 : 1000;

        const entry = await strapi.entityService.create("api::medicao.medicao", {data: data});
        
        for(let ordem of data.Ordens) {
            ordem.StatusPrecificacao = Enum_StatusPrecificacao.EmMedicao

            await strapi.entityService.update("api::ordem-servico.ordem-servico", ordem.id,
            {
                data: ordem
            });
        };

        return entry;
    },
    alterar: async (data) => {
        const entry = await strapi.entityService.update("api::medicao.medicao", data.id, {data: data});
        
        if (data.OrdensRemovidas) {
            for(let ordem of data.OrdensRemovidas) {
                await strapi.entityService.update("api::ordem-servico.ordem-servico", ordem,
                {
                    data: {
                        StatusPrecificacao: Enum_StatusPrecificacao.Precificada
                    }
                });
            };
        }
        
        for(let ordem of data.Ordens) {
            ordem.StatusPrecificacao = Enum_StatusPrecificacao.EmMedicao

            await strapi.entityService.update("api::ordem-servico.ordem-servico", ordem.id,
            {
                data: ordem
            });
        };

        if (data.Status === Enum_StatusMedicao.Conferencia && data.Vendedor) {
            const item = await strapi.entityService.findOne("api::medicao.medicao", data.id, {populate: ['Ordens.Servicos, Ordens.Escala.EscalaVeiculos.Veiculo, Ordens.Proposta, Empresa, Cliente, Contato, Ordens.Equipamento']});
            
            let content = await relatorio.gerarRelatorioMedicao(item);
            if (!content?.pdf) content = await relatorio.gerarRelatorioMedicao(item);
            if (!content.pdf) return false;

            const arrayBuffer = new ArrayBuffer(content.pdf.data.length);
            const view = new Uint8Array(arrayBuffer);
            for (let i = 0; i < content.pdf.data.length; ++i) {
                view[i] = content.pdf.data[i];
            };

            const files = [
                {
                    IsBuffer: true,
                    NomeArquivo: `medicao_${item.Cliente.RazaoSocial}.pdf`.toLocaleLowerCase(),
                    Content: view
                }
            ];

            const message =`
            <div
              class="container"
              style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <p style="font-size: 12.0pt;">Prezado Vendedor,</p><br/><br/>
                <p style="font-size: 12.0pt;">Anexamos medição para sua conferência, gentileza retornar se precisa de ajuste ou se está validada para que possamos sequenciar o envio ao cliente.</p><br/>
                <p style="font-size: 12.0pt;"><i>Este é um e-mail automático, em caso de dúvidas permanecemos a disposição no e-mail financeiro@nacionalhidro.com.br</i></p><br/>
                <p style="font-size: 12.0pt;">Atenciosamente,</p><br/>
                <img src="cid:logo" />
            </div>`;
            const emails = ['financeiro@nacionalhidro.com.br', 'bruno@nacionalhidro.com.br'];
            const emailTo = data.Vendedor.email;

            try {
                await email.sendMail(emailTo, 'Nacional Hidro - Conferência da Medição', message, files, emails);
            } catch (err) {
                throw new Error(`Falha ao enviar e-mail de conferência: ${err.message || err}`);
            }
        }

        return entry;
    },
    cancelar: async (data) => {
        const entry = await strapi.entityService.update("api::medicao.medicao", data.id, {data: data, populate: 'Ordens'});
        
        for(let ordem of entry.Ordens) {
            ordem.StatusPrecificacao = Enum_StatusPrecificacao.Precificada

            await strapi.entityService.update("api::ordem-servico.ordem-servico", ordem.id,
            {
                data: ordem
            });
        };

        return entry;
    },
    imprimir: async (data) => {
        const item = await strapi.entityService.findOne("api::medicao.medicao", data.id, {populate: ['Ordens.Servicos, Ordens.Escala.EscalaVeiculos.Veiculo, Ordens.Proposta, Empresa, Cliente, Contato, Ordens.Equipamento']})
        let buffer = await relatorio.gerarRelatorioMedicao(item);
        if (!buffer?.pdf) buffer = await relatorio.gerarRelatorioMedicao(item)
        return buffer.pdf;
    },
    enviar: async (data) => {
        const item = await strapi.entityService.findOne("api::medicao.medicao", data.id, {populate: ['Ordens.Servicos, Ordens.Escala.EscalaVeiculos.Veiculo, Ordens.Proposta, Empresa, Cliente, Contato, Ordens.Equipamento']})

        const message =`
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
            <p style="font-size: 12.0pt;">Prezado Cliente,</p><br/><br/>
            <p style="font-size: 12.0pt;">Anexamos sua medição para conferência e aprovação de faturamento. Lembrando que este boletim foi gerado conforme proposta comercial e seu prazo para aprovação é de até 2 dias corridos a contar da data de recebimento deste e-mail.</p><br/>
            <p style="font-size: 12.0pt;"><i>Este é um e-mail automático, em caso de dúvidas permanecemos a disposição no e-mail financeiro@nacionalhidro.com.br</i></p><br/>
            <p style="font-size: 12.0pt;">Atenciosamente,</p><br/>
            <img src="cid:logo" />
        </div>`;
        const emails = item.EmailCopia ? item.EmailCopia.split(';') : [];
        emails.push('financeiro@nacionalhidro.com.br');
        let emailTo = '';
        emailTo = item.Contato.Email.toLowerCase();

        let content = await relatorio.gerarRelatorioMedicao(item)
        if (!content?.pdf) content = await relatorio.gerarRelatorioMedicao(item)

        if (!content.pdf) return false


        const arrayBuffer = new ArrayBuffer(content.pdf.data.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < content.pdf.data.length; ++i) {
            view[i] = content.pdf.data[i];
        }

        const files = [
            {
                IsBuffer: true,
                NomeArquivo: `medicao_${item.Cliente.RazaoSocial}.pdf`.toLocaleLowerCase(),
                Content: view
            }
        ]
        try {
            await email.sendMail(emailTo, 'Nacional Hidro - Aprovação de Medição', message, files, emails);
        } catch (err) {
            throw new Error(`Falha ao enviar e-mail de aprovação: ${err.message || err}`);
        }

        await strapi.entityService.update('api::medicao.medicao', data.id, {
          data: {
            Status: Enum_StatusMedicao.EmAprovacao,
            DataCobranca: new Date()
          }
        });

        return true;
    },
    reprovar: async (data) => {
        let entry = await strapi.entityService.update("api::medicao.medicao", data.id, {data: data, populate: '*'});
        
        const newData = {
            "Ordens": entry.Ordens,
            "Cliente": entry.Cliente,
            "Contato": entry.Contato,
            "EmailCopia": entry.EmailCopia,
            "Cte": entry.Cte,
            "ValorRL": entry.ValorRL,
            "ValorServico": entry.ValorServico,
            "ValorCte": entry.ValorCte,
            "PorcentagemRL": entry.PorcentagemRL,
            "TotalServico": entry.TotalServico,
            "TotalHora": entry.TotalHora,
            "Adicional": entry.Adicional,
            "Desconto": entry.Desconto,
            "ValorTotal": entry.ValorTotal,
            "Status": Enum_StatusMedicao.EmAberto,
            "DataCriacao": new Date(),
            "CriadoPor": entry.CriadoPor,
            "Codigo": entry.Codigo,
            "Revisao": entry.Revisao + 1,
            "Empresa": entry.Empresa,
            "DataAprovacaoInterna": null,
            "DataCobranca": null,
            "MotivoCancelamento": null,
            "DataCancelamento": null,
            "Observacoes": entry.Observacoes,
            "ValorAprovado": null,
            "DataConferencia": null,
            "DataAprovacao": null,
            "Vendedor": entry.Vendedor,
            "Solicitante": entry.Solicitante
        }
        entry = await strapi.entityService.create("api::medicao.medicao", {data: newData});

        return entry;
    },
    aprovar: async (data) => {
        let entry = await strapi.entityService.update("api::medicao.medicao", data.Medicao.id, {data: data.Medicao});

        let file = await strapi.services["api::configuracao.configuracao"].upload(Buffer.from(data.Imagem.Buffer.data), data.Imagem.FileName, data.Imagem.Type);  

        if(data.Medicao.Cte) {
            const faturamento = {
                Medicao: data.Medicao.id,
                UrlImagemAprovacao: file,
                TipoFatura: 'CTE',
                DataCriacao: new Date(),
                ValorTotal: data.Medicao.SaldoDevedor,
                ValorRateado: data.Medicao.SaldoDevedor,
                ValorLiquido: data.Medicao.SaldoDevedor,
                Status: Enum_StatusFaturamento.EmAberto,
                Empresa: data.Empresa,
                Cliente: data.Cliente
            }
            await strapi.entityService.create("api::faturamento.faturamento", {data: faturamento});
        } else {
            const faturamentos = []
            if (data.Medicao.ValorServicoFatura) {
                const faturamento = {
                    Medicao: data.Medicao.id,
                    UrlImagemAprovacao: file,
                    TipoFatura: 'NF',
                    DataCriacao: new Date(),
                    ValorTotal: data.Medicao.SaldoDevedor,
                    ValorRateado: data.Medicao.ValorServicoFatura,
                    ValorLiquido: data.Medicao.ValorServicoFatura,
                    Status: Enum_StatusFaturamento.EmAberto,
                    Empresa: data.Empresa,
                    Cliente: data.Cliente
                }
                faturamentos.push(faturamento)
            }
            if (data.Medicao.ValorRLFatura) {
                const faturamento = {
                    Medicao: data.Medicao.id,
                    UrlImagemAprovacao: file,
                    TipoFatura: 'RL',
                    DataCriacao: new Date(),
                    ValorTotal: data.Medicao.SaldoDevedor,
                    ValorRateado: data.Medicao.ValorRLFatura,
                    ValorLiquido: data.Medicao.ValorRLFatura,
                    Status: Enum_StatusFaturamento.EmAberto,
                    Empresa: data.Empresa,
                    Cliente: data.Cliente
                }
                faturamentos.push(faturamento)
            }
            for (const faturamento of faturamentos) {
                await strapi.entityService.create("api::faturamento.faturamento", {data: faturamento});
            }

        }

        return entry;
    },
    buscar: async (params) => {
        const query = `SELECT t0.id, t0.status, t0.codigo, t0.revisao, e0.descricao empresa, e0.id empresa_id, c0.razao_social cliente, c0.id cliente_id,
        c1.nome contato, t0.valor_total, t0.data_aprovacao_interna, t0.data_cobranca, t0.data_cancelamento, t0.motivo_cancelamento, t0.valor_aprovado, v0.username vendedor,
        t0.porcentagem_rl, t0.total_servico, t0.total_hora, t0.adicional, t0.desconto, t0.data_criacao, t0.created_at, t0.data_conferencia, t0.data_aprovacao, t0.cte
        FROM medicoes AS t0
        LEFT JOIN medicoes_cliente_links AS t1 ON t0.id = t1.medicao_id
        LEFT JOIN medicoes_contato_links AS t2 ON t0.id = t2.medicao_id
        LEFT JOIN medicoes_empresa_links AS t3 ON t0.id = t3.medicao_id
        LEFT JOIN medicoes_vendedor_links AS t4 ON t0.id = t4.medicao_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN contatos AS c1 ON t2.contato_id = c1.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN up_users AS v0 ON t4.user_id = v0.id
        WHERE DATE_FORMAT(t0.data_criacao, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')
        AND t0.status ${params.Executada ? `= ${Enum_StatusMedicao.Aprovada}` : params.Cancelada ? `= ${Enum_StatusMedicao.Cancelado}` : `NOT IN (${Enum_StatusMedicao.Cancelado}, ${Enum_StatusMedicao.Aprovada}, ${Enum_StatusMedicao.Reprovada})`}`
        const resp = await strapi.db.connection.raw(query);

        return resp[0]
    },
    buscar_precificacao: async (params) => {
        const query = `SELECT t0.id, t0.codigo, t0.numero, t0.status, t0.data_inicial, t0.data_baixa, e0.descricao empresa, c0.razao_social cliente, 
        c1.nome contato, t0.data_cancelamento, t0.motivo_cancelamento, t0.created_at, t0.status_precificacao, c0.id cliente_id, c0.tipo_faturamento, 
        c0.dia_base_quinzenal_inicio, c0.dia_base_quinzenal_final, c0.dia_base_mensal, c0.dia_base_semanal,
        CASE
            WHEN c0.tipo_faturamento = 2 THEN CONCAT('Semanal: ', 
                CASE c0.dia_base_semanal
                    WHEN 0 THEN 'Domingo'
                    WHEN 1 THEN 'Segunda-feira'
                    WHEN 2 THEN 'Terça-feira'
                    WHEN 3 THEN 'Quarta-feira'
                    WHEN 4 THEN 'Quinta-feira'
                    WHEN 5 THEN 'Sexta-feira'
                    WHEN 6 THEN 'Sábado'
                    ELSE 'Dia da semana inválido'
                END
            )
            WHEN c0.tipo_faturamento = 3 THEN CONCAT('Quinzenal: do dia ', c0.dia_base_quinzenal_inicio, ' ao dia ', c0.dia_base_quinzenal_final)
            WHEN c0.tipo_faturamento = 4 THEN CONCAT('Mensal: dia ', c0.dia_base_mensal)
            WHEN c0.tipo_faturamento = 5 THEN 'Cada Execução'
            ELSE 'Tipo de faturamento inválido'
        END AS periodo_medicao
        FROM ordem_servicos AS t0
        LEFT JOIN ordem_servicos_cliente_links AS t1 ON t0.id = t1.ordem_servico_id
        LEFT JOIN ordem_servicos_contato_links AS t2 ON t0.id = t2.ordem_servico_id
        LEFT JOIN ordem_servicos_empresa_links AS t3 ON t0.id = t3.ordem_servico_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN contatos AS c1 ON t2.contato_id = c1.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        WHERE DATE_FORMAT(t0.data_inicial, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d') AND t0.data_inicial >= '2023-07-10'
        AND t0.status = ${Enum_StatusOrdens.Executada}`
        const resp = await strapi.db.connection.raw(query);

        return resp[0]
    },
    buscar_por_cliente: async (params) => {
        const query = `SELECT t0.id, t0.status, t0.codigo, t0.revisao, e0.descricao empresa, e0.id empresa_id, c0.razao_social cliente, c0.id cliente_id,
        c1.nome contato, t0.valor_total, t0.data_aprovacao_interna, t0.data_cobranca, t0.data_cancelamento, t0.motivo_cancelamento, t0.valor_aprovado,
        t0.porcentagem_rl, t0.total_servico, t0.total_hora, t0.adicional, t0.desconto, t0.data_criacao, t0.data_conferencia, t0.data_aprovacao
        FROM medicoes AS t0
        LEFT JOIN medicoes_cliente_links AS t1 ON t0.id = t1.medicao_id
        LEFT JOIN medicoes_contato_links AS t2 ON t0.id = t2.medicao_id
        LEFT JOIN medicoes_empresa_links AS t3 ON t0.id = t3.medicao_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN contatos AS c1 ON t2.contato_id = c1.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        WHERE c0.id = ${params.cliente_id}`
        const resp = await strapi.db.connection.raw(query);

        return resp[0]
    },
    buscar_relatorio: async (params) => {
        const query = `SELECT CASE                                      
        WHEN t0.status = 0 THEN 'Cancelada'              
        WHEN t0.status = 1 THEN 'Em aberto'              
        WHEN t0.status = 2 THEN 'Em conferência'         
        WHEN t0.status = 3 THEN 'Validada Int.'          
        WHEN t0.status = 4 THEN 'Em Aprovação'           
        WHEN t0.status = 5 THEN 'Aprovada'               
        WHEN t0.status = 6 THEN 'Aprov. Parcialmente'    
        WHEN t0.status = 7 THEN 'Reprovada'              
        END AS status,
        CASE WHEN t0.cte = 1 THEN 'CTE 100%'
        WHEN t0.porcentagem_rl = 100 THEN 'RL 100%'
        WHEN t0.porcentagem_rl = 0 THEN 'NF 100%'
        ELSE CONCAT('RL ', t0.porcentagem_rl, '% / NF ', 100 - t0.porcentagem_rl, '%')
        END AS rateio,                                  
        t0.codigo, t0.revisao, e0.descricao empresa, e0.id empresa_id, c0.razao_social cliente, c0.id cliente_id, t0.solicitante, c1.nome contato,
        t0.valor_total, 
        DATE_FORMAT(t0.data_aprovacao_interna, '%d/%m/%Y') AS data_aprovacao_interna, 
        t0.adicional, 
        t0.total_servico + t0.total_hora AS total_servicos,
        DATE_FORMAT(t0.data_cobranca, '%d/%m/%Y') AS data_cobranca, v0.username vendedor,
        DATE_FORMAT(t0.data_cancelamento, '%d/%m/%Y') AS data_cancelamento, t0.motivo_cancelamento, 
        DATE_FORMAT(t0.data_criacao, '%d/%m/%Y') AS data_criacao, 
        DATE_FORMAT(t0.data_aprovacao, '%d/%m/%Y') AS data_aprovacao,
        t0.data_criacao data_criacao_aux, t0.data_cancelamento data_cancelamento_aux, t0.data_aprovacao data_aprovacao_aux, 
        t0.desconto
        FROM medicoes AS t0                              
        LEFT JOIN medicoes_cliente_links AS t1 ON t0.id = t1.medicao_id
        LEFT JOIN medicoes_contato_links AS t2 ON t0.id = t2.medicao_id
        LEFT JOIN medicoes_empresa_links AS t3 ON t0.id = t3.medicao_id
        LEFT JOIN medicoes_vendedor_links AS t4 ON t0.id = t4.medicao_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN contatos AS c1 ON t2.contato_id = c1.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN up_users AS v0 ON t4.user_id = v0.id
        WHERE ((t0.status IN (4, 5, 6) AND DATE_FORMAT(t0.data_cobranca, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')) 
        OR (t0.status NOT IN (4, 5, 6) AND DATE_FORMAT(t0.data_criacao, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d'))) 
        ORDER BY t0.codigo`
        const resp = await strapi.db.connection.raw(query);

        return resp[0]
    },
    cobranca_automatica: async () => {
        const today = moment();
        today.set({hour: 0, minute: 0, second: 0, millisecond: 0});
        
        const two_days_before = today.subtract(3, "days").format("YYYY-MM-DD");
        console.log(two_days_before);
        const medicoes = await strapi.entityService.findMany("api::medicao.medicao", {
            filters: {
                $and: [
                    {
                        Status: {
                            $in: [Enum_StatusMedicao.EmAprovacao, Enum_StatusMedicao.AprovadaParcialmente]
                        }
                    },
                    {
                        DataCobranca: {
                            $lt: two_days_before
                        }
                    }
                ]
            },
            limit: 50,
            populate: ['Ordens.Servicos, Ordens.Escala.EscalaVeiculos.Veiculo, Ordens.Proposta, Empresa, Cliente, Contato, Ordens.Equipamento']
        });
        const message =`
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
            <p style="font-size: 12.0pt;">Prezado Cliente,</p><br/><br/>
            <p style="font-size: 12.0pt;">Até o presente momento não recebemos a aprovação da medição para faturamento. Evite bloqueio de serviços e cobranças adicionais de multa e juros.</p><br/>
            <p style="font-size: 12.0pt;">Contamos com seu retorno  nesse mesmo instante.</p><br/>
            <p style="font-size: 12.0pt;"><i>Este é um e-mail automático, em caso de dúvidas permanecemos a disposição no e-mail financeiro@nacionalhidro.com.br</i></p><br/>
            <p style="font-size: 12.0pt;">Atenciosamente,</p><br/>
            <img src="cid:logo" />
        </div>`;
        console.log(medicoes);
        for (const medicao of medicoes) {
            let content = await relatorio.gerarRelatorioMedicao(medicao);
            if (!content?.pdf) content = await relatorio.gerarRelatorioMedicao(medicao);
    
            if (!content.pdf) return false;

            const arrayBuffer = new ArrayBuffer(content.pdf.data.length);
            const view = new Uint8Array(arrayBuffer);
            for (let i = 0; i < content.pdf.data.length; ++i) {
                view[i] = content.pdf.data[i];
            }

            const files = [
                {
                    IsBuffer: true,
                    NomeArquivo: `medicao_${medicao.Cliente.RazaoSocial}.pdf`.toLocaleLowerCase(),
                    Content: view
                }
            ]
            await email.sendMail(medicao.Contato?.Email?.toLowerCase(), 'Nacional Hidro - Medição em Aberto', message, files);

            // Atualiza a DataCobranca para hoje, evitando o re-envio diário em loop e destravando a fila de e-mails
            await strapi.entityService.update("api::medicao.medicao", medicao.id, {
                data: { DataCobranca: new Date() }
            });
        }
    }
}));
