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
  const populate = [
    'Cliente',
    'Empresa',
    'Equipamento',
    'OrdemServico',
    'Veiculos',
    'Funcionarios',
    'EscalaVeiculos.Veiculo',
    'EscalaFuncionarios.Funcionario',
    'EscalaFuncionarios.Funcionario.Cargo'
  ]
  
  const parseToIso = (d) => {
    if (!d) return moment().format('YYYY-MM-DD')
    if (d instanceof Date) return moment(d).format('YYYY-MM-DD')
    const m = moment(d, ['DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD', moment.ISO_8601])
    return m.isValid() ? m.format('YYYY-MM-DD') : moment(d).format('YYYY-MM-DD')
  }

  const d1 = parseToIso(data1)
  const d2 = parseToIso(data2)

  const filterConditions = [
    {
      Data: {
        $between: [d1, d2]
      }
    }
  ]

  if (porFuncionario && empresa && Number(empresa) > 0) {
    filterConditions.push({
      Empresa: {
        id: {
          $eq: Number(empresa)
        }
      }
    })
  }

  const query = qs.stringify(
    {
      filters: {
        $and: filterConditions
      },
      pagination: {
        limit: 10000,
        pageSize: 10000
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
        const listaNormalizada = Array.isArray(normalizado) ? normalizado : (normalizado?.data && Array.isArray(normalizado.data) ? normalizado.data : [])
        const dados = []
        if (porFuncionario) {
          for (const x of listaNormalizada) {
            const funcionariosList = []
            if (x?.EscalaFuncionarios?.length > 0) {
              for (const ef of x.EscalaFuncionarios) {
                if (!ef?.Ausente && ef?.StatusOperacao !== 1 && ef?.StatusOperacao !== 2) {
                  const nome = ef?.Funcionario?.Nome || ef?.Nome
                  if (nome) funcionariosList.push(nome)
                }
              }
            }
            if (funcionariosList.length === 0 && x?.Funcionarios?.length > 0) {
              for (const f of x.Funcionarios) {
                const nome = f?.Nome || f?.Funcionario?.Nome
                if (nome) funcionariosList.push(nome)
              }
            }

            if (funcionariosList.length === 0) {
              dados.push({
                id: x.id,
                Data: x.Data ? moment(x.Data).local().format('DD/MM/YYYY') : '-',
                Cliente: x.Cliente?.RazaoSocial || x.Cliente?.Nome || '-',
                Cnpj: x.Cliente?.Cnpj || '-',
                Funcionario: '-'
              })
            } else {
              for (const nome of funcionariosList) {
                dados.push({
                  id: x.id,
                  Data: x.Data ? moment(x.Data).local().format('DD/MM/YYYY') : '-',
                  Cliente: x.Cliente?.RazaoSocial || x.Cliente?.Nome || '-',
                  Cnpj: x.Cliente?.Cnpj || '-',
                  Funcionario: nome
                })
              }
            }
          }
        } else {
          for (const x of listaNormalizada) {
            let veiculosAux = ''
            let funcionariosAux = ''
            if (x?.EscalaVeiculos?.length > 0) {
              x.EscalaVeiculos.forEach(item => {
                const placa = item.Veiculo?.Placa || item.Veiculo?.Descricao || item.Placa || item.Descricao || ''
                if (placa) veiculosAux += `${placa}; `
              })
            }
            if (!veiculosAux && x?.Veiculos?.length > 0) {
              x.Veiculos.forEach(item => {
                const placa = item.Placa || item.Descricao || ''
                if (placa) veiculosAux += `${placa}; `
              })
            }

            if (x?.EscalaFuncionarios?.length > 0) {
              x.EscalaFuncionarios.forEach(item => {
                const nome = item.Funcionario?.Nome || item.Nome || ''
                if (nome) funcionariosAux += `${nome}; `
              })
            }
            if (!funcionariosAux && x?.Funcionarios?.length > 0) {
              x.Funcionarios.forEach(item => {
                const nome = item.Nome || ''
                if (nome) funcionariosAux += `${nome}; `
              })
            }

            dados.push({
              id: x.id,
              Data: x.Data ? moment(x.Data).local().format('DD/MM/YYYY') : '-',
              Hora: x.Hora ? moment(x.Hora, "HH:mm").format("HH:mm") : '',
              Cliente: x.Cliente?.RazaoSocial || x.Cliente?.Nome || '-',
              Cnpj: x.Cliente?.Cnpj || '-',
              Equipamento: x.Equipamento?.Equipamento || x.Equipamento?.Descricao || '-',
              Veiculos: veiculosAux || '-',
              Funcionarios: funcionariosAux || '-',
              Observacoes: x.Observacoes || '',
              OrdemServico: x.OrdemServico ? `${x.OrdemServico?.Codigo || ''}/${x.OrdemServico?.Numero || ''}` : '-',
              Status: Lista_StatusEscala.find(y => y.value === x.Status)?.label || '-'
            })
          }
        }
        dispatch({
          type: "BUSCAR_ESCALAS_RELATORIO",
          payload: dados
        })
      } else {
        dispatch({
          type: "BUSCAR_ESCALAS_RELATORIO",
          payload: []
        })
      } 
    })
  }
}