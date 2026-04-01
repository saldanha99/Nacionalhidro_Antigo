const initialState = {
  empresas: [],
  empresasBancos: [],
  documentos: [],
  isFinishedAction: {},
  error: ''
} 

const EmpresaReducer = (state = initialState, action) => {
    switch (action.type) {
      case "BUSCAR_EMPRESAS": {
        return { ...state, empresas: action.payload }
      }
      case "BUSCAR_EMPRESAS_ERROR": {
        return { ...state, error: action.payload.data }
      } 
      case "BUSCAR_EMPRESAS_BANCOS": {
        return { ...state, empresasBancos: action.payload }
      }
      case "BUSCAR_EMPRESAS_BANCOS_ERROR": {
        return { ...state, error: action.payload }
      } 
      case "LISTA_EMPRESA_DOCUMENTOS": {
        return { ...state, documentos: action.payload }
      }
      case "EMPRESA_SALVAR": {
        return { ...state, isFinishedAction: action.payload }
      }
      case "EMPRESA_SALVAR_ERROR": {
        return { ...state, error: action.payload.data }
      }
      case "CRIAR_EMPRESA_DOCUMENTO": {
        return { ...state, createDocSuccess: action.payload }
      }
      case "DELETAR_EMPRESA_DOCUMENTO": {
        return { ...state, deleteDocSuccess: action.payload }
      }
      default: {
        return state
      }
    }
}

export default EmpresaReducer

