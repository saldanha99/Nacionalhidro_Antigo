import api from "@src/services/api"
export const cadastrarVendedor = (vendedor) => {
  return (dispatch) => {
    api.post("/api/vendedores", vendedor, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "VENDEDOR_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "VENDEDOR_SALVAR_ERROR",
          payload: data.error
        })
      }
    })
  }
}
