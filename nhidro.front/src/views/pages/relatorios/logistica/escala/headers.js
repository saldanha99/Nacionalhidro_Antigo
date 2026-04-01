import { matchSorter } from "match-sorter"

const columnsSimplificado = [
  {
    Header: "ID",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Data",
    id: "Data",
    accessor: (value) => value.Data === '-' || value.Data,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Data"] })
  },
  {
    Header: "Hora",
    accessor: 'Hora',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Hora"] })
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
    Header: "Equipamento",
    accessor: 'Equipamento',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Equipamento"] })
  },
  {
    Header: "Veículos",
    accessor: "Veiculos",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Veiculos"] })
  },
  {
    Header: "Funcionários",
    accessor: "Funcionarios",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Funcionarios"] })
  },
  {
    Header: "Observações",
    accessor: "Observacoes",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
  },
  {
    Header: "Ordem Serviço",
    accessor: "OrdemServico",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["OrdemServico"] })
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
    Header: "Funcionário",
    id: "Funcionario",
    accessor: "Funcionario",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Funcionario"] })
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
    Header: "CNPJ Cliente",
    accessor: 'Cnpj',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cnpj"] })
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