import React, { useState, useEffect, useRef } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { Card, CardHeader, CardBody, Row, Col, CardFooter } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import 'react-quill/dist/quill.snow.css'
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { buscarContasPagar } from "@src/redux/actions/financeiro/contas-a-pagar/buscarContasActions"
import { buscarEmpresasBancos } from "@src/redux/actions/administrador/empresa/buscarEmpresasBancosActions"
import { pagarConta } from "@src/redux/actions/financeiro/contas-a-pagar/pagarContaActions"
import { corrigirConta } from "@src/redux/actions/financeiro/contas-a-pagar/corrigirContaActions"
import { salvarParcela } from "@src/redux/actions/financeiro/contas-a-pagar/salvarParcelaActions"
import { upload } from "@src/redux/actions/files/uploadActions"
import { FiEdit2 } from 'react-icons/fi'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import swal from 'sweetalert'
import ModalContasPagar from '../modals/ModalContasPagar'
import { Enum_FormaPagamento } from '../../../../../utility/enum/Enums'
import { formatNumberReal } from '../../../../../utility/number/index'
import { formatImage } from '../../../../../utility/file/index'
import Flatpickr from "react-flatpickr"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import moment from "moment"
import uuidv4 from 'uuid/v4'
import { DiffDatesInDays, convertDateFormat, dateSort } from '../../../../../utility/date/date'
import auth from "@src/services/auth"

moment.locale("pt-br")

const user = auth.getUserInfo()

const ContasPagar = (props) => {
  const refComp = useRef(null)
  
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'AÇÕES' },
      { name: 'STATUS' },
      { name: 'ID' },
      { name: 'EMPRESA' },
      { name: 'FORNECEDOR' },
      { name: 'Nº NF' },
      { name: 'EMISSÃO NF' },
      { name: 'VALOR A PAGAR(R$)' },
      { name: 'PARCELA' },
      { name: 'VENCIMENTO' },
      { name: 'DATA DE PAGAMENTO' },
      { name: 'VALOR PAGO(R$)' },
      { name: 'NATUREZAS CONTÁBEIS' },
      { name: 'CENTROS DE CUSTO' },
      { name: 'DATA DE ENTRADA' },
      { name: 'OBSERVAÇÕES' },
      { name: 'USUÁRIO' }
    ],
    quantityItensOnRow: 10
  } 
  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3))
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3))

  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [data, setData] = useState({})
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem])
  const [filteredData, setFilteredData] = useState([])
  const [pagamento, setPagamento] = useState({})
  const [modal, setModal] = useState(false)
  const [initial, setInitial] = useState(true)
  const [valorTotal, setValorTotal] = useState(0)
  const [state, setState] = useState({})

  const handleClose = () => {
    setData({})
    setModal(false)
  }

  const buscarContasAPagar = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarContasPagar(dataInicial, dataFinal)
      setLoadingSkeleton(true)
      
      return
      const updatedData = state.data.filter(x => {
        const vencimento = moment(x.Parcela.DataVencimentoReal).utc()._d
        return vencimento >= intervaloData[0] && vencimento <= intervaloData[1]
      })
      setFilteredData(updatedData)
    }

  }
  useEffectAfterMount(() => {
    buscarContasAPagar(intervaloData)
  }, [intervaloData])

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
  }

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Contas à pagar"
        messageBody="Dados salvos!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Contas à pagar"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastStatusSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Contas à pagar"
        messageBody="Pagamento efetuado!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastStatusCorrecaoSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Contas à pagar"
        messageBody="Correção efetuada!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const save = (data, fileCheque) => {
    const span = document.createElement("span")
    span.innerHTML = "Tem certeza que deseja efetuar o pagamento?"
    swal({
      title: "Aviso",
      content: span,
      icon: "warning",
      buttons: ['Cancelar', 'Continuar'],
      dangerMode: true
    })
    .then((ok) => {
      if (ok) {
        setLoadingSkeleton(true)
        data.Parcela.ValorAPagar = data.Parcela.ValorAPagar - data.Valor
        data.DataPagamento = new Date()
        data.UsuarioBaixa = user.email;
        if (data.FormaPagamento === Enum_FormaPagamento.Cheque && fileCheque) {
          const image = formatImage(fileCheque)
          const extension = image.type.split('/')[1]
          const filename = `${uuidv4()}.${extension}`
          setPagamento(data)
          props.upload(image.buffer, filename, image.type)
        } else props.pagarConta(data)
        handleClose()
      } else swal("Processo cancelado!")
    })
  }

  const corrigirConta = (conta) => {
    props.corrigirConta(conta)
    handleClose()
  }

  const salvarParcela = (conta) => {
    conta.ValorAPagar = Math.round((conta.ValorParcela + conta.ValorAcrescimo - conta.ValorDecrescimo) * 100) / 100 - conta.ValorPago
    props.salvarParcela(conta)
    handleClose()
  }
    
  useEffect(() => {
    if (selectedTipo === 'Pagar') {    
      props.buscarEmpresasBancos()   
      buscarContasAPagar(intervaloData)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    setInitial(false)
    if (props.listaPagar && props.listaPagar.length > 0) {
      props?.listaPagar.forEach(value => {
        value.NaturezaContabil = ''
        value.CentroCusto = ''
        value?.ContaNaturezasContabeis?.map(item => { value.NaturezaContabil += (item.NaturezaContabil ? `${item.NaturezaContabil?.Descricao}; ` : '') })
        value?.ContaCentrosCustos?.map(item => { value.CentroCusto += (item.CentroCusto ? `${item.CentroCusto?.Descricao}; ` : '') })
        value.DataEmissaoNF = moment(value.DataEmissaoNF).local().format("DD/MM/YYYY")
        value.DataVencimento = moment(value.DataVencimento).local().format("DD/MM/YYYY")
        value.DataVencimentoReal = moment(value.DataVencimentoReal).local().format("DD/MM/YYYY")
        value.DataEntrada = moment(value.createdAt).local().format("DD/MM/YYYY")
        value.Id = value.id
      })
      setState({...state, data: props?.listaPagar})
      setFilteredData(props?.listaPagar)
    }
    setLoadingSkeleton(false)
  }, [props?.listaPagar])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastSuccess()
      setInitial(true)
      buscarContasAPagar(intervaloData)
    }
  }, [props?.isFinishedAction])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastStatusSuccess()
      setInitial(true)
      buscarContasAPagar(intervaloData)    
    }
  }, [props?.updateStatus])

  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastStatusCorrecaoSuccess()
      setInitial(true)
      props.buscarContasPagar()
    }
  }, [props?.updateStatusCorrecao])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      buscarContasAPagar(intervaloData)
    }
  }, [props?.error])

  useEffect(() => {
    if (props?.fileId) {
      pagamento.UrlCheque = props.fileId
      props.pagarConta(pagamento)
    }
  }, [props?.fileId])
  
  useEffectAfterMount(() => {
    let valor = 0
    if (filteredData.length) {
      filteredData.forEach(x => { valor += x.Parcela?.ValorAPagar ?? 0 })
    } else if (state?.data.length) {
      state?.data.forEach(x => { valor += x.Parcela?.ValorAPagar ?? 0 })
    }

    setValorTotal(valor)
  }, [filteredData])

  return (
        <Card>
          <CardHeader>
              <div><h3 className="font-weight-bolder">Filtrar data de vencimento</h3></div>
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
                      className="form-control"
                      key={Portuguese}
                      options={{ mode: 'range', locale: Portuguese, dateFormat: 'd-m-Y'  }}
                      name="filtroData"
                      placeholder="Intervalo de datas"
                      ref={refComp}
                    />
                  </Col>
                  <div className="event-tags d-none d-sm-flex justify-content-end mt-1">
                    <div className="tag mr-1 ml-4">
                    <span className="bullet bullet-danger bullet-sm mr-50"></span>
                    <span>Pagamento Atrasado</span>
                    </div>
                    <div className="tag mr-1">
                    <span className="bullet bullet-secondary bullet-sm mr-50"></span>
                    <span>Pagamento Parcial</span>
                    </div>
                  </div>
              </Row>
          </CardBody>
          {
            loadingSkeleton
            && <SkeletonDataTable configDataTableSkeleton={configDataTableSkeleton} />
          } 
          <ModalContasPagar data={data} modal={modal} handleClose={handleClose} save={save} corrigirConta={corrigirConta} salvarParcela={salvarParcela} bancos={props.empresasBancos}/>
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
                    id: 'id',
                    accessor: 'id',
                    filterable: false,
                    width: 80,
                    Cell: (row) => {
                      return (
                        <div>
                          <FiEdit2 style={{margin: '5px'}} size={20} onClick={() => {
                            setData(row.original)
                            setModal(true)
                          }}/>
                        </div>
                      )
                    }
                  },
                  {
                    Header: "STATUS",
                    id: "StatusPagamento",
                    accessor: 'StatusPagamento',
                    width: 80,
                    filterable: false,
                    Cell: (row) => {
                      return (
                        <span className={DiffDatesInDays(moment(), moment(row?.original?.Parcela?.DataVencimentoReal)) > 0 ? "bullet bullet-danger bullet-sm" : row?.original?.StatusPagamento === 'Parcial' ? "bullet bullet-secondary bullet-sm" : "" }></span>
                      )
                    }
                  },
                  {
                    Header: "ID",
                    accessor: "Id",
                    width: 80,
                    filterAll: true,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Id"] })
                  },
                  {
                    Header: "EMPRESA",
                    id: "Empresa",
                    accessor: (value) => value.Empresa.Descricao || '-',
                    filterAll: true,
                    width: 150,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
                  },
                  {
                    Header: "FORNECEDOR",
                    id: "Fornecedor",
                    accessor: (value) => value.Fornecedor.Nome,
                    filterAll: true,
                    width: 150,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Fornecedor"] })
                  },
                  {
                    Header: "Nº NF",
                    accessor: "NumeroNF",
                    filterAll: true,
                    width: 80,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroNF"] })
                  },
                  {
                    Header: "EMISSÃO NF",
                    id: "DataEmissaoNF",
                    accessor: (value) => value.DataEmissaoNF,
                    filterAll: true,
                    width: 120,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissaoNF"] }),
                    sortType: 'datetime',
                    sortMethod: (a, b) => {
                      const convertedB = convertDateFormat(b);
                      const convertedA = convertDateFormat(a);
                
                      return dateSort(convertedA, convertedB);
                    }
                  },
                  {
                    Header: "VALOR A PAGAR(R$)",
                    id: "ValorAPagar",
                    accessor: (value) => formatNumberReal(value.Parcela?.ValorAPagar) || '-',
                    filterAll: true,
                    width: 120,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorAPagar"] })
                  },
                  {
                    Header: "PARCELA",
                    id: "NumeroParcela",
                    accessor: (value) => value.NumeroParcela || '-',
                    width: 80,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroParcela"] })
                  },
                  {
                    Header: "VENCIMENTO",
                    id: "DataVencimento",
                    accessor: "DataVencimento",
                    filterAll: true,
                    width: 120,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataVencimento"] }),
                    sortType: 'datetime',
                    sortMethod: (a, b) => {
                      const convertedB = convertDateFormat(b);
                      const convertedA = convertDateFormat(a);
                
                      return dateSort(convertedA, convertedB);
                    }
                  },
                  {
                    Header: "DATA DE PAGAMENTO",
                    id: "DataVencimentoReal",
                    accessor: "DataVencimentoReal",
                    filterAll: true,
                    width: 120,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataVencimentoReal"] }),
                    sortType: 'datetime',
                    sortMethod: (a, b) => {
                      const convertedB = convertDateFormat(b);
                      const convertedA = convertDateFormat(a);
                
                      return dateSort(convertedA, convertedB);
                    }
                  },
                  {
                    Header: "VALOR PAGO(R$)",
                    id: "ValorPago",
                    accessor: (value) => value.Parcela?.ValorPago?.toFixed(2) || '-',
                    filterAll: true,
                    width: 120,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorPago"] })
                  },
                  {
                    Header: "NATUREZAS CONTÁBEIS",
                    id: "NaturezaContabil",
                    accessor: (value) => value.NaturezaContabil || '-',
                    filterAll: true,
                    width: 180,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NaturezaContabil"] })
                  },
                  {
                    Header: "CENTROS DE CUSTO",
                    id: "CentroCusto",
                    accessor: (value) => value.CentroCusto || '-',
                    filterAll: true,
                    width: 180,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["CentroCusto"] })
                  },
                  {
                    Header: "DATA DE ENTRADA",
                    id: "DataEntrada",
                    accessor: "DataEntrada",
                    filterAll: true,
                    width: 120,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEntrada"] }),
                    sortType: 'datetime',
                    sortMethod: (a, b) => {
                      const convertedB = convertDateFormat(b);
                      const convertedA = convertDateFormat(a);
                
                      return dateSort(convertedA, convertedB);
                    }
                  },
                  {
                    Header: "CLIENTE",
                    id: "Cliente",
                    accessor: (value) => value?.Cliente?.RazaoSocial || '-',
                    filterAll: true,
                    width: 150,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
                  },
                  {
                    Header: "OBSERVAÇÕES",
                    id: "Observacoes",
                    accessor: (value) => value?.Observacoes,
                    filterAll: true,
                    width: 150,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
                  },
                  {
                    Header: "USUÁRIO",
                    id: "Usuario",
                    accessor: (value) => value?.UsuarioLancamento?.username,
                    filterAll: true,
                    width: 150,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Usuario"] })
                  }
                ]}
                defaultPageSize={10}
                noDataComponent="Ainda não existem"
                previousText={"Anterior"}
                nextText={"Próximo"}
                noDataText="Não há contas para exibir"
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
          {filteredData?.length > 0 && <CardFooter>
            <h4>Valor à pagar: {formatNumberReal(valorTotal)}</h4>
          </CardFooter>}
        </Card>
    )
}

const mapStateToProps = (state) => {
  return {
    listaPagar: state?.contas?.listaPagar,
    empresasBancos: state?.empresa?.empresasBancos,
    isFinishedAction: state?.contas?.isFinishedAction,
    updateStatus: state?.contas?.updateStatus,
    updateStatusCorrecao: state?.contas?.updateStatusCorrecao,
    error: state?.contas?.error,
    fileId: state?.file?.fileId
  }
}

export default connect(mapStateToProps, {
  buscarContasPagar,
  pagarConta,
  upload,
  corrigirConta,
  salvarParcela,
  buscarEmpresasBancos
})(ContasPagar)