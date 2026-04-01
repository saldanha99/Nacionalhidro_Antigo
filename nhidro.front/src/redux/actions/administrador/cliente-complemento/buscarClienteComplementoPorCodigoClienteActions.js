import api from "@src/services/api"
export const buscarClienteComplementoPorCodigoCliente = (codigoCliente) => {
  return (dispatch) => {
    api.get(`api/cliente-complementos/get/${codigoCliente}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CLIENTE_COMPLEMENTO",
          payload: data
        })
      } else {
        dispatch({
          type: "BUSCAR_CLIENTE_COMPLEMENTO_ERROR",
          payload: data
        })
      } 
    })
  }
}
