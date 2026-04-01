const initialState = {
  lista: [],
  isFinishedAction: {},
  error: ''
}

const ResponasbilidadeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_RESPONSABILIDADES": {
      return { ...state, lista: action.payload }
    }
    case "BUSCAR_RESPONSABILIDADES_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "RESPONSABILIDADE_SALVAR": {
      return { ...state, isFinishedAction: action.payload }
    }
    case "RESPONSABILIDADE_SALVAR_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default ResponasbilidadeReducer

