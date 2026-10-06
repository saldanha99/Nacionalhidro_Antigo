'use strict';

const https = require('https');

/**
 * NFS-e no padrão nacional (DPS) via Focus NFe.
 *
 * Desde 01/10/2026 a Prefeitura de Campinas recusa o emissor antigo (ABRASF) para
 * quem não é do Simples Nacional, com o erro L999 "utilize o Novo emissor ajustado
 * ao padrão nacional". Campinas manteve ambiente próprio, mas passou a usar o layout
 * nacional — é o "Cenário B" do guia da Focus: endpoint /v2/nfsen com os campos do
 * layout nacional, mantendo habilitada só a opção "NFSe" da empresa no painel.
 *
 * Este módulo converte o JSON salvo em DadosFaturamento (formato antigo: prestador,
 * tomador.endereco, servico, itens) para o payload da DPS nacional. Os códigos
 * padrão são os da simulação feita pelo contador no emissor novo de Campinas em
 * 02/10/2026 e podem ser trocados por fatura em DadosFaturamento.servico.
 */

const CAMPINAS = '3509502';

// Prefixo da referência Focus das notas emitidas por /v2/nfsen. Notas antigas
// (fat_...) continuam sendo consultadas e canceladas por /v2/nfse.
const PREFIXO_REFERENCIA_NACIONAL = 'nfsen_';

// Série da DPS enviada por integração. Desde 01/10/2026 Campinas recusa as séries
// 00001 a 10000 (uso exclusivo do sistema municipal) com o erro L0022; a faixa de
// integração é 10001 a 49999. O número da DPS continua sendo dado pela Focus.
const SERIE_DPS_INTEGRACAO = '10001';

// Até esta data o emissor antigo de Campinas ainda aceita optantes do Simples
// Nacional; a partir dela todo mundo emite no padrão nacional.
const INICIO_NACIONAL_SIMPLES = '2026-11-01';

const PADROES_SERVICO = {
    // 07.10.01 - Limpeza, manutenção e conservação de vias e logradouros públicos, imóveis...
    codigo_tributacao_nacional_iss: '071001',
    // 07.10.01.004 - Atividades de limpeza não especificadas anteriormente (Campinas)
    codigo_tributacao_municipal_iss: '004',
    // 1.2406.90.00 - Serviços de limpeza urbana e similares não classificados em subposições anteriores
    codigo_nbs: '124069000',
    // 020201 - Serviço prestado fisicamente sobre bem imóvel - local do imóvel
    codigo_indicador_operacao: '020201',
    // 000 / 000001 - Situações tributadas integralmente pelo IBS e CBS
    ibs_cbs_situacao_tributaria: '000',
    ibs_cbs_classificacao_tributaria: '000001',
    // 01 - Operação tributável com alíquota básica
    situacao_tributaria_pis_cofins: '01',
};

const digitos = (valor) => (valor === undefined || valor === null ? '' : String(valor).replace(/\D/g, ''));

const texto = (valor) => {
    if (valor === undefined || valor === null) return '';
    return String(valor).replace(/�/g, ' ').trim();
};

const numero = (valor) => {
    if (valor === undefined || valor === null || valor === '') return 0;
    const n = Number(String(valor).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
};

const arredondar = (valor) => Math.round((numero(valor) + Number.EPSILON) * 100) / 100;

const verdadeiro = (valor) => valor === true || valor === 1 || valor === '1' || valor === 'true';

const isReferenciaNacional = (referencia) => String(referencia || '').startsWith(PREFIXO_REFERENCIA_NACIONAL);

/**
 * Município onde o serviço foi executado (LC 116/2003, art. 3º, VII, item 07.10).
 * Respeita a escolha feita na tela; sem escolha, assume o município do tomador.
 */
const resolverLocalPrestacao = (dados) => {
    const prestadorMun = digitos(dados?.prestador?.codigo_municipio) || CAMPINAS;
    const tomadorMun = digitos(dados?.tomador?.endereco?.codigo_municipio);
    return digitos(dados?.servico?.codigo_municipio) || tomadorMun || prestadorMun;
};

/**
 * Consulta o CEP no ViaCEP. Devolve { ibge, localidade, uf, ... }, { inexistente: true }
 * quando o CEP não existe, ou null se o serviço não respondeu (não bloqueia a emissão).
 */
const consultarCep = (cep, timeoutMs = 5000) => new Promise((resolve) => {
    const limpo = digitos(cep);
    if (limpo.length !== 8) return resolve({ inexistente: true });
    const req = https.get(`https://viacep.com.br/ws/${limpo}/json/`, { timeout: timeoutMs }, (res) => {
        let corpo = '';
        res.on('data', (parte) => { corpo += parte; });
        res.on('end', () => {
            if (res.statusCode === 400) return resolve({ inexistente: true });
            try {
                const json = JSON.parse(corpo);
                if (json.erro) return resolve({ inexistente: true });
                resolve(json);
            } catch (err) {
                resolve(null);
            }
        });
    });
    req.on('timeout', () => req.destroy());
    req.on('error', () => resolve(null));
});

/**
 * A prefeitura recusa a DPS quando o CEP do imóvel não é do município do local da
 * prestação (erro L9999). Com o indicador 020201 o local da prestação é, por
 * definição, onde fica o imóvel; então o município passa a seguir o CEP informado.
 * Lança erro legível se o CEP não existir.
 */
const alinharLocalPrestacaoPeloImovel = async (dados) => {
    if (!dados) return dados;
    if (!dados.imovel) dados.imovel = {};

    // Se o imóvel não tiver CEP nem logradouro, tenta usar o endereço do tomador como base
    if (!digitos(dados.imovel.cep) && !texto(dados.imovel.logradouro) && dados.tomador?.endereco) {
        const end = dados.tomador.endereco;
        if (digitos(end.cep)) {
            dados.imovel.cep = digitos(end.cep);
            if (!texto(dados.imovel.logradouro)) dados.imovel.logradouro = texto(end.logradouro);
            if (!texto(dados.imovel.numero)) dados.imovel.numero = texto(end.numero) || 'S/N';
            if (!texto(dados.imovel.bairro)) dados.imovel.bairro = texto(end.bairro);
            if (!texto(dados.imovel.complemento) && texto(end.complemento)) dados.imovel.complemento = texto(end.complemento);
        }
    }

    const cep = digitos(dados?.imovel?.cep);
    if (!cep) return dados;
    const info = await consultarCep(cep);
    if (!info) {
        console.warn('[nfse] ViaCEP indisponível; local da prestação mantido sem validar o CEP', cep);
        return dados;
    }
    if (info.inexistente) {
        throw new Error(`O CEP do local do serviço (${cep}) não existe no ViaCEP / Correios. Corrija o endereço do imóvel antes de emitir.`);
    }
    const ibge = digitos(info.ibge);
    if (!ibge) return dados;

    // Se faltar logradouro ou bairro no imóvel, preenche a partir do ViaCEP
    if (!texto(dados.imovel.logradouro) && info.logradouro) dados.imovel.logradouro = info.logradouro;
    if (!texto(dados.imovel.bairro) && info.bairro) dados.imovel.bairro = info.bairro;
    if (!texto(dados.imovel.complemento) && info.complemento) dados.imovel.complemento = info.complemento;

    const atual = resolverLocalPrestacao(dados);
    if (atual !== ibge) {
        console.warn(`[nfse] Local da prestação ${atual} não corresponde ao CEP ${cep} (${info.localidade}/${info.uf} - ${ibge}); ajustado para ${ibge}.`);
        if (!dados.servico) dados.servico = {};
        dados.servico.codigo_municipio = ibge;
    }
    return dados;
};

/**
 * Decide se a fatura vai pelo padrão nacional. Só o Simples Nacional pode seguir no
 * emissor antigo, e apenas até 31/10/2026.
 */
const usarPadraoNacional = (dados, dataReferencia = new Date()) => {
    if (!verdadeiro(dados?.optante_simples_nacional)) return true;
    const hoje = new Date(dataReferencia).toISOString().slice(0, 10);
    return hoje >= INICIO_NACIONAL_SIMPLES;
};

/**
 * Tipo de retenção do PIS/COFINS/CSLL (tag tpRetPisCofins) conforme o que tem valor.
 */
const tipoRetencaoPisCofins = (pis, cofins, csll) => {
    const p = pis > 0, c = cofins > 0, s = csll > 0;
    if (p && c && s) return '3';
    if (p && c && !s) return '4';
    if (p && !c && !s) return '5';
    if (!p && c && !s) return '6';
    if (!p && c && s) return '7';
    if (!p && !c && s) return '8';
    if (p && !c && s) return '9';
    return '0';
};

const valorRetencao = (servico, campoValor, campoAliquota, valorServico) => {
    const informado = servico?.[campoValor];
    if (informado !== undefined && informado !== null && informado !== '') return arredondar(informado);
    return arredondar(valorServico * numero(servico?.[campoAliquota]) / 100);
};

const somarItens = (dados) => {
    if (Array.isArray(dados?.itens) && dados.itens.length) {
        return arredondar(dados.itens.reduce((total, item) => total + numero(item?.valor_total), 0));
    }
    return arredondar(dados?.servico?.valor_servicos);
};

const montarDescricao = (dados) => {
    const discriminacao = texto(dados?.servico?.discriminacao);
    if (discriminacao) return discriminacao;
    const itens = (dados?.itens || []).map((item) => texto(item?.discriminacao)).filter(Boolean);
    return itens.join('\n') || 'SERVICOS PRESTADOS';
};

const dataCompetencia = (dataEmissao) => {
    const valor = texto(dataEmissao);
    if (/^\d{4}-\d{2}-\d{2}/.test(valor)) return valor.slice(0, 10);
    return new Date().toISOString().slice(0, 10);
};

/**
 * Converte DadosFaturamento (formato antigo) no payload da DPS nacional da Focus.
 * Lança erro com mensagem legível quando falta algo que a prefeitura vai recusar.
 */
const montarDpsNacional = (dados) => {
    const prestador = dados?.prestador || {};
    const tomador = dados?.tomador || {};
    const endereco = tomador.endereco || {};
    const servico = dados?.servico || {};
    const imovel = dados?.imovel || {};

    const prestadorMun = digitos(prestador.codigo_municipio) || CAMPINAS;
    const localPrestacao = resolverLocalPrestacao(dados);
    const optanteSimples = verdadeiro(dados?.optante_simples_nacional);
    const valorServico = somarItens(dados);

    const erros = [];
    if (!digitos(prestador.cnpj)) erros.push('CNPJ do prestador');
    if (!(valorServico > 0)) erros.push('valor do serviço');
    if (!digitos(tomador.cnpj) && !digitos(tomador.cpf)) erros.push('CNPJ/CPF do tomador');
    if (!texto(tomador.razao_social)) erros.push('razão social do tomador');
    if (!digitos(endereco.codigo_municipio)) erros.push('município do tomador');
    if (!digitos(endereco.cep)) erros.push('CEP do tomador');
    if (!digitos(imovel.cep) || !texto(imovel.logradouro) || !texto(imovel.numero) || !texto(imovel.bairro)) {
        erros.push('endereço do local do serviço (CEP, logradouro, número e bairro do imóvel)');
    }
    if (erros.length) {
        throw new Error(`Preencha antes de emitir: ${erros.join(', ')}.`);
    }

    const payload = {
        serie_dps: SERIE_DPS_INTEGRACAO,
        data_emissao: texto(dados.data_emissao) || new Date().toISOString(),
        data_competencia: dataCompetencia(dados.data_emissao),
        codigo_municipio_emissora: prestadorMun,
        cnpj_prestador: digitos(prestador.cnpj),
        inscricao_municipal_prestador: digitos(prestador.inscricao_municipal) || undefined,
        // 1: Não optante; 3: ME/EPP do Simples Nacional
        codigo_opcao_simples_nacional: optanteSimples ? '3' : '1',
        regime_especial_tributacao: '0',

        razao_social_tomador: texto(tomador.razao_social).slice(0, 150),
        codigo_municipio_tomador: digitos(endereco.codigo_municipio),
        cep_tomador: digitos(endereco.cep),
        logradouro_tomador: texto(endereco.logradouro) || undefined,
        numero_tomador: texto(endereco.numero) || 'S/N',
        complemento_tomador: texto(endereco.complemento) || undefined,
        bairro_tomador: texto(endereco.bairro) || undefined,
        telefone_tomador: digitos(tomador.telefone).length >= 6 ? digitos(tomador.telefone).slice(0, 20) : undefined,
        email_tomador: texto(tomador.email).split(/[;,\s]+/)[0] || undefined,

        codigo_municipio_prestacao: localPrestacao,
        codigo_tributacao_nacional_iss: digitos(servico.codigo_tributacao_nacional_iss) || PADROES_SERVICO.codigo_tributacao_nacional_iss,
        codigo_tributacao_municipal_iss: digitos(servico.codigo_tributacao_municipal_iss) || PADROES_SERVICO.codigo_tributacao_municipal_iss,
        codigo_nbs: digitos(servico.codigo_nbs) || PADROES_SERVICO.codigo_nbs,
        descricao_servico: montarDescricao(dados),
        valor_servico: valorServico,

        // Endereço do imóvel onde o serviço foi executado (indicador 020201)
        cep_imovel: digitos(imovel.cep),
        logradouro_imovel: texto(imovel.logradouro),
        numero_imovel: texto(imovel.numero),
        complemento_imovel: texto(imovel.complemento) || undefined,
        bairro_imovel: texto(imovel.bairro),

        // 1: Operação tributável
        tributacao_iss: '1',
        // 1: Não retido; 2: Retido pelo tomador
        tipo_retencao_iss: verdadeiro(servico.iss_retido) ? '2' : '1',
    };

    if (payload.descricao_servico.length > 1000) {
        throw new Error(`A descrição do serviço tem ${payload.descricao_servico.length} caracteres; o padrão nacional aceita até 1000.`);
    }

    const documentoTomador = digitos(tomador.cnpj) || digitos(tomador.cpf);
    if (documentoTomador.length === 11) payload.cpf_tomador = documentoTomador;
    else payload.cnpj_tomador = documentoTomador;

    const imTomador = digitos(tomador.inscricao_municipal);
    if (imTomador && Number(imTomador) > 0) payload.inscricao_municipal_tomador = imTomador;

    // Campinas calcula a própria alíquota; para outro município ela precisa vir na nota.
    if (localPrestacao !== prestadorMun && numero(servico.aliquota) > 0) {
        payload.percentual_aliquota_relativa_municipio = arredondar(servico.aliquota);
    }

    // Retenções federais em reais (orientação do contador: IRRF 1,5%, contribuições
    // sociais 4,65% = PIS 0,65 + COFINS 3 + CSLL 1, INSS 3,5%).
    const valorPis = valorRetencao(servico, 'valor_pis', 'aliquota_pis', valorServico);
    const valorCofins = valorRetencao(servico, 'valor_cofins', 'aliquota_cofins', valorServico);
    const valorCsll = valorRetencao(servico, 'valor_csll', 'aliquota_csll', valorServico);
    const valorIr = valorRetencao(servico, 'valor_ir', 'aliquota_ir', valorServico);
    const valorInss = valorRetencao(servico, 'valor_inss', 'aliquota_inss', valorServico);

    if (!optanteSimples) {
        payload.situacao_tributaria_pis_cofins = PADROES_SERVICO.situacao_tributaria_pis_cofins;
    }
    payload.tipo_retencao_pis_cofins = tipoRetencaoPisCofins(valorPis, valorCofins, valorCsll);
    // A tag vRetCSLL soma PIS, COFINS e CSLL retidos ("contribuições sociais").
    if (valorPis + valorCofins + valorCsll > 0) payload.valor_csll = arredondar(valorPis + valorCofins + valorCsll);
    if (valorIr > 0) payload.valor_irrf = valorIr;
    if (valorInss > 0) payload.valor_cp = valorInss;

    // Valor aproximado dos tributos, como na simulação do contador
    payload.valor_total_tributos_federais = 0;
    payload.valor_total_tributos_estaduais = 0;
    payload.valor_total_tributos_municipais = 0;

    // Reforma tributária (IBS/CBS). O Simples Nacional só informa a partir de 2027.
    payload.finalidade_emissao = '0';
    payload.consumidor_final = documentoTomador.length === 11 ? '1' : '0';
    payload.indicador_destinatario = '0';
    payload.codigo_indicador_operacao = digitos(servico.codigo_indicador_operacao) || PADROES_SERVICO.codigo_indicador_operacao;
    if (!optanteSimples) {
        payload.ibs_cbs_situacao_tributaria = texto(servico.ibs_cbs_situacao_tributaria) || PADROES_SERVICO.ibs_cbs_situacao_tributaria;
        payload.ibs_cbs_classificacao_tributaria = texto(servico.ibs_cbs_classificacao_tributaria) || PADROES_SERVICO.ibs_cbs_classificacao_tributaria;
    } else {
        // 1: apuração dos tributos federais e municipal pelo Simples Nacional
        payload.regime_tributario_simples_nacional = '1';
    }

    Object.keys(payload).forEach((chave) => {
        if (payload[chave] === undefined || payload[chave] === '') delete payload[chave];
    });

    return payload;
};

/**
 * Resumo legível dos erros da Focus (síncronos ou do retorno da consulta).
 */
const mensagemErroFocus = (resposta) => {
    if (!resposta) return 'sem resposta da Focus';
    if (Array.isArray(resposta.erros) && resposta.erros.length) {
        return resposta.erros.map((e) => `${e.codigo ? e.codigo + ': ' : ''}${e.mensagem}`).join('; ');
    }
    return resposta.mensagem || resposta.mensagem_sefaz || resposta.status || resposta.codigo || 'erro desconhecido';
};

module.exports = {
    CAMPINAS,
    PADROES_SERVICO,
    PREFIXO_REFERENCIA_NACIONAL,
    INICIO_NACIONAL_SIMPLES,
    SERIE_DPS_INTEGRACAO,
    isReferenciaNacional,
    resolverLocalPrestacao,
    consultarCep,
    alinharLocalPrestacaoPeloImovel,
    usarPadraoNacional,
    montarDpsNacional,
    mensagemErroFocus,
    tipoRetencaoPisCofins,
};
