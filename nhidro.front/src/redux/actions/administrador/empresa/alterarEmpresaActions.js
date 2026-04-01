import api from "@src/services/api"
export const alterarEmpresa = (empresa) => {
  return (dispatch) => {
    api.post(`/api/empresas/updateEmpresa`, empresa, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "EMPRESA_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "EMPRESA_SALVAR_ERROR",
          payload:  data.error
        })
      } 
    })
  }
}
