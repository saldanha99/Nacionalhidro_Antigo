import api from "@src/services/api"

export const precificar = (model) => {
  return (dispatch) => {
    api.post("/api/ordem-servicos/precificar", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "MEDICAO_PRECIFICAR",
          payload: data
        })
      } else {
        dispatch({
          type: "MEDICAO_PRECIFICAR_ERROR",
          payload: data.error
        })
      }
    })
  }
}

export const verificarPendencias = (model) => {
  return (dispatch) => {
    api.post("/api/ordem-servicos/verificar-pendencias", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "MEDICAO_PRECIFICACAO_PENDENTE",
          payload: data
        })
      }
    })
  }
}