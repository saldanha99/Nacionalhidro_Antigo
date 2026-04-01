import React, { useState, useEffect, useRef } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { buscarPropostas } from "@src/redux/actions/comercial/proposta/buscarPropostasActions"
import { cadastrarProposta } from "@src/redux/actions/comercial/proposta/cadastrarPropostaActions"
import { alterarProposta } from "@src/redux/actions/comercial/proposta/alterarPropostaActions"
import { enviarProposta } from "@src/redux/actions/comercial/proposta/enviarPropostaActions"
import { alterarStatusProposta } from "@src/redux/actions/comercial/proposta/alterarStatusPropostaActions"
import { Card, CardBody, Row, Col, Button, CardHeader } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { FiEdit2, FiSend, FiXCircle, FiThumbsUp, FiThumbsDown, FiEye, FiCopy } from 'react-icons/fi'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { formatNumberReal } from '../../../../../utility/number/index'
import { Enum_StatusPropostas } from '../../../../../utility/enum/Enums'
import ModalCadastroProposta from '../modals/ModalCadastroProposta'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import moment from "moment"
moment.locale("pt-br")
import auth from "@src/services/auth"

const MySwal = withReactContent(Swal)
const user = auth.getUserInfo()

const PropostasAbertas = (props) => {
  const refComp = useRef(null)

  const configDataTableSkeleton = {
    nameRows: [
      { name: 'Ações' },
      { name: 'Código' },
      { name: 'Revisão' },
      { name: 'Cliente' },
      { name: 'Vendedor' },
      { name: 'Data de Geração' },
      { name: 'Validade' },
      { name: 'Valor' }
    ],
    quantityItensOnRow: 10
  } 

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3))
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3))

  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [data, setData] = useState({})
  const [filteredData, setFilteredData] = useState([])
  const [modal, setModal] = useState(false)
  const [state, setState] = useState({})
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem])

  const buscarPropostas = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarPropostas(Enum_StatusPropostas.Aberta, user, dataInicial, dataFinal)
      setLoadingSkeleton(true)
    }

  }

  const handleClose = () => {
    setData({})
    setModal(false)
  }

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Proposta"
        messageBody="Proposta salva!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Proposta"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const save = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja gerar a proposta?",
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
            data.CriadoPor = user
            data.DataCriacao = new Date()
            props.cadastrarProposta({ data })
          } else if (data.Enviada) {
            data.id = 0
            data.Enviada = false
            data.ehRevisao = true
            data.AlteradoPor = user
            data.DataAlteracao = new Date()
            props.cadastrarProposta({ data })
          } else {
            data.AlteradoPor = user
            data.DataAlteracao = new Date()
            props.alterarProposta({ data })
          }
          MySwal.fire({
            title: 'Aguarde...',
            text: 'Estamos gerando o arquivo PDF da Proposta, para que você possa visualizar. Caso ao finalizar o processo ainda não visualize o arquivo, tente atualizar a página ou entre em contato com o suporte!',
            icon: "info"
          })
        }
      })
  }

  const enviar = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja enviar a proposta? O cliente será notificado via e-mail.",
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
    .then(function (result) {
      if (result.value) {
        setLoadingSkeleton(true)
        props.enviarProposta({ data })
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
              data.MotivoCancelamento = value.toUpperCase()
              data.DataCancelamento = new Date()
              data.Status = Enum_StatusPropostas.Cancelado
              props.alterarStatusProposta({data})
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

  const alterarStatus = (data, status) => {
    MySwal.fire({
      title: "Aviso",
      icon: "warning",
      text: "Tem certeza que deseja prosseguir?",
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
        if (status === Enum_StatusPropostas.Aprovada) {
          setLoadingSkeleton(true)
          data.Status = status
          data.DataStatus = new Date()
          props.alterarStatusProposta({data})
        } else {
          MySwal.fire({
            text: "Motivo da reprovação:",
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
                data.MotivoReprovacao = value.toUpperCase()
                data.Status = status
                data.DataStatus = new Date()
                props.alterarStatusProposta({data})
              } else {
                Swal.showValidationMessage("O motivo é um campo obrigatório")
              }
            },
            buttonsStyling: false,
            showLoaderOnConfirm: true
          })
        }
      }
    })
  }

  const visualizarPDF = (data) => {
    window.open(data.UrlArquivo, '_blank')
  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
  }
    
  useEffect(() => {
    if (selectedTipo === 'Em Aberto') {
      buscarPropostas(intervaloData)
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    setState({...state, data: props?.propostas})
    setFilteredData(props?.propostas)
    setLoadingSkeleton(false)
  }, [props?.propostas])

  useEffectAfterMount(() => {
    handleToastSuccess()
    buscarPropostas(intervaloData)
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    handleToastError()
    buscarPropostas(intervaloData, Enum_StatusPropostas.Aberta)
  }, [props?.error])

  useEffectAfterMount(() => {
    buscarPropostas(intervaloData)
  }, [intervaloData])

  return (
    <Card>
      <CardHeader>
          <div><h3 className="font-weight-bolder">Filtrar data de geração</h3></div>
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
              key={Portuguese}
              options={{ mode: 'range', locale: Portuguese, dateFormat: 'd-m-Y'  }}
              name="filtroData"
              placeholder="Intervalo de datas"
              ref={refComp}
            />
          </Col>
          <Col md="4">
            <div className="event-tags d-none d-sm-flex mt-1">
              <div className="tag mr-1">
              <span className="bullet bullet-info bullet-sm mr-50"></span>
              <span>Proposta Enviada</span>
              </div>
              <div className="tag mr-1">
              <span className="bullet bullet-danger bullet-sm mr-50"></span>
              <span>Proposta Vencida</span>
              </div>
            </div>
          </Col>
          <Col md="5" style={{textAlign: 'right'}}>
            <Button color="primary"
                onClick={() => {
                    setData({ Revisao: 0, Usuario: user})
                    setModal(true)
                }}
                className="text-size-button"
                disabled={loadingSkeleton}
            >
                Nova Proposta
            </Button>  
          </Col>
        </Row>
      </CardBody>
      {
        loadingSkeleton
        && <SkeletonDataTable configDataTableSkeleton={configDataTableSkeleton} />
      } 
      <ModalCadastroProposta data={data} modal={modal} handleClose={handleClose} save={save} clientes={props.clientes} vendedores={props.vendedores} empresas={props.empresas} equipamentos={props.equipamentos} acessorios={props.acessorios} responsabilidades={props.responsabilidades} cargos={props.cargos} configuracoes={props.configuracoes} user={user} />
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
                accessor: 'id',
                filterable: false,
                width: 180,
                Cell: (row) => {
                  return (<div>
                    <FiXCircle title='Cancelar' style={{margin: '5px'}} size={20} onClick={() => {
                      cancelar(row.original)
                    }}/>
                    {row.original.Enviada && <FiCopy title='Copiar' style={{margin: '5px'}} size={20} onClick={() => {
                      const copy = JSON.parse(JSON.stringify(row.original));
                      copy.Revisao = 0;
                      copy.Usuario = user;
                      copy.DataProposta = null;
                      copy.Enviada = null;
                      copy.Codigo = null;
                      copy.DataStatus = null;
                      copy.AlteradoPor = null;
                      copy.DataAlteracao = null;
                      copy.UrlArquivo = null;
                      copy.NomeArquivo = null;
                      
                      setData(copy)
                      setModal(true)
                    }}/>}
                    {row.original.Enviada && <FiThumbsDown title='Reprovar' style={{margin: '5px'}} size={20} onClick={() => {
                      alterarStatus(row.original, Enum_StatusPropostas.Reprovada)
                    }}/>}
                    {row.original.Enviada && <FiThumbsUp title='Aprovar' style={{margin: '5px'}} size={20} onClick={() => {
                      alterarStatus(row.original, Enum_StatusPropostas.Aprovada)
                    }}/>}
                    <FiEdit2 title='Editar' style={{margin: '5px'}} size={20} onClick={() => {
                      const deepCopyObj = JSON.parse(JSON.stringify(row.original))                    
                      setData(deepCopyObj)
                      setModal(true)
                    }}/>
                    {!row.original.Enviada && <FiSend title='Enviar' style={{margin: '5px'}} size={20} onClick={() => {
                      enviar(row.original)
                    }}/>}
                    {row.original.UrlArquivo && <FiEye title='Visualizar PDF' style={{margin: '5px'}} size={20} onClick={() => {
                      visualizarPDF(row.original)
                    }}/>}
                  </div>)
                }
              },
              {
                Header: "STATUS",
                id: "Enviada",
                accessor: 'Enviada',
                width: 80,
                filterable: false,
                Cell: (row) => {
                  return (
                    <span className={row?.original?.Enviada ? "bullet bullet-info bullet-sm ml-1" : new Date(row?.original?.DataValidade) < new Date() ? "bullet bullet-danger bullet-sm ml-1" : " "}></span>
                  )
                }
              },
              {
                Header: "CÓDIGO",
                accessor: "Codigo",
                filterAll: true,
                width: 120,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Codigo"] })
              },
              {
                Header: "REVISÃO",
                id: 'Revisao',
                accessor: "Revisao",
                filterable: false,
                width: 120,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Revisao"] }),
                Cell: (row) => {
                  return (
                    <span>{row?.original?.Revisao > 0 ? row?.original?.Revisao : "Não Revisado".toUpperCase()}</span>
                  )
                }
              },
              {
                Header: "CLIENTE",
                id: "Cliente",
                accessor: (value) => value.Cliente.RazaoSocial || '-',
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
              },
              {
                Header: "VENDEDOR",
                id: "Usuario",
                accessor: (value) => value.Usuario?.username?.toUpperCase(),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Usuario"] })
              },
              {
                Header: "DATA DE GERAÇÃO",
                id: "DataProposta",
                accessor: (value) => value.DataProposta === '-' || moment(value.DataProposta).local().format("DD/MM/YYYY"),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataProposta"] })
              },
              {
                Header: "VALIDADE",
                id: "DataValidade",
                accessor: (value) => value.DataValidade === '-' || moment(value.DataValidade).local().format("DD/MM/YYYY"),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataValidade"] })
              },
              {
                Header: "VALOR",
                id: "Valor",
                accessor: (value) => formatNumberReal(value?.Valor) || '-',
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Valor"] })
              }
            ]}
            defaultPageSize={10}
            defaultSorted={[
              {
                id: "Codigo",
                desc: true
              }
            ]}
            noDataComponent="Ainda não existem"
            previousText={"Anterior"}
            nextText={"Próximo"}
            noDataText="Não há propostas para exibir"
            pageText='Página'
            ofText='de'
            rowsText='itens'
            getTheadTrProps={(state, row) => {
              return {
                style: { background: '#2f4b74', color: 'white', height: '2.3rem', fontWeight: 'bold' }
              }
            }}
            data={filteredData}
        />
      }
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    propostas: state?.proposta?.propostas
  }
}

export default connect(mapStateToProps, {
  buscarPropostas,
  cadastrarProposta,
  alterarProposta,
  enviarProposta,
  alterarStatusProposta
})(PropostasAbertas)