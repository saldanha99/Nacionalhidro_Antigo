import api from "@src/services/api"
import { normalize } from '../../../../utility/Utils'
import qs from "qs"

export const buscarFornecedor = () => {
  const query = qs.stringify(
    {
      sort: 'Nome:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/fornecedores?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_FORNECEDORES",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_FORNECEDORES_ERROR",
          payload:  data
        })
      } 
    })
  }
}
