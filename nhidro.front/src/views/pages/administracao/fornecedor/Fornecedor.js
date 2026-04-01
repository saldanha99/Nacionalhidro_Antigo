import React, { useState, useEffect } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { Card, CardHeader, CardBody, Input, Row, Col, Button } from 'reactstrap'
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import "@styles/base/plugins/tables/react-paginate.scss"
import "@styles/react/libs/tables/react-dataTable-component.scss"
import "@styles/base/pages/data-list.scss"
import SkeletonDataTable from '../../components/SkeletonDataTable'
import { buscarFornecedor } from "@src/redux/actions/administrador/fornecedor/buscarFornecedorActions"
import { cadastrarFornecedor } from "@src/redux/actions/administrador/fornecedor/cadastrarFornecedorActions"
import { alterarFornecedor } from "@src/redux/actions/administrador/fornecedor/alterarFornecedorActions"
import { ChevronDown, ChevronLeft, ChevronRight } from "react-feather"
import { FiEdit2} from 'react-icons/fi'
import ModalFornecedor from './ModalFornecedor'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import swal from 'sweetalert'
import auth from "@src/services/auth"
import { BrazilFormatComponent } from 'react-brazil'

const userInfo = auth.getUserInfo()

const Fornecedor = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'RAZÃO SOCIAL' },
      { name: 'NOME FANTASIA' },
      { name: 'CNPJ' },
      { name: 'INSCRIÇÃO ESTADUAL' },
      { name: 'ENDEREÇO' },
      { name: 'E-MAIL' },
      { name: 'TELEFONE' }
    ],
    quantityItensOnRow: 10

  }
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState({})
  const [modal, setModal] = useState(false)
  const [initial, setInitial] = useState(true)
  const [state, setState] = useState({
      searchTextValue: null
  })

  const handleClose = () => {
    setModal(false)
  }

  const handlePagination = (page) => {
    setCurrentPage(page.selected)
  }

  const handleFilter = (e) => {
    setState({...state, [e.target.name]: e?.target?.value})  
  }
    
  const executeFilterData = (value) => {
    if (value.length) {
      let updatedData = []
      updatedData = state.data.filter((item) => {
        if (!item.Bloqueado) {
          const startsWith =
            item?.Nome?.toUpperCase().includes(value.toUpperCase())  ||
            item?.CNPJ?.toUpperCase().includes(value.toUpperCase())  ||
            item?.Inscricao?.toUpperCase().includes(value.toUpperCase()) ||
            item?.Endereco?.toUpperCase().includes(value.toUpperCase())  ||
            item?.Email?.toUpperCase().includes(value.toUpperCase()) ||
            item?.Telefone?.toUpperCase().includes(value.toUpperCase()) 
  
          if (startsWith) {
            return startsWith
          } else return null
        }
      })
          

      return updatedData
    }
  }

  const dataToRender = () => {
    if (state.searchTextValue?.length) {
      return executeFilterData(state.searchTextValue)
    }
    return state?.data.filter(item => !item.Bloqueado)
  }

  const CustomPagination = () => (
    <ReactPaginate
        previousLabel={<ChevronLeft size={15} />}
        nextLabel={<ChevronRight size={15} />}
        forcePage={currentPage}
        onPageChange={(page) => handlePagination(page)}
        pageCount={dataToRender().length / 10 || 1}
        breakLabel={"..."}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        activeClassName={"active"}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
        "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
        }
    />
  )

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Fornecedor"
        messageBody="Dados salvos!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Fornecedor"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
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
        handleClose()
        if (data.id === 0) props.cadastrarFornecedor({data})
        else props.alterarFornecedor({data})
      } else swal("Processo cancelado!")
    })
  }

  useEffect(() => {
    props.buscarFornecedor()
    setLoadingSkeleton(true)
  }, [])

  useEffectAfterMount(() => {
    setInitial(false)
    setState({...state, data: props?.lista})
    setLoadingSkeleton(false)
  }, [props?.lista])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastSuccess()
      setInitial(true)
      props.buscarFornecedor()
    }
  }, [props?.isFinishedAction])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      props.buscarFornecedor()
    }
  }, [props?.error])

  return (
        <Card>
          <CardHeader>
              <div><h3 className="font-weight-bolder">Procurar</h3></div>
          </CardHeader>
          <CardBody>
              <Row>
                  <Col md="6">
                      <Input
                          className="form-control"
                          type="text"
                          id="search-input"
                          placeholder="Procurar"
                          name="searchTextValue"
                          value={state.searchTextValue}
                          onChange={handleFilter}
                      />
                  </Col>
                  <Col md="6" style={{textAlign: 'right'}}>
                    <Button color="primary"
                        onClick={() => {
                            setData({ id: 0, Bloqueado: false })
                            setModal(true)
                        }}
                        className="text-size-button"
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
          <ModalFornecedor data={data} modal={modal} handleClose={handleClose} save={save} />
          {
            !loadingSkeleton
            && <DataTable
                noHeader
                pagination
                columns={[
                  {
                    name: "EDITAR",
                    maxWidth: "50px",
                    cell: (row) => <FiEdit2 style={{margin: '5px'}} size={20} onClick={() => {
                        console.log(row)
                        setData(row)
                        setModal(true)
                    } 
                    }/>
                  },
                  {
                    name: "Razão Social",
                    selector: "Nome",
                    sortable: true,
                    width: "20rem",
                    cell: (row) => <span>{row?.Nome || "-"}</span>
                  },
                  {
                    name: "Nome Fantasia",
                    selector: "NomeFantasia",
                    sortable: true,
                    width: "20rem",
                    cell: (row) => <span>{row?.NomeFantasia || "-"}</span>
                  },
                  {
                    name: "CNPJ",
                    selector: "CNPJ",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{<BrazilFormatComponent value={row?.CNPJ} format='cnpj'/> || '-'}</span>
                  },
                  {
                    name: "Inscrição Estadual",
                    selector: "Inscricao",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.Inscricao || '-'}</span>
                  },
                  {
                    name: "Endereço",
                    selector: "Endereco",
                    sortable: true,
                    width: "25rem",
                    cell: (row) => <span>{row?.Endereco || '-'}</span>
                  },
                  {
                    name: "E-mail",
                    selector: "Email",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.Email || "-"}</span>
                  },
                  {
                    name: "Telefone",
                    selector: "Telefone",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.Telefone || "-"}</span>
                  },
                  {
                    name: "Bloqueado",
                    selector: "Bloqueado",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.Bloqueado ? 'Sim' : 'Não' }</span>
                  }
                ]}
                paginationPerPage={10}
                noDataComponent="Ainda não existem"
                className="react-dataTable"
                sortIcon={<ChevronDown size={10} />}
                paginationDefaultPage={currentPage + 1}
                paginationComponent={CustomPagination}
                data={dataToRender()}
            />
          }
        </Card>
    )
}

const mapStateToProps = (state) => {
  return {
    lista: state?.fornecedor?.lista,
    isFinishedAction: state?.fornecedor?.isFinishedAction,
    error: state?.fornecedor?.error
  }
}

export default connect(mapStateToProps, {
  buscarFornecedor,
  cadastrarFornecedor,
  alterarFornecedor
})(Fornecedor)