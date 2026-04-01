import { matchSorter } from "match-sorter"

const columnsSimplificado = [
  {
    Header: "ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Código O.S.",
    accessor: "Codigo",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Codigo"] })
  },
  {
    Header: "Proposta",
    accessor: "Proposta",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Proposta"] })
  },
  {
    Header: "Data",
    id: "Data",
    accessor: (value) => value.Data === '-' || value.Data,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Data"] })
  },
  {
    Header: "Cliente",
    accessor: 'Cliente',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
  },
  {
    Header: "CNPJ",
    accessor: 'Cnpj',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cnpj"] })
  },
  {
    Header: "Empresa",
    accessor: 'Empresa',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
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

const columnsFuncionario = [
  {
    Header: "ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Funcionário",
    id: "Funcionario",
    accessor: "Funcionario",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Funcionario"] })
  },
  {
    Header: "Código O.S.",
    accessor: "Codigo",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Codigo"] })
  },
  {
    Header: "Proposta",
    accessor: "Proposta",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Proposta"] })
  },
  {
    Header: "Data",
    id: "Data",
    accessor: (value) => value.Data === '-' || value.Data,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Data"] })
  },
  {
    Header: "Cliente",
    accessor: 'Cliente',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
  },
  {
    Header: "CNPJ",
    accessor: 'Cnpj',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cnpj"] })
  },
  {
    Header: "Empresa",
    accessor: 'Empresa',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
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
  },
  {
    Header: "Data Baixa",
    id: "DataBaixa",
    accessor: (value) => value.DataBaixa === '-' || value.DataBaixa,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataBaixa"] })
  },
  {
    Header: "Usuário Baixa",
    accessor: "UsuarioBaixa",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["UsuarioBaixa"] })
  }
]

const getHeader = (relatorio) => {
  switch (relatorio) {
    case 'relatorio-simplificado': return columnsSimplificado
    case 'relatorio-funcionario': return columnsFuncionario
    // case 'relatorio-pagas-periodo': return columnsContasPagasPorPeriodo
    // case 'relatorio-competencia': return columnsContasAPagarPorCompetencia
    // case 'relatorio-atraso': return columnsContasAPagarEmAtraso
  }
}

export {
  getHeader
}