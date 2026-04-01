export const login = (state = {user:{}, role: '' }, action) => {
  switch (action.type) {
    case "LOGIN_WITH_FB": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_GOOGLE": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_PASSWORD_LESS": {
      return { ...state, user: action.payload }
    }
    case "LOGIN_PASSWORD_LESS_ERROR": {
      return { ...state, error: action.payload }
    }
    case "LOGIN_WITH_JWT": {
      return { ...state, user: action.payload }
    }
    case "LOGIN_WITH_JWT_ERROR": {
      return { ...state, error: action.payload }
    }
    case "LOGOUT_WITH_JWT": {
      return { ...state, values: action.payload }
    }
    case "GET_ROLES": {
      return { ...state, role: action.payload }
    }
    case "GET_ROLES_ERROR": {
      return { ...state, error: action.payload }
    }
    default: {
      return state
    }
  }
}
