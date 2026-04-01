import api from "@src/services/api"
export const corrigirConta = (model) => {
  return (dispatch) => {
    api.post(`/api/contas/corrigir`, model, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "CONTAS_A_PAGAR_CORRECAO",
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

export const corrigirParcela = (contaId, parcela) => {
  return (dispatch) => {
    api.get(`api/contas/corrigir-parcela?contaId=${contaId}&parcela=${parcela}`, function (data) {
      if (data) {
        dispatch({
          type: "CORRIGIR_PARCELA",
          payload:  data.data
        })
      } else {
        dispatch({
          type: "CORRIGIR_PARCELA_ERROR",
          payload:  data
        })
      } 
    })
  }
}