import React from 'react'
import { Row, Col } from 'reactstrap'
import { TipoOrdemCores } from '../../../../../utility/enum/Enums'
import { ActionFaturamentoStatus, StatusFaturamentoWrapper } from '../../../../styled-components/GlobalStyles'


export default function StatusOrdens(props) {

    const { handlesOnSelect, selectedTipo } = props

    const getValue = (status) => {
        return <span className={`description ${selectedTipo === status ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect(status)} >{TipoOrdemCores.find(item => item.label === status).value}</span>
    }

    return (
        <StatusFaturamentoWrapper>
          <Row>
              <Col md="9">
                    <div>
                        <hr />
                        <div class="d-flex justify-content-between">
                            <ActionFaturamentoStatus>
                                <div onClick={() => handlesOnSelect('Abrir')} className="circle"style={{background: TipoOrdemCores.find(item => item.label === 'Abrir').color}}></div>
                                {
                                  getValue('Abrir')
                                }
                            </ActionFaturamentoStatus>
                            <ActionFaturamentoStatus>
                                <div onClick={() => handlesOnSelect('Em Aberto')} className="circle"style={{background: TipoOrdemCores.find(item => item.label === 'Em Aberto').color}}></div>
                                {
                                  getValue('Em Aberto')
                                }
                            </ActionFaturamentoStatus>
                            <ActionFaturamentoStatus style={{ textAlign: '-webkit-right' }}>
                                <div onClick={() => handlesOnSelect('Executadas')} className="circle" style={{ background: TipoOrdemCores.find(item => item.label === 'Executadas').color }}>
                                </div>
                                {   
                                   getValue('Executadas')
                                }
                            </ActionFaturamentoStatus> 
                        </div>  
                    </div>
              </Col>
              <Col md="3">
                    <div class="d-flex justify-content-end">
                        <ActionFaturamentoStatus style={{marginTop: '27px', marginLeft: '10%', textAlign: '-webkit-center'}}>
                            <div className="circle" onClick={() => handlesOnSelect('Canceladas')} style={{ background: TipoOrdemCores.find(item => item.label === 'Canceladas').color}}></div>
                            {getValue('Canceladas')}
                        </ActionFaturamentoStatus>
                    </div>
              </Col>
          </Row>
      </StatusFaturamentoWrapper>
    )
}
