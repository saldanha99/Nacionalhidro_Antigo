// **  Initial State
const initialState = {
    user: []
 }
  
export const authReducer = (state = initialState, action) => {
   
  switch (action.type) {
        case "LOGIN":
          return { ...state, user: action.payload }
        case "LOGIN_ERROR": {
          return { ...state, error: action.payload }
        }
        case "LOGOUT":
          return { ...state, user: {} }
        default:
          return state
    }
} 
  