import React, { useState, useEffect } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { Card, CardHeader, CardBody, Row, Col, CardFooter } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { buscarContasPagas } from "@src/redux/actions/financeiro/contas-a-pagar/buscarContasActions"
import { corrigirParcela } from "@src/redux/actions/financeiro/contas-a-pagar/corrigirContaActions"
import { ArrowLeft, List } from "react-feather"
import { formatNumberReal } from '../../../../../utility/number/index'
import { Enum_StatusContasPagamento } from '../../../../../utility/enum/Enums'
import ModalHistorico from '../modals/ModalHistorico'
import Flatpickr from "react-flatpickr"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import moment from "moment"
import { convertDateFormat, dateSort } from '../../../../../utility/date/date'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import auth from "@src/services/auth"
moment.locale("pt-br")

const MySwal = withReactContent(Swal)

const user = auth.getUserInfo()

const ContasPagas = (props) => {

  const configDataTableSkeleton = {
    nameRows: [
      { name: 'HISTÓRICO' },
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
      { name: 'PARCIAL' },
      { name: 'OBSERVAÇÕES' },
      { name: 'USUÁRIO' }
    ],
    quantityItensOnRow: 10
  } 

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3))
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3))

  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem])
  const [valorTotal, setValorTotal] = useState(0)
  const [state, setState] = useState({})
  const [modal, setModal] = useState(false)
  const [data, setData] = useState({})

  const handleClose = () => {
    setModal(false)
  }

  const buscarContasPagas = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarContasPagas(dataInicial, dataFinal)
      setLoadingSkeleton(true)
    }
  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
  }

  const corrigirParcela = (contaId, parcela) => {
    MySwal.fire({
      title: "Correção",
      text: "A parcela retornará para pagamento. Deseja prosseguir?",
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
        props.corrigirParcela(contaId, parcela);
      }
    })
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
    
  useEffect(() => {
    if (selectedTipo === 'Pago') {
      buscarContasPagas(intervaloData)
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    props?.listaPagas.forEach(value => {
      value.NaturezaContabil = ''
      value.CentroCusto = ''
      value?.ContaNaturezasContabeis?.map(item => { value.NaturezaContabil += (item.NaturezaContabil ? `${item.NaturezaContabil?.Descricao}; ` : '') })
      value?.ContaCentrosCustos?.map(item => { value.CentroCusto += (item.CentroCusto ? `${item.CentroCusto?.Descricao}; ` : '') }),
      value.DataEmissaoNF = moment(value.DataEmissaoNF).local().format("DD/MM/YYYY"),
      value.DataVencimento = moment(value.DataVencimento).local().format("DD/MM/YYYY"),
      value.DataVencimentoReal = moment(value.DataVencimentoReal).local().format("DD/MM/YYYY"),
      value.DataEntrada = moment(value.DataCriacao).local().format("DD/MM/YYYY")
      value.Id = value.id
    })
    setState({...state, data: props?.listaPagas})
    setFilteredData(props?.listaPagas)
    setLoadingSkeleton(false)
  }, [props?.listaPagas])
  
  useEffectAfterMount(() => {
    let valor = 0
    if (filteredData?.length) {
      filteredData.forEach(x => { valor += x.Parcela?.ValorPago ?? 0 })
    } else if (state?.data?.length) {
      state?.data.forEach(x => { valor += x.Parcela?.ValorPago ?? 0 })
    }

    setValorTotal(valor)
  }, [filteredData])

  useEffectAfterMount(() => {
    buscarContasPagas(intervaloData)
  }, [intervaloData])

  useEffectAfterMount(() => {
    if(!props.updateCorrecaoParcela) return;
    handleToastStatusCorrecaoSuccess()
    buscarContasPagas(intervaloData)
  }, [props?.updateCorrecaoParcela])

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
                    />
                  </Col>
              </Row>
          </CardBody>
          {
            loadingSkeleton
            && <SkeletonDataTable configDataTableSkeleton={configDataTableSkeleton} />
          }
          <ModalHistorico modal={modal} handleClose={handleClose} conta={data} />
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
                          {user.role.name === 'Gerencial' && <ArrowLeft style={{margin: '5px'}} size={20} onClick={() => {
                            corrigirParcela(row.original.Id, row.original.Parcela?.NumeroParcela)
                          }}/>}
                          <List style={{margin: '5px'}} size={20} onClick={() => {
                            setData(row.original)
                            setModal(true)
                          }}/>
                        </div>
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
                    accessor: "DataEmissaoNF",
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
                    accessor: (value) => value.Parcela?.ValorAPagar?.toFixed(2) || '-',
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
                    Header: "PARCIAL",
                    id: "StatusPagamento",
                    accessor: (value) => (value.Parcela?.StatusPagamento === Enum_StatusContasPagamento.Parcial ? 'Sim' : 'Não'),
                    filterAll: true,
                    width: 50,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["StatusPagamento"] })
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
          {state.data?.length && <CardFooter>
            <h4>Valor pago: {formatNumberReal(valorTotal)}</h4>
          </CardFooter>}
        </Card>
    )
}

const mapStateToProps = (state) => {
  return {
    listaPagas: state?.contas?.listaPagas,
    updateCorrecaoParcela: state.contas?.updateCorrecaoParcela,
    error: state?.contas?.error
  }
}

export default connect(mapStateToProps, {
  buscarContasPagas,
  corrigirParcela
})(ContasPagas)