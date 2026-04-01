import api from "@src/services/api"
export const cadastrarEscala = (model) => {
  return (dispatch) => {
    api.post("/api/escalas/cadastrar", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_ESCALA",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_ESCALA_ERROR",
          payload: data.error
        })
      }
    })
  }
}
