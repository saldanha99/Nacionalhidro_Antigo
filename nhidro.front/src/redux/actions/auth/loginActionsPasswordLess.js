import api from "@src/services/api"
export const submitEmail = (user) => {
  return (dispatch) => {
    api.post("tokens/submitEmail", user, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "LOGIN_PASSWORD_LESS_SUBMIT_EMAIL",
          payload: data
        })
      } else {
        dispatch({
          type: "LOGIN_PASSWORD_LESS_SUBMIT_EMAIL_ERROR",
          payload: data
        })
      }     
    })
  }
}
