import React from 'react'
import { Row, Col } from 'reactstrap'
import { TipoContasReceberCores } from '../../../../../utility/enum/Enums'
import { ActionFaturamentoStatus, StatusFaturamentoWrapper } from '../../../../styled-components/GlobalStyles'


export default function StatusContasReceber(props) {

    const { handlesOnSelect, selectedTipo } = props

    const getValue = (status) => {
        return <span className={`description ${selectedTipo === status ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect(status)} >{TipoContasReceberCores.find(item => item.label === status).value}</span>
    }

    return (
        <StatusFaturamentoWrapper>
          <Row>
              <Col md="10">
                <div>
                    <hr />
                    <div class="d-flex justify-content-between">
                        <ActionFaturamentoStatus style={{ textAlign: '-webkit-right' }}>
                            <div onClick={() => handlesOnSelect('Cadastro')} className="circle" style={{ background: TipoContasReceberCores.find(item => item.label === 'Cadastro').color }}>
                            </div>
                            {   
                                getValue('Cadastro')
                            }
                        </ActionFaturamentoStatus>
                        <ActionFaturamentoStatus style={{ textAlign: '-webkit-right' }}>
                            <div onClick={() => handlesOnSelect('Receber')} className="circle" style={{ background: TipoContasReceberCores.find(item => item.label === 'Receber').color }}>
                            </div>
                            {   
                                getValue('Receber')
                            }
                        </ActionFaturamentoStatus>
                        <ActionFaturamentoStatus style={{ textAlign: '-webkit-right' }}>
                            <div onClick={() => handlesOnSelect('Recebidos')} className="circle" style={{ background: TipoContasReceberCores.find(item => item.label === 'Recebidos').color }}>
                            </div>
                            {   
                                getValue('Recebidos')
                            }
                        </ActionFaturamentoStatus>
                    </div>  
                </div>
              </Col>
              <Col md="2">
                    <div class="d-flex justify-content-end">
                        <ActionFaturamentoStatus style={{marginTop: '27px', textAlign: '-webkit-center'}}>
                            <div className="circle" onClick={() => handlesOnSelect('Cancelados')} style={{ background: TipoContasReceberCores.find(item => item.label === 'Cancelados').color}}></div>
                            {getValue('Cancelados')}
                        </ActionFaturamentoStatus>
                    </div>
              </Col>
          </Row>
      </StatusFaturamentoWrapper>
    )
}
