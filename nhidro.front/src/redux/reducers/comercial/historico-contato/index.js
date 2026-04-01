const initialState = {
  historicoContato: [],
  historicoContatoError: false,
  saveHistoricoSuccess: null
} 

const HistoricoContatoReducer = (state = initialState, action) => {
      switch (action.type) {
        case "LISTA_HISTORICO_CONTATO": {
          return { ...state, historicoContato: action.payload }
        }
        case "LISTA_HISTORICO_CONTATO_ERROR": {
          return { ...state, historicoContatoError: !state.historicoContatoError }
        }
        case "SALVAR_HISTORICO_CONTATO": {
          return { ...state, saveHistoricoSuccess: action.payload }
        }
        default: {
          return state
        }
      }
}

export default HistoricoContatoReducer

