const initialState = {
  lista: [],
  isFinishedAction: {},
  error: ''
}

const VendedorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_VENDEDORES": {
      return { ...state, lista: action.payload }
    }
    case "BUSCAR_VENDEDORES_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "VENDEDOR_SALVAR": {
      return { ...state, isFinishedAction: action.payload }
    }
    case "VENDEDOR_SALVAR_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default VendedorReducer

