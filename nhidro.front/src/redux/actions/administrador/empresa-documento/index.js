import api from "@src/services/api"
export const criarEmpresaDocumento = (obj) => {
  return (dispatch) => {
    api.post(`/api/empresa-documentos`, obj, function (status, data) {

        if (status === 200) {
            dispatch({ type: "CRIAR_EMPRESA_DOCUMENTO",
              payload: data })
        }
  
      })
  }
}

export const deletarEmpresaDocumento = (doc) => {
  return (dispatch) => {
    doc.Deletado = true
    api.put(`/api/empresa-documentos/${doc.id}`, {data: doc}, function (status, data) {
      if (status === 200) {
          dispatch({ type: "DELETAR_EMPRESA_DOCUMENTO",
            payload: data })
      }

    })
  }
}