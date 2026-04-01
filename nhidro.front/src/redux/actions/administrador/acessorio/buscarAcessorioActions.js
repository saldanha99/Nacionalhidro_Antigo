import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const buscarAcessorios = () => {
  const query = qs.stringify(
    {
      sort: 'Nome:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/acessorios?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_ACESSORIOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_ACESSORIOS_ERROR",
          payload: data
        })
      }
    })
  }
}

export const buscarAcessoriosAtivos = () => {
  const query = qs.stringify(
    {
      filters: {
        $or: [
          {
            Inativo: {
              $null: true
            }
          },
          {
            Inativo: false
          }
        ]
      },
      sort: 'Nome:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/acessorios?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_ACESSORIOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_ACESSORIOS_ERROR",
          payload: data
        })
      }
    })
  }
}
