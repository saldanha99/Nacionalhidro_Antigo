const initialState = {
  lista: [],
  vendedores: [],
  aprovadores: [],
  roles: [],
  isFinishedAction: {},
  error: ''
}

const UsuarioReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BUSCAR_USUARIOS": {
      return { ...state, lista: action.payload }
    }
    case "BUSCAR_USUARIOS_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "BUSCAR_VENDEDORES": {
      return { ...state, vendedores: action.payload }
    }
    case "BUSCAR_APROVADORES": {
      return { ...state, aprovadores: action.payload }
    }
    case "BUSCAR_VENDEDORES_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "BUSCAR_ROLES": {
      return { ...state, roles: _.sortBy(action.payload.roles, 'name') }
    }
    case "BUSCAR_ROLES_ERROR": {
      return { ...state, error: action.payload.data }
    }
    case "SALVAR_USUARIO": {
      return { ...state, isFinishedAction: action.payload }
    }
    case "SALVAR_USUARIO_ERROR": {
      return { ...state, error: action.payload.data }
    }
    default: {
      return state
    }
  }
}

export default UsuarioReducer

