const initialState = {
  lista: [],
  isFinishedAction: {},
  error: ''
}

const VeiculoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_VEICULOS": {
      return { ...state, lista: action.payload }
    }
    case "BUSCAR_VEICULOS_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "SALVAR_VEICULO": {
      return { ...state, isFinishedAction: action.payload }
    }
    case "SALVAR_VEICULO_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default VeiculoReducer

