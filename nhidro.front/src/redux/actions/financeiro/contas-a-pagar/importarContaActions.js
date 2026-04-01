import api from "@src/services/api"
export const importarConta = (model) => {
  return (dispatch) => {
    api.post("/api/contas/importar", model, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "CONTAS_A_PAGAR_IMPORTAR",
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
