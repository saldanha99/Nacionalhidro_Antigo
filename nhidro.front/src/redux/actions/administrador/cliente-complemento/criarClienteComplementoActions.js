import api from "@src/services/api"
export const criarClienteComplemento = (obj) => {
  return (dispatch) => {
    api.post(`/api/cliente-complementos/create`, obj, function (status, data) {

        if (status === 200) {
            dispatch({ type: "CRIAR_CLIENTE_COMPLEMENTO", data })
        } else {
            dispatch({
              type: "CRIAR_CLIENTE_COMPLEMENTO_ERROR",
              payload: data
            })
        }
  
      })
  }
}
