import React, { useState, useEffect } from 'react'
import { Card } from 'reactstrap'
import '@styles/base/pages/faturamento.scss'
import { connect } from "react-redux"
import "@styles/base/plugins/tables/react-paginate.scss"
import "@styles/react/libs/tables/react-dataTable-component.scss"
import "@styles/base/pages/data-list.scss"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import StatusEscala from './components/StatusEscala'
import EscalasAbertas from './components/EscalasAbertas'
import EscalasCanceladas from './components/EscalasCanceladas'


const Escala = (props) => {
  const [selectedTipo, setSelectedTipo] = useState('')

  const handlesOnSelect = (option) => {
    setSelectedTipo(option)
  }

  useEffect(() => {
    handlesOnSelect('Abertas')
 }, [])

 const ehStatus = (status) => {
     if (selectedTipo === status) {
       return true
     }
     return false
 }
  
  return (
    <Card>
      <StatusEscala handlesOnSelect={handlesOnSelect} selectedTipo={selectedTipo} />
      <div
        style={{
          width: '100%',
          padding: '15px 0px 0px 0px' 
        }}
      >   
      </div>
      {
        ehStatus('Abertas')
        && <EscalasAbertas selectedTipo={selectedTipo} />
      }
      {
        ehStatus('Canceladas')
        && <EscalasCanceladas selectedTipo={selectedTipo} />
      }
    </Card>
  )
}

export default connect()(Escala)