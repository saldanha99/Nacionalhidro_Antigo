import { matchSorter } from "match-sorter"
import { formatNumberReal } from "../../../../../utility/number"

const columnsSimplificado = [
  {
    Header: "Status",
    id: "status",
    accessor: "status",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["status"] })
  },
  {
    Header: "Nº Medição",
    id: 'codigo',
    accessor: "codigo",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["codigo"] })
  },
  {
    Header: "Revisão",
    id: "revisao",
    accessor: (value) => value.revisao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["revisao"] }),
  },
  {
    Header: "Data Criação",
    id: 'data_criacao',
    accessor: (value) => value.data_criacao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_criacao"] })
  },
  {
    Header: "Empresa",
    id: 'empresa',
    accessor: 'empresa',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["empresa"] })
  },
  {
    Header: "Cód. Cliente",
    id: 'cliente_id',
    accessor: 'cliente_id',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["cliente_id"] })
  },
  {
    Header: "Cliente",
    id: 'cliente',
    accessor: 'cliente',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["cliente"] })
  },
  {
    Header: "Contato",
    id: 'contato',
    accessor: 'contato',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["contato"] })
  },
  {
    Header: "Solicitante",
    id: 'solicitante',
    accessor: 'solicitante',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["solicitante"] })
  },
  {
    Header: "Total Serviços",
    id: "total_servicos",
    accessor: (value) => formatNumberReal(value.total_servicos),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["total_servicos"] }),
  },
  {
    Header: "Descontos",
    id: "desconto",
    accessor: (value) => formatNumberReal(value.desconto),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["desconto"] }),
  },
  {
    Header: "Acrescimos",
    id: "adicional",
    accessor: (value) => formatNumberReal(value.adicional),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["adicional"] }),
  },
  {
    Header: "Valor Total",
    id: "valor_total",
    accessor: (value) => formatNumberReal(value.valor_total),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_total"] }),
  },
  {
    Header: "Rateio",
    id: "rateio",
    accessor: (value) => value.rateio,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["rateio"] }),
  },
  {
    Header: "Vendedor Resp.",
    id: "vendedor",
    accessor: (value) => value.vendedor,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["vendedor"] }),
  },
  {
    Header: "Aprov. Interna",
    id: 'data_aprovacao_interna',
    accessor: (value) => value.data_aprovacao_interna,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_aprovacao_interna"] })
  },
  {
    Header: "Cobrança Enviada",
    id: "data_cobranca",
    accessor: (value) => value.data_cobranca,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_cobranca"] }),
  },
  {
    Header: "Aprov. Cliente",
    id: "data_aprovacao",
    accessor: (value) => value.data_aprovacao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_aprovacao"] }),
  },
  {
    Header: "Dias em aberto",
    id: "dias_aberto",
    accessor: (value) => value.dias_aberto,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["dias_aberto"] }),
  },
  {
    Header: "Data Cancelamento",
    id: "data_cancelamento",
    accessor: "data_cancelamento",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_cancelamento"] }),
  },
  {
    Header: "MotivoCancelamento",
    id: "motivo_cancelamento",
    accessor: 'motivo_cancelamento',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["motivo_cancelamento"] }),
  }
]

const getHeader = (relatorio) => {
  switch (relatorio) {
    case 'relatorio-simplificado': return columnsSimplificado
  }
}

export {
  getHeader
}