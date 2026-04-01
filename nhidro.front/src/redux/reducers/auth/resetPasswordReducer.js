export const resetPassword = (state = {reset:{} }, action) => {
    switch (action.type) {
      case "RESET_PASSWORD": {
        return { ...state, reset: action.payload }
      }
      case "RESET_PASSWORD_ERROR": {
        return { ...state, error: action.payload.data }
      }
      default: {
        return state
      }
    }
  }
  