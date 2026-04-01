import api from "@src/services/api"
export const alterarVeiculo = (veiculo) => {
  return (dispatch) => {
    api.put(`/api/veiculos/${veiculo.data.id}`, veiculo, function (status, data) {
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