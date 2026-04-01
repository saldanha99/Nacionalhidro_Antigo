export const Enum_TipoFaturamento = {
    // OrcamentoFechado: 1,
    Semanal: 2,
    Quinzenal: 3,
    Mensal: 4,
    CadaExecucao: 5,
    // PagamentoAntecipado: 6
}

export const List_DiasSemana = [
    {
        id: 1,
        value: 0,
        label: "Domingo"
    },
    {
        id: 2,
        value: 1,
        label: "Segunda-feira"
    },
    {
        id: 3,
        value: 2,
        label: "Terça-feira"
    },
    {
        id: 4,
        value: 3,
        label: "Quarta-feira"
    },
    {
        id: 5,
        value: 4,
        label: "Quinta-feira"
    },
    {
        id: 6,
        value: 5,
        label: "Sexta-feira"
    },
    {
        id: 7,
        value: 6,
        label: "Sábado"
    }
]

export const List_Segmentos = ['AUTO VÁCUO', 'CARRETA', 'HIDROJATO', 'HIDROJATO COMBINADO']

export const List_TipoFaturamento = [
    {
        value: 1,
        label: "Orçamento fechado"
    },
    {
        value: 2,
        label: "Semanal"
    },
    {
        value: 3,
        label: "Quinzenal"
    },
    {
        value: 4,
        label: "Mensal"
    },
    {
        value: 5,
        label: "A cada execução"
    },
    {
        value: 6,
        label: "Pagamento antecipado"
    }
]

export const TipoFaturamentoCores = [
    {
        color: '#7aaff9',
        label: 'A_Cobrar',
        value: 'Cobrar'
    },
    {
        color: '#a8ccff',
        label: 'A_Baixar',
        value: 'Baixar'
    },
    {
        color: '#1abadd',
        label: 'A_Aprovar',
        value: 'Aprovar'
    },
    {
        color: '#068ead',
        label: 'A_Faturar',
        value: 'Faturar'
    },
    {
        color: '#06ad99',
        label: 'A_Processar',
        value: 'Processando'
    },
    {
        color: '#06ad6d',
        label: 'Faturado',
        value: 'Faturado'
    },
    {
        color: '#06ad46',
        label: 'A_Receber',
        value: 'Receber'
    },
    {
        color: '#06ad17',
        label: 'Recebidos',
        value: 'Recebidos'
    },
    {
        color: '#80284E',
        label: 'Com_Falha',
        value: 'Com erro'
    },
    {
        color: '#E90000',
        label: 'Cancelado',
        value: 'Cancelados'
    },
    {
        color: '#FC986B',
        label: 'Status_da_Precificação',
        value: 'Status da Precificação'
    },
    {
        color: '#FFFB84',
        label: 'Status_da_Medição',
        value: 'Status da Medição'
    },
    {
        color: '#10FF50',
        label: 'Medições_Finalizadas',
        value: 'Medições Finalizadas'
    },
    {
        color: '#7aaff9',
        label: 'Status_do_Faturamento',
        value: 'Status_do_Faturamento'
    },
]

export const TipoContasAPagarCores = [
    {
        color: '#FC986B',
        label: 'Cadastrar',
        value: 'Cadastrar'
    },
    {
        color: '#FFFB84',
        label: 'Pagar',
        value: 'Pagar'
    },
    {
        color: '#10FF50',
        label: 'Pago',
        value: 'Pago(s)'
    },
    {
        color: '#E90000',
        label: 'Cancelado',
        value: 'Cancelado(s)'
    }
]

export const TipoContasReceberCores = [
    {
        color: '#FC986B',
        label: 'Cadastro',
        value: 'Cadastro'
    },
    {
        color: '#FFFB84',
        label: 'Receber',
        value: 'Receber'
    },
    {
        color: '#10FF50',
        label: 'Recebidos',
        value: 'Recebidos'
    },
    {
        color: '#E90000',
        label: 'Cancelados',
        value: 'Cancelados'
    }
]

export const Enum_FormaPagamento = {
    Boleto: 1,
    Cheque: 2,
    Pix: 3,
    Transferencia: 4,
    Dinheiro: 5,
    DebitoAutomatico: 6
}

export const List_FormasPagamento = [
    {
        label: 'Boleto',
        value: 1
    },
    {
        label: 'Cheque',
        value: 2
    },
    {
        label: 'PIX',
        value: 3
    },
    {
        label: 'Transferência',
        value: 4
    },
    {
        label: 'Dinheiro',
        value: 5
    },
    {
        label: 'Débito Automático',
        value: 6
    },
    {
        label: 'Cartão de Crédito',
        value: 7
    }
]

export const Enum_StatusContasPagamento = {
    Pendente: 0,
    Pago: 1,
    Parcial: 2
}

export const Enum_StatusContas = {
    Cancelado: 0,
    Criado: 1,
    Baixado: 2,
    Pago: 3
}

export const Enum_RegimeTributario = {
    Simples: 1,
    Real: 4,
    Presumido: 5
}

export const Lista_RegimeTributario = [
    {
        label: 'Simples Nacional',
        value: Enum_RegimeTributario.Simples
    },
    // {
    //     label: 'Simples Nacional Excesso',
    //     value: 2
    // },
    // {
    //     label: 'Regime Normal',
    //     value: 3
    // },
    {
        label: 'Lucro Real',
        value: Enum_RegimeTributario.Real
    },
    {
        label: 'Lucro Presumido',
        value: Enum_RegimeTributario.Presumido
    }
]

export const Enum_TipoResponsabilidade = {
    Contratado: 1,
    Contratante: 2
}

//Proposta
export const TipoPropostaCores = [
    {
        color: '#a8ccff',
        label: 'Em Aberto',
        value: 'Em Aberto'
    },
    {
        color: '#06ad17',
        label: 'Aprovadas',
        value: 'Aprovadas'
    },
    {
        color: '#80284E',
        label: 'Reprovadas',
        value: 'Reprovadas'
    },
    {
        color: '#E90000',
        label: 'Canceladas',
        value: 'Canceladas'
    },
    {
        color: '#3d1f1f',
        label: 'Vencido',
        value: 'Vencidos'
    }
]

export const Enum_StatusPropostas = {
    Cancelado: 0,
    Aberta: 1,
    Aprovada: 2,
    Reprovada: 3,
    Revisada: 4
}

export const Lista_StatusProposta = [
    {
        label: 'Cancelada',
        value: Enum_StatusPropostas.Cancelado
    },
    {
        label: 'Em Aberto',
        value: Enum_StatusPropostas.Aberta
    },
    {
        label: 'Aprovada',
        value: Enum_StatusPropostas.Aprovada
    },
    {
        label: 'Reprovada',
        value: Enum_StatusPropostas.Reprovada
    }
]

export const Enum_TiposCobranca = {
    Hora: 1,
    Diaria: 2,
    Frete: 3,
    Fechada: 4
}

export const Lista_TiposCobranca = [
    {
        label: 'Hora',
        value: Enum_TiposCobranca.Hora
    },
    {
        label: 'Diária',
        value: Enum_TiposCobranca.Diaria
    },
    {
        label: 'Frete',
        value: Enum_TiposCobranca.Frete
    },
    {
        label: 'Fechada',
        value: Enum_TiposCobranca.Fechada
    }
]

//Ordem Serviço
export const TipoOrdemCores = [
    {
        color: '#a8ccff',
        label: 'Abrir',
        value: 'Abrir'
    },
    {
        color: '#0083ff',
        label: 'Em Aberto',
        value: 'Em Aberto'
    },
    {
        color: '#06ad17',
        label: 'Executadas',
        value: 'Executadas'
    },
    {
        color: '#E90000',
        label: 'Canceladas',
        value: 'Canceladas'
    }
]

export const Enum_StatusOrdens = {
    Cancelado: 0,
    Aberta: 1,
    Executada: 2
}

export const Lista_StatusOrdem = [
    {
        label: 'Cancelada',
        value: Enum_StatusOrdens.Cancelado
    },
    {
        label: 'Em Aberto',
        value: Enum_StatusOrdens.Aberta
    },
    {
        label: 'Executada',
        value: Enum_StatusOrdens.Executada
    }
]

export const List_TiposVeiculo = [
    {
        value: 1,
        label: "Carro"
    },
    {
        value: 2,
        label: "Caminhão Toco"
    },
    {
        value: 3,
        label: "Caminhão Truck"
    },
    {
        value: 4,
        label: "Cavalo Mecânico"
    },
    {
        value: 5,
        label: "Carreta"
    }
]

export const List_MotivosAfastamento = [
    {
        value: 0,
        label: "Nenhum"
    },
    {
        value: 1,
        label: "Férias"
    },
    {
        value: 2,
        label: "Atestado"
    }
]

//Escala
export const TipoEscalaCores = [
    {
        color: '#a8ccff',
        label: 'Abertas',
        value: 'Abertas'
    },
    {
        color: '#06ad17',
        label: 'Executadas',
        value: 'Executadas'
    },
    {
        color: '#E90000',
        label: 'Canceladas',
        value: 'Canceladas'
    }
]

export const Enum_StatusEscalas = {
    Cancelado: 0,
    Aberta: 1,
    Executada: 2
}

export const Lista_StatusEscala = [
    {
        label: 'Cancelada',
        value: Enum_StatusEscalas.Cancelado
    },
    {
        label: 'Em Aberto',
        value: Enum_StatusEscalas.Aberta
    },
    {
        label: 'Executada',
        value: Enum_StatusEscalas.Executada
    }
]

export const List_StatusOperacional = [
    {
        value: 0,
        label: "Nenhum"
    },
    {
        value: 1,
        label: "Férias"
    },
    {
        value: 2,
        label: "Atestado"
    },
    {
        value: 3,
        label: "Pátio"
    },
    {
        value: 4,
        label: "Banco de horas"
    }
]

//Agendamento
export const Enum_StatusAgendamentos = {
    Agendado: 1,
    Confirmado: 2,
    Viagem: 3,
    Manutencao: 4
}

export const List_StatusAgendamentos = [
    {
        label: 'Agendado',
        value: Enum_StatusAgendamentos.Agendado
    },
    {
        label: 'Confirmado',
        value: Enum_StatusAgendamentos.Confirmado
    },
    {
        label: 'Viagem',
        value: Enum_StatusAgendamentos.Viagem
    },
    {
        label: 'Manutenção',
        value: Enum_StatusAgendamentos.Manutencao
    }
]

export const List_CoresStatusAgendamentos = [
    {
        value: 1,
        color: "#ffb82b"
    },
    {
        value: 2,
        color: "#29C770"
    },
    {
        value: 3,
        color: "#3174ad"
    },
    {
        value: 4,
        color: "#EA5556"
    }
]

//Cliente
export const Enum_StatusHistoricoContato = {
    Novo: 1,
    Retornar: 2,
    Finalizado: 3
}


//Medicao
export const Enum_StatusPrecificacao = {
    Cancelado: 3,
    EmAberto: 0,
    Precificada: 1,
    EmMedicao: 2,
    Todos: 4,
    ForaPeriodo: 5
}

export const Enum_TipoPrecificacao = {
    Servico:1,
    Hora:2
}

export const List_StatusPrecificacao = [{ value: Enum_StatusPrecificacao.EmAberto, label: 'Em aberto' }, { value: Enum_StatusPrecificacao.Precificada, label: 'Precificada' }, { value: Enum_StatusPrecificacao.EmMedicao, label: 'Em medição'}, { value: Enum_StatusPrecificacao.ForaPeriodo, label: 'Fora do período'}]

export const Enum_StatusMedicao = {
    Cancelado: 0,
    EmAberto: 1,
    Conferencia: 2,
    Validada: 3,
    EmAprovacao: 4,
    Aprovada: 5,
    AprovadaParcialmente: 6,
    Reprovada: 7,
    Todos: 8,
    Atrasado: 9
}

export const List_StatusMedicao = [{value:Enum_StatusMedicao.EmAberto, label:'Em aberto' }, {value:Enum_StatusMedicao.Conferencia, label:'Em conferencia' }, {value:Enum_StatusMedicao.Validada, label:'Validado' }, {value:Enum_StatusMedicao.EmAprovacao, label:'Aguardando aprovação do cliente' }, {value:Enum_StatusMedicao.AprovadaParcialmente, label:'Aprovado parcialmente' }, {value:Enum_StatusMedicao.Atrasado, label:'Atrasado' }]

export const Enum_MedicoesFinalizadas = {
    SemAtraso:1,
    ComAtraso:2,
    Todos:3
}

export const TipoMedicoesFinalizadasCores = [
    {
        color: '#FFFB84',
        label: 'Em_Aberto',
        value: Enum_StatusMedicao.EmAberto
    },
    {
        color: '#D66BFC',
        label: 'Em_Conferencia',
        value: Enum_StatusMedicao.Conferencia
    },
    {
        color: '#10FF50',
        label: 'Validado',
        value: Enum_StatusMedicao.Validada
    },
    {
        color: '#54B7EA',
        label: 'Aguardando_Aprovação',
        value: Enum_StatusMedicao.Aprovada
    },
    {
        color: '#82868B',
        label: 'Aprovado_Parcialmente',
        value: Enum_StatusMedicao.AprovadaParcialmente
    },
    {
        color: '#FF0000',
        label: 'Atrasado',
        value: Enum_StatusMedicao.Atrasado
    },
]

export const List_MedicoesFinalizadas = [{value:Enum_MedicoesFinalizadas.SemAtraso, label:'Aprovada no Prazo' }, {value:Enum_MedicoesFinalizadas.ComAtraso, label:'Aprovada com Atraso' }, ]

export const Lista_TiposHoraAdicional = [
    {
        label: 'Adicional noturno',
        value: 1
    },
    {
        label: 'Feriado',
        value: 2
    },
    {
        label: 'Final de semana',
        value: 3
    },
]

//Faturamento
export const Enum_StatusFaturamento = {
    Cancelado: 0,
    EmAberto: 1,
    Emitido: 2,
    Processando: 3,
    Falha: 4,
    Enviado: 5,
    Todos: 6
}

export const List_StatusFaturamento = [{value:Enum_StatusFaturamento.EmAberto, label:'Em aberto' }, {value:Enum_StatusFaturamento.Processando, label:'Processando' }, {value:Enum_StatusFaturamento.Falha, label:'Falha ao emitir' }, {value:Enum_StatusFaturamento.Emitido, label:'Emitido' }, {value:Enum_StatusFaturamento.Enviado, label:'Enviado' }]

//Contas a receber
export const Enum_StatusContasAReceber = {
    Cancelado: 0,
    EmAberto: 1,
    Pendente: 2,
    RecebidoParcial: 3,
    Recebido: 4,
    EmCorrecao: 5,
    Todos: 6
}

export const List_StatusContasAReceber = [{value:Enum_StatusContasAReceber.EmCorrecao, label:'Contas em Correção' }]

export const Enum_StatusParcelaReceber = {
    Pendente: 0,
    Parcial: 1,
    Recebido: 2,
    Todos: 3,
    RecebidoComAtraso: 4
}

export const List_StatusParcelaReceber = [{value:Enum_StatusParcelaReceber.Pendente, label:'Recebimento Pendente' }, {value:Enum_StatusParcelaReceber.Parcial, label:'Recebimento Parcial' }]

export const List_StatusContasRecebidos = [{value: Enum_StatusParcelaReceber.RecebidoComAtraso, label:'Recebidos em atraso' }, {value:Enum_StatusParcelaReceber.Parcial, label:'Recebimento Parcial' }]

export const List_TiposFatura = [
    {
        label: 'RL',
        value: 'RL'
    },
    {
        label: 'NF',
        value: 'NF'
    },
    {
        label: 'CTE',
        value: 'CTE'
    }
]