import api from "@src/services/api"
import moment from "moment"
import { Enum_StatusEscalas } from "../../../../utility/enum/Enums"
moment.locale("pt-br")

export const cadastrarFuncionario = (funcionario) => {
  return (dispatch) => {
    try {
      api.post("/api/funcionarios", funcionario, function (status, data) {
        if (status === 200) {
          if (funcionario.data.GerarEscala) {
            const date = new Date(funcionario.data.InicioAfastamento)
            const promises = []
        
            while (date <= new Date(funcionario.data.FimAfastamento)) {
              const escala = {
                Data: moment(date).toDate(),
                Status: Enum_StatusEscalas.Aberta,
                EscalaVeiculos: [],
                EscalaFuncionarios: [{Funcionario: data.id, StatusOperacao: funcionario.data.MotivoAfastamento}]
              }                  
              promises.push(new Promise((r, j) => api.post("/api/escalas/cadastrar", {data:escala}, function (status, data) {
                if (status === 200) r(status)
                else j(status)
              })))
              date.setDate(date.getDate() + 1)
            }
            Promise.all(promises).then(() => {
              dispatch({
                type: "SALVAR_FUNCIONARIO",
                payload: data
              })
            })
            .catch((error) => {
              dispatch({
                type: "SALVAR_FUNCIONARIO_ERROR",
                payload: data
              })
            })
          } else {
            dispatch({
              type: "SALVAR_FUNCIONARIO",
              payload: data
            })
          }
        } else {
          dispatch({
            type: "SALVAR_FUNCIONARIO_ERROR",
            payload: data.error
          })
        }
      })
    } catch (error) {
      dispatch({
        type: "SALVAR_FUNCIONARIO_ERROR",
        payload: funcionario
      })
    }
  }
}