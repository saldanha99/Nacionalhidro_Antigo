const initialState = {
    lista: [],
    isFinishedAction: {},
    error: ''
} 

const NaturezaReducer = (state = initialState, action) => {
      switch (action.type) {
        case "BUSCAR_NATUREZAS": {
          return { ...state, lista: action.payload }
        }
        case "BUSCAR_NATUREZAS_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "NATUREZA_SALVAR": {
          return { ...state, isFinishedAction: action.payload }
        }
        case "NATUREZA_SALVAR_ERROR": {
          return { ...state, error: action.payload.data }
        }
        default: {
          return state
        }
      }
}

export default NaturezaReducer

