import api from "@src/services/api"
export const cadastrarEquipamento = (equipamento) => {
  return (dispatch) => {
    api.post("/api/equipamentos/criarEquipamento", equipamento, function (status, data) {
      if (status === 200) {
        if (data.data !== null) {
          const equipamento = data.data
          equipamento.id = data.data.id
          dispatch({
            type: "EQUIPAMENTO_SALVAR",
            payload: equipamento
          })
        } else {
          dispatch({
            type: "EQUIPAMENTO_SALVAR_ERROR",
            payload: data.error
          })
        }
      } else {
        dispatch({
          type: "EQUIPAMENTO_SALVAR_ERROR",
          payload: data.error
        })
      }
    })
  }
}
