import api from "@src/services/api"
export const cadastrarNatureza = (natureza) => {
  return (dispatch) => {
    api.post("/api/naturezas-contabeis", natureza, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "NATUREZA_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "NATUREZA_SALVAR_ERROR",
          payload:  data.error
        })
      } 
    })
  }
}
