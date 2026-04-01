const initialState = {
    lista: [],
    isFinishedAction: {},
    error: ''
} 

const FornecedorReducer = (state = initialState, action) => {
      switch (action.type) {
        case "BUSCAR_FORNECEDORES": {
          return { ...state, lista: action.payload }
        }
        case "BUSCAR_FORNECEDORES_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "FORNECEDOR_SALVAR": {
          return { ...state, isFinishedAction: action.payload }
        }
        case "FORNECEDOR_SALVAR_ERROR": {
          return { ...state, error: action.payload.data }
        }
        default: {
          return state
        }
      }
}

export default FornecedorReducer

