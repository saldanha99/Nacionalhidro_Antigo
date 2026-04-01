import api from "@src/services/api"
export const alterarCentroCusto = (centro) => {
  return (dispatch) => {
    api.put(`/api/centros-custo/${centro.data.id}`, centro, function (status, data) {
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
