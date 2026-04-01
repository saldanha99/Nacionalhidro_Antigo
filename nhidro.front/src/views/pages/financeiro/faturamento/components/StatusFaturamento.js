import React from 'react'
import { Row, Col } from 'reactstrap'
import { TipoFaturamentoCores } from '../../../../../utility/enum/Enums'
import { ActionFaturamentoStatus, StatusFaturamentoWrapper } from '../../../../styled-components/GlobalStyles'


export default function StatusFaturamento(props) {

    const { handlesOnSelect, selectedTipo } = props

    const getValue = (status) => {
        return <span className={`description ${selectedTipo === status ? 'font-weight-bolder' : ''}`} onClick={() => handlesOnSelect(status)} >{TipoFaturamentoCores.find(item => item.label === status).value}</span>
    }

    return (
        <StatusFaturamentoWrapper>
          <Row>
              <Col md="3">
                    <div>
                        <div class="d-flex justify-content-between">
                            <ActionFaturamentoStatus style={{marginTop: '7px', textAlign: '-webkit-center'}}>
                                <div onClick={() => handlesOnSelect('Status_do_Faturamento')} className="circle" style={{ background: TipoFaturamentoCores.find(item => item.label === 'Status_do_Faturamento').color }}>
                                </div>
                                {   
                                   getValue('Status_do_Faturamento')
                                }
                            </ActionFaturamentoStatus>
                            <ActionFaturamentoStatus style={{marginTop: '7px', textAlign: '-webkit-center'}}>
                                <div className="circle" onClick={() => handlesOnSelect('Cancelado')} style={{ background: TipoFaturamentoCores.find(item => item.label === 'Cancelado').color}}></div>
                                {getValue('Cancelado')}
                            </ActionFaturamentoStatus>
                        </div>  
                    </div>
              </Col>
          </Row>
      </StatusFaturamentoWrapper>
    )
}
