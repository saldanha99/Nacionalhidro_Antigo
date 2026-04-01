import api from "@src/services/api"
export const cadastrarCargo = (cargo) => {
  return (dispatch) => {
    api.post("/api/cargos", cargo, function (status, data) {
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
