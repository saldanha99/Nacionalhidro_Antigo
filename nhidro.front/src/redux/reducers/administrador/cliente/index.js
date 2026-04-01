const initialState = {
    listaClientes: [],
    listaClientesAtivos: [],
    listaClientesVendedor: [],
    clienteExiste: false,
    clienteExisteRazao: [],
    complementoCliente:{},
    createSuccess: false,
    createDocSuccess: null,
    createError: false,
    updateSuccess: false,
    updateError: false,
    sendEmail: false,
    sendEmailError: false,
    contatos: [],
    complementoCliente: [],
    error: []
} 

const ClienteReducer = (state = initialState, action) => {
      switch (action.type) {
        case "LISTA_CLIENTES": {
          return { ...state, listaClientes: action.payload }
        }
        case "LISTA_CLIENTES_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "LISTA_CLIENTES_ATIVOS": {
          return { ...state, listaClientesAtivos: action.payload }
        }
        case "LISTA_CLIENTES_ATIVOS_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "LISTA_CLIENTE_CONTATOS": {
          return { ...state, contatos: action.payload }
        }
        case "LISTA_CLIENTE_DOCUMENTOS": {
          return { ...state, documentos: action.payload }
        }
        case "LISTA_CLIENTES_VENDEDOR": {
          return { ...state, listaClientesVendedor: action.payload }
        }
        case "LISTA_CLIENTES_VENDEDOR_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "CLIENTE_EXISTE": {
          const existe = action.payload.length > 0
          return { ...state, clienteExiste: existe }
        }
        case "CLIENTE_EXISTE_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "CLIENTE_EXISTE_RAZAO": {
          return { ...state, clienteExisteRazao: action.payload }
        }
        case "CLIENTE_EXISTE_RAZAO_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "BUSCAR_CLIENTE_COMPLEMENTO": {
          return { ...state, complementoCliente: action.payload }
        }
        case "BUSCAR_CLIENTE_COMPLEMENTO_ERROR": {
          return { ...state, error: action.payload.data }
        }
        case "CRIAR_CLIENTE_COMPLEMENTO": {
          return { ...state, createSuccess: !state.createSuccess }
        }
        case "CRIAR_CLIENTE": {
          return { ...state, createSuccess: !state.createSuccess }
        }
        case "CRIAR_CLIENTE_COMPLEMENTO_ERROR": {
          return { ...state, error: action.payload.data, createError: !state.createError  }
        }
        case "CRIAR_CLIENTE_DOCUMENTO": {
          return { ...state, createDocSuccess: action.payload }
        }
        case "DELETAR_CLIENTE_DOCUMENTO": {
          return { ...state, deleteDocSuccess: action.payload }
        }
        case "ATUALIZAR_CLIENTE_COMPLEMENTO": {
            return { ...state, updateSuccess: !state.updateSuccess }
        }
        case "ATUALIZAR_CLIENTE": {
            return { ...state, updateSuccess: !state.updateSuccess }
        }
        case "ATUALIZAR_CLIENTE_COMPLEMENTO_ERROR": {
          return { ...state, error: action.payload, updateError: !action.updateError  }
        }
        case "UPDATE_FLAG": {
          const updateFlag =   { ...state, ...action.obj } 
          return  updateFlag 
        }  
        case "ENVIAR_EMAIL_CLIENTES": {
            return { ...state, sendEmail: !state.sendEmail }
        }
        case "ENVIAR_EMAIL_CLIENTES_ERROR": {
          return { ...state, sendEmailError: !state.sendEmailError  }
        }
        default: {
          return state
        }
      }
}

export default ClienteReducer

