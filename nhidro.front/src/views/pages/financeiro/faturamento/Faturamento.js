import React, { useState, useEffect } from 'react'
import { Card } from 'reactstrap'
import '@styles/base/pages/faturamento.scss'
import StatusFaturamento from './components/StatusFaturamento'
import FaturamentoStatusFaturamento from './components/FaturamentoStatusFaturamento'
import FaturamentoCancelados from './components/FaturamentoCancelados'

const Faturamento = (props) => {
  const [selectedTipo, setSelectedTipo] = useState('')

  const handlesOnSelect = (optionFaturamento) => {
    setSelectedTipo(optionFaturamento)
  }

  useEffect(() => {
    handlesOnSelect('Status_do_Faturamento')
  }, [])

  const ehStatus = (status) => {
    if (selectedTipo === status) {
      return true
    }
    return false
  }

  return (
    <Card>
      <StatusFaturamento handlesOnSelect={handlesOnSelect} selectedTipo={selectedTipo} />
      <div
        style={{
          width: '100%',
          padding: '15px 0px 0px 0px'
        }}>
      </div>
      {
        ehStatus('Status_do_Faturamento')
        && <FaturamentoStatusFaturamento selectedTipo={selectedTipo} empresas={props.empresas} />
      }

     {
        ehStatus('Cancelado')
        && <FaturamentoCancelados selectedTipo={selectedTipo} />
      }
    </Card>
  )
}

export default Faturamento;