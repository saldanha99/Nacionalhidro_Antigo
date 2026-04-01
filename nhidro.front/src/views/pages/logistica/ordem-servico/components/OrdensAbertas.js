import React, { useState, useEffect, useRef } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { buscarOrdensRaw, buscarOrdem } from "@src/redux/actions/logistica/ordem-servico/buscarOrdensActions"
import { alterarOrdem, alterarOrdemEmLote } from "@src/redux/actions/logistica/ordem-servico/alterarOrdemActions"
import { imprimirOrdens, visualizarOrdem } from "@src/redux/actions/logistica/ordem-servico/imprimirOrdensActions"
import { buscarVeiculos } from "@src/redux/actions/administrador/veiculo/buscarVeiculoActions"
import { buscarFuncionariosAtivos } from "@src/redux/actions/administrador/funcionario/buscarFuncionarioActions"
import { buscarEscalasOrdens } from "@src/redux/actions/logistica/escala/buscarEscalasActions"
import { buscarEmpresas  } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import { Card, CardBody, Row, Col, CardHeader, CustomInput, Button } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import uuidv4 from 'uuid/v4'
import { FiEdit2, FiEye, FiXCircle } from 'react-icons/fi'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Enum_StatusOrdens } from '../../../../../utility/enum/Enums'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import moment from "moment"
moment.locale("pt-br")
import auth from "@src/services/auth"
import ModalCadastroOrdem from '../modals/ModalCadastroOrdem'
import ModalBaixarOrdem from '../modals/ModalBaixarOrdem'
import Spinner from 'reactstrap/lib/Spinner'

const MySwal = withReactContent(Swal)
const user = auth.getUserInfo()

const OrdensAbertas = (props) => {
  const refComp = useRef(null)

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 2))
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 2))

  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [loadingPrint, setLoadingPrint] = useState(false)
  const [data, setData] = useState({})
  const [filteredData, setFilteredData] = useState([])
  const [modal, setModal] = useState(false)
  const [state, setState] = useState({})
  const [dataPrint, setDataPrint] = useState({})
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem])
  const [modalBaixa, setModalBaixa] = useState(false)
  const [selectAll, setSelectAll] = useState(null)
  const [cancel, setCancel] = useState(null)

  let reactTable = useRef(null)

  const buscarOrdens = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarOrdensRaw(Enum_StatusOrdens.Aberta, dataInicial, dataFinal)
      setLoadingSkeleton(true)
    }

  }
  
  const buscarEscalas = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarEscalasOrdens(dataInicial, dataFinal)
    }

  }

  const handleClose = () => {
    setData({})
    setModal(false)
  }

  const handleCloseBaixa = () => {
    setModalBaixa(false)
  }

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Ordem de Serviço"
        messageBody="OS salva!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Ordem de Serviço"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const save = (data, baixa) => {
    MySwal.fire({
      title: "Aviso",
      text: !baixa ? "Tem certeza que deseja salvar a OS?" : "Tem certeza que deseja baixar a OS?",
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
          data.DataInicial = data.DataInicial?.length ? data.DataInicial[0] : data.DataInicial
          data.HoraInicial = moment(data.HoraInicial, "HH:mm").format("HH:mm:ss.SSS")
          data.AlteradoPor = user
          data.DataAlteracao = new Date()
          data.HoraPadrao = data.HoraPadrao ? moment(data.HoraPadrao, "HH:mm").format("HH:mm:ss.SSS") : null
          data.HoraTolerancia = data.HoraTolerancia ? moment(data.HoraTolerancia, "HH:mm").format("HH:mm:ss.SSS") : null
          data.HoraEntrada = data.HoraEntrada ? moment(data.HoraEntrada, "HH:mm").format("HH:mm:ss.SSS") : null
          data.HoraSaida = data.HoraSaida ? moment(data.HoraSaida, "HH:mm").format("HH:mm:ss.SSS") : null
          data.HoraAlmoco = data.HoraAlmoco ? moment(data.HoraAlmoco, "HH:mm").format("HH:mm:ss.SSS") : null
          data.HoraTotal = data.HoraTotal ? moment(data.HoraTotal, "HH:mm").format("HH:mm:ss.SSS") : null
          data.HoraAdicional = data.HoraAdicional ? moment(data.HoraAdicional, "HH:mm").format("HH:mm:ss.SSS") : null
          if (baixa) {
            data.BaixadoPor = user
            data.DataBaixa = new Date()
            data.Status = Enum_StatusOrdens.Executada
          }
          props.alterarOrdem({ data })
          setModal(false)
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
              setCancel(value)
              props.buscarOrdem(data.id)
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

  const baixarLote = (dadosHora) => {
    MySwal.fire({
      title: "Aviso",
      icon: "warning",
      text: "Tem certeza que baixar todas as Ordens selecionadas?",
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
        handleCloseBaixa()
        setLoadingSkeleton(true)
        const selecionados = filteredData.filter(x => x.Selecionado)
        props.alterarOrdemEmLote(selecionados, dadosHora, user)
      }
    })
  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
  }
    
  useEffect(() => {
    if (selectedTipo === 'Em Aberto') {
      buscarOrdens(intervaloData)
      buscarEscalas(intervaloData)
      props.buscarEmpresas()
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    setState({...state, data: props?.ordens})
    setFilteredData(props?.ordens)
    setLoadingSkeleton(false)
  }, [props?.ordens])

  useEffectAfterMount(() => {
    if (!props.ordem) return
    if (cancel) {
      setCancel(null)
      const data = props.ordem
      data.MotivoCancelamento = cancel
      data.DataCancelamento = new Date()
      data.Status = Enum_StatusOrdens.Cancelado
      props.alterarOrdem({ data })
    } else {
      props.ordem.DataInicial = moment(props.ordem.DataInicial).toDate()
      setData(props.ordem)
      setModal(true)
    }
    setLoadingSkeleton(false)
  }, [props?.ordem])

  useEffectAfterMount(() => {
    if (props.isFinishedAction?.message) {
      MySwal.fire('Alerta!', `As seguintes ordens da proposta estão pendentes: ${props.isFinishedAction?.message}`, 'warning')
    }
    handleToastSuccess()
    buscarOrdens(intervaloData)
    buscarEscalas(intervaloData)
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    if (!props.print?.data) return
    const blob = new Blob([new Uint8Array(props?.print?.data)], { type: 'application/pdf' })
    const fileURL = window.URL.createObjectURL(blob)
    const tab = window.open()
    tab.location.href = fileURL
    setLoadingPrint(false)
    setDataPrint({})
  }, [props?.print])

  useEffectAfterMount(() => {
    handleToastError()
  }, [props?.error])

  useEffectAfterMount(() => {
    buscarOrdens(intervaloData)
    buscarEscalas(intervaloData)
  }, [intervaloData])

  return (
    <Card>
      <CardHeader>
          <div><h3 className="font-weight-bolder">Filtrar data inicial</h3></div>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md="3">
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
          <div className="event-tags d-none d-sm-flex justify-content-end mt-1 ml-1">
            <div className="tag mr-1">
              <span className="bullet bullet-danger bullet-sm mr-50"></span>
              <span>Baixa em atraso</span>
            </div>
          </div>
          <Col md="8" style={{textAlign: 'right'}}>
            <Button color="secondary"
                title="Selecione na lista abaixo as Ordens que deseja imprimir."
                onClick={() => {
                  setLoadingPrint(true)
                  setLoadingSkeleton(true)
                  props.imprimirOrdens(filteredData.filter(x => x.Selecionado))
                }}
                className="text-size-button mr-2"
                disabled={!filteredData.some(x => x.Selecionado) || loadingPrint}
            >
                Imprimir em lote
            </Button>  
            <Button color="primary"
                title="Selecione na lista abaixo as Ordens que deseja efetuar uma baixa em lote."
                onClick={() => {
                  setModalBaixa(true)
                }}
                className="text-size-button"
                disabled={!filteredData.some(x => x.Selecionado)}
            >
                Baixa em lote
            </Button>  
          </Col>
        </Row>
        <Row>
          <Col className="mt-3">
            <CustomInput
              type="checkbox"
              id={uuidv4()}
              className="custom-control-primary zindex-0"
              inline
              checked={selectAll}
              onChange={(e) => {
                filteredData.forEach(x => { if (reactTable.getResolvedState().sortedData.find(y => y.id === x.id)) x.Selecionado = e.target.checked })
                setSelectAll(e.target.checked)
              }}
            />
            <span>Selecionar tudo</span>
          </Col>
        </Row>
      </CardBody>
      <ModalCadastroOrdem data={data} modal={modal} handleClose={handleClose} save={save} veiculos={props.veiculos} funcionarios={props.funcionarios} escalas={props.escalas} empresas={props.empresas} />
      <ModalBaixarOrdem modal={modalBaixa} handleClose={handleCloseBaixa} save={baixarLote} />
      <ReactTable
        loading={loadingSkeleton}
        style={{ fontSize: 'small', textAlign: 'center'}}
        filterable
        pagination
        responsive
        ref={(r) => (reactTable = r)}
        onFilteredChange={() => {
          setSelectAll(false)
          filteredData.forEach(x => { x.Selecionado = false })
        }}
        defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value
        }
        columns={[
          {
            Header: "AÇÃO EM LOTE",
            id: 'select',
            width: 120,
            filterable: false,
            Cell: (row) => {
              return (<div>
                <CustomInput
                  type="checkbox"
                  id={uuidv4()}
                  className="custom-control-primary zindex-0"
                  inline
                  checked={row.original.Selecionado}
                  onChange={(e) => {
                    row.original.Selecionado = e.target.checked
                    setFilteredData([...filteredData], filteredData)
                  }}
                />
              </div>)
            }
          },
          {
            Header: "AÇÕES",
            accessor: 'id',
            filterable: false,
            width: 160,
            Cell: (row) => {
              return (<div>
                <FiXCircle title='Cancelar' style={{margin: '5px'}} size={20} onClick={() => {
                  cancelar(row.original)
                }}/>
                <FiEdit2 title='Editar' style={{margin: '5px'}} size={20} onClick={() => {
                  setLoadingSkeleton(true)
                  props.buscarOrdem(row.original.id)
                }}/>
                {row.original.id === dataPrint.id ? <Spinner size={20} /> : <FiEye
                  title="Visualizar PDF"
                  style={{ margin: "5px" }}
                  size={20}
                  onClick={() => {
                    setDataPrint(row.original)
                    props.visualizarOrdem(row.original);
                  }}
                />}
              </div>)
            }
          },
          {
            Header: "STATUS",
            id: "status",
            width: 80,
            filterable: false,
            accessor: (row) => {
              return (
                <span className={ new Date(new Date(row?.data_inicial).setUTCDate(new Date(row?.data_inicial).getUTCDate() + 1)) < new Date(new Date().setUTCHours(0, 0, 0, 0)) ? "bullet bullet-danger bullet-sm" : "" }></span>
              )
            }
          },
          {
            Header: "PROPOSTA",
            id: 'proposta',
            accessor: (value) => value.proposta || '-',
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["proposta"] })
          },
          {
            Header: "CÓDIGO",
            id: "codigo",
            accessor: (value) => `${value.codigo}/${value.numero}`,
            filterAll: true,
            width: 120,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["codigo"] })
          },
          {
            Header: "EMPRESA",
            id: "empresa",
            accessor: (value) => value.empresa || '-',
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["empresa"] })
          },
          {
            Header: "CLIENTE",
            id: "cliente",
            accessor: (value) => value.cliente || '-',
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["cliente"] })
          },
          {
            Header: "CONTATO",
            id: "contato",
            accessor: (value) => value.contato?.toUpperCase(),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["contato"] })
          },
          {
            Header: "EQUIPAMENTO",
            id: "equipamento",
            accessor: (value) => value.equipamento?.toUpperCase(),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["equipamento"] })
          },
          {
            Header: "DATA",
            id: "data_inicial",
            accessor: (value) => value.data_inicial === '-' || moment(value.data_inicial).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_inicial"] })
          },
          {
            Header: "HORA",
            id: "hora_inicial",
            accessor: (value) => value.hora_inicial === '-' || moment(value.hora_inicial, "HH:mm").format("HH:mm"),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["hora_inicial"] })
          },
          {
            Header: "CRIADO POR",
            id: "usuario",
            accessor: (value) => value.usuario?.toUpperCase(),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["usuario"] })
          },
          {
            Header: "DATA CRIAÇÃO",
            id: "data_criacao",
            accessor: (value) => value.data_criacao === '-' || moment(value.data_criacao).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_criacao"] })
          }
        ]}
        defaultPageSize={10}
        defaultSorted={[
          {
            id: "data_inicial",
            desc: false
          }
        ]}
        noDataComponent="Ainda não existem"
        previousText={"Anterior"}
        nextText={"Próximo"}
        noDataText="Não há ordens para exibir"
        pageText='Página'
        ofText='de'
        rowsText='itens'
        loadingText='Carregando...'
        getTheadTrProps={(state, row) => {
          return {
            style: { background: '#2f4b74', color: 'white', height: '2.3rem', fontWeight: 'bold' }
          }
        }}
        data={filteredData}
      />
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    ordens: state?.ordem?.new_ordens,
    ordem: state?.ordem?.ordem,
    funcionarios: state?.funcionario?.lista,
    veiculos: state?.veiculo?.lista,
    escalas: state?.escala?.escalas,
    empresas: state?.empresa.empresas,
    isFinishedAction: state?.ordem?.isFinishedAction,
    print: state?.ordem?.print,
    error: state?.ordem?.error
  }
}

export default connect(mapStateToProps, {
  buscarOrdensRaw,
  buscarOrdem,
  alterarOrdem,
  alterarOrdemEmLote,
  imprimirOrdens,
  visualizarOrdem,
  buscarFuncionariosAtivos,
  buscarEscalasOrdens,
  buscarVeiculos,
  buscarEmpresas
})(OrdensAbertas)