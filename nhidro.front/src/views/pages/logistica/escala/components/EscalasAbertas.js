import React, { useState, useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { buscarEscalas } from "@src/redux/actions/logistica/escala/buscarEscalasActions"
import { buscarOrdensEscala } from "@src/redux/actions/logistica/ordem-servico/buscarOrdensActions"
import { alterarEscala } from "@src/redux/actions/logistica/escala/alterarEscalaActions"
import { cadastrarEscala } from "@src/redux/actions/logistica/escala/cadastrarEscalaActions"
import { buscarVeiculos } from "@src/redux/actions/administrador/veiculo/buscarVeiculoActions"
import { buscarFuncionariosAtivos } from "@src/redux/actions/administrador/funcionario/buscarFuncionarioActions"
import { buscarClientesAtivos } from "@src/redux/actions/administrador/cliente/listaClientesActions"
import { buscarEquipamentosAtivos } from "@src/redux/actions/administrador/equipamento/buscarEquipamentosActions"
import { buscarEmpresas  } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import { Card, CardBody, Row, Col, CardHeader, Button, Input, Alert } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import Select from "react-select"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { FiEdit2, FiRepeat, FiSave, FiTruck, FiUser, FiXCircle } from 'react-icons/fi'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Enum_StatusEscalas, Enum_StatusOrdens } from '../../../../../utility/enum/Enums'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import moment from "moment"
moment.locale("pt-br")
import auth from "@src/services/auth"
import ModalCadastroEscala from '../modals/ModalCadastroEscala'
import ReportEscala from '../reports/ReportEscala'
import ModalFuncionarios from '../modals/ModalFuncionarios'
import ModalVeiculos from '../modals/ModalVeiculos'
import _ from 'underscore'

const MySwal = withReactContent(Swal)
const user = auth.getUserInfo()

const EscalasAbertas = (props) => {
  const refComp = useRef(null)

  const configDataTableSkeleton = {
    nameRows: [
      { name: 'Ações' },
      { name: 'OS' },
      { name: 'STATUS OP.' },
      { name: 'DATA' },
      { name: 'HORA' },
      { name: 'EMPRESA' },
      { name: 'CLIENTE' },
      { name: 'EQUIPAMENTO' },
      { name: 'VEÍCULOS' },
      { name: 'FUNCIONÁRIOS' },
      { name: 'OBSERVAÇÕES' }
    ],
    quantityItensOnRow: 10
  } 

  const mesPassado = new Date(new Date().setDate(new Date().getDate()))
  const mesQuevem = new Date(new Date().setDate(new Date().getDate()))

  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [data, setData] = useState({})
  const [modal, setModal] = useState(false)
  const [modalFuncionarios, setModalFuncionarios] = useState(false)
  const [modalVeiculos, setModalVeiculos] = useState(false)
  const [state, setState] = useState({})
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem])
  const [escalaReport, setEscalaReport] = useState({Data: '', Equipamentos: []})
  const [alert, setAlert] = useState(true)

  const buscarEscalas = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarEscalas(Enum_StatusEscalas.Aberta, dataInicial, dataFinal)
      setLoadingSkeleton(true)
    }

  }

  const fullData = (escala) => {
    return escala.Data && (escala.Cliente?.id > 0 && escala.Equipamento?.id)
  }

  const handleClose = () => {
    setData({})
    setModal(false)
  }

  const handleCloseFuncionarios = () => {
    setData({})
    setModalFuncionarios(false)
  }

  const handleCloseVeiculos = () => {
    setData({})
    setModalVeiculos(false)
  }

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Escala"
        messageBody="Escala salva!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Escala"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const save = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja salvar a escala?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1"
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true
    })
      .then((result) => {
        if (result.value) {
          handleClose()
          setLoadingSkeleton(true)
          data.Hora = data.Hora ? moment(data.Hora, "HH:mm").format("HH:mm:ss.SSS") : null
          if (data.id === 0) {
            data.CriadoPor = user
            data.DataCriacao = new Date()
            props.cadastrarEscala({ data })
          } else {
            data.AlteradoPor = user
            data.DataAlteracao = new Date()
            props.alterarEscala({ data })
          }
        }
      })
  }

  const cancelar = (data) => {
    MySwal.fire({
      title: "Aviso",
      icon: "warning",
      text: "Tem certeza que deseja cancelar?",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1"
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true
    }).then(function (result) {
      if (result.value) {
        MySwal.fire({
          text: "Motivo do cancelamento:",
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Salvar",
          cancelButtonText: "Cancelar",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-primary mr-1"
          },
          reverseButtons: true,
          preConfirm: (value) => {
            if (value) {
              setLoadingSkeleton(true)
              data.MotivoCancelamento = value
              data.DataCancelamento = new Date()
              data.Status = Enum_StatusEscalas.Cancelado
              props.alterarEscala({ data })
            } else {
              Swal.showValidationMessage("O motivo é um campo obrigatório")
            }
          },
          buttonsStyling: false,
          showLoaderOnConfirm: true
        })
      }
    })
  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
  }

  const updateFuncionarios = (naoIntegrados, escala) => {
    const temFuncIndisponivel = naoIntegrados?.some(x => x.Afastado)
    if (temFuncIndisponivel) {  
      MySwal.fire({
        title: "Aviso",
        text: "Existem funcionários afastados selecionados. Deseja prosseguir?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-outline-primary mr-1"
        },
        buttonsStyling: false,
        showLoaderOnConfirm: true,
        reverseButtons: true
      })
        .then((result) => {
          if (result.value) {
            let funcionarios = funcionarios.concat(naoIntegrados)

            const index = state.filteredData.findIndex(x => x.id === escala.id)
            state.filteredData[index].EscalaFuncionarios = []
            funcionarios.forEach(element => {
              state.filteredData[index].EscalaFuncionarios.push({
                    Funcionario: element,
                    StatusOperacao: element.StatusOperacao
                  })
            })
            setState({...state}, state)
            handleCloseFuncionarios()
          }
        })
    } else {
      let funcionarios = funcionarios.concat(naoIntegrados)

      const index = state.filteredData.findIndex(x => x.id === escala.id)
      state.filteredData[index].EscalaFuncionarios = []
      funcionarios.forEach(element => {
        state.filteredData[index].EscalaFuncionarios.push({
              Funcionario: element,
              StatusOperacao: element.StatusOperacao
          })
      })
      setState({...state}, state)
      handleCloseFuncionarios()
    }
  }

  const updateVeiculos = (veiculos, escala) => {
    const temIndisponivel = veiculos?.some(x => x.Manutencao)
    if (temIndisponivel) {  
      MySwal.fire({
        title: "Aviso",
        text: "Existem veículos em manutenção selecionados. Deseja prosseguir?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-outline-primary mr-1"
        },
        buttonsStyling: false,
        showLoaderOnConfirm: true,
        reverseButtons: true
      })
        .then((result) => {
          if (result.value) {
            const index = state.filteredData.findIndex(x => x.id === escala.id)
            state.filteredData[index].EscalaVeiculos = []
            veiculos.forEach(element => {
              state.filteredData[index].EscalaVeiculos.push({
                    Veiculo: element,
                    Manutencao: element.Manutencao
                  })
            })
            setState({...state}, state)
            handleCloseVeiculos()
          }
        })
    } else {
      const index = state.filteredData.findIndex(x => x.id === escala.id)
      state.filteredData[index].EscalaVeiculos = []
      veiculos.forEach(element => {
        state.filteredData[index].EscalaVeiculos.push({
              Veiculo: element,
              Manutencao: element.Manutencao
            })
      })
      setState({...state}, state)
      handleCloseVeiculos()
    }
  }

  const formatReport = (data, escalas) => {
    if (data.length && escalas.length && props.equipamentos) {
      escalaReport.Equipamentos = []
      escalaReport.Data = data.length > 1 && new Date(data[0]).getDate() !== new Date(data[1]).getDate() ? `${moment(data[0]).format('DD/MM/YYYY')} - ${moment(data[1]).format('DD/MM/YYYY')}` : moment(data[0]).format('DD/MM/YYYY')
      props.equipamentos.forEach(element => {
        const list = escalas.filter(x => x.Equipamento?.id === element.id)
        if (list && list.length) {
          const escalasEquipamento = []
          list.forEach(x => {
            let veiculosAux = ''
            let funcionariosAux = ''
            const funcionariosList = []
            x.EscalaVeiculos?.map(item => { veiculosAux += (`${item.Veiculo?.Descricao} - ${item.Veiculo?.Placa}; `) })
            x?.EscalaFuncionarios?.map(item => { funcionariosAux += (`${item.Funcionario?.Nome}; `); funcionariosList.push(item.Funcionario?.Nome) })
            x.VeiculosTexto = veiculosAux
            x.FuncionariosTexto = funcionariosAux
            x.FuncionariosList = funcionariosList
            x.ClienteTexto = [x.Cliente?.RazaoSocial]
            x.ObservacoesTexto = [x.Observacoes]

            const escalaExiste = escalasEquipamento.find(y => y.FuncionariosTexto === x.FuncionariosTexto && y.VeiculosTexto === x.VeiculosTexto && y.Data === x.Data)
            if (escalaExiste) {
              escalaExiste.ClienteTexto.push(x.ClienteTexto)
              escalaExiste.ObservacoesTexto.push(x.Observacoes)
            } else escalasEquipamento.push(x)
          })
          const equipamento = {
            id: element.id,
            Equipamento: element.Equipamento,
            Escalas: escalasEquipamento
          }
          escalaReport.Equipamentos.push(equipamento)
        }
      })
      escalaReport.Equipamentos = _.sortBy(escalaReport.Equipamentos, 'id')
      setEscalaReport(escalaReport)
    }
  }
    
  useEffect(() => {
    if (selectedTipo === 'Abertas') {
      buscarEscalas(intervaloData)
      props.buscarEquipamentosAtivos()
      props.buscarFuncionariosAtivos()
      props.buscarVeiculos()
      props.buscarClientesAtivos()
      props.buscarEmpresas()
      props.buscarOrdensEscala()
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    formatReport(intervaloData, props.escalas)
    setState({...state, data: props?.escalas, filteredData: props?.escalas})
    setLoadingSkeleton(false)
  }, [props?.escalas])

  useEffectAfterMount(() => {
    formatReport(intervaloData, props.escalas)
  }, [props?.equipamentos])

  useEffectAfterMount(() => {
    handleToastSuccess()
    buscarEscalas(intervaloData)
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    handleToastError()
    buscarEscalas(intervaloData, Enum_StatusEscalas.Aberta)
  }, [props?.error])

  useEffectAfterMount(() => {
    buscarEscalas(intervaloData)
  }, [intervaloData])

  return (
    <Card>
      <CardHeader>
          <div><h3 className="font-weight-bolder">Filtrar</h3></div>
      </CardHeader>
      <CardBody>
        <Row className="justify-content-between">
          <Col md="2">
            <Flatpickr
              value={intervaloData}
              onChange={date => handlerFiltroData(date)}
              onClose={ (selectedDates, dateStr, instance) => {
                if (selectedDates.length === 1) {
                    instance.setDate([selectedDates[0], selectedDates[0]], true)
                }
              }}
              disabled={loadingSkeleton}
              className="form-control"
              key={Portuguese}
              options={{ mode: 'range', locale: Portuguese, dateFormat: 'd-m-Y'  }}
              name="filtroData"
              placeholder="Intervalo de datas"
              ref={refComp}
            />
          </Col>
          <Col md="2">
            <Button color="primary"
                onClick={() => buscarEscalas(intervaloData)}
                className="text-size-button mr-1"
                disabled={loadingSkeleton}
            >
                Atualizar
            </Button> 
          </Col>
          <Col md="6" style={{textAlign: 'right'}}>
            <Button color="secondary"
                onClick={() => {
                  const html = ReactDOMServer.renderToStaticMarkup(<ReportEscala escala={escalaReport}  />)
                  const htmlWDoc = `<!DOCTYPE html>${html}`
                  const wnd = window.open("about:blank", "", "_blank")
                  wnd.document.write(htmlWDoc)
                }}
                className="text-size-button mr-1"
                disabled={loadingSkeleton}
            >
                Relatório
            </Button>  
            <Button color="primary"
                onClick={() => {
                  if (alert) {
                    MySwal.fire('Atenção!', 'Não se esqueça de atualizar as escalas anteriores antes de prosseguir.', 'info')
                    setAlert(false)
                  }
                  setData({id: 0, Status: Enum_StatusEscalas.Aberta, Data: new Date()})
                  setModal(true)
                }}
                className="text-size-button"
                disabled={loadingSkeleton}
            >
                Nova Escala
            </Button>  
          </Col>
        </Row>
      </CardBody>
      {
        loadingSkeleton
        && <SkeletonDataTable configDataTableSkeleton={configDataTableSkeleton} />
      }
      <ModalFuncionarios data={JSON.parse(JSON.stringify(data))} modal={modalFuncionarios} handleClose={handleCloseFuncionarios} funcionarios={JSON.parse(JSON.stringify(props.funcionarios))} escalas={props.escalas} updateFuncionarios={updateFuncionarios} />
      <ModalVeiculos data={JSON.parse(JSON.stringify(data))} modal={modalVeiculos} handleClose={handleCloseVeiculos} veiculos={JSON.parse(JSON.stringify(props.veiculos))} escalas={props.escalas} updateVeiculos={updateVeiculos} />
      <ModalCadastroEscala data={data} modal={modal} save={save} handleClose={handleClose} equipamentos={props.equipamentos} clientes={props.clientes} ordens={props.ordens} veiculos={props.veiculos} funcionarios={JSON.parse(JSON.stringify(props.funcionarios))} escalas={props.escalas} empresas={props.empresas} />
      {
        !loadingSkeleton
        && <ReactTable
            style={{ fontSize: 'small', textAlign: 'center'}}
            filterable
            pagination
            responsive
            defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value
            }
            columns={[
              {
                Header: "AÇÕES",
                id: 'acoes',
                filterable: false,
                width: 180,
                accessor: (row) => {
                  return (<div>
                    {!row.OrdemServico && <FiXCircle title='Cancelar' style={{margin: '5px'}} size={20} onClick={() => {
                      cancelar(row)
                    }}/>}
                    <FiEdit2 title='Editar' style={{margin: '5px'}} size={20} onClick={() => {
                      const deepCopyObj = JSON.parse(JSON.stringify(row))                    
                      setData(deepCopyObj)
                      setModal(true)
                    }}/>
                    <FiUser title='Ver Funcionários' style={{margin: '5px'}} size={20} onClick={() => {
                      const data = JSON.parse(JSON.stringify(row))
                      setData(data)
                      setModalFuncionarios(true)
                    }}/>
                    <FiTruck title='Ver Veículos' style={{margin: '5px'}} size={20} onClick={() => {
                      const data = JSON.parse(JSON.stringify(row))
                      setData(data)
                      setModalVeiculos(true)
                    }}/>
                    <FiRepeat title='Duplicar' style={{margin: '5px'}} size={20} onClick={() => {
                      const data = JSON.parse(JSON.stringify(row))                
                      data.id = 0

                      let date = new Date(row.Data)
                      date = new Date(date.setHours(date.getHours() + 3))

                      data.Data = moment(new Date(date.setDate(date.getUTCDate() + 1))).format("YYYY-MM-DD")
                      data.EscalaFuncionarios.forEach(f => { f.id = 0 })
                      data.EscalaVeiculos.forEach(f => { f.id = 0 })
                      delete data.OrdemServico
                      delete data.AgendamentoServicos
                      delete data.DataAlteracao
                      delete data.createdAt
                      delete data.updatedAt
                      setData(data)
                      setModal(true)
                    }}/>
                    <FiSave title='Salvar' style={{margin: '5px'}} size={20} onClick={() => {
                      if (fullData(row)) save(row)
                      else MySwal.fire('Favor inserir os dados obrigatórios!')
                    }}/>
                  </div>)
                }
              },
              {
                Header: "ID",
                id: 'id',
                show: false,
                accessor: (row) => (<Input style={{border: "none"}}
                    type="text"
                    id="Id"
                    name="Id"
                    placeholder="Id"
                    value={row.id}
                    disabled
                />),
                width: 100,
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
              },
              {
                Header: "OS",
                id: "OS",
                accessor: (row) => `${row.OrdemServico?.Codigo}/${row.OrdemServico?.Numero}`,
                width: 120,
                Cell: (row) => (<div style={{ display: "flex" }}>
                <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem', width: '12rem', border: 'none' })
                    }}
                    name="OS"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={props.ordens}
                    isSearchable
                    isClearable
                    getOptionLabel={(option) => `${option?.Codigo}/${option?.Numero}`}
                    getOptionValue={(option) => option}
                    value={
                        props.ordens?.filter((option) => option.id === row.original.OrdemServico?.id)
                    }
                    onChange={(object) => {
                      row.original.OrdemOld = row.original.OrdemServico?.id
                      row.original.Cliente = object ? object.Cliente : row.original.Cliente
                      row.original.Equipamento = object ? object.Equipamento : row.original.Equipamento
                      row.original.OrdemServico = object
                      setState({...state}, state)
                    }}
                />
                </div>),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["OS"] })
              },
              {
                Header: "EMPRESA",
                id: "Empresa",
                accessor: "Empresa.Descricao",
                width: 190,
                Cell: (row) => (<div style={{ display: "flex" }}>
                <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem', width: '15rem', border: row.original.Empresa?.id ? 'none' : '', borderColor: row.original.Empresa?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                    }}
                    name="Empresa"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={props.empresas}
                    isSearchable
                    getOptionLabel={(option) => option?.Descricao}
                    getOptionValue={(option) => option}
                    value={
                        props.empresas?.filter((option) => option.id === row.original.Empresa?.id)
                    }
                    onChange={(object) => {
                      row.original.Empresa = object
                      setState({...state}, state)
                    }}
                />
                </div>),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
              },
              {
                Header: "CLIENTE",
                id: "Cliente",
                accessor: "Cliente.RazaoSocial",
                width: 190,
                Cell: (row) => (<div style={{ display: "flex" }}>
                <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem', width: '15rem' })
                    }}
                    name="Cliente"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={props.clientes}
                    isSearchable
                    getOptionLabel={(option) => option?.RazaoSocial}
                    getOptionValue={(option) => option}
                    value={
                        props.clientes?.filter((option) => option.id === row.original.Cliente?.id)
                    }
                    onChange={(object) => {
                      row.original.Cliente = object
                      setState({...state}, state)
                    }}
                    isDisabled={row.original.OrdemServico?.id}
                />
                </div>),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
              },
              {
                Header: "DATA",
                id: "Data",
                accessor: (value) => value.Data === '-' || moment(value.Data).local().format("DD/MM/YYYY"),
                width: 160,
                Cell: (row) => (
                    <Input style={!row.original.Data ? { borderColor: '#cc5050' } : {border: "none"}}
                        type="date"
                        id="Data"
                        name="Data"
                        placeholder="Data"
                        value={row.original.Data}
                        onChange={(e) => {
                          row.original[e.target.name] = e.target.value
                          setState({...state}, state)
                        }}
                    />),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Data"] })
              },
              {
                Header: "HORA",
                id: "Hora",
                accessor: (value) => value.Hora === '-' || moment(value.Hora, "HH:mm").format("HH:mm"),
                width: 160,
                Cell: (row) => (
                  <Input
                      type="time"
                      id="Hora"
                      name="Hora"
                      placeholder="Hora"
                      value={row.original.Hora || ''}
                      onChange={(e) => {
                        row.original[e.target.name] = e.target.value
                        setState({...state}, state)
                      }}
                  />
                  ),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Data"] })
              },
              {
                Header: "EQUIPAMENTO",
                id: "Equipamento",
                accessor: "Equipamento.Equipamento",
                width: 300,
                Cell: (row) => (<div style={{ display: "flex" }}>
                <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem', width: '25rem', border: row.original.Equipamento?.id ? 'none' : '', borderColor: row.original.Equipamento?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                    }}
                    name="Equipamento"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={props.equipamentos}
                    isSearchable
                    getOptionLabel={(option) => option?.Equipamento}
                    getOptionValue={(option) => option}
                    value={
                        props.equipamentos?.filter((option) => option.id === row.original.Equipamento?.id)
                    }
                    onChange={(object) => {
                      row.original.Equipamento = object
                      setState({...state}, state)
                    }}
                />
                </div>),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Equipamento"] })
              },
              {
                Header: "VEÍCULOS",
                id:"Veiculos",
                accessor: (value) => value.EscalaVeiculos?.map(item => { return `${item.Veiculo?.Descricao} - ${item.Veiculo?.Placa}; ` }),
                width: 300,
                Cell: (row) => (
                  <Input style={!row.original.EscalaVeiculos?.length ? { borderColor: '#cc5050' } : {border: "none"}}
                      type="text"
                      id="Veiculos"
                      name="Veiculos"
                      placeholder="Veículos"
                      value={row.original.EscalaVeiculos?.map(item => { return `${item.Veiculo?.Placa}; ` })}
                      disabled
                  />),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Veiculos"] })
              },
              {
                Header: "FUNCIONÁRIOS",
                id:"Funcionarios",
                accessor: (value) => value.EscalaFuncionarios?.map(item => { return `${item.Funcionario?.Nome}; ` }),
                width: 300,
                Cell: (row) => (
                  <Input style={!row.original.EscalaFuncionarios?.length ? { borderColor: '#cc5050' } : {border: "none"}}
                      type="text"
                      id="Funcionarios"
                      name="Funcionarios"
                      placeholder="Funcionários"
                      value={row.original.EscalaFuncionarios?.map(item => { return `${item.Funcionario?.Nome}; ` })}
                      disabled
                  />),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Funcionarios"] })
              },
              {
                Header: "OBSERVAÇÕES",
                id: "Observacoes",
                accessor: (x) => {
                  return x.Observacoes ?? ''
                },
                width: 300,
                Cell: (row) => (<div style={{ display: "flex" }}>
                <Input
                    style={{border: 'none'}}
                    type="textarea"
                    rows={4}
                    id="Observacoes"
                    name="Observacoes"
                    placeholder="Observações"
                    value={row.original.Observacoes}
                    onChange={(e) => {
                      row.original[e.target.name] = e.target.value
                      setState({...state}, state)
                    }}
                />
                </div>),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
              }
            ]}
            defaultPageSize={50}
            defaultSorted={[
              {
                id: "Data",
                desc: false
              }
            ]}
            noDataComponent="Ainda não existem"
            previousText={"Anterior"}
            nextText={"Próximo"}
            noDataText="Não há escalas para exibir"
            pageText='Página'
            ofText='de'
            rowsText='itens'
            getTheadTrProps={(state, row) => {
              return {
                style: { background: '#2f4b74', color: 'white', height: '2.3rem', fontWeight: 'bold' }
              }
            }}
            data={state.filteredData}
        />
      }
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    escalas: state?.escala?.escalas,
    ordens: state?.ordem?.ordens,
    funcionarios: state?.funcionario?.lista,
    veiculos: state?.veiculo?.lista,
    equipamentos: state?.equipamento?.equipamentosAtivos,
    clientes: state?.cliente?.listaClientesAtivos,
    empresas: state?.empresa.empresas,
    isFinishedAction: state?.escala?.isFinishedAction,
    error: state?.escala?.error
  }
}

export default connect(mapStateToProps, {
  buscarEscalas,
  buscarOrdensEscala,
  alterarEscala,
  cadastrarEscala,
  buscarEquipamentosAtivos,
  buscarFuncionariosAtivos,
  buscarVeiculos,
  buscarClientesAtivos,
  buscarEmpresas
})(EscalasAbertas)