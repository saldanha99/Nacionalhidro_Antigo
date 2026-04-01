const initialState = {
  equipamentos: [],
  equipamentosAtivos: [],
  isFinishedAction: {},
  error: ''
}

const EquipamentoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_EQUIPAMENTOS": {
      return { ...state, equipamentos: action.payload }
    }
    case "BUSCAR_EQUIPAMENTOS_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "BUSCAR_EQUIPAMENTOS_ATIVOS": {
      return { ...state, equipamentosAtivos: action.payload }
    }
    case "BUSCAR_EQUIPAMENTOS_ATIVOS_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "EQUIPAMENTO_SALVAR": {
      return { ...state, isFinishedAction: action.payload }
    }
    case "EQUIPAMENTO_SALVAR_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default EquipamentoReducer

