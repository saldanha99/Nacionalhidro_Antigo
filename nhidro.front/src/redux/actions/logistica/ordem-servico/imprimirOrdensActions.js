import api from "@src/services/api"

export const imprimirOrdens = (ordens) => {
  return (dispatch) => {
    const ids = ordens.map(x => x.id)
  
    const chunkSize = 15
    const promises = []
  
    const files = []
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize)
      promises.push(new Promise((r, j) => api.post("/api/ordem-servicos/imprimir", chunk, function (status, data) {
        if (status === 200) {
          dispatch({
            type: "IMPRIMIR_ORDEM_SERVICO",
            payload: data
          })
          files.push(data)
          r(status)
        } else j(status)
      })))
    } 
  
    Promise.all(promises).then(() => {
    })
    .catch((error) => {
      dispatch({
        type: "IMPRIMIR_ORDEM_SERVICO_ERROR",
        payload: error
      })
    })
  }
}
          
export const visualizarOrdem = (ordem) => {
  return (dispatch) => {
    api.post("/api/ordem-servicos/visualizar", ordem, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "VISUALIZAR_MEDICAO",
          payload: data
        })
      }
    })
  }
}