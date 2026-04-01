const initialState = {
    lista: [],
    listaPagar: [],
    listaPagas: [],
    listaCanceladas: [],
    isFinishedAction: {},
    error: '',
    isFinishedImport: [],
    updateStatus: {},
    updateStatusCorrecao: {},
    listaAux: {},
    relatorio: [],
    nfIsValid: null
} 

const ContasAPagarReducer = (state = initialState, action) => {
      switch (action.type) {
        case "BUSCAR_CONTAS_A_CADASTRAR": {
          const list = action.payload.map(element => {
            element.VencimentoParcela = element.ContaPagamento?.ContaPagamentoParcela[0]?.DataVencimentoReal;
            return element;
          });
          return { ...state, lista: list }
        }
        case "BUSCAR_CONTAS_A_CADASTRAR_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "BUSCAR_CONTAS_A_PAGAR": {
          const list = action.payload.map(element => {
            element.VencimentoParcela = element.ContaPagamento?.ContaPagamentoParcela[0]?.DataVencimentoReal;
            element.DataVencimento = element.Parcela.DataVencimento;
            element.DataVencimentoReal = element.Parcela.DataVencimentoReal;
            return element;
          });
          return { ...state, listaPagar: list }
        }
        case "BUSCAR_CONTAS_A_PAGAR_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "BUSCAR_CONTAS_PAGAS": {
          const list = action.payload.map(element => {
            element.VencimentoParcela = element.ContaPagamento?.ContaPagamentoParcela[0]?.DataVencimentoReal;
            element.DataVencimento = element.Parcela.DataVencimento;
            element.DataVencimentoReal = element.Parcela.DataVencimentoReal;
            return element;
          });
          return { ...state, listaPagas: list }
        }
        case "BUSCAR_CONTAS_PAGAS_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "BUSCAR_CONTAS_CANCELADAS": {
          return { ...state, listaCanceladas: action.payload }
        }
        case "BUSCAR_CONTAS_CANCELADAS_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "BUSCAR_LISTAS_CONTAS_A_PAGAR": {
          return { ...state, listaAux: action.payload }
        }
        case "BUSCAR_LISTAS_CONTAS_A_PAGAR_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "BUSCAR_CONTAS_RELATORIO": {
          return { ...state, relatorio: action.payload }
        }
        case "BUSCAR_CONTAS_RELATORIO_ERROR": {
          return { ...state, error: action.payload.data }
        } 
        case "CONTAS_A_PAGAR_SALVAR_PARCELA": {
          return { ...state, isFinishedAction: action.payload.data }
        }
        case "CONTAS_A_PAGAR_SALVAR_PARCELA_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "CONTAS_A_PAGAR_SALVAR": {
          return { ...state, isFinishedAction: action.payload.data }
        }
        case "CONTAS_A_PAGAR_SALVAR_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "CONTAS_A_PAGAR_STATUS": {
          return { ...state, updateStatus: action.payload.data }
        }
        case "CONTAS_A_PAGAR_CORRECAO": {
          return { ...state, updateStatusCorrecao: action.payload.data }
        }
        case "CONTAS_A_PAGAR_STATUS_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "CONTAS_A_PAGAR_IMPORTAR": {
          return { ...state, isFinishedImport: action.payload.data }
        }
        case "VALIDAR_NF": {
          return { ...state, nfIsValid: action.payload }
        }
        case "VALIDAR_NF_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "CORRIGIR_PARCELA": {
          return { ...state, updateCorrecaoParcela: new Date() }
        }
        case "CORRIGIR_PARCELA_ERROR": {
          return { ...state, error: action.payload.data }
        }
        default: {
          return state
        }
      }
}

export default ContasAPagarReducer

