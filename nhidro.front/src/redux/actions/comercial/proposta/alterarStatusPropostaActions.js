import api from "@src/services/api"
export const alterarStatusProposta = (model) => {
  return (dispatch) => {
    api.put(`/api/propostas/${model.data.id}`, model, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_PROPOSTA",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_PROPOSTA_ERROR",
          payload: data.error
        })
      }
    })
  }
}
