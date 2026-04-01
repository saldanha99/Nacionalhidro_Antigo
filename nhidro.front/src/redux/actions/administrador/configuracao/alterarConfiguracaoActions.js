import api from "@src/services/api"
export const alterarConfiguracao = (configuracao) => {
  return (dispatch) => {
    api.put(`/api/configuracoes/${configuracao.data.id}`, configuracao, function (status, data) {
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