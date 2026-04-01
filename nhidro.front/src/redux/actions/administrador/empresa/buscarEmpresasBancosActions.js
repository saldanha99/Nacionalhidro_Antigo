import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'
export const buscarEmpresasBancos = () => {
  const query = qs.stringify(
    {
      sort: 'Banco:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/empresas-bancos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_EMPRESAS_BANCOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_EMPRESAS_BANCOS_ERROR",
          payload:  data
        })
      } 
    })
  }
}
