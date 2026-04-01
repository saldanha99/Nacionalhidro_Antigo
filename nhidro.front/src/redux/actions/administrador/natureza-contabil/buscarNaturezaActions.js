import api from "@src/services/api"
import { normalize } from '../../../../utility/Utils'
import qs from "qs"

export const buscarNatureza = () => {
  const query = qs.stringify(
    {
      sort: 'Descricao:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/naturezas-contabeis?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_NATUREZAS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_NATUREZAS_ERROR",
          payload:  data
        })
      } 
    })
  }
}
