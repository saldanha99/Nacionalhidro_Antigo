import React, { useState, useEffect } from 'react'
import { Card, CardBody } from 'reactstrap'
import '@styles/base/pages/faturamento.scss'
import { connect } from "react-redux"
import "@styles/base/plugins/tables/react-paginate.scss"
import "@styles/react/libs/tables/react-dataTable-component.scss"
import "@styles/base/pages/data-list.scss"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import StatusOrdens from './components/StatusOrdens'
import OrdensAbrir from './components/OrdensAbrir'
import OrdensAbertas from './components/OrdensAbertas'
import OrdensExecutadas from './components/OrdensExecutadas'
import OrdensCanceladas from './components/OrdensCanceladas'


const OrdemServico = (props) => {
  const [selectedTipo, setSelectedTipo] = useState('')

  const handlesOnSelect = (option) => {
    setSelectedTipo(option)
  }

  useEffect(() => {
    handlesOnSelect('Abrir')
 }, [])

 const ehStatus = (status) => {
     if (selectedTipo === status) {
       return true
     }
     return false
 }
  
  return (
    <Card>
      <StatusOrdens handlesOnSelect={handlesOnSelect} selectedTipo={selectedTipo} />
      <div
        style={{
          width: '100%',
          padding: '15px 0px 0px 0px' 
        }}
      >   
      </div>
      {
        ehStatus('Abrir')
        && <OrdensAbrir selectedTipo={selectedTipo} />
      }
      {
        ehStatus('Em Aberto')
        && <OrdensAbertas selectedTipo={selectedTipo} />
      }
      {
        ehStatus('Executadas')
        && <OrdensExecutadas selectedTipo={selectedTipo} />
      }
      {
        ehStatus('Canceladas')
        && <OrdensCanceladas selectedTipo={selectedTipo} />
      }
    </Card>
  )
}

export default connect()(OrdemServico)