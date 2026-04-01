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
import { buscarFuncionarios } from "@src/redux/actions/administrador/funcionario/buscarFuncionarioActions"
import { cadastrarFuncionario } from "@src/redux/actions/administrador/funcionario/cadastrarFuncionarioActions"
import { alterarFuncionario } from "@src/redux/actions/administrador/funcionario/alterarFuncionarioActions"
import { buscarCargos } from "@src/redux/actions/administrador/cargo/buscarCargosActions"
import { sendEmail } from '@src/redux/actions/files/emailActions'
import { ChevronDown, ChevronLeft, ChevronRight } from "react-feather"
import { FiEdit2 } from 'react-icons/fi'
import ModalFuncionario from './ModalFuncionario'
import { ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import auth from "@src/services/auth"
import { List_MotivosAfastamento } from '../../../../utility/enum/Enums'
import api from "@src/services/api"
const MySwal = withReactContent(Swal)
const user = auth.getUserInfo()

const Funcionarios = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'ID' },
      { name: 'NOME' },
      { name: 'CARGO' },
      { name: 'AFASTAMENTO' }
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
        item?.Nome?.toUpperCase().includes(value.toUpperCase()) ||
        item?.Cargo?.Descricao?.toUpperCase().includes(value.toUpperCase()) ||
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
        messageTitle="Funcionário"
        messageBody="Dados salvos!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Funcionário"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
  
      reader.onload = () => {
        resolve(reader.result)
      }
  
      reader.onerror = reject
  
      reader.readAsArrayBuffer(file)
    })
  }

  const saveDocs = async (funcionario) => {
    for (const doc of funcionario.DocumentosPessoais) {
      if (doc.Filename !== doc.FilenameOld) {
        if (doc.id) {
          api.delete(`/api/documentos/${doc.id}`, function (status, data) {})
          delete doc.id
        }
        const arrayBuffer = await readFileAsync(doc.File)
        const buffer = Buffer.from(arrayBuffer)
  
        const model = {
          buffer,
          filename: doc.Filename,
          type: doc.Type
        }
        const file = await api.post('/api/configuracoes/upload', model, function (status, data) {
          return data
        })
        doc.UrlArquivo = file.url
        doc.TipoArquivo = doc.Extension
        const documento = await api.post('/api/documentos', {data: doc}, function (status, data) {
          return data
        })
        doc.id = documento.data.id
      }
    }
    for (const doc of funcionario.DocumentosIntegracoes) {
      if (doc.Filename !== doc.FilenameOld) {
        if (doc.id) {
          api.delete(`/api/documentos/${doc.id}`, function (status, data) {})
          delete doc.id
        }
        const arrayBuffer = await readFileAsync(doc.File)
        const buffer = Buffer.from(arrayBuffer)
  
        const model = {
          buffer,
          filename: doc.Filename,
          type: doc.Type
        }
        const file = await api.post('/api/configuracoes/upload', model, function (status, data) {
          return data
        })
        doc.UrlArquivo = file.url
        doc.TipoArquivo = doc.Type
        const documento = await api.post('/api/documentos', {data: doc}, function (status, data) {
          return data
        })
        doc.id = documento.data.id
      }
    }
    for (const doc of funcionario.DocumentosSeguranca) {
      if (doc.Filename !== doc.FilenameOld) {
        if (doc.id) {
          api.delete(`/api/documentos/${doc.id}`, function (status, data) {})
          delete doc.id
        }
        const arrayBuffer = await readFileAsync(doc.File)
        const buffer = Buffer.from(arrayBuffer)
  
        const model = {
          buffer,
          filename: doc.Filename,
          type: doc.Type
        }
        const file = await api.post('/api/configuracoes/upload', model, function (status, data) {
          return data
        })
        doc.UrlArquivo = file.url
        doc.TipoArquivo = doc.Type
        const documento = await api.post('/api/documentos', {data: doc}, function (status, data) {
          return data
        })
        doc.id = documento.data.id
      }
    }
  }

  const save = (data, afastamento) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja salvar os dados?",
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
      .then(async (ok) => {
        if (ok.value) {
          if (data.MotivoAfastamento !== afastamento.MotivoAfastamento || data.InicioAfastamento !== afastamento.InicioAfastamento || data.FimAfastamento !== afastamento.FimAfastamento) {
            MySwal.fire({
              title: "Aviso",
              text: "Você está fazendo alterações no afastamento do funcionário, isso irá gerar Escalas para controle. Prosseguir?",
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
            }).then(async (ok) => {
              if (ok.value) {
                setLoadingSkeleton(true)
                handleClose()
                await saveDocs(data)
                data.GerarEscala = true
                if (data.id === 0) {
                  data.DataCriacao = new Date()
                  data.CriadoPor = user
                  props.cadastrarFuncionario({ data })
                } else {
                  data.DataAlteracao = new Date()
                  data.AlteradoPor = user
                  props.alterarFuncionario({ data })
                }
              }
            })
          } else {
            setLoadingSkeleton(true)
            handleClose()
            await saveDocs(data)
            if (data.id === 0) {
              data.DataCriacao = new Date()
              data.CriadoPor = user
              props.cadastrarFuncionario({ data })
            } else {
              data.DataAlteracao = new Date()
              data.AlteradoPor = user
              props.alterarFuncionario({ data })
            }
          }
        }
      })
  }
  
  const sendFiles = (funcionario, files, copy) => {
    props.sendEmail({
      title: `Documentos Funcionário ${funcionario.Nome}`,
      files,
      copy
    })
  }

  useEffect(() => {
    props.buscarCargos()
    props.buscarFuncionarios()
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
      props.buscarFuncionarios()
    }
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      props.buscarFuncionarios()
    }
  }, [props?.error])

  useEffectAfterMount(() => {
    if (initial === false) {
      MySwal.fire('Arquivos enviados!')
    }
  }, [props?.send])

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
      <ModalFuncionario data={data} modal={modal} cargos={props.cargos} handleClose={handleClose} save={save} sendFiles={sendFiles} />
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
              selector: "Nome",
              sortable: true,
              cell: (row) => <span>{row?.Nome || "-"}</span>
            },
            {
              name: "CARGO",
              selector: "Cargo",
              sortable: true,
              cell: (row) => <span>{row?.Cargo?.Descricao || "-"}</span>
            },
            {
              name: "AFASTAMENTO",
              selector: "MotivoAfastamento",
              sortable: true,
              cell: (row) => <span>{List_MotivosAfastamento.find(x => x.value === row.MotivoAfastamento)?.label?.toUpperCase()}</span>
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
    lista: state?.funcionario?.lista,
    isFinishedAction: state?.funcionario?.isFinishedAction,
    send: state?.file?.send,
    error: state?.funcionario?.error,
    cargos: state?.cargo?.lista
  }
}

export default connect(mapStateToProps, {
  buscarFuncionarios,
  cadastrarFuncionario,
  alterarFuncionario,
  buscarCargos,
  sendEmail
})(Funcionarios)