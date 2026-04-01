import React from 'react'
import { Row, Col } from 'reactstrap'
import { TipoEscalaCores } from '../../../../../utility/enum/Enums'
import { ActionFaturamentoStatus, StatusFaturamentoWrapper } from '../../../../styled-components/GlobalStyles'


export default function StatusEscala(props) {

    const { handlesOnSelect, selectedTipo } = props

    const getValue = (status) => {
        return <span className={`description ${selectedTipo === status ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect(status)} >{TipoEscalaCores.find(item => item.label === status).value}</span>
    }

    return (
        <StatusFaturamentoWrapper>
          <Row>
              <Col md="9">
                    <div>
                        <hr />
                        <div class="d-flex justify-content-between">
                            <ActionFaturamentoStatus>
                                <div onClick={() => handlesOnSelect('Abertas')} className="circle"style={{background: TipoEscalaCores.find(item => item.label === 'Abertas').color}}></div>
                                {
                                  getValue('Abertas')
                                }
                            </ActionFaturamentoStatus>
                        </div>  
                    </div>
              </Col>
              <Col md="3">
                    <div class="d-flex justify-content-end">
                        <ActionFaturamentoStatus style={{marginTop: '27px', marginLeft: '10%', textAlign: '-webkit-center'}}>
                            <div className="circle" onClick={() => handlesOnSelect('Canceladas')} style={{ background: TipoEscalaCores.find(item => item.label === 'Canceladas').color}}></div>
                            {getValue('Canceladas')}
                        </ActionFaturamentoStatus>
                    </div>
              </Col>
          </Row>
      </StatusFaturamentoWrapper>
    )
}
