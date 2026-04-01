import React, { useState, useEffect } from 'react'
import { Card } from 'reactstrap'
import '@styles/base/pages/faturamento.scss'
import { connect } from "react-redux"
import { buscarEmpresas  } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import ContasReceberCancelado from './components/ContasReceberCancelado'
import ContasReceberCadastro from './components/ContasReceberCadastro'
import ContasReceberReceber from './components/ContasReceberReceber'
import ContasReceberRecebidos from './components/ContasReceberRecebidos'
import StatusContasReceber from './components/StatusContasReceber'

const ContasAReceber = (props) => {
  const [selectedTipo, setSelectedTipo] = useState('')

  const handlesOnSelect = (optionContasAReceber) => {
    setSelectedTipo(optionContasAReceber)
  }

  useEffect(() => {
    handlesOnSelect('Cadastro')
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
      <StatusContasReceber handlesOnSelect={handlesOnSelect} selectedTipo={selectedTipo} />
      <div
        style={{
          width: '100%',
          padding: '15px 0px 0px 0px'
        }}>
      </div>
      {
        ehStatus('Cadastro')
        && <ContasReceberCadastro selectedTipo={selectedTipo} empresas={props.empresas} />
      }

      {
        ehStatus('Receber')
        && <ContasReceberReceber selectedTipo={selectedTipo} empresas={props.empresas} />
      }

      {
        ehStatus('Recebidos')
        && <ContasReceberRecebidos selectedTipo={selectedTipo} empresas={props.empresas} />
      }

     {
        ehStatus('Cancelados')
        && <ContasReceberCancelado selectedTipo={selectedTipo} />
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
})(ContasAReceber);