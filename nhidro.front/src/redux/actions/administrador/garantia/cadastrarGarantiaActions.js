import api from "@src/services/api"
export const cadastrarGarantia = (garantia) => {
  return (dispatch) => {
    api.post("/api/garantias", garantia, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "GARANTIA_SALVAR",
          payload: garantia
        })
      } else {
        dispatch({
          type: "GARANTIA_SALVAR_ERROR",
          payload: data.error
        })
      }
    })
  }
}
