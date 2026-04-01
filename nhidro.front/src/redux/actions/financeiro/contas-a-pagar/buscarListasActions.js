import api from "@src/services/api"
export const buscarListas = () => {
  return (dispatch) => {
    api.get(`api/contas/buscar-listas`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_LISTAS_CONTAS_A_PAGAR",
          payload:  data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_LISTAS_CONTAS_A_PAGAR_ERROR",
          payload:  data
        })
      } 
    })
  }
}
