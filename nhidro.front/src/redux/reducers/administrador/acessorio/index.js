const initialState = {
  lista: [],
  isFinishedAction: {},
  error: ''
}

const AcessorioReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_ACESSORIOS": {
      return { ...state, lista: action.payload }
    }
    case "BUSCAR_ACESSORIOS_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "ACESSORIO_SALVAR": {
      return { ...state, isFinishedAction: action.payload }
    }
    case "ACESSORIO_SALVAR_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default AcessorioReducer

