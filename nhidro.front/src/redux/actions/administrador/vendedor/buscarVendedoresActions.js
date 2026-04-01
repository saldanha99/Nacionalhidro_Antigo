import api from "@src/services/api"
import { normalize } from '../../../../utility/Utils'
export const buscarVendedores = () => {
  return (dispatch) => {
    api.get(`api/vendedores?_start=0&_limit=9999`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_VENDEDORES",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_VENDEDORES_ERROR",
          payload: data
        })
      }
    })
  }
}
