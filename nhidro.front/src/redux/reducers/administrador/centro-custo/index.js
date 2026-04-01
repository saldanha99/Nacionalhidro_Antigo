const initialState = {
    lista: [],
    isFinishedAction: {},
    error: ''
} 

const CentroCustoReducer = (state = initialState, action) => {
      switch (action.type) {
        case "BUSCAR_CENTROSCUSTO": {
          return { ...state, lista: action.payload }
        }
        case "BUSCAR_CENTROSCUSTO_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "CENTROCUSTO_SALVAR": {
          return { ...state, isFinishedAction: action.payload }
        }
        case "CENTROCUSTO_SALVAR_ERROR": {
          return { ...state, error: action.payload.data }
        }
        default: {
          return state
        }
      }
}

export default CentroCustoReducer

