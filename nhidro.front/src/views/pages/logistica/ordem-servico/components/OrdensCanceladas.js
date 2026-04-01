import React, { useState, useEffect, useRef } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { buscarOrdensRaw } from "@src/redux/actions/logistica/ordem-servico/buscarOrdensActions"
import { corrigirPrecificacao } from "@src/redux/actions/financeiro/medicao/index";
import { Card, CardBody, Row, Col, CardHeader } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import { Enum_StatusOrdens } from '../../../../../utility/enum/Enums'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import moment from "moment"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { ArrowLeftCircle } from 'react-feather'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
moment.locale("pt-br")
const MySwal = withReactContent(Swal)

const OrdensCanceladas = (props) => {
  const refComp = useRef(null)

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3))
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3))

  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [state, setState] = useState({})
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem])

  const buscarOrdens = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarOrdensRaw(Enum_StatusOrdens.Cancelado, dataInicial, dataFinal)
      setLoadingSkeleton(true)
    }

  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
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
    if (selectedTipo === 'Canceladas') {
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
            Header: "MOTIVO CANCELAMENTO",
            accessor: "motivo_cancelamento",
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["motivo_cancelamento"] })
          },
          {
            Header: "DATA CANCELAMENTO",
            id: "data_cancelamento",
            accessor: (value) => value.data_cancelamento === '-' || moment(value.data_cancelamento).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_cancelamento"] })
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
    ordens: state?.ordem?.new_ordens,
    statePrecificar: state?.medicao?.statePrecificar
  }
}

export default connect(mapStateToProps, {
  buscarOrdensRaw,
  corrigirPrecificacao
})(OrdensCanceladas)