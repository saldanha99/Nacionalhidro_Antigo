const initialState = {
  propostas: [],
  propostasClientes: [],
  propostasMedicao: [],
  relatorio: [],
  isFinishedAction: {},
  error: '',
  ultimoCodigo: null
} 

const PropostaReducer = (state = initialState, action) => {
      switch (action.type) {
        case "BUSCAR_PROPOSTAS": {
          return { ...state, propostas: action.payload }
        }
        case "BUSCAR_PROPOSTAS_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "BUSCAR_PROPOSTAS_CLIENTE": {
          return { ...state, propostasClientes: action.payload }
        }
        case "BUSCAR_PROPOSTAS_CLIENTE_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "BUSCAR_PROPOSTAS_MEDICAO": {
          return { ...state, propostasMedicao: action.payload }
        }
        case "BUSCAR_PROPOSTAS_MEDICAO_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "BUSCAR_CODIGO_PROPOSTAS": {
          return { ...state, ultimoCodigo: action.payload }
        }
        case "BUSCAR_CODIGO_PROPOSTAS_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "BUSCAR_PROPOSTAS_RELATORIO": {
          return { ...state, relatorio: action.payload }
        }
        case "BUSCAR_PROPOSTAS_RELATORIO_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "SALVAR_PROPOSTA": {
          return { ...state, isFinishedAction: action.payload }
        }
        case "SALVAR_PROPOSTA_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "ENVIAR_PROPOSTA": {
          return { ...state, isFinishedAction: action.payload }
        }
        case "ENVIAR_PROPOSTA_ERROR": {
          return { ...state, error: action.payload.data }
        }
        default: {
          return state
        }
      }
}

export default PropostaReducer

