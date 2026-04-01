import api from "@src/services/api"
export const cadastrarResponsabilidade = (responsabilidade) => {
  return (dispatch) => {
    api.post("/api/responsabilidades", responsabilidade, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "RESPONSABILIDADE_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "RESPONSABILIDADE_SALVAR_ERROR",
          payload:  data.error
        })
      } 
    })
  }
}
