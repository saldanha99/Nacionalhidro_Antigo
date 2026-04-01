import api from "@src/services/api"
export const salvarParcela = (model) => {
  return (dispatch) => {
    api.post(`/api/contas/salvar-parcela`, model, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "CONTAS_A_PAGAR_SALVAR_PARCELA",
            payload:  data
          })
        } else {
          dispatch({
            type: "CONTAS_A_PAGAR_SALVAR_PARCELA_ERROR",
            payload:  data
          })
        }
      } else {
        dispatch({
          type: "CONTAS_A_PAGAR_SALVAR_PARCELA_ERROR",
          payload:  data
        })
      } 
    })
  }
}
