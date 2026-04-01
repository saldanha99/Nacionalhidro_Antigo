import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const buscarCargos = () => {
  const query = qs.stringify(
    {
      sort: 'Descricao:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/cargos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CARGOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_CARGOS_ERROR",
          payload: data
        })
      }
    })
  }
}
