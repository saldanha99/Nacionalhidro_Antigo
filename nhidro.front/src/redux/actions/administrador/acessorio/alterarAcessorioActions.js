import api from "@src/services/api"
export const alterarAcessorio = (acessorio) => {
  return (dispatch) => {
    api.put(`/api/acessorios/${acessorio.data.id}`, acessorio, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "ACESSORIO_SALVAR",
          payload: data
        })
      } else {
        dispatch({
          type: "ACESSORIO_SALVAR_ERROR",
          payload: data.error
        })
      }
    })
  }
}