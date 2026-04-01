import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Input, Row, Col, Button} from 'reactstrap'
import '@styles/base/pages/clientes.scss'
import DataTable from "react-data-table-component"
import { buscarClientesporVendedor, enviarEmails  } from "@src/redux/actions/administrador/cliente/listaClientesActions"
import { buscarVendedores } from "@src/redux/actions/administrador/usuario/buscarUsuariosActions"
import { buscarFuncionariosAtivos } from "@src/redux/actions/administrador/funcionario/buscarFuncionarioActions"
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import "@styles/base/plugins/tables/react-paginate.scss"
import "@styles/react/libs/tables/react-dataTable-component.scss"
import "@styles/base/pages/data-list.scss"
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import ReactPaginate from "react-paginate"
import { updateFlag  } from "@src/redux/actions/flags/updateFlagActions"
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight
} from "react-feather"
import SkeletonDataTable from '../../components/SkeletonDataTable'
import { FiEdit2} from 'react-icons/fi'
import ModalCliente from './ModalCliente'
import auth from "@src/services/auth"
import ModalEnviarEmail from './ModalEnviarEmail'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const user = auth.getUserInfo()

const Clientes = (props) => {

  const TipoPessoa = {
    PessoaFisica: 1,
    PessoaJuridica: 2
  }
   
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'AÇÕES' },
      { name: 'ID' },
      { name: 'CÓDIGO' },
      { name: 'RAZÃO SOCIAL' },
      { name: 'NOME FANTASIA' },
      { name: 'CNPJ/CPF' },
      { name: 'IE/RG' },
      { name: 'SEGMENTO PRINCIPAL' },
      { name: 'LOCALIZAÇÃO' },
      { name: 'VENDEDOR' }
    ],
    quantityItensOnRow: 10

  }
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState({})
  const [modal, setModal] = useState(false)
  const [modalEmail, setModalEmail] = useState(false)
  const [state, setState] = useState({
      searchTextValue: null
  })
  const [selectedData, setSelectedData] = useState([])

  useEffect(() => {
      props.buscarVendedores()
      props.buscarClientesporVendedor(user)
      props.buscarFuncionariosAtivos()
      setLoadingSkeleton(true)
  }, [])

  useEffectAfterMount(() => {
    setState({
      ...state,
      data: props?.clientes
    })

    setLoadingSkeleton(false)
  }, [props?.clientes])

  const handlePagination = (page) => {
    setCurrentPage(page.selected)
  }
    
  const executeFilterData = (value) => {
    if (value.length) {
      let updatedData = []
      updatedData = state.data.filter((item) => {

        const startsWith =
        item.RazaoSocial?.toUpperCase().includes(value.toUpperCase()) ||
        item.NomeFantasia?.toUpperCase().includes(value.toUpperCase()) ||
        item?.Nome?.toUpperCase().includes(value.toUpperCase())  ||
        item?.Cnpj?.toUpperCase().includes(value.toUpperCase())  ||
        item?.Cpf?.toUpperCase().includes(value.toUpperCase()) ||
        item?.Ie?.toUpperCase().includes(value.toUpperCase())  ||
        item?.Rg?.toUpperCase().includes(value.toUpperCase())  ||
        item?.Cidade?.toUpperCase().includes(value.toUpperCase())  ||
        item?.Segmento?.toUpperCase().includes(value.toUpperCase())

        if (startsWith) {
          return startsWith
        } else return null
      })

      return updatedData
    }
  }

  const handleFilter = (e) => {

    setState({...state, [e.target.name]: e?.target?.value})  
  }

  useEffectAfterMount(() => {
      if (props.clienteCreateSuccess === true) {

          toast.success(
              <ToastContent
                messageTitle="Cliente"
                messageBody="Novos dados do cliente inseridos!"
                color="success"
              />,
              { transition: Slide, autoClose: 10000 }
          )
          
          props.updateFlag({createSuccess: false})
          props.buscarClientesporVendedor(user)
      }
  }, [props.clienteCreateSuccess])

  useEffectAfterMount(() => {
    if (props.clienteUpdateSuccess === true) {

        toast.success(
            <ToastContent
              messageTitle="Cliente"
              messageBody="Dados do cliente alterados!"
              color="success"
            />,
            { transition: Slide, autoClose: 10000 }
        )
        
        props.updateFlag({updateSuccess: false})
        props.buscarClientesporVendedor(user)
    }
}, [props.clienteUpdateSuccess])

  const dataToRender = () => {
    if (state.searchTextValue?.length) {

      return executeFilterData(state.searchTextValue)
    }
    return state?.data
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

  const sendEmail = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Essa ação irá enviar um e-mail para cada contato de todos os clientes selecionados anteriormente. Deseja prosseguir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1"
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true
    })
      .then((ok) => {
        if (ok.value) {
          setModalEmail(false)
          props.enviarEmails({ data })
        }
      })
  }

  useEffectAfterMount(() => {
    toast.success(
        <ToastContent
          messageTitle="Cliente"
          messageBody="E-mails enviado com sucesso!"
          color="success"
        />,
        { transition: Slide, autoClose: 10000 }
    )
}, [props.sendEmail])

useEffectAfterMount(() => {
  toast.success(
      <ToastContent
        messageTitle="Cliente"
        messageBody="Falha ao enviar e-mails!"
        color="error"
      />,
      { transition: Slide, autoClose: 10000 }
  )
}, [props.sendEmailError])

  return (
        <Card>
          <CardHeader>
              <div><h3 className="font-weight-bolder">Procurar</h3></div>
          </CardHeader>
          <CardBody>
              <ModalCliente data={data} modal={modal} setModal={setModal} setLoadingSkeleton={setLoadingSkeleton} vendedores={props.vendedores} user={user} funcionarios={props.funcionarios} />
              <ModalEnviarEmail data={selectedData} modal={modalEmail} setModal={setModalEmail} send={sendEmail} />
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
                  <Col md="4" style={{textAlign: 'right'}}>
                    <Button color="secondary"
                        disabled={!selectedData.length || user.role.name !== 'Gerencial'}
                        onClick={() => {
                            setModalEmail(true)
                        }}
                        className="text-size-button"
                    >
                        Disparar E-mail
                    </Button>  
                  </Col>
                  <Col md="2" style={{textAlign: 'right'}}>
                    <Button color="primary"
                        disabled={user.role.name === 'Seguranca Trabalho'}
                        onClick={() => {
                            setData({ id: 0, Vendedor: user.role.name.includes('Comercial') ? user : null})
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
          {
            !loadingSkeleton
            && <DataTable
                noHeader
                pagination
                columns={[
                  {
                    name: "AÇÕES",
                    maxWidth: "50px",
                    cell: (row) => <FiEdit2 style={{margin: '5px'}} size={20} onClick={() => {
                        setData(row)
                        setModal(true)
                    } 
                    }/>
                  },
                  {
                    name: "ID",
                    selector: "id",
                    sortable: true,
                    maxWidth: "50px",
                    cell: (row) => <span>{row?.id || "-"}</span>
                  },
                  {
                    name: "CÓDIGO",
                    selector: "ClienteCodigo",
                    sortable: true,
                    maxWidth: "50px",
                    cell: (row) => <span>{row?.ClienteCodigo || "-"}</span>
                  },
                  {
                    name: "RAZÃO SOCIAL",
                    selector: "RazaoSocial",
                    sortable: true,
                    minWidth: "50px",
                    cell: (row) => <span>{row?.RazaoSocial || '-'}</span>
                  },
                  {
                    name: "NOME FANTASIA",
                    selector: "NomeFantasia",
                    sortable: true,
                    minWidth: "50px",
                    cell: (row) => <span>{row?.NomeFantasia || '-'}</span>
                  },
                  {
                    name: "CNPJ/CPF",
                    selector: "Cnpj",
                    sortable: true,
                    minWidth: "50px",
                    cell: (row) => <span>{ (row?.TipoPessoa === TipoPessoa.PessoaJuridica ? row?.Cnpj : row?.Cpf) || '-'}</span>
                  },
                  {
                    name: "IE/RG",
                    selector: "Ie",
                    sortable: true,
                    minWidth: "50px",
                    cell: (row) => <span>{ (row?.Ie !== '' || !row?.Ie ? row?.Ie : row?.Rg) || '-'}</span>
                  },
                  {
                    name: "SEGMENTO PRINCIPAL",
                    selector: "Ie",
                    sortable: true,
                    minWidth: "50px",
                    cell: (row) => <span>{row?.Segmento || '-'}</span>
                  },
                  {
                    name: "LOCALIZAÇÃO",
                    selector: "Cidade",
                    sortable: true,
                    minWidth: "50px",
                    cell: (row) => <span>{row?.Cidade || "-"}</span>
                  },
                  {
                    name: "VENDEDOR",
                    selector: "Vendedor",
                    sortable: true,
                    minWidth: "50px",
                    cell: (row) => <span>{row?.Vendedor?.username || "-"}</span>
                  }
                ]}
                paginationPerPage={10}
                noDataComponent="Ainda não existem"
                className="react-dataTable"
                sortIcon={<ChevronDown size={10} />}
                paginationDefaultPage={currentPage + 1}
                paginationComponent={CustomPagination}
                data={dataToRender()}
                selectableRows={user.role.name === 'Gerencial'}
                onSelectedRowsChange={e => {
                  setSelectedData(e.selectedRows)
                }}
            />
          }
        </Card>
    )
}

const mapStateToProps = (state) => {
  return {
    clientes: state?.cliente?.listaClientesVendedor,
    clienteUpdateSuccess: state?.cliente?.updateSuccess,
    complementoClienteUpdateError: state?.cliente?.updateError,
    clienteCreateSuccess: state?.cliente?.createSuccess,
    clienteCreateError: state?.cliente?.createError,
    sendEmail: state?.cliente?.sendEmail,
    sendEmailError: state?.cliente?.sendEmailError,
    vendedores: state?.usuario?.vendedores,
    funcionarios: state?.funcionario?.lista
  }
}

export default connect(mapStateToProps, {
  buscarVendedores,
  buscarFuncionariosAtivos,
  buscarClientesporVendedor,
  updateFlag,
  enviarEmails
})(Clientes)

