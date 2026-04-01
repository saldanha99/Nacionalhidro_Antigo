import React, { useState, useEffect } from 'react'
import { Card } from 'reactstrap'
import '@styles/base/pages/faturamento.scss'
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import 'react-quill/dist/quill.snow.css'
import { connect } from "react-redux"
import StatusMedicao from './components/StatusMedicao'
import MedicaoPrecificar from './components/MedicaoPrecificar'
import MedicaoStatusMedicao from './components/MedicaoStatusMedicao'
import MedicoesFinalizadas from './components/MedicoesFinalizadas'
import { buscarEmpresas  } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import MedicoesCanceladas from './components/MedicoesCanceladas'

const Medicao = (props) => {
  const [selectedTipo, setSelectedTipo] = useState('')

  const handlesOnSelect = (optionMedicaoPrecificar) => {
    setSelectedTipo(optionMedicaoPrecificar)
  }

  useEffect(() => {
    handlesOnSelect('Status_da_Precificação')
    props.buscarEmpresas()
  }, [])

  const ehStatus = (status) => {
    if (selectedTipo === status) {
      return true
    }
    return false
  }

  return (
    <Card>
      <StatusMedicao handlesOnSelect={handlesOnSelect} selectedTipo={selectedTipo} />
      <div
        style={{
          width: '100%',
          padding: '15px 0px 0px 0px'
        }}>
      </div>
      {
        ehStatus('Status_da_Precificação')
        && <MedicaoPrecificar selectedTipo={selectedTipo} empresas={props.empresas} />
      }

      {
        ehStatus('Status_da_Medição')
        && <MedicaoStatusMedicao selectedTipo={selectedTipo} empresas={props.empresas} />
      }

      {
        ehStatus('Medições_Finalizadas')
        && <MedicoesFinalizadas selectedTipo={selectedTipo} empresas={props.empresas} />
      }

     {
        ehStatus('Cancelado')
        && <MedicoesCanceladas  selectedTipo={selectedTipo} />
      }
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    empresas: state?.empresa.empresas
  };
};

export default connect(mapStateToProps, {
  buscarEmpresas
})(Medicao);