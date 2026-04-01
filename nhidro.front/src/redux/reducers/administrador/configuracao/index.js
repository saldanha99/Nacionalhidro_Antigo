const initialState = {
  configuracoes: [],
  isFinishedAction: {},
  error: ''
}

const ConfiguracaoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_CONFIGURACOES": {
      return { ...state, configuracoes: action.payload }
    }
    case "BUSCAR_CONFIGURACOES_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default ConfiguracaoReducer

