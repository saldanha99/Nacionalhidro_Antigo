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
    id: 'medicao',
    accessor: "medicao",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["medicao"] })
  },
  {
    Header: "Rev. Medição",
    id: "medicao_revisao",
    accessor: (value) => value.medicao_revisao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["medicao_revisao"] }),
  },
  {
    Header: "Nº Fat",
    id: "nota",
    accessor: (value) => value.nota,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["nota"] }),
  },
  {
    Header: "Tipo Fatura",
    id: "tipo_fatura",
    accessor: (value) => value.tipo_fatura,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["tipo_fatura"] }),
  },
  {
    Header: "Data Emissão",
    id: 'data_emissao',
    accessor: (value) => value.data_emissao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_emissao"] })
  },
  {
    Header: "Empresa",
    id: 'empresa',
    accessor: 'empresa',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["empresa"] })
  },
  {
    Header: "Cód Cliente",
    id: 'cliente_id',
    accessor: 'cliente_id',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["cliente_id"] })
  },
  {
    Header: "CNPJ Cliente",
    id: 'cliente_cnpj',
    accessor: 'cliente_cnpj',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["cliente_cnpj"] })
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
    Header: "Valor Medição",
    id: "valor_total",
    accessor: (value) => formatNumberReal(value.valor_total),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_total"] }),
  },
  {
    Header: "Aprovação Cliente",
    id: 'data_aprovacao',
    accessor: (value) => value.data_aprovacao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_aprovacao"] })
  },
  {
    Header: "Valor Bruto",
    id: "valor_rateado",
    accessor: (value) => formatNumberReal(value.valor_rateado),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_rateado"] }),
  },
  {
    Header: "Valor ISS",
    id: "valor_iss",
    accessor: (value) => formatNumberReal(value.valor_iss),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_iss"] }),
  },
  {
    Header: "Valor INSS",
    id: "valor_inss",
    accessor: (value) => formatNumberReal(value.valor_inss),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_inss"] }),
  },
  {
    Header: "Valor PIS",
    id: "valor_pis",
    accessor: (value) => formatNumberReal(value.valor_pis),
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["valor_pis"] }),
  },
  {
    Header: "Valor COFINS",
    id: "valor_cofins",
    accessor: (value) => formatNumberReal(value.valor_cofins),
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["valor_cofins"] }),
  },
  {
    Header: "Valor IR",
    id: "valor_ir",
    accessor: (value) => formatNumberReal(value.valor_ir),
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["valor_ir"] }),
  },
  {
    Header: "Valor CSLL",
    id: "valor_csll",
    accessor: (value) => formatNumberReal(value.valor_csll),
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["valor_csll"] }),
  },
  {
    Header: "Valor Líquido",
    id: "valor_liquido",
    accessor: (value) => formatNumberReal(value.valor_liquido),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_liquido"] }),
  },
  {
    Header: "Cobrança Enviada",
    id: "data_envio",
    accessor: (value) => value.data_envio,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_envio"] }),
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