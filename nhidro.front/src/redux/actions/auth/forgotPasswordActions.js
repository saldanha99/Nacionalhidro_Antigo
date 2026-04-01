import api from "@src/services/api"
export const forgotPassword = (user) => {
  return (dispatch) => {
    api.post("api/auth/forgot-password", user, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "FORGOT_PASSWORD",
          payload:  data
        })
      } else {
        dispatch({
          type: "FORGOT_PASSWORD_ERROR",
          payload:  data
        })
      } 
    })
  }
}
