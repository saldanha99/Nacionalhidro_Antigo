import api from "@src/services/api"
export const criarCliente = (obj) => {
  return (dispatch) => {
    api.post(`/api/cliente/cadastrarCliente`, obj, function (status, data) {
      if (status === 200) {
        dispatch({ type: "CRIAR_CLIENTE", data })
      } else {
        dispatch({
          type: "CRIAR_CLIENTE_ERROR",
          payload: data
        })
      }

    })
  }
}