const initialState = {
  lista: [],
  isFinishedAction: {},
  error: ''
}

const CargoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_CARGOS": {
      return { ...state, lista: action.payload }
    }
    case "BUSCAR_CARGOS_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "CARGO_SALVAR": {
      return { ...state, isFinishedAction: action.payload }
    }
    case "CARGO_SALVAR_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default CargoReducer

