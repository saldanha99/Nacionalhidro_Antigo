import api from "@src/services/api"
export const faturar = (faturamento) => {
  return (dispatch) => {
    api.post("/api/faturamento/faturar", faturamento, function (status, data) {
      if (status === 200) {
        if (data.error === false) {
          dispatch({
            type: "FATURAMENTO_FATURAR",
            payload:  data
          })
        } else {
          dispatch({
            type: "FATURAMENTO_FATURAR_ERROR",
            payload:  data
          })
        }
      } else {
        dispatch({
          type: "FATURAMENTO_FATURAR_ERROR",
          payload:  data
        })
      } 
    })
  }
}
