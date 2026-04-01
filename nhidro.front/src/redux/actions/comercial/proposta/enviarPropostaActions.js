import api from "@src/services/api"
export const enviarProposta = (model) => {
  return (dispatch) => {
    api.post("/api/propostas/enviar", model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "ENVIAR_PROPOSTA",
          payload: data
        })
      } else {
        dispatch({
          type: "ENVIAR_PROPOSTA_ERROR",
          payload: data
        })
      }
    })
  }
}
