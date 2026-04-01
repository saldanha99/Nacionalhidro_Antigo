import api from "@src/services/api"
export const cadastrarCentroCusto = (centro) => {
  return (dispatch) => {
    api.post("/api/centros-custo", centro, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "CENTROCUSTO_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "CENTROCUSTO_SALVAR_ERROR",
          payload: data.error
        })
      } 
    })
  }
}
