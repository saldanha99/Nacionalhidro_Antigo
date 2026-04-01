import api from "@src/services/api"
import qs from "qs"
import { Lista_StatusEscala, Enum_StatusEscalas } from "../../../../utility/enum/Enums"
import { normalize } from '../../../../utility/Utils'
import moment from "moment"
moment.locale("pt-br")

export const buscarEscalas = (status, data1, data2) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            Status: status
          },
          {
            Data: {
              $between: [data1, data2]
            }
          }
        ]
      },
      populate: ['Equipamento.Veiculos', 'EscalaFuncionarios.Funcionario.Cargo', 'EscalaVeiculos.Veiculo', 'Cliente.Integracoes.Funcionario.Cargo', 'OrdemServico', 'AgendamentoServicos', 'CriadoPor', 'Empresa']
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/escalas?${query}`, function (data) {
      const escalas = normalize(data)
      escalas?.forEach(element => {
        element.VeiculosAux = ''
        element.FuncionariosAux = ''
        element?.Veiculos?.map(item => { element.VeiculosAux += (`${item.Descricao}; `) })
        element?.Funcionarios?.map(item => { element.FuncionariosAux += (`${item.Nome}; `) })
      })
      if (data) {
        dispatch({
          type: "BUSCAR_ESCALAS",
          payload: escalas
        })
      } else {
        dispatch({
          type: "BUSCAR_ESCALAS_ERROR",
          payload:  data
        })
      } 
    })
  }
}

export const buscarEscalasOrdens = (data1, data2) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            Status: Enum_StatusEscalas.Aberta
          },
          {
            Data: {
              $between: [data1, data2]
            }
          }
        ]
      },
      populate: ['EscalaFuncionarios.Funcionario', 'EscalaVeiculos.Veiculo']
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/escalas?${query}`, function (data) {
      const escalas = normalize(data)
      if (data) {
        dispatch({
          type: "BUSCAR_ESCALAS",
          payload: escalas
        })
      } else {
        dispatch({
          type: "BUSCAR_ESCALAS_ERROR",
          payload:  data
        })
      } 
    })
  }
}
export const buscarEscalasRelatorio = (data1, data2, empresa, porFuncionario) => {
  const populate = porFuncionario ? ['Cliente', 'Empresa', 'EscalaFuncionarios.Funcionario'] : ['OrdemServico', 'Cliente', 'Equipamento', 'EscalaVeiculos.Veiculo', 'EscalaFuncionarios.Funcionario.Cargo', 'Empresa']
  const query = qs.stringify(
    {
      filters: porFuncionario ? {
        $and: [
          {
            Data: {
              $between: [data1, data2]
            }
          },
          {
            Empresa: {
              id: empresa
            }
          }
        ]
      } : {
        Data: {
          $between: [data1, data2]
        }
      },
      sort: {
        Data: 'asc'
      },
      populate
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/escalas?${query}`, function (data) {
      if (data) {
        const normalizado = normalize(data)
        const dados = []
        if (porFuncionario) {
          for (const x of normalizado.filter(f => f.Cliente?.id)) {
            for (const ef of x.EscalaFuncionarios.filter(f => !f.Ausente)) {
              if (ef.StatusOperacao !== 1 && ef.StatusOperacao !== 2) { //Ferias e Atestado
                dados.push({
                  id: x.id,
                  Data: moment(x.Data).local().format('DD/MM/YYYY'),
                  Cliente: x.Cliente?.RazaoSocial,
                  Cnpj: x.Cliente?.Cnpj,
                  Funcionario: ef.Funcionario.Nome
                })
              }
            }
          }
        } else {
          for (const x of normalizado) {
            let veiculosAux = ''
            let funcionariosAux = ''
            x?.EscalaVeiculos?.map(item => { veiculosAux += (`${item.Veiculo?.Placa}; `) })
            x?.EscalaFuncionarios?.map(item => { funcionariosAux += (`${item.Funcionario?.Nome}; `) })
  
            dados.push({
              id: x.id,
              Data: moment(x.Data).local().format('DD/MM/YYYY'),
              Hora: x.Hora ? moment(x.Hora, "HH:mm").format("HH:mm") : '',
              Cliente: x.Cliente?.RazaoSocial,
              Cnpj: x.Cliente?.Cnpj,
              Equipamento: x.Equipamento?.Equipamento,
              Veiculos: veiculosAux,
              Funcionarios: funcionariosAux,
              Observacoes: x.Observacoes,
              OrdemServico: x.OrdemServico ? `${x.OrdemServico?.Codigo}/${x.OrdemServico?.Numero}` : '-',
              Status: Lista_StatusEscala.find(y => y.value === x.Status)?.label
            })
          }
        }
        dispatch({
          type: "BUSCAR_ESCALAS_RELATORIO",
          payload: dados
        })
      } else {
        dispatch({
          type: "BUSCAR_ESCALAS_RELATORIO_ERROR",
          payload:  {data}
        })
      } 
    })
  }
}