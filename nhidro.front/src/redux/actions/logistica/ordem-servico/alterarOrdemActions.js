import api from "@src/services/api"
import { Enum_StatusOrdens, Enum_TiposCobranca } from "../../../../utility/enum/Enums"
import moment from "moment"
moment.locale("pt-br")
export const alterarOrdem = (model) => {
  return (dispatch) => {
    api.post("/api/ordem-servicos/alterar", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_ORDEM_SERVICO",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_ORDEM_SERVICO_ERROR",
          payload: data.error
        })
      }
    })
  }
}
export const alterarOrdemEmLote = (ordens, dadosHora, user) => {
  return (dispatch) => {
    try {
      const promises = []
  
      ordens.forEach(data => {
        const model = {}
        model.HoraInicial = moment(data.hora_inicial, "HH:mm").format("HH:mm:ss.SSS")
        model.AlteradoPor = user
        model.DataAlteracao = new Date()
        model.DataBaixa = new Date()
        model.Status = Enum_StatusOrdens.Executada
        model.HoraPadrao = dadosHora.HoraPadrao ? moment(dadosHora.HoraPadrao, "HH:mm").format("HH:mm:ss.SSS") : null
        model.HoraTolerancia = dadosHora.HoraTolerancia ? moment(dadosHora.HoraTolerancia, "HH:mm").format("HH:mm:ss.SSS") : null
        model.HoraEntrada = dadosHora.HoraEntrada ? moment(dadosHora.HoraEntrada, "HH:mm").format("HH:mm:ss.SSS") : null
        model.HoraSaida = dadosHora.HoraSaida ? moment(dadosHora.HoraSaida, "HH:mm").format("HH:mm:ss.SSS") : null
        model.HoraAlmoco = dadosHora.HoraAlmoco ? moment(dadosHora.HoraAlmoco, "HH:mm").format("HH:mm:ss.SSS") : null
        model.HoraTotal = dadosHora.HoraTotal ? moment(dadosHora.HoraTotal, "HH:mm").format("HH:mm:ss.SSS") : null
        model.HoraAdicional = dadosHora.HoraAdicional ? moment(dadosHora.HoraAdicional, "HH:mm").format("HH:mm:ss.SSS") : null
        promises.push(new Promise((r, j) => api.put(`/api/ordem-servicos/${data.id}`, {data: model}, function (status, data) {
          if (status === 200) r(status)
          else j(status)
        })))
      })

      Promise.all(promises).then(() => {
        dispatch({
          type: "SALVAR_ORDEM_SERVICO",
          payload: ordens[0]
        })
      })
      .catch((error) => {
        dispatch({
          type: "SALVAR_ORDEM_SERVICO_ERROR",
          payload: ordens[0]
        })
      })
    } catch (error) {
      dispatch({
        type: "SALVAR_ORDEM_SERVICO_ERROR",
        payload: ordens[0]
      })
    }
  }
}