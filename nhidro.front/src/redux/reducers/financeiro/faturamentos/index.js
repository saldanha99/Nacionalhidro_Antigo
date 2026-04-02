const initialState = {
    faturamentos: [],
    item: {},
    stateCancelar:{},
    stateSalvar:{},
    stateNFS:{},
    stateConsultarNFSe:{},
    faturamentoStatus:{},
    print: {},
    error:{},
    errorNFS:{},
    errorConsultarNFSe:{},
    relatorio: []
  };
  
  const FaturamentoReducer = (state = initialState, action) => {
    switch (action.type) {
      case "BUSCAR_FATURAMENTO": {
        return { ...state, faturamentos: action.payload };
      }
      case "BUSCAR_FATURAMENTO_ID": {
        return { ...state, item: action.payload };
      }
      case "BUSCAR_FATURAMENTO_ERROR": {
        return { ...state, error: action.payload };
      }
      case "FATURAMENTO_CANCELAR": {
        return { ...state, stateCancelar: action.payload };
      }
      case "FATURAMENTO_CANCELAR_ERROR": {
        return { ...state, error: action.payload };
      }
      case "FATURAMENTO_SALVAR": {
        return { ...state, stateSalvar: action.payload };
      }
      case "FATURAMENTO_SALVAR_ERROR": {
        return { ...state, error: action.payload };
      }
      case "NFS_SALVAR": {
        return { ...state, stateNFS: action.payload };
      }
      case "NFS_SALVAR_ERROR": {
        return { ...state, errorNFS: action.payload };
      }
      case "CONSULTAR_NFSE_SUCCESS": {
        return { ...state, stateConsultarNFSe: action.payload };
      }
      case "CONSULTAR_NFSE_ERROR": {
        return { ...state, errorConsultarNFSe: action.payload };
      }
      case "BUSCAR_FATURAMENTO_STATUS": {
        return { ...state, faturamentoStatus: action.payload };
      }
      case "BUSCAR_FATURAMENTO_STATUS_ERROR": {
        return { ...state, error: action.payload };
      }
      case "BUSCAR_FATURAMENTOS_CLIENTE": {
        return { ...state, faturamentos: action.payload };
      }
      case "BUSCAR_FATURAMENTOS_RELATORIO": {
        return { ...state, relatorio: action.payload };
      }
      case "IMPRIMIR_FATURAMENTO": {
        return { ...state, print: action.payload }
      }
      case "IMPRIMIR_FATURAMENTO_ERROR": {
        return { ...state, error: action.payload }
      }
      case "ENVIAR_FATURAMENTO": {
        return { ...state, stateSalvar: action.payload };
      }
      case "ENVIAR_FATURAMENTO_ERROR": {
        return { ...state, error: action.payload };
      }
      case "CANCELAR_FATURAMENTO": {
        return { ...state, stateCancelar: action.payload };
      }
      case "CANCELAR_FATURAMENTO_ERROR": {
        return { ...state, error: action.payload };
      }
      default: {
        return state;
      }
    }
  };
  
  export default FaturamentoReducer;
