import React, { useState, useEffect } from 'react'
import { Card, CardBody } from 'reactstrap'
import '@styles/base/pages/faturamento.scss'
import { connect } from "react-redux"
import "@styles/base/plugins/tables/react-paginate.scss"
import "@styles/react/libs/tables/react-dataTable-component.scss"
import "@styles/base/pages/data-list.scss"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import StatusContasAPagar from './components/StatusContasAPagar'
import ContasCadastrar from './components/ContasCadastrar'
import ContasPagar from './components/ContasPagar'
import ContasPagas from './components/ContasPagas'
import ContasCanceladas from './components/ContasCanceladas'


const ContasAPagar = (props) => {
  const [selectedTipo, setSelectedTipo] = useState('')

  const handlesOnSelect = (option) => {
    setSelectedTipo(option)
  }

  useEffect(() => {
    handlesOnSelect('Cadastrar')
 }, [])

 const ehStatusCadastrar = () => {
     if (selectedTipo === 'Cadastrar') {
       return true
     }
     return false
 }

 const ehStatusPagar = () => {
   if (selectedTipo === 'Pagar') {
     return true
   }
   return false
 }

 const ehStatusPago = () => {
   if (selectedTipo === 'Pago') {
     return true
   }
   return false
 }

 const ehStatusCancelado = () => {
   if (selectedTipo === 'Cancelado') {
     return true
   }
   return false
 }
  
  return (
    <Card>
      <StatusContasAPagar handlesOnSelect={handlesOnSelect} selectedTipo={selectedTipo} />
      <div
        style={{
          width: '100%',
          padding: '15px 0px 0px 0px' 
        }}
      >   
      </div>
      {
        ehStatusCadastrar()
        && <ContasCadastrar selectedTipo={selectedTipo} />
      }

      {
        ehStatusPagar()
        && <ContasPagar selectedTipo={selectedTipo} />
      }

      {
        ehStatusPago()
        && <ContasPagas selectedTipo={selectedTipo} />
      }

      {
        ehStatusCancelado()
        && <ContasCanceladas selectedTipo={selectedTipo} />
      }
    </Card>
  )
}

export default connect()(ContasAPagar)