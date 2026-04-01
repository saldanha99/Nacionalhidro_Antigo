import { matchSorter } from "match-sorter"
import { convertDateFormat, dateSort } from "../../../../../utility/date/date";
import { formatNumberReal } from "../../../../../utility/number";

const columnsSimplificado = [
  {
    Header: "Status",
    id: "status_recebimento",
    accessor: "status_recebimento",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["status_recebimento"] })
  },
  {
    Header: "ID",
    id: 'conta',
    accessor: "conta",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["conta"] })
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
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
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
    Header: "Vencimento",
    id: 'data_vencimento',
    accessor: (value) => value.data_vencimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Valor Líquido",
    id: "valor_parcela",
    accessor: (value) => formatNumberReal(value.valor_parcela),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_parcela"] }),
  },
  {
    Header: "Acréscimo",
    id: "valor_acrescimo",
    accessor: (value) => formatNumberReal(value.valor_acrescimo),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_acrescimo"] }),
  },
  {
    Header: "Decréscimo",
    id: "valor_decrescimo",
    accessor: (value) => formatNumberReal(value.valor_decrescimo),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_decrescimo"] }),
  },
  {
    Header: "Valor Recebido",
    id: "valor_recebido",
    accessor: (value) => formatNumberReal(value.valor_recebido),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_recebido"] }),
  },
  {
    Header: "A Receber",
    id: "valor_a_receber",
    accessor: (value) => formatNumberReal(value.valor_a_receber),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_a_receber"] }),
  },
  {
    Header: "Nº Parcela",
    id: 'parcela',
    accessor: (value) => value.parcela,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["parcela"] })
  },
  {
    Header: "Dt Recebimento",
    id: 'data_vencimento_real',
    accessor: (value) => value.data_vencimento_real,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_vencimento_real"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Tipo Inserção",
    id: "insercao_manual",
    accessor: (value) => value.insercao_manual,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["insercao_manual"] }),
  }
]

const columnsRecebidas = [
  {
    Header: "Status",
    id: "status_recebimento",
    accessor: "status_recebimento",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["status_recebimento"] })
  },
  {
    Header: "ID",
    id: 'conta',
    accessor: "conta",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["conta"] })
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
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
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
    Header: "Vencimento",
    id: 'data_vencimento',
    accessor: (value) => value.data_vencimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Valor Líquido",
    id: "valor_parcela",
    accessor: (value) => formatNumberReal(value.valor_parcela),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_parcela"] }),
  },
  {
    Header: "Acréscimo",
    id: "valor_acrescimo",
    accessor: (value) => formatNumberReal(value.valor_acrescimo),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_acrescimo"] }),
  },
  {
    Header: "Decréscimo",
    id: "valor_decrescimo",
    accessor: (value) => formatNumberReal(value.valor_decrescimo),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_decrescimo"] }),
  },
  {
    Header: "Valor Recebido",
    id: "valor_recebido",
    accessor: (value) => formatNumberReal(value.valor_recebido),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_recebido"] }),
  },
  {
    Header: "A Receber",
    id: "valor_a_receber",
    accessor: (value) => formatNumberReal(value.valor_a_receber),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_a_receber"] }),
  },
  {
    Header: "Nº Parcela",
    id: 'parcela',
    accessor: (value) => value.parcela,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["parcela"] })
  },
  {
    Header: "Dt Recebimento",
    id: 'data_recebimento',
    accessor: (value) => value.data_recebimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_recebimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "DDL Real",
    id: 'dias_aberto',
    accessor: (value) => value.dias_aberto,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["dias_aberto"] })
  },
  {
    Header: "Banco",
    id: "empresa_banco",
    accessor: (value) => value.empresa_banco,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["empresa_banco"] }),
  },
  {
    Header: "Tipo Inserção",
    id: "insercao_manual",
    accessor: (value) => value.insercao_manual,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["insercao_manual"] }),
  }
]

const columnsCompetencia = [
  {
    Header: "Status",
    id: "status",
    accessor: "status",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["status"] })
  },
  {
    Header: "ID",
    id: 'id',
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
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
    accessor: 'data_emissao',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
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
    Header: "Vencimento",
    id: 'data_vencimento',
    accessor: 'data_vencimento',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Valor Bruto",
    id: "valor_bruto",
    accessor: (value) => formatNumberReal(value.valor_bruto),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_bruto"] }),
  },
  {
    Header: "Valor Líq.",
    id: "valor_total",
    accessor: (value) => formatNumberReal(value.valor_total),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_total"] }),
  },
  {
    Header: "Nº Parcelas",
    id: 'quantidade_parcela',
    accessor: (value) => value.quantidade_parcela,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["quantidade_parcela"] })
  },
  {
    Header: "Observação",
    id: 'observacoes',
    accessor: (value) => value.observacoes,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["observacoes"] })
  },
  {
    Header: "Tipo Inserção",
    id: "insercao_manual",
    accessor: (value) => value.insercao_manual,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["insercao_manual"] }),
  }
]

const columnsCentro = [
  {
    Header: "Status",
    id: "status",
    accessor: "status",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["status"] })
  },
  {
    Header: "ID",
    id: 'id',
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
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
    accessor: 'data_emissao',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
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
    Header: "Vencimento",
    id: 'data_vencimento',
    accessor: 'data_vencimento',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Valor Bruto",
    id: "valor_bruto",
    accessor: (value) => formatNumberReal(value.valor_bruto),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_bruto"] }),
  },
  {
    Header: "Valor Líq.",
    id: "valor_total",
    accessor: (value) => formatNumberReal(value.valor_total),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_total"] }),
  },
  {
    Header: "Nº Parcelas",
    id: 'quantidade_parcela',
    accessor: (value) => value.quantidade_parcela,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["quantidade_parcela"] })
  },
  {
    Header: "Centro Custo",
    id: 'centro_custo',
    accessor: (value) => value.centro_custo,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["centro_custo"] })
  },
  {
    Header: "Valor Centro Custo",
    id: 'centro_valor',
    accessor: (value) => formatNumberReal(value.centro_valor),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["centro_valor"] })
  },
  {
    Header: "Observação",
    id: 'observacoes',
    accessor: (value) => value.observacoes,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["observacoes"] })
  },
  {
    Header: "Tipo Inserção",
    id: "insercao_manual",
    accessor: (value) => value.insercao_manual,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["insercao_manual"] }),
  }
]

const columnsNatureza = [
  {
    Header: "Status",
    id: "status",
    accessor: "status",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["status"] })
  },
  {
    Header: "ID",
    id: 'id',
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
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
    accessor: 'data_emissao',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
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
    Header: "Vencimento",
    id: 'data_vencimento',
    accessor: 'data_vencimento',
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Valor Bruto",
    id: "valor_bruto",
    accessor: (value) => formatNumberReal(value.valor_bruto),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_bruto"] }),
  },
  {
    Header: "Valor Líq.",
    id: "valor_total",
    accessor: (value) => formatNumberReal(value.valor_total),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_total"] }),
  },
  {
    Header: "Nº Parcelas",
    id: 'quantidade_parcela',
    accessor: (value) => value.quantidade_parcela,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["quantidade_parcela"] })
  },
  {
    Header: "Natureza C.",
    id: 'natureza_contabil',
    accessor: (value) => value.natureza_contabil,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["natureza_contabil"] })
  },
  {
    Header: "Valor Natureza C.",
    id: 'natureza_valor',
    accessor: (value) => formatNumberReal(value.natureza_valor),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["natureza_valor"] })
  },
  {
    Header: "Observação",
    id: 'observacoes',
    accessor: (value) => value.observacoes,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["observacoes"] })
  },
  {
    Header: "Tipo Inserção",
    id: "insercao_manual",
    accessor: (value) => value.insercao_manual,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["insercao_manual"] }),
  }
]

const columnsAtrasado = [
  {
    Header: "Status",
    id: "status_recebimento",
    accessor: "status_recebimento",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["status_recebimento"] })
  },
  {
    Header: "ID",
    id: 'conta',
    accessor: "conta",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["conta"] })
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
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
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
    Header: "Vencimento",
    id: 'data_vencimento',
    accessor: (value) => value.data_vencimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Valor Parcela",
    id: "valor_parcela",
    accessor: (value) => formatNumberReal(value.valor_parcela),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_parcela"] }),
  },
  {
    Header: "Acréscimo",
    id: "valor_acrescimo",
    accessor: (value) => formatNumberReal(value.valor_acrescimo),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_acrescimo"] }),
  },
  {
    Header: "Decréscimo",
    id: "valor_decrescimo",
    accessor: (value) => formatNumberReal(value.valor_decrescimo),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_decrescimo"] }),
  },
  {
    Header: "Valor Recebido",
    id: "valor_recebido",
    accessor: (value) => formatNumberReal(value.valor_recebido),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_recebido"] }),
  },
  {
    Header: "A Receber",
    id: "valor_a_receber",
    accessor: (value) => formatNumberReal(value.valor_a_receber),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_a_receber"] }),
  },
  {
    Header: "Nº Parcela",
    id: 'parcela',
    accessor: (value) => value.parcela,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["parcela"] })
  },
  {
    Header: "Dt Recebimento",
    id: 'data_vencimento_real',
    accessor: (value) => value.data_vencimento_real,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_vencimento_real"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Dias em Atraso",
    id: "dias_atraso",
    accessor: (value) => value.dias_atraso,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["dias_atraso"] }),
  },
  {
    Header: "Observação",
    id: "observacoes",
    accessor: (value) => value.observacoes,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["observacoes"] }),
  },
  {
    Header: "Tipo Inserção",
    id: "insercao_manual",
    accessor: (value) => value.insercao_manual,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["insercao_manual"] }),
  }
]

const columnsAntecipado = [
  {
    Header: "ID",
    id: 'conta',
    accessor: "conta",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["conta"] })
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
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
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
    Header: "Vencimento",
    id: 'data_vencimento',
    accessor: (value) => value.data_vencimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_vencimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Valor Parcela",
    id: "valor_parcela",
    accessor: (value) => formatNumberReal(value.valor_parcela),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_parcela"] }),
  },
  {
    Header: "Acréscimo",
    id: "valor_acrescimo",
    accessor: (value) => formatNumberReal(value.valor_acrescimo),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_acrescimo"] }),
  },
  {
    Header: "Decréscimo",
    id: "valor_decrescimo",
    accessor: (value) => formatNumberReal(value.valor_decrescimo),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_decrescimo"] }),
  },
  {
    Header: "Taxa(%)",
    id: "taxa_juros",
    accessor: (value) => formatNumberReal(value.taxa_juros),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["taxa_juros"] }),
  },
  {
    Header: "Valor Desconto",
    id: "valor_operacao",
    accessor: (value) => formatNumberReal(value.valor_operacao),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor_operacao"] }),
  },
  {
    Header: "Valor Líquido",
    id: "valor",
    accessor: (value) => formatNumberReal(value.valor),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["valor"] }),
  },
  {
    Header: "Dt Recebimento",
    id: 'data_recebimento',
    accessor: (value) => value.data_recebimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_recebimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Observação",
    id: "observacao",
    accessor: (value) => value.observacao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["observacao"] }),
  }
]

const columnsCiclo = [
  {
    Header: "ID",
    id: 'conta',
    accessor: "conta",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["conta"] })
  },
  {
    Header: "Data Criação da Medição",
    id: "data_medicao",
    accessor: (value) => value.data_medicao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_medicao"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Nº Medição",
    id: "medicao",
    accessor: (value) => value.medicao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["medicao"] }),
  },
  {
    Header: "Data Emissão Fat",
    id: "data_emissao",
    accessor: (value) => value.data_emissao,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_emissao"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
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
    Header: "Dt Recebimento",
    id: 'data_recebimento',
    accessor: (value) => value.data_recebimento,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_recebimento"] }),
    sortType: 'datetime',
    sortMethod: (a, b) => {
      const convertedB = convertDateFormat(b);
      const convertedA = convertDateFormat(a);

      return dateSort(convertedA, convertedB);
    }
  },
  {
    Header: "Ciclo Operacional",
    id: "ciclo_operacional",
    accessor: (value) => value.ciclo_operacional,
    filterAll: true,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["ciclo_operacional"] }),
  },
  {
    Header: "Observação",
    id: "observacoes",
    accessor: (value) => value.observacoes,
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["observacoes"] }),
  }
]

const getHeader = (relatorio) => {
  switch (relatorio) {
    case 'relatorio-simplificado': return columnsSimplificado
    case 'relatorio-recebidas': return columnsRecebidas
    case 'relatorio-competencia': return columnsCompetencia
    case 'relatorio-centro': return columnsCentro
    case 'relatorio-natureza': return columnsNatureza
    case 'relatorio-atraso': return columnsAtrasado
    case 'relatorio-antecipado': return columnsAntecipado
    case 'relatorio-ciclo': return columnsCiclo
  }
}

export {
  getHeader
}