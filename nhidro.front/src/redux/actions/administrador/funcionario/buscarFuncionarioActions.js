import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const buscarFuncionarios = () => {
  const query = qs.stringify(
    {
      populate: '*',
      sort: 'Nome:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/funcionarios?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_FUNCIONARIOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_FUNCIONARIOS_ERROR",
          payload: data
        })
      }
    })
  }
}

export const buscarFuncionariosAtivos = () => {
  const query = qs.stringify(
    {
      filters: {
        $or: [
          {
            Bloqueado: {
              $null: true
            }
          },
          {
            Bloqueado: false
          }
        ]
      },
      populate: '*',
      sort: 'Nome:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/funcionarios?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_FUNCIONARIOS_ATIVOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_FUNCIONARIOS_ERROR",
          payload: data
        })
      }
    })
  }
}

