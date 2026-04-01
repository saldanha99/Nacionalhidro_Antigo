import api from "@src/services/api"
export const cadastrarEmpresa = (empresa) => {
  return (dispatch) => {
    api.post("/api/empresas/createEmpresa", empresa, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "EMPRESA_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "EMPRESA_SALVAR_ERROR",
          payload: data.error
        })
      } 
    })
  }
}
