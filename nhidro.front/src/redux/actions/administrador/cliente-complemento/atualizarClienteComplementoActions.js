import api from "@src/services/api"
export const atualizarClienteComplemento = (obj) => {
  return (dispatch) => {
    api.post(`/api/cliente-complementos/update`, obj, function (status, data) {

        if (status === 200) {
            dispatch({ type: "ATUALIZAR_CLIENTE_COMPLEMENTO", data })
        } else {
            dispatch({
              type: "ATUALIZAR_CLIENTE_COMPLEMENTO_ERROR",
              payload: data
            })
        }
  
      })
  }
}
