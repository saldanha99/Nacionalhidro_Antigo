import api from "@src/services/api"
export const cadastrarAcessorio = (acessorio) => {
  return (dispatch) => {
    api.post("/api/acessorios", acessorio, function (status, data) {
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
