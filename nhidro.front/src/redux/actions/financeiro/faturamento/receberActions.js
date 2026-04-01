import api from "@src/services/api"
export const receber = (faturamento) => {
  return (dispatch) => {
    api.post("/api/faturamento/receber", faturamento, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "FATURAMENTO_RECEBER",
            payload:  data
          })
        } else {
          dispatch({
            type: "FATURAMENTO_RECEBER_ERROR",
            payload:  data
          })
        }
      } else {
        dispatch({
          type: "FATURAMENTO_RECEBER_ERROR",
          payload:  data
        })
      } 
    })
  }
}
