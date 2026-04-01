import api from "@src/services/api"
export const alterarGarantia = (garantia) => {
  return (dispatch) => {
    api.put(`/api/garantias/${garantia.data.id}`, garantia, function (status, data) {
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