import { combineReducers } from "redux"
import { login } from "./loginReducer"
import { forgotPassword } from "./forgotPasswordReducer"
import { resetPassword } from "./resetPasswordReducer"
import { authReducer } from "./authReducer"

const authReducers = combineReducers({
  login,
  forgotPassword,
  resetPassword,
  authReducer
})

export default authReducers
