import React from 'react'
import { Row, Col, CardTitle, CardText, Form, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import { Link, Redirect } from 'react-router-dom'
export default function Authenticate(props) {

    const {
        handleLogin,
        stateLogin,
        setStateLogin,
        handleComponent,
        isDisabledButton
    } = props

    const isValidSubmitForgotPassword = () => {
        if (
            (stateLogin?.identifier !== null && stateLogin?.identifier !== '')
            && (stateLogin?.password !== null && stateLogin?.password !== '')
        ) {
            return true
        }
        return false
    }

    return (
        <Col >
            <CardTitle tag='h2' className='font-weight-bolder mb-1' >
                Bem vindo(a) à Nacional Hidro
            </CardTitle>
            <CardText className='mb-2'>Entre com a sua conta ou crie uma para começar a utilizar o sistema</CardText>
            <Form className='auth-login-form mt-2' action="/">
            <FormGroup>
                <Label style={{fontSize:"0.7rem"}} className='form-label' for='login-email'>
                Email
                </Label>
                <Input
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    value={stateLogin.identifier}
                    onChange={(e) => setStateLogin({ ...stateLogin, identifier: e.target.value })
                    }
                />
            </FormGroup>
            <FormGroup>
                <div className='d-flex justify-content-between'>
                <Label style={{fontSize:"0.7rem"}} className='form-label' for='login-password'>
                    Senha
                </Label>
                </div>
                <InputPasswordToggle
                        className='input-group-merge' 
                        id='login-password'
                    
                        onChange={(e) => setStateLogin({ ...stateLogin, password: e.target.value })}
                    />
            
                <div  className=" mt-2 d-flex justify-content-end" onClick={ () =>  handleComponent('ForgotPassword', true)}>
                    <small className='font-weight-bolder esqueceu-a-senha'>Esqueceu a senha?</small>
                </div>
            </FormGroup>
            {/* <FormGroup>
                <CustomInput type='checkbox' className='custom-control-Primary' id='remember-me' label='Lembrar de mim' />
            </FormGroup> */}
            {/* <Button.Ripple  color='primary' block className='font-weight-bolder'>
                Entrar
            </Button.Ripple> */}
            {""}
           
            <Button.Ripple  
                color='primary' 
                block 
                className='font-weight-bolder mt-1'
                disabled={ isDisabledButton(isValidSubmitForgotPassword())}
                onClick={ () => handleLogin() }
            >
                Entrar
            </Button.Ripple>
            </Form>
      </Col>
    )
}
