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
import { buscarUsuarios, buscarPermissoes } from "@src/redux/actions/administrador/usuario/buscarUsuariosActions"
import { cadastrarUsuario } from "@src/redux/actions/administrador/usuario/cadastrarUsuarioActions"
import { alterarUsuario } from "@src/redux/actions/administrador/usuario/alterarUsuarioActions"
import { upload } from "@src/redux/actions/files/uploadActions"
import { ChevronDown, ChevronLeft, ChevronRight } from "react-feather"
import { FiEdit2 } from 'react-icons/fi'
import ModalUsuario from './ModalUsuario'
import { ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"

const Usuario = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'ID' },
      { name: 'NOME' },
      { name: 'E-MAIL' },
      { name: 'PERMISSÃO' }
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
    setState({ ...state, [e.target.name]: e?.target?.value })
  }

  const executeFilterData = (value) => {
    if (value.length) {
      let updatedData = []
      updatedData = state.data.filter((item) => {

        const startsWith =
          item?.username?.toUpperCase().includes(value.toUpperCase()) ||
          item?.email?.toUpperCase().includes(value.toUpperCase()) ||
          item?.id?.toString().toUpperCase().includes(value.toUpperCase())

        if (startsWith) {
          return startsWith
        } else return null
      })

      return updatedData
    }
  }

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

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Usuario"
        messageBody="Dados salvos!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Usuario"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  useEffect(() => {
    props.buscarPermissoes()
    props.buscarUsuarios()
    setLoadingSkeleton(true)
  }, [])

  useEffectAfterMount(() => {
    setInitial(false)
    setState({ ...state, data: props?.lista })
    setLoadingSkeleton(false)
  }, [props?.lista])

  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastSuccess()
      setTimeout(function() {
        setInitial(true)
        props.buscarUsuarios()
      }, 3000)
    }
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      props.buscarUsuarios()
    }
  }, [props?.error])

  useEffect(() => {
    if (props?.fileId) {
      data.urlSignature = props.fileId
      if (data.id === 0) {
        data.password = Math.random().toString(36).slice(-8)
        props.cadastrarUsuario(data)
      } else props.alterarUsuario(data)
    }
  }, [props?.fileId])

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
          <Col md="6" style={{ textAlign: 'right' }}>
            <Button color="primary"
              onClick={() => {
                setData({ id: 0, confirmed: true })
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
      {props.roles && <ModalUsuario data={data} modal={modal} handleClose={handleClose} roles={props.roles}
                                    aprove={(data, image, filename, type) => {
                                      if (data && image) {
                                        setData(data)
                                        const reader = new FileReader()
                                        reader.onload = function() {
                                          const arrayBuffer = this.result
                                          props.upload(arrayBuffer, filename, type)
                                          setLoadingSkeleton(true)
                                        }
                                        reader.readAsArrayBuffer(image)
                                      } else if (data) {
                                        setLoadingSkeleton(true)
                                        if (data.id === 0) {
                                          data.password = Math.random().toString(36).slice(-8)
                                          props.cadastrarUsuario(data)
                                        } else props.alterarUsuario(data)
                                      }
                                    }} />
      }
      {
        !loadingSkeleton
        && <DataTable
          noHeader
          pagination
          columns={[
            {
              name: "EDITAR",
              maxWidth: "50px",
              cell: (row) => <FiEdit2 style={{ margin: '5px' }} size={20} onClick={() => {
                setData(row)
                setModal(true)
              }
              } />
            },
            {
              name: "ID",
              selector: "id",
              sortable: true,
              cell: (row) => <span>{row?.id || "-"}</span>
            },
            {
              name: "NOME",
              selector: "name",
              sortable: true,
              cell: (row) => <span>{row?.username?.toUpperCase() || "-"}</span>
            },
            {
              name: "E-MAIL",
              selector: "email",
              sortable: true,
              cell: (row) => <span>{row?.email?.toUpperCase() || "-"}</span>
            },
            {
              name: "PERMISSÃO",
              selector: "role.name",
              sortable: true,
              cell: (row) => <span>{row?.role?.name?.toUpperCase() || "-"}</span>
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
    lista: state?.usuario?.lista,
    roles: state?.usuario?.roles,
    fileId: state?.file?.fileId,
    isFinishedAction: state?.usuario?.isFinishedAction,
    error: state?.usuario?.error
  }
}

export default connect(mapStateToProps, {
  buscarUsuarios,
  buscarPermissoes,
  cadastrarUsuario,
  alterarUsuario,
  upload
})(Usuario)