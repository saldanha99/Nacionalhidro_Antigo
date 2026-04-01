import api from "@src/services/api"
export const alterarResponsabilidade = (responsabilidade) => {
  return (dispatch) => {
    api.put(`/api/responsabilidades/${responsabilidade.data.id}`, responsabilidade, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "RESPONSABILIDADE_SALVAR",
          payload: data
        })    
      } else {
        dispatch({
          type: "RESPONSABILIDADE_SALVAR_ERROR",
          payload: data.error
        })
      }
    })
  }
}