import { matchSorter } from "match-sorter"

const columnsFornecedores = [
  {
    Header: "ID",
    id: "id",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Nome Fantasia",
    accessor: "NomeFantasia",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NomeFantasia"] })
  },
  {
    Header: "Razão Social",
    accessor: "Nome",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Nome"] })
  },
  {
    Header: "CNPJ",
    accessor: "CNPJ",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["CNPJ"] })
  },
  {
    Header: "Email",
    accessor: "Email",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Email"] })
  },
  {
    Header: "Telefone",
    accessor: "Telefone",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Telefone"] })
  },
  {
    Header: "Endereço",
    accessor: "Endereco",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Endereco"] })
  },
  {
    Header: "Inscrição Estadual",
    accessor: "Inscricao",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Inscricao"] })
  },
  {
    Header: "Chave Pix",
    accessor: "ChavePix",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ChavePix"] })
  },
  {
    Header: "Tipo Pix",
    accessor: "TipoPix",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["TipoPix"] })
  },
  {
    Header: "Banco",
    accessor: "Banco",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Banco"] })
  },
  {
    Header: "Agência",
    accessor: "AgenciaBanco",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["AgenciaBanco"] })
  },
  {
    Header: "Conta",
    accessor: "ContaBanco",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ContaBanco"] })
  },
  {
    Header: "Contato Financeiro",
    accessor: "ContatoFinanceiro",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ContatoFinanceiro"] })
  },
  {
    Header: "Contato Venda",
    accessor: "ContatoVenda",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ContatoVenda"] })
  },
  {
    Header: "Bloqueado",
    id: "Bloqueado",
    accessor: (value) => (value.Bloqueado ? 'Sim' : 'Não'),
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Bloqueado"] })
  }
]

const columnsNaturezas = [
  {
    Header: "ID",
    id: "id",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Descrição",
    accessor: "Descricao",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Descricao"] })
  }
]
const columnsCentroCustos = [
  {
    Header: "ID",
    id: "id",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Descrição",
    accessor: "Descricao",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Descricao"] })
  }
]
const columnsBancos = [
  {
    Header: "ID",
    id: "id",
    accessor: "id",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
  },
  {
    Header: "Empresa",
    accessor: "Empresa.Descricao",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa.Descricao"] })
  },
  {
    Header: "CNPJ",
    accessor: "Empresa.CNPJ",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa.CNPJ"] })
  },
  {
    Header: "Nome Banco",
    accessor: "Banco",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Banco"] })
  },
  {
    Header: "Agência",
    accessor: "Agencia",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Agencia"] })
  },
  {
    Header: "Conta",
    accessor: "Conta",
    filterAll: true,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Conta"] })
  }
]

const getHeader = (relatorio) => {
  switch (relatorio) {
    case 'relatorio-fornecedores': return columnsFornecedores
    case 'relatorio-naturezas-contabeis': return columnsNaturezas
    case 'relatorio-centro-custos': return columnsCentroCustos
    case 'relatorio-bancos': return columnsBancos
  }
}

export {
  getHeader
}