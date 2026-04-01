import { matchSorter } from "match-sorter"
import { formatNumberReal } from "../../../../../utility/number"

const columnsSimplificado = [
  {
    Header: "Código",
    accessor: "Codigo",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Codigo"] })
  },
  {
    Header: "Revisão",
    accessor: "Revisao",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Revisao"] })
  },
  {
    Header: "Empresa",
    accessor: 'Empresa',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
  },
  {
    Header: "Cliente",
    accessor: 'Cliente',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
  },
  {
    Header: "Contato",
    accessor: 'Contato',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Contato"] })
  },
  {
    Header: "Vendedor",
    accessor: "Vendedor",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Vendedor"] })
  },
  {
    Header: "Data",
    id: "Data",
    accessor: (value) => value.Data === '-' || value.Data,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Data"] })
  },
  {
    Header: "Vencimento",
    id: "Vencimento",
    accessor: (value) => value.Vencimento === '-' || value.Vencimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Vencimento"] })
  },
  {
    Header: "Valor",
    id: "Valor",
    accessor: (value) => formatNumberReal(value.Valor) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Valor"] })
  },
  {
    Header: "Status",
    accessor: "Status",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Status"] })
  }
]

const getHeader = (relatorio) => {
  switch (relatorio) {
    case 'relatorio-simplificado': return columnsSimplificado
    // case 'relatorio-detalhado': return columnsContasAPagarDetalhado
    // case 'relatorio-pagas-periodo': return columnsContasPagasPorPeriodo
    // case 'relatorio-competencia': return columnsContasAPagarPorCompetencia
    // case 'relatorio-atraso': return columnsContasAPagarEmAtraso
  }
}

export {
  getHeader
}