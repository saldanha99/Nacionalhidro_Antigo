import api from "@src/services/api"
import qs from "qs"
import { normalize } from '../../../../utility/Utils'
import { Enum_StatusOrdens, Enum_StatusPrecificacao, Lista_StatusOrdem } from "../../../../utility/enum/Enums"
import moment from "moment"

export const buscarOrdens = (status, data1, data2) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            Status: status
          },
          {
            DataInicial: {
              $between: [data1, data2]
            }
          }
        ]
      },
      populate: ['Proposta.PropostaEquipes.Cargo', 'Proposta.PropostaEquipes.Equipamento', 'Proposta.PropostaEquipamentos.Equipamento.Veiculos', 'Servicos', 'Servicos.ServicosHorasAdicionais','Cliente.Contatos', 'Contato', 'Equipamento', 'Escala.Equipamento.Veiculos', 'Escala.EscalaVeiculos.Veiculo', 'Escala.EscalaFuncionarios.Funcionario.Cargo', 'DiasSemana', 'CriadoPor', 'Empresa']
    },
    {
      encodeValuesOnly: true // prettify url
    })
  return (dispatch) => {
    api.get(`api/ordem-servicos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_ERROR",
          payload:  data
        })
      } 
    })
  }
}
export const buscarOrdensRaw = (status, data1, data2) => {
  return (dispatch) => {
    api.post("/api/ordem-servicos/buscar", {params: {Data1: data1, Data2: data2, Status: status}}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_ORDENS",
          payload: data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_ERROR",
          payload: data
        })
      }
    })
  }
}
export const buscarOrdem = (id) => {
  const query = qs.stringify(
    {
      populate: ['Proposta.PropostaEquipes.Cargo', 'Proposta.PropostaEquipes.Equipamento', 'Proposta.PropostaEquipamentos.Equipamento.Veiculos', 'Servicos', 'Cliente.Contatos', 'Contato', 'Equipamento', 'Escala.Equipamento.Veiculos', 'Escala.EscalaVeiculos.Veiculo', 'Escala.EscalaFuncionarios.Funcionario.Cargo', 'DiasSemana', 'CriadoPor', 'Empresa']
    },
    {
      encodeValuesOnly: true // prettify url
    }
  )
  return (dispatch) => {
    api.get(`/api/ordem-servicos/${id}?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_ORDEM_ID",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_ERROR",
          payload: data
        })
      }
    })
  }
}
export const buscarOrdensPorCliente = (cliente, data1, data2) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            Cliente: {
              id: cliente
            }
          },
          {
            DataInicial: {
              $between: [data1, data2]
            }
          }
        ]
      },
      populate: ['Proposta', 'Cliente', 'Contato', 'OrdemEquipamento.Equipamento', 'CriadoPor', 'Equipamento', 'Empresa']
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/ordem-servicos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_CLIENTE",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_CLIENTE_ERROR",
          payload:  data
        })
      } 
    })
  }
}

export const buscarOrdensEscala = () => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            Status: Enum_StatusOrdens.Aberta
          }
        ]
      },
      populate: ['Empresa', 'Cliente', 'Equipamento']
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/ordem-servicos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_ERROR",
          payload:  data
        })
      } 
    })
  }
}
export const buscarUltimoCodigo = (codigo) => {
  const query = qs.stringify(
    {
      filters: {
        Codigo: codigo
      },
      sort: ['Numero:desc'],
      pagination: {
        start: 0,
        limit: 1
      }
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/ordem-servicos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_CODIGO_ORDENS",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_CODIGO_ORDENS_ERROR",
          payload:  data
        })
      } 
    })
  }
}
export const buscarPropostasRaw = (data1, data2) => {
  return (dispatch) => {
    api.post("/api/ordem-servicos/buscar-propostas", {params: {Data1: data1, Data2: data2 }}, function (status, data) {
      if (status === 200) {
        dispatch({
          type: "BUSCAR_PROPOSTAS_ORDENS",
          payload: data.data
        })
      } else {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_ERROR",
          payload: data
        })
      }
    })
  }
}
export const buscarProposta = (id) => {
  const query = qs.stringify(
    {
      populate: ['Empresa', 'Cliente.Contatos', 'Contato', 'PropostaEquipes.Cargo', 'PropostaEquipamentos.Equipamento.Veiculos']
    },
    {
      encodeValuesOnly: true // prettify url
    }
  )
  return (dispatch) => {
    api.get(`/api/propostas/${id}?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_PROPOSTA",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_ERROR",
          payload: data
        })
      }
    })
  }
}
export const buscarOrdensMedicao = (model) => {
  const query = qs.stringify(
    {
      filters: {
        $and: [
          {
            Cliente: {
              id: model.Cliente.id
            }
          },
          {
            Status: Enum_StatusOrdens.Executada
          },
          {
            $or: [
              {
                StatusPrecificacao: {
                  $ne: Enum_StatusPrecificacao.EmMedicao
                }
              },
              {
                StatusPrecificacao: {
                  $null: true
                }
              }
            ]
          },
          model.Proposta?.id ?
          {
            Proposta: {
              id: model.Proposta.id
            }
          } : {},
          model.Data?.length > 0 ?
          {
            DataInicial: {
              $between: [model.Data[0], model.Data[1]]
            }
          } : {}
        ]
      },
      sort: 'DataInicial:asc',
      populate: ['Cliente', 'Contato', 'Equipamento', 'Servicos']
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/ordem-servicos?${query}`, function (data) {
      if (data) {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_MEDICAO",
          payload: normalize(data)
        })
      } else {
        dispatch({
          type: "BUSCAR_ORDENS_SERVICO_MEDICAO_ERROR",
          payload:  data
        })
      } 
    })
  }
}
export const buscarOrdensRelatorio = (data1, data2, empresa, porFuncionario) => {
  const populate = porFuncionario ? ['Cliente', 'Empresa', 'Escala', 'Escala.EscalaFuncionarios.Funcionario', 'Proposta', 'BaixadoPor'] : ['Cliente', 'Empresa', 'Proposta']
  const query = qs.stringify(
    {
      filters: porFuncionario ? {
        $and: [
          {
            DataInicial: {
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
        DataInicial: {
          $between: [data1, data2]
        }
      },
      sort: {
        DataInicial: 'asc'
      },
      populate
    },
    {
      encodeValuesOnly: true // prettify url
    })

  return (dispatch) => {
    api.get(`api/ordem-servicos?${query}`, function (data) {
      if (data) {
        const normalizado = normalize(data)
        const dados = []
        if (porFuncionario) {
          for (const x of normalizado.filter(f => f.Cliente?.id)) {
            if (!x.Escala) continue;
            for (const ef of x.Escala?.EscalaFuncionarios?.filter(f => !f.Ausente)) {
              if (ef.StatusOperacao !== 1 && ef.StatusOperacao !== 2) { //Ferias e Atestado
                dados.push({
                  id: x.id,
                  Data: moment(x.DataInicial).local().format('DD/MM/YYYY'),
                  DataBaixa: moment(x.DataBaixa).local().format('DD/MM/YYYY'),
                  Cliente: x.Cliente?.RazaoSocial,
                  Cnpj: x.Cliente?.Cnpj,
                  Empresa: x.Empresa?.Descricao,
                  Proposta: x.Proposta?.Codigo,
                  Funcionario: ef.Funcionario?.Nome,
                  UsuarioBaixa: x.BaixadoPor?.email,
                  Codigo: `${x?.Codigo}/${x?.Numero}`,
                  Status: Lista_StatusOrdem.find(y => y.value === x.Status)?.label,
                  Observacoes: x.Observacoes
                })
              }
            }
          }
        } else {
          for (const x of normalizado) {
            dados.push({
              id: x.id,
              Data: moment(x.DataInicial).local().format('DD/MM/YYYY'),
              Hora: x.HoraInicial ? moment(x.HoraInicial, "HH:mm").format("HH:mm") : '',
              Cliente: x.Cliente?.RazaoSocial,
              Cnpj: x.Cliente?.Cnpj,
              Empresa: x.Empresa?.Descricao,
              Proposta: x.Proposta?.Codigo,
              Codigo: `${x?.Codigo}/${x?.Numero}`,
              Status: Lista_StatusOrdem.find(y => y.value === x.Status)?.label,
              Observacoes: x.Observacoes
            })
          }
        }
        dispatch({
          type: "BUSCAR_ORDENS_RELATORIO",
          payload: dados
        })
      }
    })
  }
}