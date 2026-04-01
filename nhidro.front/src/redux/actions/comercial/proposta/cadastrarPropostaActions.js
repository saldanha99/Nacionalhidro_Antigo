import api from "@src/services/api"
export const cadastrarProposta = (model) => {
  return (dispatch) => {
    api.post("/api/propostas/cadastrar", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_PROPOSTA",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_PROPOSTA_ERROR",
          payload: data
        })
      }
    })
  }
}
