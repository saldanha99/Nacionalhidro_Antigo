import api from "@src/services/api"

export const sendEmail = (model) => {
  return (dispatch) => {
    api.post('/api/configuracoes/send', model, function (status, data) {
      if (status === 200) {
        dispatch({ type: "SEND_FILE", data })
      } else {
        dispatch({
          type: "SEND_FILE_ERROR",
          payload:  data
        })
      } 
    })
  }
}
