const initialState = {
    contasReceber: [],
    parcelas: [],
    parcelaReceber: {},
    parcelaRecebida: {},
    stateSalvar: {},
    isFinishedAction: {},
    send: {},
    item: {},
    error: {},
    relatorio: [],
    notaIsValid: true
  };
  
  const ContasReceberReducer = (state = initialState, action) => {
    switch (action.type) {
      case "BUSCAR_CONTAS_RECEBER": {
        return { ...state, contasReceber: action.payload };
      }
      case "BUSCAR_CONTAS_RECEBER_ID": {
        return { ...state, item: action.payload };
      }
      case "BUSCAR_CONTAS_RECEBER_CLIENTE": {
        return { ...state, contasReceber: action.payload };
      }
      case "BUSCAR_CONTAS_RECEBER_RELATORIO": {
        return { ...state, relatorio: action.payload };
      }
      case "BUSCAR_CONTAS_RECEBER_ERROR": {
        return { ...state, error: action.payload };
      }
      case "CONTAS_RECEBER_SALVAR": {
        return { ...state, stateSalvar: action.payload.data }
      }
      case "CONTAS_RECEBER_SALVAR_ERROR": {
        return { ...state, error: action.payload.data }
      }
      case "ENVIAR_CONTAS_RECEBER": {
        return { ...state, send: action.payload }
      }
      case "ENVIAR_CONTAS_RECEBER_ERROR": {
        return { ...state, error: action.payload }
      }
      case "BUSCAR_PARCELA_RECEBER": {
        return { ...state, parcelaReceber: action.payload };
      }
      case "BUSCAR_PARCELA_RECEBIDA": {
        return { ...state, parcelaRecebida: action.payload };
      }
      case "BUSCAR_PARCELAS": {
        return { ...state, parcelas: action.payload };
      }
      case "BUSCAR_PARCELAS_ERROR": {
        return { ...state, error: action.payload };
      } 
      case "CONTAS_A_RECEBER_SALVAR_PARCELA": {
        return { ...state, isFinishedAction: action.payload.data }
      }
      case "VALIDAR_NOTA_RECEBER": {
        return { ...state, notaIsValid: action.payload }
      }
      default: {
        return state;
      }
    }
  };
  
  export default ContasReceberReducer;
