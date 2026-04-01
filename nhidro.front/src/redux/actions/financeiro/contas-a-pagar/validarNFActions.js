import api from "@src/services/api"

export const validarNotaFiscal = (numeroNF, fornecedorId) => {
    return (dispatch) => {
      api.get(`api/contas/validar-nota?numeroNF=${numeroNF}&fornecedorId=${fornecedorId}`, function (data) {
        if (data) {
          dispatch({
            type: "VALIDAR_NF",
            payload: {
              data: data.data,
              date: new Date()
            }
          })
        } else {
          dispatch({
            type: "VALIDAR_NF_ERROR",
            payload:  data
          })
        } 
      })
    }
  }