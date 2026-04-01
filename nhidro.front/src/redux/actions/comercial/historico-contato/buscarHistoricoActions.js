import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const buscarHistoricoContato = () => {
    const query = qs.stringify(
      {
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
export const buscarHistoricoContatoPorCliente = (cliente) => {
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
            type: "SALVAR_HISTORICO_ERROR",
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