import React, { useState, useEffect, useRef } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { cadastrarOrdem, cadastrarOrdemEmLote } from "@src/redux/actions/logistica/ordem-servico/cadastrarOrdemActions"
import { buscarUltimoCodigo, buscarPropostasRaw, buscarProposta } from "@src/redux/actions/logistica/ordem-servico/buscarOrdensActions"
import { buscarVeiculos } from "@src/redux/actions/administrador/veiculo/buscarVeiculoActions"
import { buscarFuncionariosAtivos } from "@src/redux/actions/administrador/funcionario/buscarFuncionarioActions"
import { buscarEscalasOrdens } from "@src/redux/actions/logistica/escala/buscarEscalasActions"
import { buscarEmpresas  } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Enum_StatusOrdens, Enum_StatusPropostas } from '../../../../../utility/enum/Enums'
import auth from "@src/services/auth"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import moment from "moment"
import { FiFolderPlus } from 'react-icons/fi'
import ModalCadastroOrdem from '../modals/ModalCadastroOrdem'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
moment.locale("pt-br")

const MySwal = withReactContent(Swal)
const user = auth.getUserInfo()

const OrdensAbrir = (props) => {
  const refComp = useRef(null)

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 4))
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 4))

  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [state, setState] = useState({})
  const [data, setData] = useState({})
  const [modal, setModal] = useState(false)
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem])

  const buscarPropostas = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      props.buscarPropostasRaw(dataInicial, dataFinal)
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
        messageBody="Falha na requisição!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
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
          if (!data.id) {
            data.HoraInicial = moment(data.HoraInicial, "HH:mm").format("HH:mm:ss.SSS")
            data.CriadoPor = user
            data.DataCriacao = new Date()
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
            if (data.DataInicial.length && (new Date(data.DataInicial[0]).getTime() !== new Date(data.DataInicial[1]).getTime())) {
              MySwal.fire('', 'Você está gerando Ordens em lote, isso poderá levar alguns minutos.', 'info')
              props.cadastrarOrdemEmLote(data)
            } else {
              data.DataInicial = moment(data.DataInicial[0]).toDate()
              props.cadastrarOrdem({ data })
            }
            setModal(false)
          }
        }
      })
  }
    
  useEffect(() => {
    if (selectedTipo === 'Abrir') {
      buscarPropostas(intervaloData)
      buscarEscalas(intervaloData)
      props.buscarFuncionariosAtivos()
      props.buscarVeiculos()
      props.buscarEmpresas()
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    setState({...state, data: props?.propostas})
    setFilteredData(props?.propostas)
    setLoadingSkeleton(false)
  }, [props?.propostas])

  useEffectAfterMount(() => {
    if (!props.proposta) return
    const os = {
      Codigo: props.proposta.Codigo,
      Status: Enum_StatusOrdens.Aberta,
      Proposta: props.proposta,
      DataInicial: [new Date(), new Date()],
      Empresa: props.proposta.Empresa,
      Cliente: props.proposta.Cliente,
      Contato: props.proposta.Contato
    }
    setData(os)
    props.buscarUltimoCodigo(props.proposta.Codigo)
  }, [props?.proposta])

  useEffectAfterMount(() => {
    if (props.ultimoCodigo?.length) {
      data.Numero = props.ultimoCodigo[0].Numero + 1
      setData(data)
    } else {
      data.Numero = 1
      setData(data)
    }
    setModal(true)
    setLoadingSkeleton(false)
  }, [props?.ultimoCodigo])

  useEffectAfterMount(() => {
    if (props.isFinishedAction?.message) {
      MySwal.fire('Alerta!', `As seguintes ordens da proposta estão pendentes: ${props.isFinishedAction?.message}`, 'warning')
    }
    handleToastSuccess()
    setLoadingSkeleton(false)
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    handleToastError()
    setLoadingSkeleton(false)
  }, [props?.error])

  useEffectAfterMount(() => {
    buscarPropostas(intervaloData)
    buscarEscalas(intervaloData)
  }, [intervaloData])

  return (
    <Card>
    <CardHeader>
        <div><h3 className="font-weight-bolder">Filtrar data proposta</h3></div>
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
            className="form-control"
            disabled={loadingSkeleton}
            key={Portuguese}
            options={{ mode: 'range', locale: Portuguese, dateFormat: 'd-m-Y'  }}
            name="filtroData"
            placeholder="Intervalo de datas"
            ref={refComp}
          />
        </Col>
      </Row>
    </CardBody>
      <ModalCadastroOrdem data={data} modal={modal} handleClose={handleClose} save={save} veiculos={props.veiculos} funcionarios={props.funcionarios} escalas={props.escalas} empresas={props.empresas} />
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
            Header: "AÇÕES",
            accessor: 'id',
            filterable: false,
            width: 160,
            Cell: (row) => {
              return (<div>
                <FiFolderPlus title='Abrir Ordem' style={{margin: '5px'}} size={20} onClick={() => {
                  if (!row.original?.cliente_cnpj) return MySwal.fire({
                    title: "Cliente",
                    text: "Favor completar o cadastro do cliente antes de prosseguir.",
                    icon: "warning"
                  })
                  setLoadingSkeleton(true)
                  props.buscarProposta(row.original.id)
                }}/>
              </div>)
            }
          },
          {
            Header: "PROPOSTA",
            accessor: "codigo",
            filterAll: true,
            width: 120,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["codigo"] })
          },
          {
            Header: "REVISÃO",
            id: 'revisao',
            accessor: "revisao",
            filterable: false,
            width: 120,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["revisao"] }),
            Cell: (row) => {
              return (
                <span>{row?.original?.revisao > 0 ? row?.original?.revisao : "Não Revisado".toUpperCase()}</span>
              )
            }
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
            Header: "VENDEDOR",
            id: "username",
            accessor: (value) => value.username,
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["username"] })
          },
          {
            Header: "DATA DE GERAÇÃO",
            id: "data_proposta",
            accessor: (value) => value.data_proposta === '-' || moment(value.data_proposta).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_proposta"] })
          },
          {
            Header: "VALIDADE",
            id: "data_validade",
            accessor: (value) => value.data_validade === '-' || moment(value.data_validade).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_validade"] })
          },
          {
            Header: "DATA DE APROVAÇÃO",
            id: "data_status",
            accessor: (value) => value.data_status === '-' || moment(value.data_status).local().format("DD/MM/YYYY"),
            filterAll: true,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["data_status"] })
          }
        ]}
        defaultPageSize={10}
        noDataComponent="Ainda não existem"
        previousText={"Anterior"}
        nextText={"Próximo"}
        noDataText="Não há propostas para exibir"
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
    propostas: state?.ordem?.propostas,
    proposta: state?.ordem?.proposta,
    ultimoCodigo: state?.ordem?.ultimoCodigo,
    funcionarios: state?.funcionario?.lista,
    veiculos: state?.veiculo?.lista,
    escalas: state?.escala?.escalas,
    empresas: state?.empresa.empresas,
    isFinishedAction: state?.ordem?.isFinishedAction,
    error: state?.ordem?.error
  }
}

export default connect(mapStateToProps, {
  buscarPropostasRaw,
  buscarProposta,
  buscarFuncionariosAtivos,
  buscarVeiculos,
  buscarEscalasOrdens,
  buscarUltimoCodigo,
  cadastrarOrdem,
  cadastrarOrdemEmLote,
  buscarEmpresas
})(OrdensAbrir)