import api from "@src/services/api"
export const cadastrarVeiculo = (veiculo) => {
  return (dispatch) => {
    api.post("/api/veiculos", veiculo, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "SALVAR_VEICULO",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_VEICULO_ERROR",
          payload: data.error
        })
      }
    })
  }
}