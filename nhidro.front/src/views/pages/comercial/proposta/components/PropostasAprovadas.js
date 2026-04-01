import React, { useState, useEffect } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { buscarPropostas } from "@src/redux/actions/comercial/proposta/buscarPropostasActions"
import { cadastrarProposta } from "@src/redux/actions/comercial/proposta/cadastrarPropostaActions"
import { alterarStatusProposta } from "@src/redux/actions/comercial/proposta/alterarStatusPropostaActions"
import { Card, CardBody } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { formatNumberReal } from '../../../../../utility/number/index'
import { Enum_StatusPropostas } from '../../../../../utility/enum/Enums'
import auth from "@src/services/auth"
import moment from "moment"
import { FiCopy, FiEye, FiMinusCircle, FiPlusCircle, FiXCircle } from 'react-icons/fi'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import ModalCadastroProposta from '../modals/ModalCadastroProposta'
moment.locale("pt-br")
const user = auth.getUserInfo()
const MySwal = withReactContent(Swal)

const PropostasAprovadas = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'Código' },
      { name: 'Revisão' },
      { name: 'Cliente' },
      { name: 'Vendedor' },
      { name: 'Data de Geração' },
      { name: 'Validade' },
      { name: 'Valor' },
      { name: 'Data de Aprovação' }
    ],
    quantityItensOnRow: 10
  } 
  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [state, setState] = useState({})
  const [data, setData] = useState({})
  const [modal, setModal] = useState(false)
    
  useEffect(() => {
    if (selectedTipo === 'Aprovadas') {
      props.buscarPropostas(Enum_StatusPropostas.Aprovada, user)
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    setState({...state, data: props?.propostas})
    setFilteredData(props?.propostas)
    setLoadingSkeleton(false)
  }, [props?.propostas])

  useEffectAfterMount(() => {
    handleToastSuccess()
    props.buscarPropostas(Enum_StatusPropostas.Aprovada, user)
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    handleToastError()
    props.buscarPropostas(Enum_StatusPropostas.Aprovada, user)
  }, [props?.error])

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Proposta"
        messageBody="Proposta salva!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Proposta"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleClose = () => {
    setData({})
    setModal(false)
  }

  const save = (data) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja gerar a proposta?",
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
          handleClose()
          setLoadingSkeleton(true)
          if (!data.id) {
            data.CriadoPor = user
            data.DataCriacao = new Date()
            props.cadastrarProposta({ data })
          }
          MySwal.fire({
            title: 'Aguarde...',
            text: 'Estamos gerando o arquivo PDF da Proposta, para que você possa visualizar. Caso ao finalizar o processo ainda não visualize o arquivo, tente atualizar a página ou entre em contato com o suporte!',
            icon: "info"
          })
        }
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
              setLoadingSkeleton(true)
              data.MotivoCancelamento = value.toUpperCase()
              data.DataCancelamento = new Date()
              data.Status = Enum_StatusPropostas.Cancelado
              props.alterarStatusProposta({data})
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

  const inativar = (data) => {
    MySwal.fire({
      title: "Aviso",
      icon: "warning",
      text: `Tem certeza que deseja ${data.Inativa ? 'reativar' : 'inativar'} ?`,
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
        setLoadingSkeleton(true)
        data.Inativa = data.Inativa ? false : true;
        props.alterarStatusProposta({data})
      }
    })
  }

  const visualizarPDF = (data) => {
    window.open(data.UrlArquivo, '_blank')
  }

  return (
    <Card>
      <CardBody>
      </CardBody>
      {
        loadingSkeleton
        && <SkeletonDataTable configDataTableSkeleton={configDataTableSkeleton} />
      }
      <ModalCadastroProposta data={data} modal={modal} handleClose={handleClose} save={save} clientes={props.clientes} vendedores={props.vendedores} empresas={props.empresas} equipamentos={props.equipamentos} acessorios={props.acessorios} responsabilidades={props.responsabilidades} cargos={props.cargos} configuracoes={props.configuracoes} user={user} />
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
                width: 160,
                Cell: (row) => {
                  return (<div>
                    <FiXCircle title='Cancelar' style={{margin: '5px'}} size={20} onClick={() => {
                      cancelar(row.original)
                    }}/>
                    {row.original.Inativa ? <FiPlusCircle title='Reativar' style={{margin: '5px'}} size={20} onClick={() => {
                      inativar(row.original)
                    }}/> : <FiMinusCircle title='Inativar' style={{margin: '5px'}} size={20} onClick={() => {
                      inativar(row.original)
                    }}/>}
                    <FiCopy title='Copiar' style={{margin: '5px'}} size={20} onClick={() => {
                      const copy = JSON.parse(JSON.stringify(row.original));
                      delete copy.id;
                      copy.Revisao = 0;
                      copy.Usuario = user;
                      copy.DataProposta = null;
                      copy.Enviada = null;
                      copy.Codigo = null;
                      copy.DataStatus = null;
                      copy.AlteradoPor = null;
                      copy.DataAlteracao = null;
                      copy.UrlArquivo = null;
                      copy.NomeArquivo = null;
                      copy.PropostaEquipamentos.map(x => x.id = 0);
                      copy.PropostaEquipes.map(x => x.id = 0);
                      copy.PropostaResponsabilidades.map(x => x.id = 0);
                      copy.Acessorios.map(x => x.id = 0);
                      
                      setData(copy)
                      setModal(true)
                    }}/>
                    {row.original.UrlArquivo && <FiEye title='Visualizar PDF' style={{margin: '5px'}} size={20} onClick={() => {
                      visualizarPDF(row.original)
                    }}/>}
                  </div>)
                }
              },
              {
                Header: "CÓDIGO",
                accessor: "Codigo",
                filterAll: true,
                width: 120,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Codigo"] })
              },
              {
                Header: "REVISÃO",
                id: 'Revisao',
                accessor: "Revisao",
                filterable: false,
                width: 120,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Revisao"] }),
                Cell: (row) => {
                  return (
                    <span>{row?.original?.Revisao > 0 ? row?.original?.Revisao : "Não Revisado".toUpperCase()}</span>
                  )
                }
              },
              {
                Header: "CLIENTE",
                id: "Cliente",
                accessor: (value) => value.Cliente.RazaoSocial || '-',
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
              },
              {
                Header: "VENDEDOR",
                id: "Usuario",
                accessor: (value) => value.Usuario?.username,
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Usuario"] })
              },
              {
                Header: "DATA DE GERAÇÃO",
                id: "DataProposta",
                accessor: (value) => value.DataProposta === '-' || moment(value.DataProposta).local().format("DD/MM/YYYY"),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataProposta"] })
              },
              {
                Header: "VALIDADE",
                id: "DataValidade",
                accessor: (value) => value.DataValidade === '-' || moment(value.DataValidade).local().format("DD/MM/YYYY"),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataValidade"] })
              },
              {
                Header: "VALOR",
                id: "Valor",
                accessor: (value) => formatNumberReal(value?.Valor) || '-',
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Valor"] })
              },
              {
                Header: "DATA DE APROVAÇÃO",
                id: "DataStatus",
                accessor: (value) => value.DataStatus === '-' || moment(value.DataStatus).local().format("DD/MM/YYYY"),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataStatus"] })
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
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    propostas: state?.proposta?.propostas
  }
}

export default connect(mapStateToProps, {
  buscarPropostas,
  cadastrarProposta,
  alterarStatusProposta
})(PropostasAprovadas)