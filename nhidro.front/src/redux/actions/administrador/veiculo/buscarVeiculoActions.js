import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const buscarVeiculos = () => {
  const query = qs.stringify(
    {
      populate: '*',
      sort: 'Placa:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/veiculos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_VEICULOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_VEICULOS_ERROR",
          payload: data
        })
      }
    })
  }
}
