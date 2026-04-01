import React from 'react'
import { Row, Col } from 'reactstrap'
import { TipoFaturamentoCores } from '../../../../../utility/enum/Enums'
import { ActionFaturamentoStatus, StatusFaturamentoWrapper } from '../../../../styled-components/GlobalStyles'


export default function StatusMedicao(props) {

    const { handlesOnSelect, selectedTipo } = props

    const getValue = (status) => {
        return <span className={`description ${selectedTipo === status ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect(status)} >{TipoFaturamentoCores.find(item => item.label === status).value}</span>
    }

    return (
        <StatusFaturamentoWrapper>
          <Row>
              <Col md="10">
                    <div>
                        <hr />
                        <div class="d-flex justify-content-between">
                        <ActionFaturamentoStatus style={{ textAlign: '-webkit-right' }}>
                                <div onClick={() => handlesOnSelect('Status_da_Precificação')} className="circle" style={{ background: TipoFaturamentoCores.find(item => item.label === 'Status_da_Precificação').color }}>
                                </div>
                                {   
                                   getValue('Status_da_Precificação')
                                }
                            </ActionFaturamentoStatus>
                            <ActionFaturamentoStatus style={{ textAlign: '-webkit-right' }}>
                                <div onClick={() => handlesOnSelect('Status_da_Medição')} className="circle" style={{ background: TipoFaturamentoCores.find(item => item.label === 'Status_da_Medição').color }}>
                                </div>
                                {   
                                   getValue('Status_da_Medição')
                                }
                            </ActionFaturamentoStatus>
                            <ActionFaturamentoStatus style={{ textAlign: '-webkit-right' }}>
                                <div onClick={() => handlesOnSelect('Medições_Finalizadas')} className="circle" style={{ background: TipoFaturamentoCores.find(item => item.label === 'Medições_Finalizadas').color }}>
                                </div>
                                {   
                                   getValue('Medições_Finalizadas')
                                }
                            </ActionFaturamentoStatus>
                        </div>  
                    </div>
              </Col>
              <Col md="2">
                    <div class="d-flex justify-content-end">
                        <ActionFaturamentoStatus style={{marginTop: '27px', textAlign: '-webkit-center'}}>
                            <div className="circle" onClick={() => handlesOnSelect('Cancelado')} style={{ background: TipoFaturamentoCores.find(item => item.label === 'Cancelado').color}}></div>
                            {getValue('Cancelado')}
                        </ActionFaturamentoStatus>
                    </div>
              </Col>
          </Row>
      </StatusFaturamentoWrapper>
    )
}
