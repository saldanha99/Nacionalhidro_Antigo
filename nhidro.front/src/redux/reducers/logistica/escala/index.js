const initialState = {
  escalas: [],
  escalasClientes: [],
  relatorio: [],
  isFinishedAction: {},
  error: ''
} 

const EscalaReducer = (state = initialState, action) => {
      switch (action.type) {
        case "BUSCAR_ESCALAS": {
          return { ...state, escalas: action.payload }
        }
        case "BUSCAR_ESCALAS_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "BUSCAR_ESCALAS_CLIENTE": {
          return { ...state, escalasClientes: action.payload }
        }
        case "BUSCAR_ESCALAS_CLIENTE_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "BUSCAR_ESCALAS_RELATORIO": {
          return { ...state, relatorio: action.payload }
        }
        case "BUSCAR_ESCALAS_RELATORIO_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "SALVAR_ESCALA": {
          return { ...state, isFinishedAction: action.payload }
        }
        case "SALVAR_ESCALA_ERROR": {
          return { ...state, error: action.payload.data }
        }
        default: {
          return state
        }
      }
}

export default EscalaReducer

