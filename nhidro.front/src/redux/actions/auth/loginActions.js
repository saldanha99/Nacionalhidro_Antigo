import api from "@src/services/api"
export const loginWithJWT = (user) => {
  return (dispatch) => {
    api.post("api/auth/local", user, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "LOGIN_WITH_JWT",
          payload: data
        })
      } else {
        dispatch({
          type: "LOGIN_WITH_JWT_ERROR",
          payload: data
        })
      }     
    })
  }
}

export const getRole = (idUser) => {
  return (dispatch) => {
    api.get(`api/cliente/get-role/${idUser}`, function (data) {
      if (data) {
        dispatch({
          type: "GET_ROLES",
          payload: data
        })
      } else {
        dispatch({
          type: "GET_ROLES_ERROR",
          payload: data
        })
      }     
    })
  }
}
