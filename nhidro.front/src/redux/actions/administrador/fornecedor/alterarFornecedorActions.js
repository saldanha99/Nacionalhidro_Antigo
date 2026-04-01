import api from "@src/services/api"
export const alterarFornecedor = (fornecedor) => {
  return (dispatch) => {
    api.put(`/api/fornecedores/${fornecedor.data.id}`, fornecedor, function (status, data) {
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
