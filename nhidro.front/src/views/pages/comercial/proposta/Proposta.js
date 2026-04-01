import React, { useState, useEffect } from 'react'
import auth from "@src/services/auth"
import { Card, CardBody } from 'reactstrap'
import '@styles/base/pages/faturamento.scss'
import { connect } from "react-redux"
import "@styles/base/plugins/tables/react-paginate.scss"
import "@styles/react/libs/tables/react-dataTable-component.scss"
import "@styles/base/pages/data-list.scss"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import PropostasAbertas from './components/PropostasAbertas'
import StatusProposta from './components/StatusProposta'
import PropostasAprovadas from './components/PropostasAprovadas'
import PropostasReprovadas from './components/PropostasReprovadas'
import PropostasCanceladas from './components/PropostasCanceladas'
import { buscarClientesVendedorAtivos } from "@src/redux/actions/administrador/cliente/listaClientesActions"
import { buscarEquipamentosAtivos } from "@src/redux/actions/administrador/equipamento/buscarEquipamentosActions"
import { buscarAcessoriosAtivos } from "@src/redux/actions/administrador/acessorio/buscarAcessorioActions"
import { buscarConfiguracoesPorDescricoes } from "@src/redux/actions/administrador/configuracao/buscarConfiguracaoActions"
import { buscarResponsabilidadesAtivas } from "@src/redux/actions/administrador/responsabilidade/buscarResponsabilidadeActions"
import { buscarCargos } from "@src/redux/actions/administrador/cargo/buscarCargosActions"
import { buscarEmpresas } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import { buscarVendedores } from "@src/redux/actions/administrador/usuario/buscarUsuariosActions"

const user = auth.getUserInfo()

const Proposta = (props) => {
  const [selectedTipo, setSelectedTipo] = useState('')

  const handlesOnSelect = (option) => {
    setSelectedTipo(option)
  }

  useEffect(() => {
    handlesOnSelect('Em Aberto')
    props.buscarClientesVendedorAtivos(user)
    props.buscarConfiguracoesPorDescricoes(['DescricaoGarantiaHora', 'DescricaoGarantiaDiaria', 'DescricaoGarantiaFrete', 'DescricaoGarantiaFechado', 'ModalidadeHora', 'ModalidadeDiaria', 'ModalidadeFechado'])
    props.buscarEquipamentosAtivos()
    props.buscarAcessoriosAtivos()
    props.buscarResponsabilidadesAtivas()
    props.buscarCargos()
    props.buscarEmpresas()
    props.buscarVendedores(true)
 }, [])

 const ehStatus = (status) => {
     if (selectedTipo === status) {
       return true
     }
     return false
 }
  
  return (
    <Card>
      <StatusProposta handlesOnSelect={handlesOnSelect} selectedTipo={selectedTipo} />
      <div
        style={{
          width: '100%',
          padding: '15px 0px 0px 0px' 
        }}
      >   
      </div>
      {
        ehStatus('Em Aberto')
        && <PropostasAbertas selectedTipo={selectedTipo} isFinishedAction={props.isFinishedAction} error={props.error} clientes={props.clientes} empresas={props.empresas} 
            equipamentos={props.equipamentos} acessorios={props.acessorios} responsabilidades={props.responsabilidades} cargos={props.cargos} configuracoes={props.configuracoes} vendedores={props.vendedores} />
      }

      {
        ehStatus('Aprovadas')
        && <PropostasAprovadas selectedTipo={selectedTipo} isFinishedAction={props.isFinishedAction} error={props.error} clientes={props.clientes} empresas={props.empresas} 
        equipamentos={props.equipamentos} acessorios={props.acessorios} responsabilidades={props.responsabilidades} cargos={props.cargos} configuracoes={props.configuracoes} vendedores={props.vendedores} />
      }

      {
        ehStatus('Reprovadas')
        && <PropostasReprovadas selectedTipo={selectedTipo} />
      }

      {
        ehStatus('Canceladas')
        && <PropostasCanceladas selectedTipo={selectedTipo} />
      }
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    isFinishedAction: state?.proposta?.isFinishedAction,
    error: state?.proposta?.error,
    clientes: state?.cliente?.listaClientesAtivos,
    empresas: state?.empresa?.empresas,
    equipamentos: state?.equipamento?.equipamentosAtivos,
    acessorios: state?.acessorio?.lista,
    responsabilidades: state?.responsabilidade?.lista,
    cargos: state?.cargo?.lista,
    configuracoes: state?.configuracao?.configuracoes,
    vendedores: state?.usuario?.vendedores
  }
}

export default connect(mapStateToProps, {
  buscarClientesVendedorAtivos,
  buscarEquipamentosAtivos,
  buscarAcessoriosAtivos,
  buscarResponsabilidadesAtivas,
  buscarCargos,
  buscarEmpresas,
  buscarConfiguracoesPorDescricoes,
  buscarVendedores
})(Proposta)