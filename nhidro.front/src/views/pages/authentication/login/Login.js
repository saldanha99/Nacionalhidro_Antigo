import { useSkin } from '@hooks/useSkin'
import React, { useState, useEffect } from "react"
import { Link, Redirect } from 'react-router-dom'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'
import { Row, Col, CardTitle, CardText, Form, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import { loginWithJWT, getRole } from "@src/redux/actions/auth/loginActions"
import { submitEmail } from "@src/redux/actions/auth/loginActionsPasswordLess"
import { forgotPassword } from "@src/redux/actions/auth/forgotPasswordActions"
import { resetPassword } from "@src/redux/actions/auth/resetPasswordActions"
import { connect } from "react-redux"
import auth from "@src/services/auth"
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import {ToastContent } from "@utils"
import { toast, Slide, ToastContainer } from "react-toastify"
import Authenticate from './Authenticate'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import queryString from "query-string"

const Login = (props) => {
  const [stateLogin, setStateLogin] = useState({
    identifier: "",
    password: ""
  })
  const [stateForgotPassword, setStateForgotPassword] = useState({
    identifier: ""
  })
  const [stateResetPassword, setStateResetPassword] = useState({
    password: "",
    passwordConfirmation: ""
  })
  const [dataUser, setDataUser] = useState({})
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  const urlImageNacionalHidro = require(`@src/assets/images/pages/users-nacional-hidro.png`).default
  const urlImageNacionalLargest = require(`@src/assets/images/pages/nacional-hidro-largest.png`).default
  const urlImageLogo = require(`@src/assets/images/logo/logo-white.png`).default

  const handleComponent = (component, flag) => {
     
    if (component === 'Authenticate') {
      setIsLogin(flag)
      setIsResetPassword(false)
      setIsForgotPassword(false)
    }

    if (component === 'ForgotPassword') {
      setIsForgotPassword(flag)
      setIsLogin(false)
      setIsResetPassword(false)
    }

    if (component === 'ResetPassword') {
      setIsResetPassword(flag)
      setIsLogin(false)
      setIsForgotPassword(false)
    }
  }

  const handleLogin = () => {
    auth.clearToken()
    auth.clearUserInfo()
    props.loginWithJWT(stateLogin)
  }

  const loginError = (error) => {
    auth.clearToken()
    auth.clearUserInfo()

    toast.error(
      <ToastContent
        messageTitle="Autenticação"
        messageBody="Verifique suas credenciais e tente novamente!"
        color="danger"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleForgotPassword = () => {
    const payload = {
      email:stateForgotPassword.identifier
    }
    props.forgotPassword(payload)
  }

  const handleResetPassword = () => {
  
    if (stateResetPassword.password !== stateResetPassword.passwordConfirmation) {
      toast.error(
        <ToastContent
          messageTitle="Redefinição de Senha"
          messageBody="Senhas Diferentes"
          color="danger"
        />,
        { transition: Slide, autoClose: 10000 }
      )
      return 
    }
   props.resetPassword(stateResetPassword)
  }

  const isDisabledButton = (flagValidationButton) => {

    if (flagValidationButton) {
        return false
    }

    return true
  }
  
  const logged = (user) => {
    auth.setToken(user.jwt, true)
    auth.setUserInfo(user.user, true)
  }

  useEffect(() => {
    const urlCode = queryString.parse(props?.location?.search)
        
    auth.clearToken()
    auth.clearUserInfo()

    if (urlCode?.code?.length > 0) {

      setStateResetPassword(
        {
          code: urlCode.code, 
          password: '',
          passwordConfirmation: ''
        }
      )

      handleComponent('ResetPassword', true)
      return
    }

    handleComponent('Authenticate', true)

  }, [])
  
  useEffectAfterMount(() => {
    loginError(props.error)
  }, [props.error])

  useEffectAfterMount(() => {
    dataUser.user.role = { 
      name: props.role
    }
    logged(dataUser)
    window.location.reload()
  
  }, [props.role])

  useEffectAfterMount(() => {
    setDataUser(props.user)
    logged(props.user)
    props.getRole(props.user.user.id)
  }, [props.user])

  useEffectAfterMount(() => {

    if (props?.forgot) {
     
      toast.success(
        <ToastContent
          messageTitle="Recuperação de senha"
          messageBody="Enviamos um código para seu email."
          color="success"
        />,
        { transition: Slide, autoClose: 10000 }
      )

      handleComponent('Authenticate', true)
    }
    
  }, [props?.forgot])

  useEffectAfterMount(() => {

    if (props?.reset) {
      setDataUser(props.reset)
      logged(props?.reset)
      props.getRole(props.reset.user.id)
    }
    
  }, [props?.reset])

  useEffectAfterMount(() => {

    if (props.forgotPasswordError.error.message.length > 0) {
  
      toast.error(
        <ToastContent
          messageTitle="Recuperação de Senha"
          messageBody="E-mail Inválido"
          color="danger"
        />,
        { transition: Slide, autoClose: 10000 }
      )
      
    }
    
  }, [props?.forgotPasswordError?.error])

  useEffectAfterMount(() => {

    if (props.resetPasswordError.error.message.length > 0) {
      toast.error(
        <ToastContent
          messageTitle="Redefinição de Senha"
          messageBody="Código provedor inválido"
          color="danger"
        />,
        { transition: Slide, autoClose: 10000 }
      )
    }
    
  }, [props?.resetPasswordError?.error])

  return (
    <div className='auth-wrapper auth-v2'  style={{ 
        background: `url(${urlImageNacionalLargest})`,
        backgroundRepeat: 'no-repeat'
    }}>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/login'>
          <img className='img-fluid' src={urlImageLogo} alt='Login V2' />
        </Link>
       
        <Col className='d-none d-lg-flex align-items-center' lg='8' sm='12'  >
        
        <img src={urlImageNacionalHidro} alt='Login V2' />
        </Col>
        <Col className='align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
            {
               isLogin
                && <Authenticate 
                      handleLogin={handleLogin} 
                      stateLogin={stateLogin}
                      setStateLogin={setStateLogin}
                      handleComponent={handleComponent}  
                      isDisabledButton={isDisabledButton}               
                    />
            }
            {
              isForgotPassword
              &&  <ForgotPassword 
                    stateForgotPassword={stateForgotPassword}
                    setStateForgotPassword={setStateForgotPassword}
                    handleForgotPassword={handleForgotPassword}
                    handleComponent={handleComponent} 
                    isDisabledButton={isDisabledButton}
                  />
            }
            {
               isResetPassword
               &&  <ResetPassword 
                      stateResetPassword={stateResetPassword}
                      setStateResetPassword={setStateResetPassword}
                      handleResetPassword={handleResetPassword}
                      handleComponent={handleComponent} 
                      isDisabledButton={isDisabledButton}
                   />
            }
        </Col>
      </Row>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.login.user,
    role: state.auth.login.role,
    error: state.auth.login.error,
    forgotPasswordError: state?.auth?.forgotPassword?.error,
    resetPasswordError: state?.auth?.resetPassword?.error,
    reset: state?.auth?.resetPassword?.reset,
    forgot: state?.auth?.forgotPassword?.forgot
  }
}

export default connect(mapStateToProps, {
  loginWithJWT,
  getRole,
  forgotPassword,
  resetPassword
})(Login)
