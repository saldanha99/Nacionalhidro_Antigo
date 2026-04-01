import api from "@src/services/api"
export const alterarVendedor = (vendedor) => {
  return (dispatch) => {
    api.put(`/api/vendedores/${vendedor.data.id}`, vendedor, function (status, data) {
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