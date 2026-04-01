import React, { useState, useEffect } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { Card, CardBody, Row, Col, Button, CardFooter } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { buscarContasCadastrar } from "@src/redux/actions/financeiro/contas-a-pagar/buscarContasActions"
import { buscarListas } from "@src/redux/actions/financeiro/contas-a-pagar/buscarListasActions"
import { adicionarConta } from "@src/redux/actions/financeiro/contas-a-pagar/adicionarContaActions"
import { alterarConta } from "@src/redux/actions/financeiro/contas-a-pagar/alterarContaActions"
import { cadastrarConta } from "@src/redux/actions/financeiro/contas-a-pagar/cadastrarContaActions"
import { cancelarConta } from "@src/redux/actions/financeiro/contas-a-pagar/cancelarContaActions"
import { importarConta } from "@src/redux/actions/financeiro/contas-a-pagar/importarContaActions"
import { buscarEmpresas } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import { buscarClientesAtivos } from "@src/redux/actions/administrador/cliente/listaClientesActions";
import { FiEdit2, FiSend, FiXCircle } from 'react-icons/fi'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import swal from 'sweetalert'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import ModalContasCadastrar from '../modals/ModalContasCadastrar'
import ModalImportarContas from '../modals/ModalImportarContas'
import { formatNumberReal } from '../../../../../utility/number/index'
import moment from "moment"
import { convertDateFormat, dateSort } from '../../../../../utility/date/date'
moment.locale("pt-br")

const MySwal = withReactContent(Swal)

const ContasCadastrar = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'Ações' },
      { name: 'Id' },
      { name: 'Empresa' },
      { name: 'Fornecedor' },
      { name: 'Nº NF' },
      { name: 'Emissão NF' },
      { name: 'Valor Total (R$)' },
      { name: 'Primeira Parcela' },
      { name: 'Naturezas Contábeis' },
      { name: 'Centros de Custo' },
      { name: 'Data de Entrada' },
      { name: 'Usuário' }
    ],
    quantityItensOnRow: 10
  
  } 
  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [data, setData] = useState({})
  const [filteredData, setFilteredData] = useState([])
  const [modal, setModal] = useState(false)
  const [modalImp, setModalImp] = useState(false)
  const [initial, setInitial] = useState(true)
  const [valorTotal, setValorTotal] = useState(0)
  const [state, setState] = useState({})

  const handleClose = () => {
    setData({})
    setModal(false)
  }

  const handleCloseImp = () => {
    setModalImp(false)
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

  const handleToastImportSuccess = (msg) => {
    toast.success(
      <ToastContent
        messageTitle="Importação"
        messageBody={msg}
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastStatusSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Contas à pagar"
        messageBody="Status alterado!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastImportError = (msg) => {
    toast.error(
      <ToastContent
        messageTitle="Importação"
        messageBody={msg}
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const fullData = (conta) => {
    let contaProdutoError = false
    let contaCentroCustoError = false
    let contaNaturezaError = false
    let contaPagamentoError = false
    
    if (!conta.ContaProdutos || conta.ContaProdutos.length === 0) contaProdutoError = true
    conta?.ContaProdutos?.forEach(x => { if (!x.Descricao || !x.ValorUnitario || !x.Quantidade) contaProdutoError = true })

    if (!conta.ContaCentrosCustos || conta.ContaCentrosCustos.length === 0) contaCentroCustoError = true

    if (!conta.ContaNaturezasContabeis || conta.ContaNaturezasContabeis.length === 0) contaNaturezaError = true

    if (!conta.ContaPagamento?.ContaPagamentoParcela || conta.ContaPagamento.ContaPagamentoParcela.length === 0) contaPagamentoError = true
    if (!contaPagamentoError) conta?.ContaPagamento.ContaPagamentoParcela?.forEach(x => { if (!x.NumeroParcela || !x.ValorParcela || !x.DataVencimento) contaPagamentoError = true })

    const r = conta.Fornecedor?.id > 0 && conta.Empresa?.id > 0 && !contaNaturezaError && !contaCentroCustoError && !contaProdutoError && !contaPagamentoError && conta.NumeroNF && conta.DataEmissaoNF

    return r
  }

  const save = (data) => {
    const span = document.createElement("span")
    span.innerHTML = "Tem certeza que deseja salvar os dados?"
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
        handleClose()
        if (data.id === 0) props.adicionarConta(data)
        else props.alterarConta(data)
      } else swal("Processo cancelado!")
    })
  }

  const importXML = (data) => {
    const span = document.createElement("span")
    span.innerHTML = "Tem certeza que deseja importar os arquivos?"
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
        handleCloseImp()
        props.importarConta(data)
      } else swal("Processo cancelado!")
    })
  }

  const cadastrar = (data) => {
    if (!fullData(data)) return swal("Atenção", "Preencha todos os campos antes de prosseguir!", "warning")
    const span = document.createElement("span")
    span.innerHTML = "Tem certeza que deseja avançar para pagamento?"
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
        props.cadastrarConta(data)
      } else swal("Processo cancelado!")
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
              data.MotivoCancelamento = value.toUpperCase()
              setLoadingSkeleton(true)
              props.cancelarConta(data)
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
    
  useEffect(() => {
    if (selectedTipo === 'Cadastrar') {
      props.buscarListas()
      props.buscarEmpresas()
      props.buscarContasCadastrar()
      props.buscarClientesAtivos();
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    setInitial(false)
    props?.lista.forEach(value => {
      if(value.id === 10866) debugger;
      value.NaturezaContabil = ''
      value.CentroCusto = ''
      value?.ContaNaturezasContabeis?.map(item => { value.NaturezaContabil += (item.NaturezaContabil ? `${item.NaturezaContabil?.Descricao} ` : '') })
      value?.ContaCentrosCustos?.map(item => { value.CentroCusto += (item.CentroCusto ? `${item.CentroCusto?.Descricao} ` : '') })
      value.DataEmissao = moment(value.DataEmissaoNF).isValid() ? moment(value.DataEmissaoNF).local().format("DD/MM/YYYY") : '-'
      value.VencimentoParcela = moment(value.VencimentoParcela).year() !== 1970 ? moment(value.VencimentoParcela).local().format("DD/MM/YYYY") : '-'
      value.DataEntrada = moment(value.createdAt).local().format("DD/MM/YYYY")
      value.Id = value.id
    })
    setState({...state, data: props?.lista})
    setFilteredData(props?.lista)
    setLoadingSkeleton(false)
  }, [props?.lista])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastSuccess()
      setInitial(true)
      props.buscarContasCadastrar()
    }
  }, [props?.isFinishedAction])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastStatusSuccess()
      setInitial(true)
      props.buscarContasCadastrar()
    }
  }, [props?.updateStatus])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      props.buscarContasCadastrar()
    }
  }, [props?.error])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      for (const msg of props?.isFinishedImport) {
        if (msg.error) {
          handleToastImportError(msg.msg)
        } else {
          handleToastImportSuccess(msg.msg)
        }
      }
      setInitial(true)
      props.buscarContasCadastrar()
    }
  }, [props?.isFinishedImport])
  
  useEffectAfterMount(() => {
    let valor = 0
    if (filteredData.length) {
      filteredData.forEach(x => { valor += x.ValorTotal })
    } else if (state?.data.length) {
      state?.data.forEach(x => { valor += x.ValorTotal })
    }

    setValorTotal(valor)
  }, [filteredData])

  return (
        <Card>
          <CardBody>
            <Row className="justify-content-between">
              <div className="event-tags d-none d-sm-flex justify-content-end mt-1 ml-1">
                <div className="tag mr-1">
                  <span className="bullet bullet-info bullet-sm mr-50"></span>
                  <span>Conta em correção</span>
                </div>
              </div>
              <Col md="8" style={{textAlign: 'right'}}>
                <Button color="primary"
                    onClick={() => {
                        setModalImp(true)
                    }}
                    className="text-size-button mr-1"
                    disabled={loadingSkeleton}
                >
                    Importar
                </Button>  
                <Button color="primary"
                    onClick={() => {
                        setData({ id: 0})
                        setModal(true)
                    }}
                    className="text-size-button"
                    disabled={loadingSkeleton}
                >
                    Adicionar
                </Button>  
              </Col>
            </Row>
          </CardBody>
          {
            loadingSkeleton
            && <SkeletonDataTable configDataTableSkeleton={configDataTableSkeleton} />
          } 
          <ModalContasCadastrar data={JSON.parse(JSON.stringify(data))} modal={modal} handleClose={handleClose} save={save} empresas={props.empresas} clientes={props.clientes} listas={props.listaAux} />
          <ModalImportarContas modal={modalImp} handleClose={handleCloseImp} save={importXML} />
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
                    width: 100,
                    Cell: (row) => {
                      return (<div>
                        <FiXCircle style={{margin: '5px'}} size={20} onClick={() => {
                          cancelar(row.original)
                        }}/>
                        <FiEdit2 style={{margin: '5px'}} size={20} onClick={() => {
                          setData(row.original)
                          setModal(true)
                        }}/>
                        <FiSend style={{margin: '5px'}} size={20} onClick={() => {
                          cadastrar(row.original)
                        }}/>
                      </div>)
                    }
                  },
                  {
                    Header: "STATUS",
                    id: "Status",
                    accessor: 'Status',
                    width: 80,
                    filterable: false,
                    Cell: (row) => {
                      return (
                        <span className={row?.original?.Status === 4 ? "bullet bullet-info bullet-sm ml-1" : "" }></span>
                      )
                    }
                  },
                  {
                    Header: "ID",
                    accessor: "Id",
                    filterAll: true,
                    width: 80,
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
                    id: "DataEmissao",
                    accessor: (value) => value.DataEmissao,
                    filterAll: true,
                    width: 150,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissao"] }),
                    sortType: 'datetime',
                    sortMethod: (a, b) => {
                      const convertedB = convertDateFormat(b);
                      const convertedA = convertDateFormat(a);
                
                      return dateSort(convertedA, convertedB);
                    }
                  },
                  {
                    Header: "VALOR TOTAL (R$)",
                    id: "ValorTotal",
                    accessor: (value) => formatNumberReal(value.ValorTotal?.toFixed(2)) || '-',
                    filterAll: true,
                    width: 150,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorTotal"] })
                  },
                  {
                    Header: "VENCIMENTO",
                    id: "VencimentoParcela",
                    accessor: "VencimentoParcela",
                    filterAll: true,
                    width: 120,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["VencimentoParcela"] }),
                    sortType: 'datetime',
                    sortMethod: (a, b) => {
                      const convertedB = convertDateFormat(b);
                      const convertedA = convertDateFormat(a);
                
                      return dateSort(convertedA, convertedB);
                    }
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
                    width: 150,
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
                    Header: "USUÁRIO",
                    id: "Usuario",
                    accessor: (value) => value?.UsuarioLancamento?.username || '-',
                    filterAll: true,
                    width: 150,
                    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Usuario"] })
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
                getTheadTrProps={(state, row) => {
                  return {
                    style: { background: '#2f4b74', color: 'white', height: '2.3rem', fontWeight: 'bold' }
                  }
                }}
                data={filteredData}
            />
          }
          {filteredData?.length > 0 && <CardFooter>
            <h4>Valor total: {formatNumberReal(valorTotal)}</h4>
          </CardFooter>}
        </Card>
    )
}

const mapStateToProps = (state) => {
  return {
    lista: state?.contas?.lista,
    listaAux: state?.contas?.listaAux,
    isFinishedAction: state?.contas?.isFinishedAction,
    isFinishedImport: state?.contas?.isFinishedImport,
    updateStatus: state?.contas?.updateStatus,
    error: state?.contas?.error,
    empresas: state?.empresa?.empresas,
    clientes: state?.cliente?.listaClientesAtivos
  }
}

export default connect(mapStateToProps, {
  buscarContasCadastrar,
  buscarListas,
  buscarEmpresas,
  buscarClientesAtivos,
  adicionarConta,
  alterarConta,
  cadastrarConta,
  cancelarConta,
  importarConta
})(ContasCadastrar)