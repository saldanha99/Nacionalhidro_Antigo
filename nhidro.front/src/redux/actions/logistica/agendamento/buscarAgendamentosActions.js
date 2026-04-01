import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'

export const buscarAgendamentos = (equipamento, ano, veiculo) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            Equipamento: equipamento ? {
              id: equipamento
            } : {
              id: {
                $gt: 0
              }
            }
          },
          {
            Veiculo: veiculo ? {
              id: veiculo
            } : {
              id: {
                $gt: 0
              }
            }
          },
          {
            Data: {
              $between: [`${ano}-01-01`, `${ano}-12-31`]
            }
          }
        ]
      },
      populate: ['Equipamento', 'Cliente', 'Veiculo', 'Proposta']
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/agendamento-servicos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_AGENDAMENTOS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_AGENDAMENTOS_ERROR",
          payload:  data
        })
      } 
    })
  }
}