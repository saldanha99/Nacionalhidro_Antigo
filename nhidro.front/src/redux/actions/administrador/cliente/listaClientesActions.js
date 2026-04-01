import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const listaClientes = () => {
  return (dispatch) => {
    api.get(`/api/cliente/buscar-clientes`, function (data) {
      if (data.error === false) {
        dispatch({
          type: "LISTA_CLIENTES",
          payload: data.data
        })
      } else {
        dispatch({
          type: "LISTA_CLIENTES_ERROR",
          payload: data
        })
      }
    })
  }
}
export const buscarClientesAtivos = (user) => {
  const query = qs.stringify(
    {
      filters: {
        $or: [
          {
            $and: [
              {
                Bloqueado: true
              },
              {
                DataDesbloqueio: { $gte: new Date()}
              }
            ]
          },
          {
            $or: [
              {
                Bloqueado: null
              },
              {
                Bloqueado: false
              }
            ]
          }
        ]
      },
      populate: ['Empresa', 'Contatos', 'Vendedor', 'Integracoes.Funcionario.Cargo'],
      sort: 'RazaoSocial:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`/api/clientes?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "LISTA_CLIENTES_ATIVOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "LISTA_CLIENTES_ATIVOS_ERROR",
          payload: data
        })
      } 
    })
  }
}
export const buscarClientesVendedorAtivos = (user) => {
  const query = user?.role?.name === 'Gerencial' ? qs.stringify(
    {
      filters: {
        $or: [
          {
            $and: [
              {
                Bloqueado: true
              },
              {
                DataDesbloqueio: { $gte: new Date()}
              }
            ]
          },
          {
            $or: [
              {
                Bloqueado: null
              },
              {
                Bloqueado: false
              }
            ]
          }
        ]
      },
      populate: ['Empresa', 'Contatos', 'Vendedor', 'Integracoes.Funcionario.Cargo'],
      sort: 'RazaoSocial:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    }) : qs.stringify(
    {
      filters: {
        $and: [
          {
            Vendedor: {
              id: user.id
            }
          },
          {
            $or: [
            {
              $and: [
                {
                  Bloqueado: true
                },
                {
                  DataDesbloqueio: { $gte: new Date()}
                }
              ]
            },
            {
              $or: [
                {
                  Bloqueado: null
                },
                {
                  Bloqueado: false
                }
              ]
            }
          ]
        }
      ]},
      populate: ['Empresa', 'Contatos', 'Vendedor', 'Integracoes.Funcionario.Cargo'],
      sort: 'RazaoSocial:asc'
    }
    )
  return (dispatch) => {
    api.get(`/api/clientes?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "LISTA_CLIENTES_ATIVOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "LISTA_CLIENTES_ATIVOS_ERROR",
          payload: data
        })
      } 
    })
  }
}
export const buscarClientesporVendedor = (user) => {
  const query = qs.stringify(
    {
      filters: user.role.name.includes('Comercial') ? {
        Vendedor: {
          id: user.id
        }
      } : {},
      populate: ['Empresa', 'Contatos', 'Vendedor', 'Integracoes.Funcionario.Cargo'],
      sort: 'RazaoSocial:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`/api/clientes?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "LISTA_CLIENTES_VENDEDOR",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "LISTA_CLIENTES_VENDEDOR_ERROR",
          payload: data
        })
      } 
    })
  }
}
export const clienteExistente = (doc, isCnpf) => {
  const query = qs.stringify(
    isCnpf ? {
      filters: {
        Cnpj: doc
      }
    } : {
      filters: {
        Cpf: doc
      }
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`/api/clientes?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "CLIENTE_EXISTE",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "CLIENTE_EXISTE_ERROR",
          payload: data
        })
      } 
    })
  }
}
export const clienteExistenteRazao = (value) => {
  const query = qs.stringify(
    {
      filters: {
        RazaoSocial: {
          $contains: value
        }
      }
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`/api/clientes?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "CLIENTE_EXISTE_RAZAO",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "CLIENTE_EXISTE_RAZAO_ERROR",
          payload: data
        })
      } 
    })
  }
}
export const enviarEmails = (model) => {
  return (dispatch) => {
    api.post("/api/cliente/enviar-email", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "ENVIAR_EMAIL_CLIENTES",
          payload: data
        })
      } else {
        dispatch({
          type: "ENVIAR_EMAIL_CLIENTES_ERROR",
          payload: data.error
        })
      }
    })
  }
}
export const buscarHistoricoContato = (cliente) => {
  const query = qs.stringify(
    {
      filters: {
        Cliente: {
          id: cliente
        }
      },
      populate: ['Vendedor', 'Cliente', 'Contato'],
      sort: 'DataContato:desc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`/api/historico-contatoes?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "LISTA_HISTORICO_CONTATO",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "LISTA_HISTORICO_CONTATO_ERROR",
          payload: data
        })
      } 
    })
  }
}
export const cadastrarHistoricoContato = (model) => {
  return (dispatch) => {
    api.post("/api/historico-contatoes", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_HISTORICO_CONTATO",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_VEICULO_ERROR",
          payload: data.error
        })
      }
    })
  }
}
export const alterarHistoricoContato = (model) => {
  return (dispatch) => {
    api.put(`/api/historico-contatoes/${model.data.id}`, model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_HISTORICO_CONTATO",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_HISTORICO_CONTATO_ERROR",
          payload: data.error
        })
      }
    })
  }
}
export const buscarContatosCliente = (cliente) => {
  return (dispatch) => {
    api.get(`/api/clientes/${cliente}?populate=Contatos`, function (data) {
      if (data) {
        dispatch({
          type: "LISTA_CLIENTE_CONTATOS",
          payload: normalize(data)?.Contatos
        })
      }
    })
  }
}
export const buscarDocumentosPorCliente = (cliente) => {
  const query = qs.stringify(
    {
      filters: {
        Cliente: {
          id: cliente
        },
        $or: [
          {
            Deletado: {
              $null: true
            }
          },
          {
            Deletado: false
          }
        ]
      }
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`/api/cliente-documentos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "LISTA_CLIENTE_DOCUMENTOS",
          payload: normalize(data)
        })
      }
    })
  }
}
