import api from "@src/services/api"
export const alterarUsuario = (data) => {
  return (dispatch) => {
    api.put(`/api/users/${data.id}`, data, function (status, data) {
      if (status === 200 || status === 201) {
        dispatch({
          type: "SALVAR_USUARIO",
          payload: data
        })
      } else {
        dispatch({
          type: "SALVAR_USUARIO_ERROR",
          payload: data.error
        })
      }
    })
  }
}