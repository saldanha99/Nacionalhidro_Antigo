const Enum_TipoFaturamento = {
    OrcamentoFechado: 1,
    Semanal: 2,
    Quinzenal: 3,
    Mensal: 4,
    CadaExecucao: 5,
    PagamentoAntecipado: 6
}

const Enum_DiasBaseSemanal = {
    Domingo: 1,
    Segunda: 2,
    Terca: 3,
    Quarta: 4,
    Quinta: 5,
    Sexta: 6,
    Sabado: 7
}

const Enum_StatusOS = {
    Baixar: 1,
    Cancelado: 2,
    Cobrar: 3,
    Aprovar: 4
}

const Enum_TipoDocFaturamento = {
    Entrada: 0,
    Saida: 1
}

const Enum_LocalDestinoFaturamento = {
    Interna: 1,
    Interestadual: 2,
    Exterior: 3
}

const Enum_FinalidadeFaturamento = {
    Normal: 1,
    Complementar: 2,
    Ajuste: 3,
    Devolucao: 4
}

const Enum_RegimeTributario = {
    SimplesNacional: 1,
    SimplesNacionalExcesso: 2,
    RegimeNormal: 3
}

const Enum_PresencaCompradorFaturamento = {
    NaoAplica: 0,
    Presencial: 1,
    Internet: 2,
    Teleatendimento: 3,
    EntregaDomicilio: 4,
    Outros: 9
}

//Contas a pagar

const Enum_StatusContas = {
    Cancelado: 0,
    Criado: 1,
    Baixado: 2,
    Pago: 3,
    Correcao: 4
}
const Enum_StatusContasPagamento = {
    Pendente: 0,
    Pago: 1,
    Parcial: 2
}


//Proposta
const Enum_StatusPropostas = {
    Cancelado: 0,
    Aberta: 1,
    Aprovada: 2,
    Reprovada: 3,
    Revisada: 4
}

const Enum_TipoResponsabilidade = {
    Contratado: 1,
    Contratante: 2,
    Ambos: 3
}

const Enum_TiposCobranca = {
    Hora: 1,
    Diaria: 2,
    Frete: 3
}


//Ordem Serviço
const Enum_StatusOrdens = {
    Cancelado: 0,
    Aberta: 1,
    Executada: 2
}


//Escala
const Enum_StatusEscalas = {
    Cancelado: 0,
    Aberta: 1,
    Executada: 2
}

const Enum_StatusOperacional = {
    Nenhum: 0,
    Ferias: 1,
    Atestado: 2,
    Patio: 3,
    BancoHoras: 4
}


//Agendamento
const Enum_StatusAgendamentos = {
    Agendado: 1,
    Confirmado: 2,
    Viagem: 3,
    Manutencao: 4
}

//Medicao
const Enum_StatusPrecificacao = {
    Cancelado: 3,
    EmAberto: 0,
    Precificada: 1,
    EmMedicao: 2,
    Todos: 4
}

const Enum_StatusMedicao = {
    Cancelado: 0,
    EmAberto: 1,
    Conferencia: 2,
    Validada: 3,
    EmAprovacao: 4,
    Aprovada: 5,
    AprovadaParcialmente: 6,
    Reprovada: 7
}
//Faturamento
const Enum_StatusFaturamento = {
    Cancelado: 0,
    EmAberto: 1,
    Emitido: 2,
    Processando: 3,
    Falha: 4,
    Enviado: 5
}
//Contas a Receber
const Enum_StatusContasReceber = {
    Cancelado: 0,
    EmAberto: 1,
    Pendente: 2,
    RecebidoParcial: 3,
    Recebido: 4,
    EmCorrecao: 5
}
const Enum_StatusParcelaReceber = {
    Pendente: 0,
    Parcial: 1,
    Recebido: 2
}

module.exports = {
    Enum_TipoFaturamento,
    Enum_DiasBaseSemanal,
    Enum_StatusOS,
    Enum_StatusFaturamento,
    Enum_FinalidadeFaturamento,
    Enum_LocalDestinoFaturamento,
    Enum_PresencaCompradorFaturamento,
    Enum_TipoDocFaturamento,
    Enum_RegimeTributario,
    Enum_StatusContas,
    Enum_StatusContasPagamento,
    Enum_TipoResponsabilidade,
    Enum_TiposCobranca,
    Enum_StatusPropostas,
    Enum_StatusEscalas,
    Enum_StatusAgendamentos,
    Enum_StatusOrdens,
    Enum_StatusOperacional,
    Enum_StatusPrecificacao,
    Enum_StatusMedicao,
    Enum_StatusContasReceber,
    Enum_StatusParcelaReceber
};