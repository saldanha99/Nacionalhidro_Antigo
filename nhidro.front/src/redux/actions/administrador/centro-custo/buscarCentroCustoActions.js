import api from "@src/services/api"
import { normalize } from '../../../../utility/Utils'
import qs from "qs"

export const buscarCentroCusto = () => {
  const query = qs.stringify(
    {
      sort: 'Descricao:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/centros-custo?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CENTROSCUSTO",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_CENTROSCUSTO_ERROR",
          payload: data
        })
      } 
    })
  }
}
