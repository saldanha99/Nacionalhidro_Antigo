import api from "@src/services/api"
export const alterarAgendamento = (model) => {
  return (dispatch) => {
    api.post(`/api/agendamento-servicos/alterar`, model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_AGENDAMENTO",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_AGENDAMENTO_ERROR",
          payload: data.error
        })
      }
    })
  }
}
