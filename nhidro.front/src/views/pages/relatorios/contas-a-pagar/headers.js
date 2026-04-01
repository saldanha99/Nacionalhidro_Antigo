import { matchSorter } from "match-sorter"
import { formatNumberReal } from "../../../../utility/number"

const columnsContasAPagarSimplificado = [
  {
    Header: "Conta ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Empresa Pagadora",
    accessor: "Empresa",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
  },
  {
    Header: "Nome Fantasia Fornecedor",
    id: 'RazaoFornecedor',
    accessor: (value) => value.FantasiaFornecedor ?? value.RazaoFornecedor,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["FantasiaFornecedor", "RazaoFornecedor"] })
  },
  {
    Header: "Nº NF",
    accessor: "NumeroNF",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroNF"] })
  },
  {
    Header: "Data Emissão NF",
    id: "DataEmissaoNF",
    accessor: (value) => value.DataEmissaoNF === '-' || value.DataEmissaoNF,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissaoNF"] })
  },
  {
    Header: "Vencimento",
    id: "Vencimento",
    accessor: (value) => value.Vencimento === '-' || value.Vencimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Vencimento"] })
  },
  {
    Header: "Data de Pagamento",
    id: "VencimentoReal",
    accessor: (value) => value.VencimentoReal === '-' || value.VencimentoReal,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["VencimentoReal"] })
  },
  {
    Header: "Valor Parcela",
    id: "ValorParcela",
    accessor: (value) => formatNumberReal(value.ValorParcela) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorParcela"] })
  },
  {
    Header: "Valor Acréscimo(R$)",
    id: "ValorAcrescimo",
    accessor: (value) => formatNumberReal(value.ValorAcrescimo) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorAcrescimo"] })
  },
  {
    Header: "Valor Decréscimo(R$)",
    id: "ValorDecrescimo",
    accessor: (value) => formatNumberReal(value.ValorDecrescimo) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorDecrescimo"] })
  },
  {
    Header: "Valor à pagar(R$)",
    id: "ValorAPagar",
    accessor: (value) => formatNumberReal(value.ValorAPagar) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorAPagar"] })
  },
  {
    Header: "Parcela",
    accessor: "NumeroParcela",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroParcela"] })
  },
  {
    Header: "Status Pagamento",
    accessor: "StatusPagamento",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["StatusPagamento"] })
  }
]

const columnsContasAPagarDetalhado = [
  {
    Header: "Conta ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Empresa Pagadora",
    accessor: "Empresa",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
  },
  {
    Header: "Nome Fantasia Fornecedor",
    id: 'RazaoFornecedor',
    accessor: (value) => value.FantasiaFornecedor ?? value.RazaoFornecedor,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["FantasiaFornecedor", "RazaoFornecedor"] })
  },
  {
    Header: "Nº NF",
    accessor: "NumeroNF",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroNF"] })
  },
  {
    Header: "Data Emissão NF",
    id: "DataEmissaoNF",
    accessor: (value) => value.DataEmissaoNF === '-' || value.DataEmissaoNF,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissaoNF"] })
  },
  {
    Header: "Vencimento",
    id: "Vencimento",
    accessor: (value) => value.Vencimento === '-' || value.Vencimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Vencimento"] })
  },
  {
    Header: "Data de Pagamento",
    id: "VencimentoReal",
    accessor: (value) => value.VencimentoReal === '-' || value.VencimentoReal,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["VencimentoReal"] })
  },
  {
    Header: "Valor Parcela",
    id: "ValorParcela",
    accessor: (value) => formatNumberReal(value.ValorParcela) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorParcela"] })
  },
  {
    Header: "Valor Acréscimo(R$)",
    id: "ValorAcrescimo",
    accessor: (value) => formatNumberReal(value.ValorAcrescimo) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorAcrescimo"] })
  },
  {
    Header: "Valor Decréscimo(R$)",
    id: "ValorDecrescimo",
    accessor: (value) => formatNumberReal(value.ValorDecrescimo) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorDecrescimo"] })
  },
  {
    Header: "Valor à pagar(R$)",
    id: "ValorAPagar",
    accessor: (value) => formatNumberReal(value.ValorAPagar) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorAPagar"] })
  },
  {
    Header: "Parcela",
    accessor: "NumeroParcela",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroParcela"] })
  },
  {
    Header: "Natureza Contábil",
    accessor: "ContaNaturezaContabil",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ContaNaturezaContabil"] })
  },
  {
    Header: "Valor Natureza Contábil",
    id: "ValorNatureza",
    accessor: (value) => parseFloat(value.ValorNatureza).toFixed(2),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorNatureza"] })
  },
  {
    Header: "Centro de custo",
    accessor: "ContaCentroCusto",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ContaCentroCusto"] })
  },
  {
    Header: "Valor Centro de custo",
    id: 'ValorCentroCusto',
    accessor: (value) => parseFloat(value.ValorCentroCusto).toFixed(2),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorCentroCusto"] })
  },
  {
    Header: "Cliente CC",
    accessor: "Cliente",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
  },
  {
    Header: "Status Pagamento",
    accessor: "StatusPagamento",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["StatusPagamento"] })
  }
]

const columnsContasPagasPorPeriodo = [
  {
    Header: "Conta ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Empresa Pagadora",
    accessor: "Empresa",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
  },
  {
    Header: "Nome Fantasia Fornecedor",
    id: 'RazaoFornecedor',
    accessor: (value) => value.FantasiaFornecedor ?? value.RazaoFornecedor,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["FantasiaFornecedor", "RazaoFornecedor"] })
  },
  {
    Header: "Nº NF",
    accessor: "NumeroNF",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroNF"] })
  },
  {
    Header: "Data Emissão NF",
    id: "DataEmissaoNF",
    accessor: (value) => value.DataEmissaoNF === '-' || value.DataEmissaoNF,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissaoNF"] })
  },
  {
    Header: "Vencimento",
    id: "Vencimento",
    accessor: (value) => value.Vencimento === '-' || value.Vencimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Vencimento"] })
  },
  {
    Header: "Data de Pagamento",
    id: "VencimentoReal",
    accessor: (value) => value.VencimentoReal === '-' || value.VencimentoReal,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["VencimentoReal"] })
  },
  {
    Header: "Valor Pago",
    id: "ValorPago",
    accessor: (value) => formatNumberReal(value.ValorPago) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorPago"] })
  },
  {
    Header: "Valor Acréscimo(R$)",
    id: "ValorAcrescimo",
    accessor: (value) => formatNumberReal(value.ValorAcrescimo) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorParcela"] })
  },
  {
    Header: "Valor Decréscimo(R$)",
    id: "ValorDecrescimo",
    accessor: (value) => formatNumberReal(value.ValorDecrescimo) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorDecrescimo"] })
  },
  {
    Header: "Valor à pagar(R$)",
    id: "ValorAPagar",
    accessor: (value) => formatNumberReal(value.ValorAPagar) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorAPagar"] })
  },
  {
    Header: "Parcela",
    accessor: "NumeroParcela",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroParcela"] })
  },
  {
    Header: "Banco de Pagamento",
    accessor: "EmpresaBanco",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["EmpresaBanco"] })
  },
  {
    Header: "Naturezas Contábeis",
    accessor: "ContaNaturezasContabeis",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ContaNaturezasContabeis"] })
  },
  {
    Header: "Status Pagamento",
    accessor: "StatusPagamento",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["StatusPagamento"] })
  }
]

const columnsContasAPagarPorCompetencia = [
  {
    Header: "Conta ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Empresa Pagadora",
    accessor: "Empresa",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
  },
  {
    Header: "Nome Fantasia Fornecedor",
    id: 'RazaoFornecedor',
    accessor: (value) => value.FantasiaFornecedor ?? value.RazaoFornecedor,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["FantasiaFornecedor", "RazaoFornecedor"] })
  },
  {
    Header: "Nº NF",
    accessor: "NumeroNF",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroNF"] })
  },
  {
    Header: "Data Emissão NF",
    id: "DataEmissaoNF",
    accessor: (value) => value.DataEmissaoNF === '-' || value.DataEmissaoNF,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissaoNF"] })
  },
  {
    Header: "Valor Compra",
    id: "ValorBruto",
    accessor: (value) => formatNumberReal(value.ValorBruto) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorBruto"] })
  },
  {
    Header: "Qtd. Parcelas",
    accessor: "QuantidadeParcela",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["QuantidadeParcela"] })
  },
  {
    Header: "Observações",
    accessor: "Observacoes",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
  },
  {
    Header: "Status",
    accessor: "Status",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Status"] })
  }
]

const columnsContasAPagarPorCompetenciaCentro = [
  {
    Header: "Conta ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Empresa Pagadora",
    accessor: "Empresa",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
  },
  {
    Header: "Fantasia Fornecedor",
    id: 'RazaoFornecedor',
    accessor: (value) => value.FantasiaFornecedor ?? value.RazaoFornecedor,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["FantasiaFornecedor", "RazaoFornecedor"] })
  },
  {
    Header: "Nº NF",
    accessor: "NumeroNF",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroNF"] })
  },
  {
    Header: "Data Emissão NF",
    id: "DataEmissaoNF",
    accessor: (value) => value.DataEmissaoNF === '-' || value.DataEmissaoNF,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissaoNF"] })
  },
  {
    Header: "Centro de custo",
    accessor: "ContaCentroCusto",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ContaCentroCusto"] })
  },
  {
    Header: "Cliente CC",
    accessor: "Cliente",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
  },
  {
    Header: "Observações",
    accessor: "Observacoes",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
  },
  {
    Header: "Valor Centro de custo",
    id: "ValorCentroCusto",
    accessor: (value) => formatNumberReal(value.ValorCentroCusto) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorCentroCusto"] })
  },
  {
    Header: "Valor Bruto",
    id: "ValorBruto",
    accessor: (value) => formatNumberReal(value.ValorBruto) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorBruto"] })
  },
  {
    Header: "Qtd. Parcelas",
    accessor: "QuantidadeParcela",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["QuantidadeParcela"] })
  },
  {
    Header: "Status",
    accessor: "Status",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Status"] })
  }
]

const columnsContasAPagarPorCompetenciaNatureza = [
  {
    Header: "Conta ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Empresa Pagadora",
    accessor: "Empresa",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
  },
  {
    Header: "Fantasia Fornecedor",
    id: 'RazaoFornecedor',
    accessor: (value) => value.FantasiaFornecedor ?? value.RazaoFornecedor,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["FantasiaFornecedor", "RazaoFornecedor"] })
  },
  {
    Header: "Nº NF",
    accessor: "NumeroNF",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroNF"] })
  },
  {
    Header: "Data Emissão NF",
    id: "DataEmissaoNF",
    accessor: (value) => value.DataEmissaoNF === '-' || value.DataEmissaoNF,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissaoNF"] })
  },
  {
    Header: "Natureza Contábil",
    accessor: "ContaNaturezaContabil",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ContaNaturezaContabil"] })
  },
  {
    Header: "Cliente CC",
    accessor: "Cliente",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
  },
  {
    Header: "Observações",
    accessor: "Observacoes",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
  },
  {
    Header: "Valor Natureza Contábil",
    id: "ValorNatureza",
    accessor: (value) => formatNumberReal(value.ValorNatureza) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorNatureza"] })
  },
  {
    Header: "Valor Bruto",
    id: "ValorBruto",
    accessor: (value) => formatNumberReal(value.ValorBruto) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorBruto"] })
  },
  {
    Header: "Qtd. Parcelas",
    accessor: "QuantidadeParcela",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["QuantidadeParcela"] })
  },
  {
    Header: "Status",
    accessor: "Status",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Status"] })
  }
]

const columnsContasAPagarEmAtraso = [
  {
    Header: "Conta ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Empresa Pagadora",
    accessor: "Empresa",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
  },
  {
    Header: "Nome Fantasia Fornecedor",
    id: 'RazaoFornecedor',
    accessor: (value) => value.FantasiaFornecedor ?? value.RazaoFornecedor,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["FantasiaFornecedor", "RazaoFornecedor"] })
  },
  {
    Header: "Nº NF",
    accessor: "NumeroNF",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroNF"] })
  },
  {
    Header: "Data Emissão NF",
    id: "DataEmissaoNF",
    accessor: (value) => value.DataEmissaoNF === '-' || value.DataEmissaoNF,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissaoNF"] })
  },
  {
    Header: "Vencimento",
    id: "Vencimento",
    accessor: (value) => value.Vencimento === '-' || value.Vencimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Vencimento"] })
  },
  {
    Header: "Data de Pagamento",
    id: "VencimentoReal",
    accessor: (value) => value.VencimentoReal === '-' || value.VencimentoReal,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["VencimentoReal"] })
  },
  {
    Header: "Valor Parcela",
    id: "ValorParcela",
    accessor: (value) => formatNumberReal(value.ValorParcela) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorParcela"] })
  },
  {
    Header: "Valor Acréscimo(R$)",
    id: "ValorAcrescimo",
    accessor: (value) => formatNumberReal(value.ValorAcrescimo) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorParcela"] })
  },
  {
    Header: "Valor Decréscimo(R$)",
    id: "ValorDecrescimo",
    accessor: (value) => formatNumberReal(value.ValorDecrescimo) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorDecrescimo"] })
  },
  {
    Header: "Valor à pagar(R$)",
    id: "ValorAPagar",
    accessor: (value) => formatNumberReal(value.ValorAPagar) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorAPagar"] })
  },
  {
    Header: "Parcela",
    accessor: "NumeroParcela",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroParcela"] })
  },
  {
    Header: "Dias em Atraso",
    accessor: "QtdDiasAtraso",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["QtdDiasAtraso"] })
  }
]

const getHeader = (relatorio) => {
  switch (relatorio) {
    case 'relatorio-simplificado': return columnsContasAPagarSimplificado
    case 'relatorio-detalhado': return columnsContasAPagarDetalhado
    case 'relatorio-pagas-periodo': return columnsContasPagasPorPeriodo
    case 'relatorio-competencia': return columnsContasAPagarPorCompetencia
    case 'relatorio-competencia-centro': return columnsContasAPagarPorCompetenciaCentro
    case 'relatorio-competencia-natureza': return columnsContasAPagarPorCompetenciaNatureza
    case 'relatorio-atraso': return columnsContasAPagarEmAtraso
  }
}

export {
  getHeader
}