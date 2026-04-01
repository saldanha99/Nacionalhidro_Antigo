const initialState = {
  lista: [],
  isFinishedAction: {},
  error: ''
}

const GarantiaReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_GARANTIAS": {
      return { ...state, lista: action.payload }
    }
    case "BUSCAR_GARANTIAS_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "GARANTIA_SALVAR": {
      return { ...state, isFinishedAction: action.payload }
    }
    case "GARANTIA_SALVAR_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default GarantiaReducer

