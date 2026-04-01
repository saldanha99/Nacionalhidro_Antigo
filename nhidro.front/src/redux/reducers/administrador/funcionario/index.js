const initialState = {
  lista: [],
  isFinishedAction: {},
  error: ''
}

const FuncionarioReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_FUNCIONARIOS": {
      return { ...state, lista: action.payload }
    }
    case "BUSCAR_FUNCIONARIOS_ATIVOS": {
      return { ...state, lista: action.payload }
    }
    case "BUSCAR_FUNCIONARIOS_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "SALVAR_FUNCIONARIO": {
      return { ...state, isFinishedAction: action.payload }
    }
    case "SALVAR_FUNCIONARIO_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default FuncionarioReducer

