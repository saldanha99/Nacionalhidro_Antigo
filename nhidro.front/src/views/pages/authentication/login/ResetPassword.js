import React from 'react'

import { Row, Col, CardTitle, CardText, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap'
export default function ResetPassword(props) {

    const {
        stateResetPassword,
        setStateResetPassword,
        handleResetPassword,
        handleComponent,
        isDisabledButton
    } = props

    const isValidSubmitResetPassword = () => {
        if (
            (stateResetPassword?.password !== null && stateResetPassword?.password !== '')
            &&  (stateResetPassword?.passwordConfirmation !== null && stateResetPassword?.passwordConfirmation !== '')
            &&  (stateResetPassword?.passwordConfirmation === stateResetPassword?.password)
            &&  (stateResetPassword?.code !== null && stateResetPassword?.code !== '')
        ) {
            return true
        }
        return false
    }

    return (
        <>
            <Col >
                    <CardTitle tag='h2' className='font-weight-bolder mb-1' >
                    Resetar Senha 🔒
                    </CardTitle>
                    <CardText className='mb-2'>Preencha os campos abaixo para redefinir sua senha.</CardText>
                    <div className='auth-login-form mt-2'>
                        <FormGroup>
                            <Label style={{fontSize:"0.7rem"}} className='form-label' for='login-email'>
                                Senha
                            </Label>
                            <Input
                                type="password"
                                placeholder="Senha"
                                value={stateResetPassword.password}
                                onChange={(e) => setStateResetPassword({ ...stateResetPassword, password: e.target.value })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label style={{fontSize:"0.7rem"}} className='form-label' for='login-email'>
                                Confirmar Senha
                            </Label>
                            <Input
                                type="password"
                                placeholder="Confirmar Senha"
                                value={stateResetPassword.passwordConfirmation}
                                onChange={(e) => setStateResetPassword({ ...stateResetPassword, passwordConfirmation: e.target.value })
                                }
                            />
                        </FormGroup>
                        <Button.Ripple  
                            disabled={ isDisabledButton(isValidSubmitResetPassword())}
                            color='primary' 
                            block className='font-weight-bolder mt-1'
                            onClick={handleResetPassword}
                        >
                            Enviar 
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
