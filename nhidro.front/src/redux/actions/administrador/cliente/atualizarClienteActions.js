import api from "@src/services/api"
export const atualizarCliente = (obj) => {
  return (dispatch) => {
    api.post(`/api/cliente/atualizarCliente`, obj, function (status, data) {
      if (status === 200) {
        dispatch({ type: "ATUALIZAR_CLIENTE", data })
      } else {
        dispatch({
          type: "ATUALIZAR_CLIENTE",
          payload: data
        })
      }

    })
  }
}