const initialState = {
  ordens: [],
  new_ordens: [],
  ordem: {},
  ordensClientes: [],
  propostas: [],
  proposta: {},
  ordensMedicao: [],
  isFinishedAction: {},
  print: {},
  error: '',
  ultimoCodigo: null,
  relatorio: []
} 

const OrdemServicoReducer = (state = initialState, action) => {
      switch (action.type) {
        case "BUSCAR_ORDENS_SERVICO": {
          return { ...state, ordens: action.payload }
        }
        case "BUSCAR_ORDENS": {
          return { ...state, new_ordens: action.payload }
        }
        case "BUSCAR_ORDEM_ID": {
          return { ...state, ordem: action.payload }
        }
        case "BUSCAR_ORDENS_SERVICO_ERROR": {
          return { ...state, error: action.payload }
        }
        case "BUSCAR_ORDENS_SERVICO_CLIENTE": {
          return { ...state, ordensClientes: action.payload }
        }
        case "BUSCAR_ORDENS_SERVICO_CLIENTE_ERROR": {
          return { ...state, error: action.payload }
        }
        case "BUSCAR_PROPOSTAS_ORDENS": {
          return { ...state, propostas: action.payload }
        }
        case "BUSCAR_PROPOSTA": {
          return { ...state, proposta: action.payload }
        }
        case "BUSCAR_ORDENS_SERVICO_MEDICAO": {
          return { ...state, ordensMedicao: action.payload }
        }
        case "BUSCAR_ORDENS_SERVICO_MEDICAO_ERROR": {
          return { ...state, error: action.payload }
        }
        case "BUSCAR_CODIGO_ORDENS": {
          return { ...state, ultimoCodigo: action.payload }
        }
        case "BUSCAR_CODIGO_ORDENS_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "BUSCAR_ORDENS_RELATORIO": {
          return { ...state, relatorio: action.payload }
        }
        case "SALVAR_ORDEM_SERVICO": {
          return { ...state, isFinishedAction: action.payload }
        }
        case "SALVAR_ORDEM_SERVICO_ERROR": {
          return { ...state, error: action.payload }
        }
        case "IMPRIMIR_ORDEM_SERVICO": {
          return { ...state, print: action.payload }
        }
        case "IMPRIMIR_ORDEM_SERVICO_ERROR": {
          return { ...state, error: action.payload }
        }
        case "VISUALIZAR_MEDICAO": {
          return { ...state, print: action.payload }
        }
        default: {
          return state
        }
      }
}

export default OrdemServicoReducer

