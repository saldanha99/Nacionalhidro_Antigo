import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const buscarConfiguracoes = () => {
  return (dispatch) => {
    api.get(`api/configuracoes`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CONFIGURACOES",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_CONFIGURACOES_ERROR",
          payload: data
        })
      }
    })
  }
}

export const buscarConfiguracoesPorDescricoes = (descricao) => {
  const query = qs.stringify(
    {
      filters: {
        Descricao: {
          $in: descricao
        }
      }
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/configuracoes?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CONFIGURACOES",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_CONFIGURACOES_ERROR",
          payload: data
        })
      }
    })
  }
}
