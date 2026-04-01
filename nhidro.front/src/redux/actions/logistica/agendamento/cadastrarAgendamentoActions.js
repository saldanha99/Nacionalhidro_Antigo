import api from "@src/services/api"
import moment from "moment"
moment.locale("pt-br")
export const cadastrarAgendamento = (model) => {
  return (dispatch) => {
    api.post("/api/agendamento-servicos/cadastrar", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_AGENDAMENTO",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_AGENDAMENTO_ERROR",
          payload: data
        })
      }
    })
  }
}
export const cadastrarAgendamentoLote = (model) => {
  return (dispatch) => {
    try {
      const date = new Date(JSON.parse(JSON.stringify(model.Data[0])))
      const promises = []
  
      while (date <= model.Data[1]) {
        const agenda = JSON.parse(JSON.stringify(model))                    
        agenda.Data = moment(date).toDate()
        promises.push(new Promise((r, j) => api.post("/api/agendamento-servicos/cadastrar", agenda, function (status, data) {
          if (status === 200) r(status)
          else j(status)
        })))
        date.setDate(date.getDate() + 1)
      }
      Promise.all(promises).then(() => {
        dispatch({
          type: "SALVAR_AGENDAMENTO",
          payload: model
        })
      })
      .catch((error) => {
        dispatch({
          type: "SALVAR_AGENDAMENTO_ERROR",
          payload: model
        })
      })
    } catch (error) {
      dispatch({
        type: "SALVAR_AGENDAMENTO_ERROR",
        payload: model
      })
    }
  }
}
