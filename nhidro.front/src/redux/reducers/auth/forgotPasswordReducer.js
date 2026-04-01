

export const forgotPassword = (state = {forgot:{} }, action) => {
    switch (action.type) {
      case "FORGOT_PASSWORD": {
        return { ...state, forgot: action.payload }
      }
      case "FORGOT_PASSWORD_ERROR": {
        return { ...state, error: action.payload.data }
      }
      default: {
        return state
      }
    }
  }
  