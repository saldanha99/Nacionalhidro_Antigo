import api from "@src/services/api"
export const criarClienteDocumento = (obj) => {
  return (dispatch) => {
    api.post(`/api/cliente-documentos`, obj, function (status, data) {

        if (status === 200) {
            dispatch({ type: "CRIAR_CLIENTE_DOCUMENTO",
              payload: data })
        }
  
      })
  }
}

export const deletarClienteDocumento = (doc) => {
  doc.Deletado = true
  return (dispatch) => {
    api.put(`/api/cliente-documentos/${doc.id}`, {data: doc}, function (status, data) {
      if (status === 200) {
          dispatch({ type: "DELETAR_CLIENTE_DOCUMENTO",
            payload: data })
      }

    })
  }
}