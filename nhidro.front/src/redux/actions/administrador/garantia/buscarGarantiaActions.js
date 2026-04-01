import api from "@src/services/api"
import { normalize } from '../../../../utility/Utils'
export const buscarGarantias = () => {
  return (dispatch) => {
    api.get(`api/garantias?_start=0&_limit=9999`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_GARANTIAS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_GARANTIASS_ERROR",
          payload: data
        })
      }
    })
  }
}
