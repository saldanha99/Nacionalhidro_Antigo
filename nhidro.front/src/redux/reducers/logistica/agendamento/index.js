const initialState = {
  agendamentos: [],
  isFinishedAction: {},
  error: ''
} 

const AgendamentoReducer = (state = initialState, action) => {
      switch (action.type) {
        case "BUSCAR_AGENDAMENTOS": {
          return { ...state, agendamentos: action.payload }
        }
        case "BUSCAR_AGENDAMENTOS_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "SALVAR_AGENDAMENTO": {
          return { ...state, isFinishedAction: action.payload }
        }
        case "SALVAR_AGENDAMENTO_ERROR": {
          return { ...state, error: action.payload.data }
        }
        default: {
          return state
        }
      }
}

export default AgendamentoReducer

