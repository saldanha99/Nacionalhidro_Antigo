import api from "@src/services/api"
export const resetPassword = (data) => {
  return (dispatch) => {
    api.post("/api/auth/reset-password", data, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "RESET_PASSWORD",
          payload:  data
        })
      } else {
        dispatch({
          type: "RESET_PASSWORD_ERROR",
          payload:  data
        })
      }
    })
  }
}
