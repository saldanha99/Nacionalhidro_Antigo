import api from "@src/services/api"
export const alterarCargo = (cargo) => {
  return (dispatch) => {
    api.put(`/api/cargos/${cargo.data.id}`, cargo, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "CARGO_SALVAR",
          payload: cargo
        })
      } else {
        dispatch({
          type: "CARGO_SALVAR_ERROR",
          payload: data.error
        })
      }
    })
  }
}