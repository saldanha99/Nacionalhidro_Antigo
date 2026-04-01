import api from "@src/services/api"
export const cadastrarFornecedor = (fornecedor) => {
  return (dispatch) => {
    api.post("/api/fornecedores", fornecedor, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "FORNECEDOR_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "FORNECEDOR_SALVAR_ERROR",
          payload:  data.error
        })
      } 
    })
  }
}
