import api from "@src/services/api"
export const buscarContasCadastrar = () => {
  return (dispatch) => {
    api.get(`api/contas/status-a-cadastrar`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CONTAS_A_CADASTRAR",
          payload:  data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_CONTAS_A_CADASTRAR_ERROR",
          payload:  data
        })
      } 
    })
  }
}

export const buscarContasPagar = (dataInicial, dataFinal) => {
  return (dispatch) => {
    api.get(`api/contas/status-a-pagar?dataInicial=${dataInicial}&dataFinal=${dataFinal}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CONTAS_A_PAGAR",
          payload:  data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_CONTAS_A_PAGAR_ERROR",
          payload:  data
        })
      } 
    })
  }
}

export const buscarContasPagas = (dataInicial, dataFinal) => {
  return (dispatch) => {
    api.get(`api/contas/status-pagas?dataInicial=${dataInicial}&dataFinal=${dataFinal}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CONTAS_PAGAS",
          payload:  data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_CONTAS_PAGAS_ERROR",
          payload:  data
        })
      } 
    })
  }
}

export const buscarContasCanceladas = () => {
  return (dispatch) => {
    api.get(`api/contas/status-cancelado`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CONTAS_CANCELADAS",
          payload:  data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_CONTAS_CANCELADAS_ERROR",
          payload:  data
        })
      } 
    })
  }
}
