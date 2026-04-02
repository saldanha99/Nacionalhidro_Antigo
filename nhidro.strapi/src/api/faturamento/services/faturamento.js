'use strict';

const { Enum_StatusFaturamento } = require('../../../../utils/enums');
const relatorio = require("../../../services/files/index");
const email = require("../../../services/email/index");
const moment = require("moment");
const request = require('request');

/**
 * faturamento service.
 */

const nfse = async (faturamento, cliente) => {
    const api = await strapi.db.query("api::configuracao.configuracao").findOne({
        where: {
            descricao: {
                $eq: 'Focus_Api',
            }
        }
    });

    let body = JSON.parse(JSON.stringify(faturamento.DadosFaturamento));

    delete body.servico.discriminacao_aux;
    delete body.EmpresaBanco;
    delete body.data_vencimento;
    delete body.data_emissao_aux;
    body.natureza_operacao = body.tomador.endereco.codigo_municipio === body.prestador.codigo_municipio ? '1' : '2';
    body.servico.valor_servicos = body.itens.reduce((total, item) => total + item.valor_total, 0);
    body.servico.iss_retido = 1;
    body.iss_retido = body.tomador.endereco.codigo_municipio === body.prestador.codigo_municipio ? 1 : 2;

    console.log(body);
    faturamento.FocusReferencia = 'fat_' + faturamento.id + '_' + moment(new Date).utc().format("YYYYMMDDhhmmss");
    var options = {
        'method': 'POST',
        'url': api.Valor + '/v2/nfse?ref=' + faturamento.FocusReferencia,
        'headers': {
            'Content-Type': 'application/json'
        },
        'auth': {
            'user': faturamento.Empresa.FocusToken,
            'password': ''
        },
        body: JSON.stringify(body)

    };

    const req = await new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
            }
            resolve(JSON.parse(response.body));
        });
    });

    console.log(req)
    const retorno = {}
    retorno.msg = req;
    retorno.success = req.status === 'processando_autorizacao';
    return { faturamento, retorno }
}

const rl = async (faturamento, cliente) => {
    try {
        const query = `SELECT MAX(nota) AS max_nota 
        FROM faturamentos f0
        INNER JOIN faturamentos_empresa_links e0 ON f0.id = e0.faturamento_id
        WHERE f0.tipo_fatura = 'RL' AND e0.empresa_id = ${faturamento.Empresa.id};`
        const resp = await strapi.db.connection.raw(query);
        console.log(resp);
        const max_nota = resp[0][0]?.max_nota || 0;
        faturamento.Nota = String(Number(max_nota) + 1).padStart(4,'0')
        console.log('[RL] Gerando recibo locacao, Nota:', faturamento.Nota);
        console.log('[RL] Medicao.Ordens count:', faturamento.Medicao?.Ordens?.length);
        const reciboLoc = await relatorio.gerarRelatorioLocacao(faturamento, cliente);

        if (reciboLoc.success) {
            faturamento.UrlArquivoNota = reciboLoc.path;
        }

        return { faturamento, retorno: reciboLoc }
    } catch (err) {
        console.error('[RL] Erro ao gerar recibo de locacao:', err?.message || err);
        return { faturamento, retorno: { success: false, error: err?.message || String(err) } }
    }
}

const cte = async (faturamento, cliente) => {
    const api = await strapi.db.query("api::configuracao.configuracao").findOne({
        where: {
            descricao: {
                $eq: 'Focus_Api',
            }
        }
    });

    let body = JSON.parse(JSON.stringify(faturamento.DadosFaturamento))
    delete body.remetente
    delete body.destinatario
    delete body.expedidor
    delete body.recebedor
    delete body.cnpj_cliente
    delete body.inscricao_estadual_cliente
    delete body.inscricao_estadual_st_cliente
    delete body.nome_cliente
    delete body.nome_fantasia_cliente
    delete body.logradouro_cliente
    delete body.numero_cliente
    delete body.complemento_cliente
    delete body.bairro_cliente
    delete body.cep_cliente
    delete body.uf_cliente
    delete body.municipio_cliente
    if (body.indicador_globalizado !== '1') delete body.indicador_globalizado
    if (body.icms_situacao_tributaria !== '90_simples_nacional') delete body.icms_indicador_simples_nacional

    body.observacao = `${body.observacao}. DADOS DE PAGAMENTO Banco: ${faturamento?.EmpresaBanco?.Banco} Ag: ${faturamento?.EmpresaBanco?.Agencia} C/C: ${faturamento?.EmpresaBanco?.Conta}`
    console.log(body);
    faturamento.FocusReferencia = 'fat_' + faturamento.id + '_' + moment(new Date).utc().format("YYYYMMDDhhmmss");

    var options = {
        'method': 'POST',
        'url': api.Valor + '/v2/cte?ref=' + faturamento.FocusReferencia,
        'headers': {
            'Content-Type': 'application/json'
        },
        'auth': {
            'user': faturamento.Empresa.FocusToken,
            'password': ''
        },
        body: JSON.stringify(body)
    };

    const req = await new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
            }
            resolve(JSON.parse(response.body));
        });
    });

    console.log(req)
    const retorno = {}
    retorno.msg = req;
    retorno.success = req.status === 'processando_autorizacao';
    return { faturamento, retorno }
}

const cancelar_nota = async (faturamento, cte) => {
    const api = await strapi.db.query("api::configuracao.configuracao").findOne({
        where: {
            descricao: {
                $eq: 'Focus_Api',
            }
        }
    });

    const url = cte ? api.Valor + '/v2/cte/' + faturamento.FocusReferencia : api.Valor + '/v2/nfse/' + faturamento.FocusReferencia;
    var options = {
        'method': 'DELETE',
        'url': url,
        'auth': {
            'user': faturamento.Empresa.FocusToken,
            'password': ''
        },
        'body': JSON.stringify({'justificativa': 'Servico Nao Prestado'})
    };
    
    const req = await new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                throw new Error(error);
            }
            resolve(JSON.parse(response.body));
        });
    });

    console.log(req)
    const retorno = {}
    retorno.msg = req.erros ? req.erros[0] : '';
    retorno.success = req.status !== 'erro_cancelamento';
    return retorno
}

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::faturamento.faturamento', ({ strapi }) => ({
    gerar: async (faturamentoInput) => {
        let retorno = {};

        // 1. Prepara payload limpo apenas com campos escalares para salvar os dados editáveis
        const editableFields = [
            'DadosFaturamento', 'DataEmissao', 'DataVencimento', 'ValorIss', 'ValorInss', 
            'ValorIr', 'ValorPis', 'ValorCofins', 'ValorCsll', 'ValorLiquido', 'Descricao', 
            'DadosComplementares', 'NumeroPedido', 'Observacoes', 'ValorRateado'
        ];
        const updatePayload = {};
        editableFields.forEach(field => {
            let val = faturamentoInput[field];
            if (val !== undefined) {
                // Se for campo decimal e vier vazio, anula para não estourar 500 no Strapi
                if (['ValorIss', 'ValorInss', 'ValorIr', 'ValorPis', 'ValorCofins', 'ValorCsll', 'ValorLiquido', 'ValorRateado'].includes(field)) {
                    if (val === "" || val === null) val = null;
                    else val = Number(val) || 0;
                }
                // Se for data e vier vazia, anular
                if (['DataEmissao', 'DataVencimento'].includes(field)) {
                    if (val === "") val = null;
                }
                updatePayload[field] = val;
            }
        });
        if (faturamentoInput.EmpresaBanco?.id) {
            updatePayload.EmpresaBanco = faturamentoInput.EmpresaBanco.id;
        }

        // 2. Salva no banco com payload limpo (evita erro 500 do Strapi com lixo no faturamentoInput)
        try {
            await strapi.entityService.update('api::faturamento.faturamento', faturamentoInput.id, {
                data: updatePayload
            });
        } catch (updateErr) {
            console.error('[gerar] Erro na atualizacao previa de faturamento:', updateErr.message);
            return { success: false, error: 'Erro de validação dos campos na pré-atualização: ' + updateErr.message };
        }

        // 3. Busca faturamento populado pra gerar os docs PDF/XML
        let faturamentoFull = await strapi.entityService.findOne('api::faturamento.faturamento', faturamentoInput.id, {
            populate: {
                Empresa: { populate: '*' }, 
                Cliente: true,
                EmpresaBanco: true,
                Medicao: { populate: { Ordens: { populate: '*' } } } 
            }
        });

        if (!faturamentoFull) {
            return { success: false, error: 'Faturamento não encontrado no banco de dados.' };
        }

        // Repassa os inputs caso o findOne ainda não tenha pegado
        editableFields.forEach(field => {
            if (faturamentoInput[field] !== undefined) faturamentoFull[field] = faturamentoInput[field];
        });
        if (faturamentoInput.EmpresaBanco) faturamentoFull.EmpresaBanco = faturamentoInput.EmpresaBanco;

        // Segurança para a geração
        if (!faturamentoFull.Medicao) faturamentoFull.Medicao = {};
        if (!faturamentoFull.Medicao.Ordens) faturamentoFull.Medicao.Ordens = [];

        console.log('[gerar] TipoFatura:', faturamentoFull.TipoFatura, '| id:', faturamentoFull.id);

        try {
            // emite
            if (faturamentoFull.TipoFatura === 'CTE') {
                const req = await cte(faturamentoFull, faturamentoFull.Cliente);
                faturamentoFull = req.faturamento;
                faturamentoFull.Status = Enum_StatusFaturamento.Processando;
                retorno = req.retorno;
            }
            else if (faturamentoFull.TipoFatura === 'NF') {
                const req = await nfse(faturamentoFull, faturamentoFull.Cliente)
                faturamentoFull = req.faturamento
                faturamentoFull.Status = Enum_StatusFaturamento.Processando;
                retorno = req.retorno;
            }
            else if (faturamentoFull.TipoFatura === 'RL') {
                const req = await rl(faturamentoFull, faturamentoFull.Cliente)
                faturamentoFull = req.faturamento
                faturamentoFull.Status = Enum_StatusFaturamento.Emitido;
                retorno = req.retorno;
            }
        } catch (e) {
            console.error('[gerar] Fatal error during generation:', e);
            return { success: false, error: 'Erro fatal ao gerar: ' + (e.message || String(e)) };
        }

        // 4. Salva o resultado final da emissão  
        if (retorno.success) {
            const finalPayload = {
                Status: faturamentoFull.Status,
                Nota: faturamentoFull.Nota,
                UrlArquivoNota: faturamentoFull.UrlArquivoNota,
                FocusReferencia: faturamentoFull.FocusReferencia,
                DadosWebHook: faturamentoFull.DadosWebHook,
                Observacoes: faturamentoFull.Observacoes,
            };

            await strapi.entityService.update('api::faturamento.faturamento', faturamentoInput.id, {
                data: finalPayload
            });

            retorno.data = faturamentoFull;
        }
        return retorno;
    },
    enviar: async (data) => {
        const nota = await strapi.db.query("api::faturamento.faturamento").findOne({
            where: {
                id: {
                    $eq: data.id,
                }
            }
        });

        const message =`
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
            <p style="font-size: 12.0pt;">Prezado Cliente,</p><br/><br/>
            <p style="font-size: 12.0pt;">Anexamos sua cobrança para registro no contas a pagar desta empresa.</p><br/>
            <p style="font-size: 12.0pt;"><i>Este é um e-mail automático, em caso de dúvidas permanecemos a disposição no e-mail financeiro@nacionalhidro.com.br</i></p><br/>
            <p style="font-size: 12.0pt;">Atenciosamente,</p><br/>
            <img src="cid:logo" />
        </div>`;
        console.log(data);
        const files = [
            {
                NomeArquivo: data.UrlArquivoNota.endsWith('.html') ? 'fatura_nacional_hidro.html' : data.TipoFatura === 'RL' ? `recibo_locacao_nacional_hidro.pdf` : 'fatura_nacional_hidro.pdf',
                UrlArquivo: data.UrlArquivoNota,
                IsUrl: true
            }
        ]

        if(data.TipoFatura === 'NF')
            files.push(
            {
                NomeArquivo: 'fatura_nacional_hidro.xml',
                UrlArquivo: nota.DadosWebHook?.url_danfse?.replace('.pdf', '-nfse.xml')?.replace('DANFSEs/NFSe', 'XMLsNFSe/'),
                IsUrl: true
            })

        if(data.TipoFatura === 'CTE')
            files.push(
            {
                NomeArquivo: 'fatura_nacional_hidro.xml',
                UrlArquivo: data.UrlArquivoNota?.replace('DACTEs/', 'XMLs/CTe').replace('.pdf', '-cte.xml'),
                IsUrl: true
            })

        const copia = data.EmailCopia ? data.EmailCopia.split(';') : [];
        copia.push('financeiro@nacionalhidro.com.br');
        const sent = email.sendMail(data.Contato.Email.toLowerCase(), 'Nacional Hidro - Faturamento', message, files, copia);

        if (sent) {
            data.Status = Enum_StatusFaturamento.Enviado;
            data.DataEnvio = new Date();
            await strapi.entityService.update('api::faturamento.faturamento', data.id, {
                data: data
            });

            return true
        }
        return false;
    },
    cancelar: async (data) => {
        let faturamento = await strapi.entityService.update('api::faturamento.faturamento', data.id, {
            data: data,
            populate: 'Empresa'
        });
        if (!faturamento) return {success: false}
        const resp = await cancelar_nota(faturamento, faturamento.TipoFatura === 'CTE');

        if (!resp.success) {
            const message =`
            <div
              class="container"
              style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <p style="font-size: 12.0pt;">Atenção,</p><br/><br/>
                <p style="font-size: 12.0pt;">O faturamento referente a ${faturamento.TipoFatura} com nº ${faturamento?.Nota || ''}, foi cancelado pelo sistema interno.</p>
                <p style="font-size: 12.0pt;">Portanto precisará ser realizado o cancelamento externamente!</p>
                <p style="font-size: 12.0pt;"><i>Este é um e-mail automático, em caso de dúvidas permanecemos a disposição no e-mail financeiro@nacionalhidro.com.br</i></p><br/>
                <p style="font-size: 12.0pt;">Atenciosamente,</p><br/>
                <img src="cid:logo" />
            </div>`;
    
            email.sendMail('financeiro@nacionalhidro.com.br', 'Nacional Hidro - Cancelamento de Nota', message);
        }
        return resp
    },
    clonar: async (data) => {
        let faturamento = await strapi.entityService.findOne('api::faturamento.faturamento', data.from);
        if (!faturamento) return {success: false}
        const entry = await strapi.entityService.update('api::faturamento.faturamento', data.to.id, {
            data: {
                DadosFaturamento: faturamento.DadosFaturamento
            }
        });
        return entry;
    },
    buscar: async (params) => {
        const query = `SELECT t0.id, t0.status, m0.codigo medicao, m0.revisao medicao_revisao, m0.data_cobranca, m0.data_aprovacao, t0.nota, t0.tipo_fatura, e0.descricao empresa, c0.razao_social cliente, c0.id cliente_id,
        t0.data_vencimento, c1.nome contato, t0.data_envio, t0.valor_total, t0.valor_rateado, t0.data_emissao, t0.data_cancelamento, t0.motivo_cancelamento, t0.created_at, t0.url_arquivo_nota, c0.cnpj cliente_cnpj, 
        t0.valor_inss, t0.valor_iss, t0.valor_pis, t0.valor_cofins, t0.valor_ir, t0.valor_csll, t0.valor_liquido
        FROM faturamentos AS t0
        LEFT JOIN faturamentos_cliente_links AS t1 ON t0.id = t1.faturamento_id
        LEFT JOIN faturamentos_contato_links AS t2 ON t0.id = t2.faturamento_id
        LEFT JOIN faturamentos_empresa_links AS t3 ON t0.id = t3.faturamento_id
        LEFT JOIN faturamentos_medicao_links AS t4 ON t0.id = t4.faturamento_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN contatos AS c1 ON t2.contato_id = c1.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN medicoes AS m0 ON t4.medicao_id = m0.id
        WHERE DATE_FORMAT(t0.data_criacao, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')
        AND t0.status ${params.Cancelado ? '=' : '!='} ${Enum_StatusFaturamento.Cancelado}`
        const resp = await strapi.db.connection.raw(query);

        return resp[0]
    },
    buscar_por_cliente: async (params) => {
        const query = `SELECT t0.id, t0.status, m0.codigo medicao, m0.revisao medicao_revisao, m0.data_cobranca, m0.data_aprovacao, t0.nota, t0.tipo_fatura, e0.descricao empresa, c0.razao_social cliente, c0.id cliente_id, 
        c1.nome contato, t0.data_envio, t0.valor_total, t0.valor_rateado, t0.data_emissao, t0.data_cancelamento, t0.motivo_cancelamento, t0.created_at, t0.url_arquivo_nota
        FROM faturamentos AS t0
        LEFT JOIN faturamentos_cliente_links AS t1 ON t0.id = t1.faturamento_id
        LEFT JOIN faturamentos_contato_links AS t2 ON t0.id = t2.faturamento_id
        LEFT JOIN faturamentos_empresa_links AS t3 ON t0.id = t3.faturamento_id
        LEFT JOIN faturamentos_medicao_links AS t4 ON t0.id = t4.faturamento_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN contatos AS c1 ON t2.contato_id = c1.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN medicoes AS m0 ON t4.medicao_id = m0.id
        WHERE c0.id = ${params.cliente_id}`
        const resp = await strapi.db.connection.raw(query);

        return resp[0]
    },
    focus_web_hook_nfse: async (data) => {
        if (data.status === 'processando_autorizacao') return;

        const faturamento = await strapi.db.query("api::faturamento.faturamento").findOne({
          where: {
            focus_referencia: {
              $eq: data.ref,
            }
          }
        });
        if (!faturamento) return;
        
        faturamento.DadosWebHook = data;
        faturamento.Nota = data.numero;
        faturamento.UrlArquivoNota = data.url;
        faturamento.Status = data.status === 'autorizado' ? Enum_StatusFaturamento.Emitido : Enum_StatusFaturamento.Falha;
        faturamento.Observacoes = `${faturamento.Observacoes}; ${data.erros ? data.erros[0]?.mensagem || '' : ''}`;
        console.log(faturamento);
        await strapi.entityService.update('api::faturamento.faturamento', faturamento.id, {
            data: faturamento
        });
    },
    focus_web_hook_cte: async (data) => {
        console.log('focus_web_hook_cte service - ref:', data.ref, 'status:', data.status);
        if (data.status === 'processando_autorizacao') return;

        let faturamento = await strapi.db.query("api::faturamento.faturamento").findOne({
          where: {
            focus_referencia: {
              $eq: data.ref,
            }
          }
        });

        if (!faturamento) {
            console.warn('focus_web_hook_cte: faturamento nao encontrado na 1a tentativa, aguardando 8s para ref:', data.ref);
            await new Promise(r => setTimeout(r, 8000));
            faturamento = await strapi.db.query("api::faturamento.faturamento").findOne({
              where: {
                focus_referencia: {
                  $eq: data.ref,
                }
              }
            });
        }

        if (!faturamento) {
            console.warn('focus_web_hook_cte: faturamento nao encontrado para ref:', data.ref);
            return;
        }

        faturamento.DadosWebHook = data;
        faturamento.Nota = data.numero;
        faturamento.UrlArquivoNota = data.caminho_dacte;
        faturamento.Status = faturamento.Status === Enum_StatusFaturamento.Enviado ? Enum_StatusFaturamento.Enviado : data.status === 'autorizado' ? Enum_StatusFaturamento.Emitido : Enum_StatusFaturamento.Falha
        faturamento.Observacoes = data.mensagem_sefaz ? `${faturamento.Observacoes}; ${data.mensagem_sefaz}` : faturamento.Observacoes;
        await strapi.entityService.update('api::faturamento.faturamento', faturamento.id, {
            data: faturamento
        });
        console.log('focus_web_hook_cte: faturamento atualizado id:', faturamento.id, 'status:', faturamento.Status);
    },
    emitir_nfse: async (data) => {
        const api = await strapi.db.query("api::configuracao.configuracao").findOne({
            where: {
                descricao: {
                    $eq: 'Focus_Api',
                }
            }
        });
        const empresa = await strapi.db.query("api::empresa.empresa").findOne({
            where: {
                id: {
                    $eq: data.empresa_id,
                }
            }
        });
        delete data.empresa;
        delete data.empresa_id;
        delete data.servico.discriminacao_aux
        delete data.EmpresaBanco;
        delete data.data_vencimento;
        delete data.data_emissao_aux;

        // data.tomador.inscricao_municipal = "000664332"

        if (data.servico.iss_retido === true) {
            data.servico.codigo_municipio = data.tomador.codigo_municipio;
        }
        console.log(data);
        const referencia = 'fat_' + empresa.Descricao + '_' + moment(new Date).utc().format("YYYYMMDDhhmmss");

        var options = {
            'method': 'POST',
            'url': api.Valor + '/v2/nfse?ref=' + referencia,
            'headers': {
                'Content-Type': 'application/json'
            },
            'auth': {
                'user': empresa.FocusToken,
                'password': ''
            },
            body: JSON.stringify(data)
    
        };
    
        const req = await new Promise((resolve, reject) => {
            request(options, function (error, response) {
                if (error) {
                    throw new Error(error);
                }
                resolve(JSON.parse(response.body));
            });
        });
    
        console.log(req)
        const retorno = {}
        retorno.msg = req;
        retorno.success = req.status === 'processando_autorizacao';
        return { referencia, retorno }
    },
    consultar_nfse: async (data) => {
        const api = await strapi.db.query("api::configuracao.configuracao").findOne({
            where: { descricao: { $eq: 'Focus_Api' } }
        });

        const faturamento = await strapi.entityService.findOne('api::faturamento.faturamento', data.id, {
            populate: ['Empresa']
        });

        if (!faturamento) return { success: false, msg: 'Faturamento não encontrado' };
        if (!faturamento.FocusReferencia) return { success: false, msg: 'Faturamento sem referência Focus. Gere novamente.' };
        if (!faturamento.Empresa?.FocusToken) return { success: false, msg: 'Empresa sem token Focus configurado.' };

        const isCte = faturamento.TipoFatura === 'CTE';
        const url = isCte
            ? `${api.Valor}/v2/cte/${faturamento.FocusReferencia}`
            : `${api.Valor}/v2/nfse/${faturamento.FocusReferencia}`;

        console.log('[consultar_nfse] Consultando Focus:', url);

        const req = await new Promise((resolve, reject) => {
            request({
                method: 'GET',
                url,
                auth: { user: faturamento.Empresa.FocusToken, password: '' }
            }, function (error, response) {
                if (error) { reject(error); return; }
                try { resolve(JSON.parse(response.body)); }
                catch (e) { reject(new Error('Resposta inválida da Focus: ' + response.body)); }
            });
        });

        console.log('[consultar_nfse] Resposta Focus:', req);

        const statusAutorizado = req.status === 'autorizado';
        const statusFalha = req.status === 'erro' || req.status === 'cancelado' || req.status === 'denegado';

        if (statusAutorizado) {
            faturamento.DadosWebHook = req;
            faturamento.Nota = req.numero;
            faturamento.UrlArquivoNota = req.caminho_dacte || req.url;
            faturamento.Status = Enum_StatusFaturamento.Emitido;
            faturamento.Observacoes = req.mensagem_sefaz ? `${faturamento.Observacoes || ''}; ${req.mensagem_sefaz}` : faturamento.Observacoes;
            await strapi.entityService.update('api::faturamento.faturamento', faturamento.id, { data: faturamento });
            return { success: true, status: req.status, emitido: true, msg: 'Nota autorizada e status atualizado!' };
        } else if (statusFalha) {
            faturamento.Status = Enum_StatusFaturamento.Falha;
            faturamento.Observacoes = `${faturamento.Observacoes || ''}; Focus status: ${req.status} - ${req.erros?.[0]?.mensagem || req.mensagem_sefaz || ''}`;
            await strapi.entityService.update('api::faturamento.faturamento', faturamento.id, { data: faturamento });
            return { success: false, status: req.status, emitido: false, msg: `Erro na nota: ${req.erros?.[0]?.mensagem || req.status}` };
        }

        return { success: true, status: req.status, emitido: false, msg: `Status Focus atual: ${req.status}` };
    },
    buscar_relatorio: async (params) => {
        const query = `SELECT CASE             
        WHEN t0.status = 0 THEN 'Cancelado'             
        WHEN t0.status = 1 THEN 'Em aberto'              
        WHEN t0.status = 2 THEN 'Emitido'              
        WHEN t0.status = 3 THEN 'Processando'              
        WHEN t0.status = 4 THEN 'Falha ao processar'
        WHEN t0.status = 5 THEN 'Enviado' 
        END AS status,
        m0.codigo medicao, m0.revisao medicao_revisao, 
        DATE_FORMAT(m0.data_criacao, '%d/%m/%Y') criacao_medicao, 
        DATE_FORMAT(m0.data_aprovacao, '%d/%m/%Y') data_aprovacao, t0.nota, t0.tipo_fatura, e0.descricao empresa, c0.razao_social cliente, c0.id cliente_id, 
        c1.nome contato, c0.cnpj cliente_cnpj,
        DATE_FORMAT(m0.data_cobranca, '%d/%m/%Y') data_envio, 
        t0.valor_total,
        t0.valor_rateado,
        DATE_FORMAT(t0.data_emissao, '%d/%m/%Y') data_emissao, 
        DATE_FORMAT(t0.data_vencimento, '%d/%m/%Y') data_vencimento, 
        DATE_FORMAT(t0.data_cancelamento, '%d/%m/%Y') data_cancelamento, t0.motivo_cancelamento, t0.url_arquivo_nota,
        t0.data_emissao data_emissao_aux, 
        t0.valor_inss,
        t0.valor_iss, 
        t0.valor_cofins, 
        t0.valor_pis, 
        t0.valor_ir, 
        t0.valor_csll, 
        t0.valor_liquido,
        m0.data_aprovacao data_aprovacao_aux,
        t0.data_cancelamento data_cancelamento_aux
        FROM faturamentos AS t0
        LEFT JOIN faturamentos_cliente_links AS t1 ON t0.id = t1.faturamento_id
        LEFT JOIN faturamentos_contato_links AS t2 ON t0.id = t2.faturamento_id
        LEFT JOIN faturamentos_empresa_links AS t3 ON t0.id = t3.faturamento_id
        LEFT JOIN faturamentos_medicao_links AS t4 ON t0.id = t4.faturamento_id
        LEFT JOIN clientes AS c0 ON t1.cliente_id = c0.id
        LEFT JOIN contatos AS c1 ON t2.contato_id = c1.id
        LEFT JOIN empresas AS e0 ON t3.empresa_id = e0.id
        LEFT JOIN medicoes AS m0 ON t4.medicao_id = m0.id
        WHERE ((t0.status IN (2, 5) AND DATE_FORMAT(t0.data_emissao, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d'))
        OR (t0.status NOT IN (2, 5) AND DATE_FORMAT(t0.data_criacao, '%y-%m-%d') BETWEEN DATE_FORMAT('${params.Data1}', '%y-%m-%d') AND DATE_FORMAT('${params.Data2}', '%y-%m-%d')))`
        const resp = await strapi.db.connection.raw(query);

        return resp[0]
    }
}));
