const initialState = {
  precificacoes: [],
  precificacao: {},
  medicao: {},
  medicoes: [],
  medicoesStatus: [],
  statePrecificar: {},
  stateSalvar: {},
  stateCancelar:{},
  stateVerificacao:{},
  error: {},
  print: {},
  send: {},
  relatorio: []
};

const PrecificarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_ORDEM_PRECIFICACAO": {
      return { ...state, precificacao: action.payload };
    }
    case "BUSCAR_PRECIFICACAO": {
      return { ...state, precificacoes: action.payload };
    }
    case "BUSCAR_MEDICAO": {
      return { ...state, medicao: action.payload };
    }
    case "BUSCAR_MEDICOES": {
      return { ...state, medicoes: action.payload, print: {} };
    }
    case "BUSCAR_MEDICOES_ERROR": {
      return { ...state, error: action.payload };
    }
    case "BUSCAR_MEDICOES_CLIENTE": {
      return { ...state, medicoes: action.payload };
    }
    case "BUSCAR_MEDICOES_STATUS": {
      return { ...state, medicoesStatus: action.payload };
    }
    case "BUSCAR_MEDICOES_STATUS_ERROR": {
      return { ...state, error: action.payload };
    }
    case "BUSCAR_MEDICOES_RELATORIO": {
      return { ...state, relatorio: action.payload };
    }
    case "MEDICAO_PRECIFICAR": {
      return { ...state, statePrecificar: action.payload };
    }
    case "MEDICAO_PRECIFICACAO_PENDENTE": {
      return { ...state, stateVerificacao: action.payload };
    }
    case "MEDICAO_PRECIFICAR_ERROR": {
      return { ...state, error: action.payload };
    }
    case "MEDICAO_SALVAR": {
      return { ...state, stateSalvar: action.payload };
    }
    case "MEDICAO_SALVAR_ERROR": {
      return { ...state, error: action.payload };
    }
    case "MEDICAO_CANCELAR": {
      return { ...state, stateCancelar: action.payload };
    }
    case "MEDICAO_CANCELAR_ERROR": {
      return { ...state, error: action.payload };
    }
    case "IMPRIMIR_MEDICAO": {
      return { ...state, print: action.payload }
    }
    case "IMPRIMIR_MEDICAO_ERROR": {
      return { ...state, error: action.payload }
    }
    case "ENVIAR_MEDICAO": {
      return { ...state, send: action.payload }
    }
    case "ENVIAR_MEDICAO_ERROR": {
      return { ...state, error: action.payload }
    }
    default: {
      return state;
    }
  }
};

export default PrecificarReducer;
