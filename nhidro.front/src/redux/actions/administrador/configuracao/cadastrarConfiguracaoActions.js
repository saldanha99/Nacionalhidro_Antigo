import api from "@src/services/api"
export const cadastrarConfiguracao = (configuracao) => {
  return (dispatch) => {
    api.post("/api/configuracoes", configuracao, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_CONFIGURACAO",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_CONFIGURACAO_ERROR",
          payload: data.error
        })
      }
    })
  }
}
