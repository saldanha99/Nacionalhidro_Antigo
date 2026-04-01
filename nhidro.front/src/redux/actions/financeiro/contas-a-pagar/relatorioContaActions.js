import api from "@src/services/api"
export const buscarRelatorioConta = (data) => {
  return (dispatch) => {
    api.post(`api/contas/relatorio`, data, function (status, data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CONTAS_RELATORIO",
          payload:  data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_CONTAS_RELATORIO_ERROR",
          payload:  data
        })
      } 
    })
  }
}
