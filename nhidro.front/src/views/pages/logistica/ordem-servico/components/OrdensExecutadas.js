import React, { useState, useEffect, useRef } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { buscarOrdensRaw, buscarOrdem } from "@src/redux/actions/logistica/ordem-servico/buscarOrdensActions"
import { imprimirOrdens, visualizarOrdem } from "@src/redux/actions/logistica/ordem-servico/imprimirOrdensActions"
import { corrigirPrecificacao } from "@src/redux/actions/financeiro/medicao/index";
import { Card, CardBody, Row, Col, CardHeader } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import { FiList, FiEye } from 'react-icons/fi'
import { Enum_StatusOrdens } from '../../../../../utility/enum/Enums'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import moment from "moment"
import ModalCadastroOrdem from '../modals/ModalCadastroOrdem'
import Spinner from 'reactstrap/lib/Spinner'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { ArrowLeftCircle } from 'react-feather'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
moment.locale("pt-br")
const MySwal = withReactContent(Swal)

const OrdensExecutadas = (props) => {
  const refComp = useRef(null)

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 2))
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 2))

  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [loadingPrint, setLoadingPrint] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [state, setState] = useState({})
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem])
  const [data, setData] = useState({})
  const [dataPrint, setDataPrint] = useState({})
  const [modal, setModal] = useState(false)

  const buscarOrdens = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarOrdensRaw(Enum_StatusOrdens.Executada, dataInicial, dataFinal)
      setLoadingSkeleton(true)
    }

  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
  }

  const handleClose = () => {
    setData({})
    setModal(false)
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

  const corrigirOrdem = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja voltar a OS para correção?",
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
          setLoadingSkeleton(true)
          const model ={
            id: data.id,
            Status: Enum_StatusOrdens.Aberta
          }
          props.corrigirPrecificacao(model)
        }
      })
  }
    
  useEffect(() => {
    if (selectedTipo === 'Executadas') {
      buscarOrdens(intervaloData)
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
    props.ordem.DataInicial = moment(props.ordem.DataInicial).toDate()
    setData(props.ordem)
    setModal(true)
    setLoadingSkeleton(false)
  }, [props?.ordem])

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
    buscarOrdens(intervaloData)
  }, [intervaloData])

  useEffectAfterMount(() => {
    handleToastSuccess()
    buscarOrdens(intervaloData)
  }, [props?.statePrecificar])

  return (
    <Card>
      <CardHeader>
          <div><h3 className="font-weight-bolder">Filtrar data inicial</h3></div>
      </CardHeader>
      <CardBody>
        <Row className="justify-content-between">
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
        </Row>
      </CardBody>
      <ModalCadastroOrdem data={data} modal={modal} handleClose={handleClose} onlyView={true} />
      <ReactTable
        loading={loadingSkeleton}
        style={{ fontSize: 'small', textAlign: 'center'}}
        filterable
        pagination
        responsive
        defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value
        }
        columns={[
          {
            Header: "AÇÔES",
            accessor: 'id',
            filterable: false,
            width: 160,
            Cell: (row) => {
              return (<div>
                <ArrowLeftCircle
                  title="Corrigir"
                  style={{ margin: "5px" }}
                  size={20}
                  onClick={() => {
                    corrigirOrdem(row.original);
                  }}
                />
                {row.original.id === dataPrint.id ? <Spinner size={20} /> : <FiEye title='Visualizar PDF' style={{margin: '5px'}} size={20} onClick={() => {
                    setDataPrint(row.original)
                    props.visualizarOrdem(row.original);
                }}/>}
                <FiList title='Visualizar' style={{margin: '5px'}} size={20} onClick={() => {
                  setLoadingSkeleton(true)
                  props.buscarOrdem(row.original.id)
                }}/>
              </div>)
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
          },
          {
            Header: "DATA DA BAIXA",
            id: "data_baixa",
            accessor: (value) => value.data_baixa === '-' || moment(value.data_baixa).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_baixa"] })
          }
        ]}
        defaultPageSize={10}
        defaultSorted={[
          {
            id: "codigo",
            desc: true
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
    print: state?.ordem?.print,
    ordens: state?.ordem?.new_ordens,
    ordem: state?.ordem?.ordem,
    statePrecificar: state?.medicao?.statePrecificar
  }
}

export default connect(mapStateToProps, {
  imprimirOrdens,
  visualizarOrdem,
  buscarOrdensRaw,
  buscarOrdem,
  corrigirPrecificacao
})(OrdensExecutadas)