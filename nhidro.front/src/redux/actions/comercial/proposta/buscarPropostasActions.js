import api from "@src/services/api"
import qs from "qs"
import { Enum_StatusPropostas, Lista_StatusProposta } from "../../../../utility/enum/Enums"
import { normalize, groupBy } from '../../../../utility/Utils'
import moment from "moment"
moment.locale("pt-br")

export const buscarPropostas = (status, user, data1, data2, forceAll) => {
  const query = !user?.role?.name.includes('Comercial') || forceAll ? qs.stringify(
    {
      filters: {
        $and: [
          {
            Status: status
          },
          {
            DataProposta: {
              $between: [data1, data2]
            }
          }
        ]
      },
      sort: {
        DataValidade: 'asc'
      },
      populate: ['Acessorios', 'Cliente.Contatos', 'Contato', 'Usuario', 'PropostaEquipes.Cargo', 'PropostaEquipes.Equipamento', 'PropostaEquipamentos.Equipamento.Veiculos', 'PropostaResponsabilidades.Responsabilidade', 'Empresa']
    },
    {
      encodeValuesOnly: true // prettify url
    }) : qs.stringify(
      {
        filters: {
          $and: [
            {
              Status: status
            },
            {
              Usuario: {
                id: user.id
              }
            },
            {
              DataProposta: {
                $between: [data1, data2]
              }
            }
          ]
        },
        sort: {
          DataValidade: 'asc'
        },
        populate: ['Acessorios', 'Cliente.Contatos', 'Contato', 'Usuario', 'PropostaEquipes.Cargo', 'PropostaEquipes.Equipamento', 'PropostaEquipamentos.Equipamento', 'PropostaResponsabilidades.Responsabilidade', 'Empresa']
      },
      {
        encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/propostas?${query}`, function (data) {
      if (data) {
        const normalizado = normalize(data)
        const agrupado = groupBy(normalizado, 'Codigo')
        const dados = {
          data: []
        }
        Object.entries(agrupado).map(([k, v]) => ({ [k]: v })).forEach(element => {
          const item = element[Object.keys(element)[0]]
          const revisao = Math.max.apply(Math, item.map((i) => i.Revisao))
          const itemRevisao = item.find((f) => f.Revisao === revisao)
          dados.data.push(itemRevisao)
        })
        dispatch({
          type: "BUSCAR_PROPOSTAS",
          payload: normalize(dados)
        })
      } else {
        dispatch({
          type: "BUSCAR_PROPOSTAS_ERROR",
          payload:  data
        })
      } 
    })
  }
}
export const buscarPropostasPorCliente = (cliente, user, data1, data2) => {
  const query = !user?.role?.name.includes('Comercial') ? qs.stringify(
    {
      filters: {
        $and: [
          {
            Cliente: {
              id: cliente
            }
          },
          {
            DataProposta: {
              $between: [data1, data2]
            }
          }
        ]
      },
      populate: ['Acessorios', 'Cliente', 'Cliente.Contatos', 'Contato', 'Usuario', 'PropostaEquipes', 'PropostaEquipes.Cargo', 'PropostaEquipamentos', 'PropostaEquipamentos.Equipamento', 'PropostaEquipamentos.Equipamento', 'PropostaResponsabilidades', 'PropostaResponsabilidades.Responsabilidade']
    },
    {
      encodeValuesOnly: true // prettify url
    }) : qs.stringify(
      {
        filters: {
          $and: [
            {
              Cliente: {
                id: cliente
              }
            },
            {
              Usuario: {
                id: user.id
              }
            },
            {
              DataProposta: {
                $between: [data1, data2]
              }
            }
          ]
        },
        populate: ['Acessorios', 'Cliente', 'Cliente.Contatos', 'Contato', 'Usuario', 'PropostaEquipes', 'PropostaEquipes.Cargo', 'PropostaEquipamentos.Equipamento.Veiculos', 'PropostaResponsabilidades.Responsabilidade']
      },
      {
        encodeValuesOnly: true // prettify url
      })

  return (dispatch) => {
    api.get(`api/propostas?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_PROPOSTAS_CLIENTE",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_PROPOSTAS_CLIENTE_ERROR",
          payload:  data
        })
      } 
    })
  }
}
export const buscarUltimoCodigo = (status) => {
  const query = qs.stringify(
    {
      sort: ['Codigo:desc'],
      pagination: {
        start: 0,
        limit: 1
      }
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/propostas?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CODIGO_PROPOSTAS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_CODIGO_PROPOSTAS_ERROR",
          payload:  data
        })
      } 
    })
  }
}
export const buscarPropostasRelatorio = (data1, data2) => {
  const query = qs.stringify(
    {
      filters: {
        DataProposta: {
          $between: [data1, data2]
        }
      },
      sort: {
        DataProposta: 'desc'
      },
      populate: ['Acessorios', 'Cliente', 'Contato', 'Usuario', 'Empresa']
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/propostas?${query}`, function (data) {
      if (data) {
        const normalizado = normalize(data)
        const dados = []
        for (const x of normalizado) {
          dados.push({
            Codigo: x.Codigo,
            Revisao: x.Revisao,
            Empresa: x.Empresa?.Descricao,
            Cliente: x.Cliente?.RazaoSocial,
            Contato: x.Contato?.Nome,
            Vendedor: x.Usuario?.username,
            Data: moment(x.DataProposta).local().format('DD/MM/YYYY'),
            Vencimento: moment(x.DataValidade).local().format('DD/MM/YYYY'),
            Valor: x.Valor,
            Status: Lista_StatusProposta.find(y => y.value === x.Status)?.label
          })
        }
        dispatch({
          type: "BUSCAR_PROPOSTAS_RELATORIO",
          payload: dados
        })
      } else {
        dispatch({
          type: "BUSCAR_PROPOSTAS_RELATORIO_ERROR",
          payload:  data
        })
      } 
    })
  }
}
export const buscarPropostasMedicaoPorCliente = (cliente) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            Cliente: {
              id: cliente.id
            }
          },
          {
            Status: Enum_StatusPropostas.Aprovada
          },
        ]
      }
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/propostas?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_PROPOSTAS_MEDICAO",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_PROPOSTAS_MEDICAO_ERROR",
          payload:  data
        })
      } 
    })
  }
}