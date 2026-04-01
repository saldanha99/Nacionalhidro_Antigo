import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const buscarEquipamentos = () => {
  return (dispatch) => {
    api.get(`api/equipamentos/buscarEquipamentos`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_EQUIPAMENTOS",
          payload: data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_EQUIPAMENTOS_ERROR",
          payload: data
        })
      }
    })
  }
}
export const buscarEquipamentosAtivos = () => {
  const query = qs.stringify(
    {
      filters: {
        Ativo: true
      },
      populate: ['EquipamentoAcessorios.Acessorio', 'Veiculos', 'EquipamentoResponsabilidades.Responsabilidade'],
      sort: 'Equipamento:asc'
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`/api/equipamentos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_EQUIPAMENTOS_ATIVOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_EQUIPAMENTOS_ATIVOS_ERROR",
          payload:  data
        })
      } 
    })
  }
}
