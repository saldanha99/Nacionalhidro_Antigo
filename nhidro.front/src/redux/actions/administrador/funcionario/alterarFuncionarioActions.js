import api from "@src/services/api"
import moment from "moment"
import { Enum_StatusEscalas } from "../../../../utility/enum/Enums"
moment.locale("pt-br")
export const alterarFuncionario = (funcionario) => {
  return (dispatch) => {
    try {
      api.put(`/api/funcionarios/${funcionario.data.id}`, funcionario, function (status, data) {
        if (status === 200) {
          if (funcionario.data.GerarEscala) {
            const date = moment(funcionario.data.InicioAfastamento).toDate() //arrumar data
            const date_end = funcionario.data.FimAfastamento ? moment(funcionario.data.FimAfastamento).toDate() : moment(funcionario.data.InicioAfastamento).toDate() //arrumar data
            const promises = []
        
            while (date <= date_end) {
              const escala = {
                Data: moment(date).toDate(),
                Status: Enum_StatusEscalas.Aberta,
                EscalaVeiculos: [],
                EscalaFuncionarios: [{Funcionario: data.data.id, StatusOperacao: funcionario.data.MotivoAfastamento}]
              }                  
              promises.push(new Promise((r, j) => api.post("/api/escalas/cadastrar", {data: escala}, function (status, data) {
                if (status === 200) r(status)
                else j(status)
              })))
              date.setDate(date.getDate() + 1)
            }
            Promise.all(promises).then(() => {
              dispatch({
                type: "SALVAR_FUNCIONARIO",
                payload: funcionario
              })
            })
            .catch((error) => {
              dispatch({
                type: "SALVAR_FUNCIONARIO_ERROR",
                payload: model
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
        payload: data.error
      })
    }
  }
}