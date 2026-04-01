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
import { buscarCargos } from "@src/redux/actions/administrador/cargo/buscarCargosActions"
import { cadastrarCargo } from "@src/redux/actions/administrador/cargo/cadastrarCargoActions"
import { alterarCargo } from "@src/redux/actions/administrador/cargo/alterarCargoActions"
import { ChevronDown, ChevronLeft, ChevronRight } from "react-feather"
import { FiEdit2 } from 'react-icons/fi'
import ModalCargo from './ModalCargo'
import { ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import swal from 'sweetalert'

const Cargo = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'ID' },
      { name: 'DESCRIÇÃO' },
      { name: 'ÚNICO POR EQUIPAMENTO' }
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
          item?.Descricao?.toUpperCase().includes(value.toUpperCase())
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
        messageTitle="Cargo"
        messageBody="Dados salvos!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Acessório"
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
          if (data.id === 0) props.cadastrarCargo({ data })
          else props.alterarCargo({ data })
        } else swal("Processo cancelado!")
      })
  }

  useEffect(() => {
    props.buscarCargos()
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
      setInitial(true)
      props.buscarCargos()
    }
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      props.buscarCargos()
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
          <Col md="6" style={{ textAlign: 'right' }}>
            <Button color="primary"
              onClick={() => {
                setData({ id: 0 })
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
      <ModalCargo data={data} modal={modal} handleClose={handleClose} save={save} />
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
              name: "DESCRIÇÃO",
              selector: "Descricao",
              sortable: true,
              cell: (row) => <span>{row?.Descricao || "-"}</span>
            },
            {
              name: "ÚNICO POR EQUIP.",
              selector: "UnicoEquipamento",
              sortable: true,
              cell: (row) => <span>{row?.UnicoEquipamento ? 'Sim' : 'Não' || "-"}</span>
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
    lista: state?.cargo?.lista,
    isFinishedAction: state?.cargo?.isFinishedAction,
    error: state?.cargo?.error
  }
}

export default connect(mapStateToProps, {
  buscarCargos,
  cadastrarCargo,
  alterarCargo
})(Cargo)