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
import { buscarEmpresas, buscarDocumentosPorEmpresa } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import { cadastrarEmpresa } from "@src/redux/actions/administrador/empresa/cadastrarEmpresaActions"
import { alterarEmpresa } from "@src/redux/actions/administrador/empresa/alterarEmpresaActions"
import { criarEmpresaDocumento, deletarEmpresaDocumento } from '@src/redux/actions/administrador/empresa-documento'
import { upload } from "@src/redux/actions/files/uploadActions"
import { download } from "@src/redux/actions/files/downloadActions"
import { ChevronDown, ChevronLeft, ChevronRight } from "react-feather"
import { FiEdit2, FiFile} from 'react-icons/fi'
import ModalEmpresa from './ModalEmpresa'
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import swal from 'sweetalert'
import { BrazilFormatComponent } from 'react-brazil'
import ModalEmpresaDocumentos from './ModalEmpresaDocumentos'
import auth from "@src/services/auth"

const user = auth.getUserInfo()

const Empresas = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'DESCRIÇÃO' },
      { name: 'CNPJ' },
      { name: 'ENDEREÇO' },
      { name: 'TELEFONE' },
      { name: 'INSCRIÇÃO ESTADUAL' },
      { name: 'DADOS DEPÓSITO' },
      { name: 'REGIME TRIBUTÁRIO' },
      { name: 'LOGRADOURO' },
      { name: 'NÚMERO' },
      { name: 'BAIRRO' },
      { name: 'MUNICÍPIO' },
      { name: 'UF' },
      { name: 'CEP' },
      { name: 'NATUREZA OPERAÇÃO' },
      { name: 'FOCUS TOKEN' }
    ],
    quantityItensOnRow: 10

  }
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState({})
  const [modal, setModal] = useState(false)
  const [modalArquivos, setModalArquivos] = useState(false)
  const [initial, setInitial] = useState(true)
  const [state, setState] = useState({
      searchTextValue: null
  })
  const [empresa, setEmpresa] = useState(null)

  const handleClose = () => {
    setModal(false)
  }

  const handleCloseArquivo = () => {
    setModalArquivos(false)
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
        const startsWith =
          item?.Descricao?.toUpperCase().includes(value.toUpperCase())  ||
          item?.CNPJ?.toUpperCase().includes(value.toUpperCase())  ||
          item?.DadosDeposito?.toUpperCase().includes(value.toUpperCase())  ||
          item?.InscricaoEstadual?.toUpperCase().includes(value.toUpperCase()) ||
          item?.Endereco?.toUpperCase().includes(value.toUpperCase())  ||
          item?.RegimeTributario?.toString()?.toUpperCase().includes(value.toUpperCase()) ||
          item?.Logradouro?.toUpperCase().includes(value.toUpperCase()) ||
          item?.Numero?.toString()?.toUpperCase().includes(value.toUpperCase()) ||
          item?.Bairro?.toUpperCase().includes(value.toUpperCase()) ||
          item?.Municipio?.toUpperCase().includes(value.toUpperCase()) ||
          item?.UF?.toUpperCase().includes(value.toUpperCase()) ||
          item?.CEP?.toUpperCase().includes(value.toUpperCase()) ||
          item?.FocusToken?.toUpperCase().includes(value.toUpperCase()) ||
          item?.Telefone?.toUpperCase().includes(value.toUpperCase()) 

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
        messageTitle="Empresa"
        messageBody="Dados salvos!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Empresa"
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
        if (data.id === 0) props.cadastrarEmpresa(data)
        else props.alterarEmpresa(data)
      } else swal("Processo cancelado!")
    })
  }

  const buscarDocumentos = (id) => {
    props.buscarDocumentosPorEmpresa(id)
    setLoadingSkeleton(true)
  }

  useEffect(() => {
    props.buscarEmpresas()
    setLoadingSkeleton(true)
    setModalArquivos(false);
    setEmpresa(null);
  }, [])

  useEffectAfterMount(() => {
    setInitial(false)
    setState({...state, data: props?.empresas})
    setLoadingSkeleton(false)
    setEmpresa(null);
  }, [props?.empresas])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastSuccess()
      setInitial(true)
      props.buscarEmpresas()
    }
  }, [props?.isFinishedAction])
  
  useEffectAfterMount(() => {
    if (initial === false) {
      handleToastError()
      setInitial(true)
      props.buscarEmpresas()
    }
  }, [props?.error])

  useEffectAfterMount(() => {
    var empresaModel = empresa;
    empresaModel.EmpresaDocumentos = props.documentos;
    setEmpresa(empresaModel);
    setLoadingSkeleton(false);
    setModalArquivos(true);
  }, [props?.documentos])

  useEffectAfterMount(() => {
    toast.success(
        <ToastContent
          messageTitle="Documentos"
          messageBody="Arquivo salvo com sucesso"
          color="success"
        />,
        { transition: Slide, autoClose: 10000 }
    )
    buscarDocumentos()
  }, [props?.saveDocSuccess])

  useEffectAfterMount(() => {
    toast.success(
        <ToastContent
          messageTitle="Documentos"
          messageBody="Arquivo deletado com sucesso"
          color="success"
        />,
        { transition: Slide, autoClose: 10000 }
    )
    buscarDocumentos()
  }, [props?.deleteDocSuccess])

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
                            setData({ id: 0})
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
          <ModalEmpresa data={data} modal={modal} handleClose={handleClose} save={save} />
          <ModalEmpresaDocumentos modal={modalArquivos} handleClose={handleCloseArquivo} empresa={empresa} loading={loadingSkeleton} upload={props.upload} download={props.download} file={props.file} fileId={props.fileId} cadastrarEmpresaDocumento={props.criarEmpresaDocumento} deletarEmpresaDocumento={props.deletarEmpresaDocumento} user={user} />
          {
            !loadingSkeleton
            && <DataTable
                noHeader
                pagination
                columns={[
                  {
                    name: "EDITAR",
                    maxWidth: "50px",
                    cell: (row) => <div>
                      <FiEdit2 style={{margin: '5px'}} size={20} onClick={() => {
                          setData(row)
                          setModal(true)
                      } 
                      }/>
                      {user.role.name === 'Gerencial' && <FiFile
                      title="Arquivos"
                      style={{ margin: "5px" }}
                      size={20}
                      onClick={() => {
                        setLoadingSkeleton(true)
                        setEmpresa(row);
                        buscarDocumentos(row.id)
                      }}
                    />}
                    </div>
                  },
                  {
                    name: "DESCRIÇÃO",
                    selector: "Descricao",
                    sortable: true,
                    width: "20rem",
                    cell: (row) => <span>{row?.Descricao || "-"}</span>
                  },
                  {
                    name: "CNPJ",
                    selector: "CNPJ",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{<BrazilFormatComponent value={row?.CNPJ} format='cnpj'/> || '-'}</span>
                  },
                  {
                    name: "ENDERECO",
                    selector: "Endereco",
                    sortable: true,
                    width: "20rem",
                    cell: (row) => <span>{row?.Endereco || "-"}</span>
                  },
                  {
                    name: "TELEFONE",
                    selector: "Telefone",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.Telefone || "-"}</span>
                  },
                  {
                    name: "INSCRIÇÃO ESTADUAL",
                    selector: "InscricaoEstadual",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.InscricaoEstadual || '-'}</span>
                  },
                  {
                    name: "DADOS DEPÓSITO",
                    selector: "DadosDeposito",
                    sortable: true,
                    width: "25rem",
                    cell: (row) => <span>{row?.DadosDeposito || '-'}</span>
                  },
                  {
                    name: "REGIME TRIBUTÁRIO",
                    selector: "RegimeTributario",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.RegimeTributario || "-"}</span>
                  },
                  {
                    name: "COMPLEMENTO",
                    selector: "Logradouro",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.Logradouro }</span>
                  },
                  {
                    name: "NÚMERO",
                    selector: "Numero",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.Numero }</span>
                  },
                  {
                    name: "BAIRRO",
                    selector: "Bairro",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.Bairro }</span>
                  },
                  {
                    name: "MUNICÍPIO",
                    selector: "Municipio",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.Municipio }</span>
                  },
                  {
                    name: "UF",
                    selector: "UF",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.UF }</span>
                  },
                  {
                    name: "CEP",
                    selector: "CEP",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.CEP }</span>
                  },
                  {
                    name: "NATUREZA OPERAÇÃO",
                    selector: "NaturezaOperacao",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.NaturezaOperacao }</span>
                  },
                  {
                    name: "FOCUS TOKEN",
                    selector: "FocusToken",
                    sortable: true,
                    width: "15rem",
                    cell: (row) => <span>{row?.FocusToken }</span>
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
    empresas: state?.empresa?.empresas,
    documentos: state?.empresa?.documentos,
    saveDocSuccess: state.empresa.createDocSuccess,
    deleteDocSuccess: state.empresa.deleteDocSuccess,
    isFinishedAction: state?.empresa?.isFinishedAction,
    error: state?.empresa?.error,
    fileId: state.file.fileId,
    file: state.file.file
  }
}

export default connect(mapStateToProps, {
  buscarEmpresas,
  cadastrarEmpresa,
  alterarEmpresa,
  buscarDocumentosPorEmpresa,
  criarEmpresaDocumento,
  deletarEmpresaDocumento,
  upload, download
})(Empresas)