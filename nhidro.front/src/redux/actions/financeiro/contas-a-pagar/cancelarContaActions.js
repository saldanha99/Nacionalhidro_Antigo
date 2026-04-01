import api from "@src/services/api"
export const cancelarConta = (model) => {
  return (dispatch) => {
    api.post(`/api/contas/cancelar`, model, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "CONTAS_A_PAGAR_STATUS",
            payload:  data
          })
        } else {
          dispatch({
            type: "CONTAS_A_PAGAR_STATUS_ERROR",
            payload:  data
          })
        }
      } else {
        dispatch({
          type: "CONTAS_A_PAGAR_STATUS_ERROR",
          payload:  data
        })
      } 
    })
  }
}
