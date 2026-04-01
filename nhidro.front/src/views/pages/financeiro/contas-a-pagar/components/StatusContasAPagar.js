import React from 'react'
import { Row, Col } from 'reactstrap'
import { TipoContasAPagarCores } from '../../../../../utility/enum/Enums'
import { ActionFaturamentoStatus, StatusFaturamentoWrapper } from '../../../../styled-components/GlobalStyles'
import auth from "@src/services/auth"
const user = auth.getUserInfo()

const rolesOnlyCreate = ['Controle Adm', 'Recursos Humanos 2', 'Seguranca Trabalho', 'Manutencao', 'Compras']

const hiddenMenu = () => {
    return rolesOnlyCreate.includes(user?.role?.name)
}

export default function StatusContasAPagar(props) {

    const { handlesOnSelect, selectedTipo } = props


    const getValueCadastrar = () => {
        return <span className={`description ${selectedTipo === 'Cadastrar' ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect('Cadastrar')} >{TipoContasAPagarCores.find(item => item.label === 'Cadastrar').value}</span>
    }

    const getValuePagar = () => {
        return <span className={`description ${selectedTipo === 'Pagar' ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect('Pagar')} >{TipoContasAPagarCores.find(item => item.label === 'Pagar').value}</span>
    }

    const getValuePago = () => {
        return <span className={`description ${selectedTipo === 'Pago' ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect('Pago')} >{TipoContasAPagarCores.find(item => item.label === 'Pago').value}</span>
    }

    const getValueCancelado = () => {
        return <span className={`description ${selectedTipo === 'Cancelado' ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect('Cancelado')} >{TipoContasAPagarCores.find(item => item.label === 'Cancelado').value}</span>
    }
    return (
        <StatusFaturamentoWrapper>
          <Row>
              <Col md="10">
                    <div>
                        <hr />
                        <div class="d-flex justify-content-between">
                            <ActionFaturamentoStatus>
                                <div onClick={() => handlesOnSelect('Cadastrar')} className="circle"style={{background: TipoContasAPagarCores.find(item => item.label === 'Cadastrar').color}}></div>
                                {
                                  getValueCadastrar()
                                }
                            </ActionFaturamentoStatus>
                            {!hiddenMenu() && <ActionFaturamentoStatus style={{ textAlign: '-webkit-right' }}>
                                <div onClick={() => handlesOnSelect('Pagar')} className="circle" style={{ background: TipoContasAPagarCores.find(item => item.label === 'Pagar').color }}>
                                </div>
                                {   
                                   getValuePagar()
                                }
                            </ActionFaturamentoStatus>}
                            {!hiddenMenu() && <ActionFaturamentoStatus style={{ textAlign: '-webkit-center'}}>
                                <div onClick={() => handlesOnSelect('Pago')} className="circle" style={{ background: TipoContasAPagarCores.find(item => item.label === 'Pago').color }}
                                ></div>
                                {   
                                   getValuePago()
                                }
                            </ActionFaturamentoStatus>}
                        </div>  
                    </div>
              </Col>
              {!hiddenMenu() && <Col md="2">
                    <div class="d-flex justify-content-end">
                        <ActionFaturamentoStatus style={{marginTop: '27px', textAlign: '-webkit-center'}}>
                            <div className="circle" onClick={() => handlesOnSelect('Cancelado')} style={{ background: TipoContasAPagarCores.find(item => item.label === 'Cancelado').color}}></div>
                            {getValueCancelado()}
                        </ActionFaturamentoStatus>
                    </div>
              </Col>}
          </Row>
      </StatusFaturamentoWrapper>
    )
}
