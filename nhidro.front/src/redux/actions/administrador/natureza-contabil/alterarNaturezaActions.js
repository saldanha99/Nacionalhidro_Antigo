import api from "@src/services/api"
export const alterarNatureza = (natureza) => {
  return (dispatch) => {
    api.put(`/api/naturezas-contabeis/${natureza.data.id}`, natureza, function (status, data) {
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
