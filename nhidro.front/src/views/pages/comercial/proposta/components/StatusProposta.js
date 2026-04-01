import React from 'react'
import { Row, Col } from 'reactstrap'
import { TipoPropostaCores } from '../../../../../utility/enum/Enums'
import { ActionFaturamentoStatus, StatusFaturamentoWrapper } from '../../../../styled-components/GlobalStyles'


export default function StatusProposta(props) {

    const { handlesOnSelect, selectedTipo } = props

    const getValue = (status) => {
        return <span className={`description ${selectedTipo === status ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect(status)} >{TipoPropostaCores.find(item => item.label === status).value}</span>
    }

    return (
        <StatusFaturamentoWrapper>
          <Row>
              <Col md="9">
                    <div>
                        <hr />
                        <div class="d-flex justify-content-between">
                            <ActionFaturamentoStatus>
                                <div onClick={() => handlesOnSelect('Em Aberto')} className="circle"style={{background: TipoPropostaCores.find(item => item.label === 'Em Aberto').color}}></div>
                                {
                                  getValue('Em Aberto')
                                }
                            </ActionFaturamentoStatus>
                            <ActionFaturamentoStatus style={{ textAlign: '-webkit-right' }}>
                                <div onClick={() => handlesOnSelect('Aprovadas')} className="circle" style={{ background: TipoPropostaCores.find(item => item.label === 'Aprovadas').color }}>
                                </div>
                                {   
                                   getValue('Aprovadas')
                                }
                            </ActionFaturamentoStatus> 
                            <ActionFaturamentoStatus style={{ textAlign: '-webkit-center'}}>
                                <div onClick={() => handlesOnSelect('Reprovadas')} className="circle" style={{ background: TipoPropostaCores.find(item => item.label === 'Reprovadas').color }}
                                ></div>
                                {   
                                   getValue('Reprovadas')
                                }
                            </ActionFaturamentoStatus>
                        </div>  
                    </div>
              </Col>
              <Col md="3">
                    <div class="d-flex justify-content-end">
                        <ActionFaturamentoStatus style={{marginTop: '27px', marginLeft: '10%', textAlign: '-webkit-center'}}>
                            <div className="circle" onClick={() => handlesOnSelect('Canceladas')} style={{ background: TipoPropostaCores.find(item => item.label === 'Canceladas').color}}></div>
                            {getValue('Canceladas')}
                        </ActionFaturamentoStatus>
                    </div>
              </Col>
          </Row>
      </StatusFaturamentoWrapper>
    )
}
