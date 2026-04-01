import api from "@src/services/api"
export const alterarConta = (model) => {
  return (dispatch) => {
    api.post(`/api/contas/alterar`, model, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "CONTAS_A_PAGAR_SALVAR",
            payload:  data
          })
        } else {
          dispatch({
            type: "CONTAS_A_PAGAR_SALVAR_ERROR",
            payload:  data
          })
        }
      } else {
        dispatch({
          type: "CONTAS_A_PAGAR_SALVAR_ERROR",
          payload:  data
        })
      } 
    })
  }
}
