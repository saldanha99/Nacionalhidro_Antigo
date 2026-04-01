import api from "@src/services/api"
import moment from "moment"
moment.locale("pt-br")
export const cadastrarOrdem = (model) => {
  return (dispatch) => {
    const promises = []
    let numero = model.data.Numero

    if (model.data.QuantidadeDia && model.data.QuantidadeDia > 1) {
      let qtd = 1
      while (qtd <= model.data.QuantidadeDia) {
        const data = JSON.parse(JSON.stringify(model.data))  
        data.Numero = numero
        promises.push(new Promise((r, j) => api.post("/api/ordem-servicos/cadastrar", {data}, function (status, data) {
          if (status === 200) r(status)
          else j(status)
        })))
        qtd++
        numero++
      }

      Promise.all(promises).then(() => {
        dispatch({
          type: "SALVAR_ORDEM_SERVICO",
          payload: model
        })
      })
      .catch((error) => {
        dispatch({
          type: "SALVAR_ORDEM_SERVICO_ERROR",
          payload: model
        })
      })
    } else {
      api.post("/api/ordem-servicos/cadastrar", model, function (status, data) {
        if (status === 200) {
          dispatch({
            type: "SALVAR_ORDEM_SERVICO",
            payload: data
          })
        } else {
          dispatch({
            type: "SALVAR_ORDEM_SERVICO_ERROR",
            payload: data
          })
        }
      })
    }
  }
}
export const cadastrarOrdemEmLote = (model) => {
  return (dispatch) => {
    try {
      const date = model.DataInicial[0]
      const promises = []
      let numero = model.Numero
  
      while (date <= model.DataInicial[1]) {
        const data = JSON.parse(JSON.stringify(model))                    
        data.DataInicial = moment(date).toDate()
        data.Numero = numero
        delete data.DiasSemana
        const day = moment(data.DataInicial).day()
        if (!model.DiasSemana || model.DiasSemana.some(x => x.value === day)) {
          if (model.QuantidadeDia && model.QuantidadeDia > 1) {
            let qtd = 1
            while (qtd <= model.QuantidadeDia) {
              const dataAux = JSON.parse(JSON.stringify(data))   
              dataAux.Numero = numero
              promises.push(new Promise((r, j) => api.post("/api/ordem-servicos/cadastrar", {data: dataAux}, function (status, data) {
                if (status === 200) r(status)
                else j(status)
              })))
              qtd++
              numero++
              data.Numero = numero
            }
          } else {
            promises.push(new Promise((r, j) => api.post("/api/ordem-servicos/cadastrar", {data}, function (status, data) {
              if (status === 200) r(status)
              else j(status)
            })))
            numero++
          }
        }
        date.setDate(date.getDate() + 1)
      }
      Promise.all(promises).then(() => {
        dispatch({
          type: "SALVAR_ORDEM_SERVICO",
          payload: model
        })
      })
      .catch((error) => {
        dispatch({
          type: "SALVAR_ORDEM_SERVICO_ERROR",
          payload: model
        })
      })
    } catch (error) {
      dispatch({
        type: "SALVAR_ORDEM_SERVICO_ERROR",
        payload: model
      })
    }
  }
}

