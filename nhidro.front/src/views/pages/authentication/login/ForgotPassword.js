import React from 'react'

import { Col, CardTitle, CardText, Form, FormGroup, Label, Input, Button } from 'reactstrap'
export default function ForgotPassword(props) {

    const {
        handleForgotPassword,
        stateForgotPassword,
        setStateForgotPassword,
        handleComponent,
        isDisabledButton
    } = props

    const isValidSubmitForgotPassword = () => {
        if (stateForgotPassword?.identifier !== null && stateForgotPassword?.identifier !== '') {
            return true
        }
        return false
    }

    return (
        <>
            <Col >
                <CardTitle tag='h2' className='font-weight-bolder mb-1' >
                Esqueceu a senha? 🔒
                </CardTitle>
                <CardText className='mb-2'>Informe o email para recuperar senha</CardText>
                <div className='auth-login-form mt-2'>
                <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className='form-label' for='login-email'>
                    Email
                    </Label>
                    <Input
                        autoComplete="off"
                        type="email"
                        placeholder="Email"
                        value={stateForgotPassword?.identifier}
                        onChange={(e) => setStateForgotPassword({ ...stateForgotPassword, identifier: e.target.value })
                        }
                    />
                </FormGroup>
                <Button.Ripple  
                    color='primary' 
                    block className='font-weight-bolder mt-1'
                    onClick={handleForgotPassword}
                    disabled={ isDisabledButton(isValidSubmitForgotPassword())}
                >
                    Enviar Email
                </Button.Ripple>
                </div>
            </Col>
            <Col className="mt-2">
                <div onClick={ () => handleComponent('Authenticate', true)}>
                    Voltar
                </div>           
            </Col>
        </>
    )
}
