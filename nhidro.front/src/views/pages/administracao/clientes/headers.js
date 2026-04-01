import { matchSorter } from "match-sorter"
import { formatNumberReal } from "../../../../utility/number"

const columns = [
  {
    Header: "CÓDIGO",
    accessor: "Codigo",
    filterAll: true,
    width: 120,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Codigo"] })
  },
  {
    Header: "REVISÃO",
    id: 'Revisao',
    accessor: "Revisao",
    filterable: false,
    width: 120,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Revisao"] }),
    Cell: (row) => {
      return (
        <span>{row?.original?.Revisao > 0 ? row?.original?.Revisao : "Não Revisado".toUpperCase()}</span>
      )
    }
  },
  {
    Header: "CLIENTE",
    id: "Cliente",
    accessor: (value) => value.Cliente.RazaoSocial || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
  },
  {
    Header: "VENDEDOR",
    id: "Usuario",
    accessor: (value) => value.Usuario?.username?.toUpperCase(),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Usuario"] })
  },
  {
    Header: "DATA DE GERAÇÃO",
    id: "DataProposta",
    accessor: (value) => value.DataProposta === '-' || moment(value.DataProposta).local().format("DD/MM/YYYY"),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataProposta"] })
  },
  {
    Header: "VALIDADE",
    id: "DataValidade",
    accessor: (value) => value.DataValidade === '-' || moment(value.DataValidade).local().format("DD/MM/YYYY"),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataValidade"] })
  },
  {
    Header: "VALOR",
    id: "Valor",
    accessor: (value) => formatNumberReal(value?.Valor) || '-',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Valor"] })
  }
]

const getHeader = (relatorio) => {
  switch (relatorio) {
    case 'relatorio-simplificado': return columns
  }
}

export {
  getHeader
}