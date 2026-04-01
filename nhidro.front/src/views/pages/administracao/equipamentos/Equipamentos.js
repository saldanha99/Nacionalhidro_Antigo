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
import { buscarEquipamentos } from "@src/redux/actions/administrador/equipamento/buscarEquipamentosActions"
import { cadastrarEquipamento } from "@src/redux/actions/administrador/equipamento/cadastrarEquipamentoActions"
import { alterarEquipamento } from "@src/redux/actions/administrador/equipamento/alterarEquipamentoActions"
import { buscarAcessoriosAtivos } from "@src/redux/actions/administrador/acessorio/buscarAcessorioActions"
import { buscarResponsabilidadesAtivas } from "@src/redux/actions/administrador/responsabilidade/buscarResponsabilidadeActions"
import { buscarVeiculos } from "@src/redux/actions/administrador/veiculo/buscarVeiculoActions"
import { upload } from "@src/redux/actions/files/uploadActions"
import { buscarNatureza } from "@src/redux/actions/administrador/natureza-contabil/buscarNaturezaActions"
import { ChevronDown, ChevronLeft, ChevronRight } from "react-feather"
import { FiEdit2 } from 'react-icons/fi'
import ModalEquipamento from './ModalEquipamento'
import { ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"

const Equipamentos = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'EQUIPAMENTO' },
      { name: 'DESCRIÇÃO' },
      { name: 'ATIVO' }
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
  const [responsabilidadesPadrao, setResponsabilidadesPadrao] = useState([])
  const [responsabilidadesAtivos, setResponsabilidadesAtivos] = useState([])
  const [acessoriosPadrao, setAcessoriosPadrao] = useState([])
  const [acessoriosOptions, setAcessoriosOptions] = useState([])

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
          item?.Equipamento?.toUpperCase().includes(value.toUpperCase()) ||
          item?.Descricao?.toUpperCase().includes(value.toUpperCase())

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
        messageTitle="Equipamento"
        messageBody="Dados salvos!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Equipamento"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  useEffect(() => {
    props.buscarEquipamentos()
    props.buscarResponsabilidadesAtivas()
    props.buscarAcessoriosAtivos()
    props.buscarVeiculos()
    props.buscarNatureza()
    setLoadingSkeleton(true)
  }, [])

  useEffectAfterMount(() => {
    setInitial(false)
    setState({ ...state, data: props?.equipamentos })
    setLoadingSkeleton(false)
  }, [props?.equipamentos])

  useEffectAfterMount(() => {
    if (props?.responsabilidadesAtivos) {
      const responsabilidadesPadrao = [], responsabilidadesAtivos = []
      props?.responsabilidadesAtivos.forEach(item => {
        if (item.Padrao) responsabilidadesPadrao.push(item) 
        
        responsabilidadesAtivos.push({ label: item.Responsabilidade, value: item })
      })

      setResponsabilidadesPadrao(responsabilidadesPadrao)
      setResponsabilidadesAtivos(responsabilidadesAtivos)
    }
  }, [props?.responsabilidadesAtivos])

  useEffectAfterMount(() => {
    if (props?.lista) {
      const acessoriosPadrao = [], acessoriosOptions = []
      props.lista.forEach(acessorio => {
        if (acessorio.Padrao) acessoriosPadrao.push(acessorio) 
        
        acessoriosOptions.push({ label: acessorio.Nome, value: acessorio })
      })

      setAcessoriosPadrao(acessoriosPadrao)
      setAcessoriosOptions(acessoriosOptions)
    }
  }, [props?.lista])

  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastSuccess()
      setInitial(true)
      props.buscarEquipamentos()
    }
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      props.buscarEquipamentos()
    }
  }, [props?.error])

  useEffect(() => {
    if (props?.fileId) {
      data.UrlImagem = props.fileId
      if (data.id === 0) props.cadastrarEquipamento(data)
      else props.alterarEquipamento(data)
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
      <ModalEquipamento
        data={data}
        modal={modal}
        handleClose={handleClose}
        aprove={(data, image, filename, type) => {
          if (data && image) {
            setData(data)
            props.upload(image, filename, type)
            setLoadingSkeleton(true)
          } else if (data) {
            setLoadingSkeleton(true)
            if (data.id === 0) props.cadastrarEquipamento(data)
            else props.alterarEquipamento(data)
          }
        }}
        responsabilidadesPadrao={responsabilidadesPadrao}
        responsabilidadesAtivos={responsabilidadesAtivos}
        acessoriosPadrao={acessoriosPadrao}
        acessoriosOptions={acessoriosOptions}
        veiculos={props.veiculos}
        naturezas={props.naturezas}
        setData={setData}
      />
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
              name: "EQUIPAMENTO",
              selector: "Equipamento",
              sortable: true,
              cell: (row) => <span>{row?.Equipamento || '-'}</span>
            },
            {
              name: "ATIVO",
              selector: "Ativo",
              sortable: true,
              width: "20rem",
              cell: (row) => <span>{row?.Ativo ? 'Sim' : 'Não'}</span>
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
    equipamentos: state?.equipamento?.equipamentos,
    isFinishedAction: state?.equipamento?.isFinishedAction,
    error: state?.equipamento?.error,
    fileId: state?.file?.fileId,
    responsabilidadesAtivos: state?.responsabilidade?.lista,
    lista: state?.acessorio?.lista,
    veiculos: state?.veiculo?.lista,
    naturezas: state?.natureza?.lista
  }
}

export default connect(mapStateToProps, {
  buscarEquipamentos,
  cadastrarEquipamento,
  alterarEquipamento,
  upload,
  buscarAcessoriosAtivos,
  buscarResponsabilidadesAtivas,
  buscarVeiculos,
  buscarNatureza
})(Equipamentos)