import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const buscarResponsabilidades = () => {
  const query = qs.stringify(
    {
      sort: 'Responsabilidade:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/responsabilidades?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_RESPONSABILIDADES",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_RESPONSABILIDADES_ERROR",
          payload: data
        })
      }
    })
  }
}

export const buscarResponsabilidadesAtivas = () => {
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
      sort: 'Responsabilidade:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/responsabilidades?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_RESPONSABILIDADES",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_RESPONSABILIDADES_ERROR",
          payload: data
        })
      }
    })
  }
}
