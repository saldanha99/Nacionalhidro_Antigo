import React, { useState, useEffect } from "react"
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Input,
  Row,
  Col,
  CustomInput,
  ButtonGroup,
  Card
} from "reactstrap"
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { Enum_TipoFaturamento, List_TipoFaturamento, List_DiasSemana } from "@src/utility/enum/Enums"
import '@styles/base/pages/modal.scss'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import Select from "react-select"
import { connect } from "react-redux"
import { criarCliente } from "@src/redux/actions/administrador/cliente/criarClienteActions"
import { atualizarCliente } from "@src/redux/actions/administrador/cliente/atualizarClienteActions"
import { clienteExistente, clienteExistenteRazao, buscarDocumentosPorCliente } from "@src/redux/actions/administrador/cliente/listaClientesActions"
import { buscarEmpresas } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import { buscarPropostasPorCliente } from "@src/redux/actions/comercial/proposta/buscarPropostasActions"
import { buscarOrdensPorCliente } from "@src/redux/actions/logistica/ordem-servico/buscarOrdensActions"
import { buscarHistoricoContatoPorCliente, cadastrarHistoricoContato, alterarHistoricoContato } from "../../../../redux/actions/comercial/historico-contato/buscarHistoricoActions"
import { buscarMedicoesPorCliente } from "../../../../redux/actions/financeiro/medicao"
import { buscarFaturamentosPorCliente } from "../../../../redux/actions/financeiro/faturamento"
import { buscarContasReceberPorCliente } from "../../../../redux/actions/financeiro/contas-a-receber"
import { criarClienteDocumento, deletarClienteDocumento } from "../../../../redux/actions/administrador/cliente-documento"
import { upload } from "@src/redux/actions/files/uploadActions"
import { download } from "@src/redux/actions/files/downloadActions"
import { BrazilMaskComponent } from 'react-brazil'
import InputMask from "react-input-mask"
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import { formatNumberReal } from '../../../../utility/number/index'
import { exportToExcel, validaCpfCnpj } from '../../../../utility/Utils'
import moment from "moment"
moment.locale("pt-br")
import { Enum_StatusContasAReceber, Enum_StatusFaturamento, Enum_StatusMedicao, Enum_StatusOrdens, Enum_StatusPropostas, List_Segmentos } from "../../../../utility/enum/Enums"
import { FiEye } from "react-icons/fi"
import SkeletonDataTable from "../../components/SkeletonDataTable"
import Alert from "reactstrap/lib/Alert"
import HistoricoContato from "./abas/HistoricoContato"
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import AbaMedicoes from "./abas/AbaMedicoes"
import AbaFaturamentos from "./abas/AbaFaturamentos"
import AbaContasReceber from "./abas/AbaContasReceber"
import { cidades } from "../../../../utility/cidades_ibge"
import AbaDocumentos from "./abas/AbaDocumentos"

// const Cryptr = require('cryptr')

const ModalCliente = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'ARQUIVO' },
      { name: 'STATUS' },
      { name: 'CÓDIGO' },
      { name: 'REVISÃO' },
      { name: 'CLIENTE' },
      { name: 'VENDEDOR' },
      { name: 'Data de Geração' },
      { name: 'Validade' },
      { name: 'Valor (R$)' },
      { name: 'DATA STATUS' },
      { name: 'MOTIVO DE REPROVAÇÃO' },
      { name: 'DATA DE CANCELAMENTO' },
      { name: 'MOTIVO DE CANCELAMENTO' }
    ],
    quantityItensOnRow: 20
  } 
  const configDataTableSkeletonOS = {
    nameRows: [
      { name: 'ARQUIVO' },
      { name: 'STATUS' },
      { name: 'CÓDIGO' },
      { name: 'CLIENTE' },
      { name: 'CONTATO' },
      { name: 'EQUIPAMENTO' },
      { name: 'SERVIÇO' },
      { name: 'DATA' },
      { name: 'HORA' },
      { name: 'OBSERVAÇÕES' },
      { name: 'CRIADO POR' },
      { name: 'DATA DE CRIAÇÃO' },
      { name: 'DATA DE CANCELAMENTO' },
      { name: 'MOTIVO DE CANCELAMENTO' }
    ],
    quantityItensOnRow: 20
  } 

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3))
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3))

  const TipoPessoa = {
    PessoaFisica: 1,
    PessoaJuridica: 2
  }

  const { modal, setModal, data, setLoadingSkeleton, vendedores, user, funcionarios } = props

  const [modelCliente, setModelCliente] = useState({
    Contatos: []
  })
  const [toggleContatos, setToggleContatos] = useState(false)
  const [toggleFuncionarios, setToggleFuncionarios] = useState(false)
  const [tipoFaturamentoLista, setTipoFaturamentoLista] = useState([])
  const [empresaLista, setEmpresaLista] = useState([])
  const [aba, setAba] = useState(1)
  const [loading, setLoading] = useState(true)
  const [intervaloDataProposta, setIntervaloDataProposta] = useState([mesPassado, mesQuevem])
  const [intervaloDataOS, setIntervaloDataOS] = useState([mesPassado, mesQuevem])
  const [filteredReactTable, setFilteredReactTable] = useState([])
  const [filteredOSReactTable, setFilteredOSReactTable] = useState([])
  const [filteredMedicaoReactTable, setFilteredMedicaoReactTable] = useState([])
  const [filteredFaturamentoReactTable, setFilteredFaturamentoReactTable] = useState([])
  const [filteredContasReceberReactTable, setFilteredContasReceberReactTable] = useState([])
  const [state, setState] = useState({
    filteredData: [],
    filteredDataOrdens: [],
    filteredDataMedicoes: [],
    filteredDataFaturamentos: [],
    filteredDataContasReceber: []
  })
  const columns = [
    {
      Header: "ARQUIVO",
      id: "UrlArquivo",
      accessor: 'Arquivo',
      filterable: false,
      width: 160,
      Cell: (row) => {
        return (<div>
          {row.original.UrlArquivo && <FiEye title='Visualizar PDF' style={{margin: '5px'}} size={20} onClick={() => {
                window.open(row.original.UrlArquivo)
          }}/>}
        </div>)
      }
    },
    {
      Header: "STATUS",
      id: "Status",
      accessor: "Status",
      filterAll: true,
      width: 120,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Status"] })
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
      getProps: (state, rowInfo, column) => {
          return {
              style: {
                  background: rowInfo && rowInfo?.row?.Status !== "REVISADA" ? 'lightgreen' : null
              }
          }
      },
      filterAll: true,
      width: 120,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Revisao"] })
    },
    {
      Header: "CLIENTE",
      id: "Cliente",
      accessor: "Cliente",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
    },
    {
      Header: "VENDEDOR",
      id: "Vendedor",
      accessor: "Vendedor",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Vendedor"] })
    },
    {
      Header: "DATA DE GERAÇÃO",
      id: "DataProposta",
      accessor: "DataProposta",
      width: 120,
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataProposta"] })
    },
    {
      Header: "VALIDADE",
      id: "DataValidade",
      accessor: "DataValidade",
      width: 120,
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataValidade"] })
    },
    {
      Header: "VALOR (R$)",
      id: "Valor",
      accessor: "Valor",
      width: 120,
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Valor"] })
    },
    {
      Header: "DATA STATUS",
      id: "DataStatus",
      accessor: "DataStatus",
      width: 120,
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataStatus"] })
    },
    {
      Header: "MOTIVO DE REPROVAÇÃO",
      id: "MotivoReprovacao",
      accessor: "MotivoReprovacao",
      width: 120,
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["MotivoReprovacao"] })
    },
    {
      Header: "DATA DE CANCELAMENTO",
      id: "DataCancelamento",
      accessor: "DataCancelamento",
      width: 120,
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataCancelamento"] })
    },
    {
      Header: "MOTIVO DE CANCELAMENTO",
      id: "MotivoCancelamento",
      accessor: "MotivoCancelamento",
      width: 120,
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["MotivoCancelamento"] })
    }
  ]
  const columnsOS = [
    {
      Header: "ARQUIVO",
      id: "UrlArquivo",
      accessor: 'Arquivo',
      filterable: false,
      Cell: (row) => {
        return (<div>
          {row.original.UrlArquivo && <FiEye title='Visualizar PDF' style={{margin: '5px'}} size={20} onClick={() => {
                window.open(row.original.UrlArquivo)
          }}/>}
        </div>)
      }
    },
    {
      Header: "STATUS",
      id: "Status",
      accessor: "Status",
      filterAll: true,
      width: 120,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Status"] })
    },
    {
      Header: "CÓDIGO",
      accessor: "Codigo",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Codigo"] })
    },
    {
      Header: "CLIENTE",
      id: "Cliente",
      accessor: "Cliente",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
    },
    {
      Header: "CONTATO",
      id: "Contato",
      accessor: "Contato",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Contato"] })
    },
    {
      Header: "EQUIPAMENTO",
      id: "Equipamento",
      accessor: "Equipamento",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Equipamento"] })
    },
    {
      Header: "SERVIÇO",
      id: "Discriminacao",
      accessor: "Discriminacao",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Discriminacao"] })
    },
    {
      Header: "DATA",
      id: "DataInicial",
      accessor: "DataInicial",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataInicial"] })
    },
    {
      Header: "HORA",
      id: "HoraInicial",
      accessor: "HoraInicial",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["HoraInicial"] })
    },
    {
      Header: "OBSERVAÇÕES",
      id: "Observacoes",
      accessor: "Observacoes",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
    },
    {
      Header: "CRIADO POR",
      id: "CriadoPor",
      accessor: "CriadoPor",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["CriadoPor"] })
    },
    {
      Header: "DATA DE CRIAÇÃO",
      id: "DataCriacao",
      accessor: "DataCriacao",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataCriacao"] })
    },
    {
      Header: "DATA DE CANCELAMENTO",
      id: "DataCancelamento",
      accessor: "DataCancelamento",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataCancelamento"] })
    },
    {
      Header: "MOTIVO DE CANCELAMENTO",
      id: "MotivoCancelamento",
      accessor: "MotivoCancelamento",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["MotivoCancelamento"] })
    }
  ]
  const [cnpj, setCnpj] = useState("")
  const [cnpjIsValid, setCnpjIsValid] = useState(true)
  const [cnpjExiste, setCnpjExiste] = useState(props.clienteExiste)
  const [razaoSocial, setRazaoSocial] = useState("")
  const [razaoIsValid, setRazaoIsValid] = useState(props.clienteExisteRazao)

  const buscarPropostas = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarPropostasPorCliente(modelCliente.id, user, dataInicial, dataFinal)
      setLoading(true)
    }
  }

  const buscarOrdens = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarOrdensPorCliente(modelCliente.id, dataInicial, dataFinal)
      setLoading(true)
    }
  }

  const buscarMedicoes = () => {
    props.buscarMedicoesPorCliente(modelCliente.id)
    setLoading(true)
  }

  const buscarFaturamentos = () => {
    props.buscarFaturamentosPorCliente(modelCliente.id)
    setLoading(true)
  }

  const buscarContasReceber = () => {
    props.buscarContasReceberPorCliente(modelCliente.id)
    setLoading(true)
  }

  const buscarHistorico = () => {
    props.buscarHistoricoContatoPorCliente(modelCliente.id)
    setLoading(true)
  }

  const buscarDocumentos = () => {
    props.buscarDocumentosPorCliente(modelCliente.id)
    setLoading(true)
  }
  
  const groupObjByColumns = (lista, cols) => {
    const arr = lista.map(x => {
      const obj = {}
      cols.forEach(c => {
        if (!c.notExport) c?.id?.length ? obj[c.Header] = x[c.id] : obj[c.Header] = x[c.accessor]
      })
      return obj
    })

    return arr
  }

  const handleExportToExcel = (lista, nome, cols) => {
    exportToExcel(groupObjByColumns(lista, cols), `${nome}_${moment(new Date()).utc().format("YYYYMMDDhmmss")}`)
  }

  const limparPesquisaProposta = () => {
    setFilteredReactTable([])
    setState({ ...state, filteredData: state.propostas })
  }

  const limparPesquisaOS = () => {
    setFilteredOSReactTable([])
    setState({ ...state, filteredDataOrdens: state.ordens })
  }

  const limparPesquisaMedicao = () => {
    setFilteredMedicaoReactTable([])
    setState({ ...state, filteredDataMedicoes: state.medicoes })
  }

  const limparPesquisaFaturamento = () => {
    setFilteredFaturamentoReactTable([])
    setState({ ...state, filteredDataFaturamentos: state.faturamentos })
  }

  const limparPesquisaContasReceber = () => {
    setFilteredContasReceberReactTable([])
    setState({ ...state, filteredDataContasReceber: state.contasReceber })
  }

  const handleModelCliente = (value, field) => {
    setModelCliente({ ...modelCliente, [field]: value })
  }

  const handleChangeContatos = (e, index) => {
    modelCliente.Contatos[index][e.target.name] = e.target.value.toUpperCase()
    setModelCliente({ ...modelCliente, Contatos: modelCliente?.Contatos })
  }

  const handlerFiltroDataProposta = (dateValue) => {
    setIntervaloDataProposta(dateValue)
  }

  const handlerFiltroDataOS = (dateValue) => {
    setIntervaloDataOS(dateValue)
  }

  useEffectAfterMount(() => {
    setEmpresaLista(props.empresas)
  }, [props.empresas])

  useEffect(() => {
    if (data) {
      if (!data.Contatos) {
        data.Contatos = []
        data.Contatos.push({ id: 0 })
        data.TipoPessoa = TipoPessoa.PessoaJuridica
      }
      if (!data.Integracoes) {
        data.Integracoes = []
      }
      if (!data.CodigoMunicipio) data.Cidade = ''
      data.PorcentagemRL = data.PorcentagemRL * 100
      setRazaoIsValid([])
      setCnpj(data.Cnpj)
      setRazaoSocial(data.RazaoSocial)
      setModelCliente(data)
    }
  }, [data])

  useEffectAfterMount(() => {
    if (modal === true && props.data) {
      const data = props.data
      // data.SenhaPortal = ""
      setModelCliente(data)
      setAba(user.role.name === "Seguranca Trabalho" ? 8 : 1)
      if (user.role.name === "Seguranca Trabalho") buscarDocumentos()
      if (!empresaLista || empresaLista.length === 0) props.buscarEmpresas()
    }
  }, [modal])

  useEffect(() => {
    if ((filteredReactTable?.length === 0 || state?.filteredData?.length === 0) && !intervaloDataProposta) {
      setState({ ...state, filteredData: state.propostas })
    }
  }, [state.filteredData])

  useEffectAfterMount(() => {
    buscarPropostas(intervaloDataProposta)
  }, [intervaloDataProposta])

  if (tipoFaturamentoLista?.length === 0) {
    setTipoFaturamentoLista(List_TipoFaturamento)
  }

  const getContatos = (index) => {
    return (
      <>
        <Col md="2" className="mt-1">
          <FormGroup>
            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Nome">Nome</Label>
            <Input style={!modelCliente.Contatos[index].Nome ? { borderColor: '#cc5050' } : {}}
              type="text"
              name="Nome"
              placeholder="Nome"
              value={modelCliente?.Contatos[index].Nome}
              onChange={(e) => handleChangeContatos(e, index)}
            />
          </FormGroup>
        </Col>
        <Col md="2" className="mt-1">
          <FormGroup>
            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Setor">Setor</Label>
            <Input
              type="text"
              name="Setor"
              placeholder="Setor"
              value={modelCliente?.Contatos[index].Setor}
              onChange={(e) => handleChangeContatos(e, index)}
            />
          </FormGroup>
        </Col>
        <Col md="2" className="mt-1">
          <FormGroup>
            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Email">E-mail</Label>
            <Input style={!modelCliente.Contatos[index].Email ? { borderColor: '#cc5050' } : {}}
              type="text"
              name="Email"
              placeholder="Email"
              value={modelCliente?.Contatos[index].Email}
              onChange={(e) => handleChangeContatos(e, index)}
            />
          </FormGroup>
        </Col>
        <Col md="2" className="mt-1">
          <FormGroup>
            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Telefone">Telefone</Label>
            <InputMask
              className="form-control"
              type="tel"
              mask="(99) 9999-9999"
              name="Telefone"
              placeholder="Telefone"
              value={modelCliente?.Contatos[index].Telefone}
              onChange={(e) => handleChangeContatos(e, index)}
            />
          </FormGroup>
        </Col>
        <Col md="2" className="mt-1">
          <FormGroup>
            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Celular">Celular</Label>
            <InputMask
              className="form-control"
              type="tel"
              mask="(99) 99999-9999"
              name="Celular"
              placeholder="Celular"
              value={modelCliente?.Contatos[index].Celular}
              onChange={(e) => handleChangeContatos(e, index)}
            />
          </FormGroup>
        </Col>
        <Col md="1" className="mt-1">
          <FormGroup>
            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Ramal">Ramal</Label>
            <Input
              type="text"
              name="Ramal"
              placeholder="Ramal"
              value={modelCliente?.Contatos[index].Ramal}
              onChange={(e) => handleChangeContatos(e, index)}
            />
          </FormGroup>
        </Col>
        {modelCliente?.Contatos?.length > 1 && <Col md="1" className="mt-3">
          <a href='#' style={{ color: '#b10000' }} onClick={() => {
            modelCliente?.Contatos.splice(index, 1)
            setModelCliente({ ...modelCliente, Contatos: modelCliente.Contatos })
          }}>
            x
          </a>
        </Col>}
      </>
    )
  }

  const getFuncionarios = (index) => {
    return (
      <>
        <Col md="4" className="mt-1">
            <FormGroup>
                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Funcionário</Label>
                <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: modelCliente.Integracoes[index].Funcionario?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                    }}
                    name="Cargo"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={funcionarios}
                    isSearchable
                    getOptionLabel={(option) => option?.Nome}
                    getOptionValue={(option) => option}
                    value={
                        funcionarios?.filter((option) => option.id === modelCliente.Integracoes[index].Funcionario?.id)
                    }
                    onChange={(object) => {
                      modelCliente.Integracoes[index].Funcionario = object
                      setModelCliente({ ...modelCliente, Integracoes: modelCliente?.Integracoes })
                    }}
                />
            </FormGroup>
        </Col>
        <Col md="2" className="mt-1">
            <FormGroup>
                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cargo</Label>
                <Input
                    type="text"
                    value={modelCliente.Integracoes[index].Funcionario?.Cargo?.Descricao}
                    id="Cargo"
                    name="Cargo"
                    placeholder="Cargo"
                    disabled
                />
            </FormGroup>
        </Col>
        <Col md="2" className="mt-1">
            <FormGroup>
                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Validade Integração</Label>
                <Input style={!modelCliente.Integracoes[index].ValidadeIntegracao ? { borderColor: '#cc5050' } : {}}
                    type="date"
                    value={modelCliente.Integracoes[index].ValidadeIntegracao}
                    id="ValidadeIntegracao"
                    name="ValidadeIntegracao"
                    placeholder="Validade Integração"
                    onChange={(e) => {
                      modelCliente.Integracoes[index].ValidadeIntegracao = e.target.value
                      setModelCliente({ ...modelCliente, Integracoes: modelCliente?.Integracoes })
                    }}
                />
            </FormGroup>
        </Col>
        <Col md="2" className="mt-1">
            <FormGroup>
                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Validade ASO</Label>
                <Input
                    type="date"
                    value={modelCliente.Integracoes[index].ValidadeAso}
                    id="ValidadeAso"
                    name="ValidadeAso"
                    placeholder="Validade ASO"
                    onChange={(e) => {
                      modelCliente.Integracoes[index].ValidadeAso = e.target.value
                      setModelCliente({ ...modelCliente, Integracoes: modelCliente?.Integracoes })
                    }}
                />
            </FormGroup>
        </Col>
        <Col md="1" className="mt-3">
          <a href='#' style={{ color: '#b10000' }} onClick={() => {
            modelCliente?.Integracoes.splice(index, 1)
            setModelCliente({ ...modelCliente, Integracoes: modelCliente.Integracoes })
          }}>
            x
          </a>
        </Col>
      </>
    )
  }

  const handleToggleContatos = () => {
    setToggleContatos(!toggleContatos)
  }

  const handleToggleFuncionarios = () => {
    setToggleFuncionarios(!toggleFuncionarios)
  }

  const isHidden = (toggle) => {
    if (toggle === true) {
      return true
    }

    return false
  }

  const ehTipoFaturamentoQuinzenal = () => {
    if (modelCliente.TipoFaturamento !== Enum_TipoFaturamento.Quinzenal) {
      return false
    }

    return true
  }

  const ehTipoFaturamentoMensal = () => {
    if (modelCliente.TipoFaturamento !== Enum_TipoFaturamento.Mensal) {
      return false
    }

    return true
  }

  const ehTipoFaturamentoSemanal = () => {
    if (modelCliente.TipoFaturamento !== Enum_TipoFaturamento.Semanal) {
      return false
    }

    return true
  }

  const onSubmitForm = () => {
    setModal(false)
    setLoadingSkeleton(true)
    const data = modelCliente
    // let encryptedStringPassword = ""

    // if (modelCliente.SenhaPortal !== "") {
    //   const cryptr = new Cryptr('myTotalySecretKey')
    //   encryptedStringPassword = cryptr.encrypt(modelCliente.SenhaPortal)
    // }

    data.DiaBaseMensal = ehTipoFaturamentoMensal() ? modelCliente.DiaBaseMensal : null
    data.DiaBaseQuinzenalInicio = ehTipoFaturamentoQuinzenal() ? modelCliente.DiaBaseQuinzenalInicio : null
    data.DiaBaseQuinzenalFinal = ehTipoFaturamentoQuinzenal() ? modelCliente.DiaBaseQuinzenalFinal : null
    data.DiaBaseSemanal = ehTipoFaturamentoSemanal() ? modelCliente.DiaBaseSemanal : null
    data.PorcentagemRL = modelCliente.PorcentagemRL / 100
    if (modelCliente?.id) {
      data.id = modelCliente.id
      // data.SenhaPortal = encryptedStringPassword
      props.atualizarCliente(data)
      return
    }

    props.criarCliente(data)
  }

  const isInvalidForm = () => {
    if (!modelCliente.RazaoSocial || (modelCliente.TipoPessoa === TipoPessoa.PessoaFisica && !modelCliente.Cpf) || (modelCliente.TipoPessoa === TipoPessoa.PessoaJuridica && !modelCliente.Cnpj) || !cnpjIsValid || cnpjExiste || (modelCliente.Contatos.length === 1 && (!modelCliente.Contatos[0]?.Nome?.length || !modelCliente.Contatos[0]?.Email?.length))) {
      return true
    }

    return false
  }

  const handleChangeSelect = (object, field) => {
    setModelCliente({ ...modelCliente, [field]: object.value })
  }

  const validarCliente = (doc, isCnpj) => {
    if (doc) {
      if (!validaCpfCnpj(doc)) {
        setCnpjExiste(false)
        return setCnpjIsValid(false)
      } else setCnpjIsValid(true)
      props.clienteExistente(doc, isCnpj)
    } else {
      setCnpjExiste(false)
      setCnpjIsValid(true)
    }
  }

  const validarClienteRazao = (value) => {
    if (value) props.clienteExistenteRazao(value)
  }

  useEffectAfterMount(() => {
    setLoading(false)
    const propostas = props.propostas?.map(x => {
      return {
        Codigo: x.Codigo,
        Revisao: x.Revisao,
        Status: x.Status === Enum_StatusPropostas.Aberta ? 'EM ABERTO' : x.Status === Enum_StatusPropostas.Aprovada ? "APROVADA" : x.Status === Enum_StatusPropostas.Reprovada ? "REPROVADA" : x.Status === Enum_StatusPropostas.Revisada ? "REVISADA" : "CANCELADA",
        DataProposta: x.DataProposta ? moment(x.DataProposta).local().format("DD/MM/YYYY") : '',
        DataValidade: x.DataValidade ? moment(x.DataValidade).local().format("DD/MM/YYYY") : '',
        Valor: formatNumberReal(x.Valor),
        Vendedor: x.Usuario?.username?.toUpperCase(),
        Cliente: x.Cliente.RazaoSocial?.toUpperCase(),
        DataStatus: x.DataStatus ? moment(x.DataStatus).local().format("DD/MM/YYYY") : '',
        DataCancelamento: x.DataCancelamento ? moment(x.DataCancelamento).local().format("DD/MM/YYYY") : '',
        MotivoReprovacao: x.MotivoReprovacao?.toUpperCase(),
        MotivoCancelamento: x.MotivoCancelamento?.toUpperCase(),
        UrlArquivo: x.UrlArquivo
      }
    })
    setState({ ...state, propostas, filteredData: propostas })
  }, [props?.propostas])
  
  useEffectAfterMount(() => {
    setCnpjExiste(props.clienteExiste)
  }, [props.clienteExiste])
  
  useEffectAfterMount(() => {
    setRazaoIsValid(props.clienteExisteRazao)
  }, [props.clienteExisteRazao])

  useEffectAfterMount(() => {
    setLoading(false)
    const ordens = props.ordens?.map(x => {
      return {
        Proposta: `${x.Proposta?.Codigo}/${x.Proposta?.Revisao}`,
        Codigo: `${x.Codigo}/${x.Numero}`,
        Status: x.Status === Enum_StatusOrdens.Aberta ? 'EM ABERTO' : x.Status === Enum_StatusOrdens.Executada ? "EXECUTADA" : "CANCELADA",
        DataInicial: x.DataInicial ? moment(x.DataInicial).local().format("DD/MM/YYYY") : '',
        HoraInicial: x.HoraInicial?.substring(0, 5),
        Cliente: x.Cliente?.RazaoSocial?.toUpperCase(),
        Contato: x.Contato?.Nome?.toUpperCase(),
        Equipamento: x.OrdemEquipamento?.Equipamento?.Equipamento?.toUpperCase(),
        Discriminacao: x.OrdemEquipamento?.Discriminacao?.toUpperCase(),
        Observacoes: x.Observacoes?.toUpperCase(),
        CriadoPor: x.CriadoPor?.username?.toUpperCase(),
        DataCriacao: x.DataCriacao ? moment(x.DataCriacao).local().format("DD/MM/YYYY") : '',
        DataCancelamento: x.DataCancelamento ? moment(x.DataCancelamento).local().format("DD/MM/YYYY") : '',
        MotivoCancelamento: x.MotivoCancelamento?.toUpperCase(),
        UrlArquivo: x.UrlArquivo
      }
    })
    setState({ ...state, ordens, filteredDataOrdens: ordens })
  }, [props?.ordens])

  useEffectAfterMount(() => {
    setLoading(false)
    const medicoes = props.medicoes?.map(x => {
      return {
        Medicao: `${x.codigo}/${x.revisao}`,
        Status: x.status === Enum_StatusMedicao.EmAberto ? 'EM ABERTO' : x.status === Enum_StatusMedicao.Aprovada ? "APROVADA" : x.status === Enum_StatusMedicao.AprovadaParcialmente ? "APROVADA PARC." : 
        x.status === Enum_StatusMedicao.Cancelado ? "CANCELADA" : x.status === Enum_StatusMedicao.Conferencia ? "EM CONFERÊNCIA" : x.status === Enum_StatusMedicao.EmAprovacao ? "EM APROVAÇÃO" : 
        x.status === Enum_StatusMedicao.Validada ? "APROVADA INT." : "REPROVADA",
        Cliente: x.cliente?.toUpperCase(),
        Contato: x.contato?.toUpperCase(),
        Empresa: x.empresa?.toUpperCase(),
        ValorTotal: x.valor_total,
        AprovacaoInterna: x.data_aprovacao_interna ? moment(x.data_aprovacao_interna).local().format("DD/MM/YYYY") : '',
        CobrancaEnviada: x.data_cobranca ? moment(x.data_cobranca).local().format("DD/MM/YYYY") : '',
        DataCancelamento: x.data_cancelamento ? moment(x.data_cancelamento).local().format("DD/MM/YYYY") : '',
        MotivoCancelamento: x.motivo_cancelamento?.toUpperCase()
      }
    })
    setState({ ...state, medicoes, filteredDataMedicoes: medicoes })
  }, [props?.medicoes])

  useEffectAfterMount(() => {
    setLoading(false)
    const faturamentos = props.faturamentos?.map(x => {
      return {
        Medicao: `${x.medicao}/${x.medicao_revisao}`,
        Status: x.status === Enum_StatusFaturamento.EmAberto ? 'EM ABERTO' : x.status === Enum_StatusFaturamento.Enviado ? "ENVIADO" : x.status === Enum_StatusFaturamento.Emitido ? "EMITIDO" : "CANCELADO",
        Contato: x.contato?.toUpperCase(),
        Empresa: x.empresa?.toUpperCase(),
        Nota: x.nota,
        TipoFatura: x.tipo_fatura,
        ValorTotal: x.valor_total,
        ValorRateado: x.valor_rateado,
        DataAprovacao: x.data_aprovacao ? moment(x.data_aprovacao).local().format("DD/MM/YYYY") : '',
        DataEmissao: x.data_emissao ? moment(x.data_emissao).local().format("DD/MM/YYYY") : '',
        CobrancaEnviada: x.data_cobranca ? moment(x.data_cobranca).local().format("DD/MM/YYYY") : '',
        DataCancelamento: x.data_cancelamento ? moment(x.data_cancelamento).local().format("DD/MM/YYYY") : '',
        MotivoCancelamento: x.motivo_cancelamento?.toUpperCase()
      }
    })
    setState({ ...state, faturamentos, filteredDataFaturamentos: faturamentos })
  }, [props?.faturamentos])

  useEffectAfterMount(() => {
    setLoading(false)
    const contasReceber = props.contasReceber?.map(x => {
      return {
        Id: x.id,
        Status: x.status === Enum_StatusContasAReceber.EmAberto ? 'EM ABERTO' : x.status === Enum_StatusContasAReceber.Pendente ? "AGUARDANDO RECEBIMENTO" : x.status === Enum_StatusContasAReceber.EmCorrecao ? "EM CORREÇÃO" : x.status === Enum_StatusContasAReceber.Recebido ? "RECEBIDO" : x.status === Enum_StatusContasAReceber.RecebidoParcial ? "RECEBIDO PARCIAL" : "CANCELADO",
        Cliente: x.cliente?.toUpperCase(),
        Empresa: x.empresa?.toUpperCase(),
        Nota: x.nota,
        TipoFatura: x.tipo_fatura,
        DataEmissao: x.data_emissao ? moment(x.data_emissao).local().format("DD/MM/YYYY") : '',
        ValorTotal: x.valor_total,
        DataEntrada: x.data_envio ? moment(x.data_envio).local().format("DD/MM/YYYY") : '',
        DataCancelamento: x.data_cancelamento ? moment(x.data_cancelamento).local().format("DD/MM/YYYY") : '',
        MotivoCancelamento: x.motivo_cancelamento?.toUpperCase(),
        TipoInsercao: x.insercao_manual,
        Usuario: x.usuario
      }
    })
    setState({ ...state, contasReceber, filteredDataContasReceber: contasReceber })
  }, [props?.contasReceber])

  useEffectAfterMount(() => {
    toast.success(
        <ToastContent
          messageTitle="Histórico Contato"
          messageBody="Dados salvos com sucesso"
          color="success"
        />,
        { transition: Slide, autoClose: 10000 }
    )
    buscarHistorico()
  }, [props?.saveHistoricoSuccess])

  useEffectAfterMount(() => {
    setLoading(false)
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
    <div>
      <span>
        <Modal
          isOpen={modal}
          size="xl"
          toggle={() => setModal(!modal)}
          className="modal-dialog-centered"
          backdrop={false}
        >
          <ModalHeader
            toggle={() => setModal(!modal)}
            style={{ background: '#2F4B7433' }}
            cssModule={{ close: 'close button-close' }}
          >
            <h4 className="mt-1 mb-1"><b>{modelCliente.RazaoSocial} - {modelCliente.Codigo}</b></h4>
          </ModalHeader>
          <ModalBody>
            {!user.role.name.includes('Seguranca Trabalho') && <Row className="mb-2">
                <Col md={12} sm={12}>
                    <ButtonGroup className="mt-2">
                    <Button onClick={() => setAba(1)} color='primary' outline={true} active={aba === 1}>Cadastro</Button>
                    <Button onClick={() => {
                      setLoading(true)
                      buscarPropostas(intervaloDataProposta)
                      setAba(2)
                    }} color='primary' outline={true} active={aba === 2} disabled={!modelCliente.id}>Propostas</Button>
                    <Button onClick={() => {
                      setLoading(true)
                      buscarOrdens(intervaloDataOS)
                      setAba(3)
                    }} color='primary' outline={true} active={aba === 3} disabled={!modelCliente.id}>Ordens Serv.</Button>
                    <Button onClick={() => {
                      setLoading(true)
                      buscarMedicoes()
                      setAba(4)
                    }} color='primary' outline={true} active={aba === 4}>Medições</Button>
                    <Button onClick={() => {
                      setLoading(true)
                      buscarFaturamentos()
                      setAba(5)
                    }} color='primary' outline={true} active={aba === 5}>Faturamentos</Button>
                    <Button onClick={() => {
                      setLoading(true)
                      buscarContasReceber()
                      setAba(6)
                    }} color='primary' outline={true} active={aba === 6}>Contas Receber</Button>
                    <Button onClick={() => {
                      setLoading(true)
                      buscarHistorico()
                      setAba(7)
                    }} color='primary' outline={true} active={aba === 7} disabled={!modelCliente.id}>Histórico de Contatos</Button>
                    <Button onClick={() => {
                      setLoading(true)
                      buscarDocumentos()
                      setAba(8)
                    }} color='primary' outline={true} active={aba === 8} disabled={!modelCliente.id}>Documentos</Button>
                    </ButtonGroup>
                </Col>
            </Row>}
            {aba === 1 && <Card>
              <Row>
                {!modelCliente.id && <Col>
                  <Label for="TipoPessoa" className="mb-1 font-weight-bolder">Tipo de pessoa</Label><br />
                  <FormGroup>
                    <Row>
                      <Col md="3">
                        <input
                          type="radio"
                          id="TipoPessoaFisica"
                          name="TipoPessoa"
                          className="mr-1"
                          inline
                          checked={modelCliente.TipoPessoa === TipoPessoa.PessoaFisica}
                          onChange={e => handleModelCliente(TipoPessoa.PessoaFisica, "TipoPessoa")}
                        />
                        <span style={{ fontWeight: modelCliente.TipoPessoa === TipoPessoa.PessoaFisica ? 'bold' : '', fontSize: '0.85rem' }}>Física</span>
                      </Col>
                      <Col>
                        <input
                          type="radio"
                          id="TipoPessoaJuridica"
                          name="TipoPessoa"
                          inline
                          className="mr-1"
                          label=""
                          checked={modelCliente.TipoPessoa === TipoPessoa.PessoaJuridica}
                          onChange={e => handleModelCliente(TipoPessoa.PessoaJuridica, "TipoPessoa")}
                        />
                        <span style={{ fontWeight: modelCliente.TipoPessoa === TipoPessoa.PessoaJuridica ? 'bold' : '', fontSize: '0.85rem' }}>Jurídica</span>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>}
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="ClienteCodigo">Código Cliente</Label>
                    <Input
                      type="text"
                      id="ClienteCodigo"
                      name="ClienteCodigo"
                      placeholder="ClienteCodigo"
                      value={modelCliente.ClienteCodigo}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value })}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="RazaoSocial">Razão Social</Label>
                    <Input style={!modelCliente.RazaoSocial ? { borderColor: '#cc5050' } : {}}
                      type="text"
                      id="RazaoSocial"
                      name="RazaoSocial"
                      placeholder="Razão Social"
                      value={modelCliente.RazaoSocial}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                      onBlur={e => { 
                          if (e.target.value !== razaoSocial) {
                            const razaoSplit = e.target.value.split(' ')
                            const value = razaoSplit.length ? razaoSplit[0] : e.target.value
                            validarClienteRazao(value)
                          } else setRazaoIsValid(true)
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Nome">Nome Fantasia</Label>
                    <Input
                      type="text"
                      id="Nome"
                      name="NomeFantasia"
                      placeholder="Nome Fantasia"
                      value={modelCliente.NomeFantasia}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  {
                    modelCliente?.TipoPessoa === TipoPessoa.PessoaFisica
                    && <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CPF</Label>
                      <BrazilMaskComponent style={!modelCliente.Cpf ? { borderColor: '#cc5050' } : {}}
                        type="text"
                        id="Cpf"
                        name="Cpf"
                        placeholder="CPF"
                        className="form-control"
                        format="cpf"
                        value={modelCliente.Cpf}
                        disabled={modelCliente.id}
                        onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                        onBlur={e => { 
                            if (e.target.value !== cnpj) validarCliente(e.target.value, false) 
                            else setCnpjIsValid(true)
                        }}
                      />
                      {cnpjExiste && 
                      <Alert color='danger'>
                          <div className='alert-body'>
                          <span className='fw-bold'>Cliente já cadastrado no sistema!</span>
                          </div>
                      </Alert>}
                      {!cnpjIsValid && 
                      <Alert color='danger'>
                          <div className='alert-body'>
                          <span className='fw-bold'>CPF inválido!!</span>
                          </div>
                      </Alert>}
                    </FormGroup>
                  }
                  {
                    modelCliente?.TipoPessoa === TipoPessoa.PessoaJuridica
                    && <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CNPJ</Label>
                      <InputMask style={!modelCliente.Cnpj ? { borderColor: '#cc5050' } : {}}
                        className="form-control"
                        type="text"
                        mask="99.999.999/9999-99"
                        name="Cnpj"
                        placeholder="Cnpj"
                        value={modelCliente?.Cnpj}
                        disabled={modelCliente.id}
                        onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                        onBlur={e => { 
                            if (e.target.value !== cnpj) validarCliente(e.target.value, true) 
                            else setCnpjIsValid(true)
                        }}
                      />
                      {cnpjExiste && 
                      <Alert color='danger'>
                          <div className='alert-body'>
                          <span className='fw-bold'>Cliente já cadastrado no sistema!</span>
                          </div>
                      </Alert>}
                      {!cnpjIsValid && 
                      <Alert color='danger'>
                          <div className='alert-body'>
                          <span className='fw-bold'>CNPJ inválido!</span>
                          </div>
                      </Alert>}
                    </FormGroup>
                  }
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Ie">Inscrição Estadual</Label>
                    <Input
                      type="text"
                      id="Ie"
                      name="Ie"
                      placeholder="Inscrição Estadual"
                      value={modelCliente.Ie}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Ie">Inscrição Municipal</Label>
                    <Input
                      type="text"
                      id="InscricaoMunicipal"
                      name="InscricaoMunicipal"
                      placeholder="Inscrição Municipal"
                      value={modelCliente.InscricaoMunicipal}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  {
                    modelCliente?.TipoPessoa === TipoPessoa.PessoaFisica
                    && <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">RG</Label>
                      <Input
                        type="text"
                        id="Rg"
                        name="Rg"
                        placeholder="RG"
                        value={modelCliente.Rg}
                        onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                      />
                    </FormGroup>
                  }
                </Col>
              </Row>
              {razaoIsValid.length > 0 && <Row>
                <Col md="12">
                  <Alert color='danger'>
                      <div className='alert-body'>
                      <span className='fw-bold'>{`Já existem os seguintes clientes cadastrados com razão social parecidas: ${razaoIsValid?.map(x => `${x.RazaoSocial}; `)}. Favor validar se não está cadastrando com duplicidade!`}</span>
                      </div>
                  </Alert>
                </Col>
              </Row>}
              <Row>
                <Col md="2">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Segmento Principal</Label>
                    <Select
                      placeholder="Selecione..."
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="Segmento"
                      noOptionsMessage={() => 'Sem registro!'}
                      options={List_Segmentos}
                      isSearchable
                      getOptionLabel={(option) => option}
                      getOptionValue={(option) => option}
                      value={
                        List_Segmentos.filter((option) => option === modelCliente.Segmento)
                      }
                      onChange={(object) => setModelCliente({ ...modelCliente, Segmento: object })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Endereço</Label>
                    <Input
                      type="text"
                      id="Endereco"
                      name="Endereco"
                      placeholder="Endereco"
                      value={modelCliente.Endereco}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col md="1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Número</Label>
                    <Input
                      type="text"
                      id="Numero"
                      name="Numero"
                      placeholder="Numero"
                      value={modelCliente.Numero}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value })}
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Complemento">Complemento</Label>
                    <Input
                      type="text"
                      id="Complemento"
                      name="Complemento"
                      placeholder="Complemento"
                      value={modelCliente.Complemento}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Bairro</Label>
                    <Input
                      type="text"
                      id="Bairro"
                      name="Bairro"
                      placeholder="Bairro"
                      value={modelCliente.Bairro}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CEP</Label>
                    <BrazilMaskComponent
                      type="text"
                      id="Cep"
                      name="Cep"
                      placeholder="Cep"
                      className="form-control"
                      format="cep"
                      value={modelCliente.Cep}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col md="1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">UF</Label>
                    <Input
                      type="text"
                      id="EstadoSigla"
                      name="EstadoSigla"
                      placeholder="Estado"
                      maxLength="2"
                      value={modelCliente.EstadoSigla}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cidade</Label>
                    <Select
                      placeholder="Cidade"
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="Cidade"
                      getOptionLabel={(option) => option.Nome?.toUpperCase()}
                      getOptionValue={(option) => option.Nome}
                      noOptionsMessage={() => 'Sem registro!'}
                      options={cidades.filter(x => x.Uf === modelCliente.EstadoSigla)}
                      isSearchable
                      value={
                        cidades.filter((option) => option.Uf === modelCliente.EstadoSigla && option.Nome.toUpperCase() === modelCliente.Cidade?.toUpperCase())
                      }
                      onChange={(option) => {
                        setModelCliente({ ...modelCliente, Cidade: option.Nome?.toUpperCase(), CodigoMunicipio: option.Codigo?.toString() })
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="PontoReferencia">Ponto de referência</Label>
                    <Input
                      type="text"
                      id="PontoReferencia"
                      name="PontoReferencia"
                      placeholder="Ponto de referência"
                      value={modelCliente.PontoReferencia}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Telefone</Label>
                    <Input
                      type="text"
                      id="Telefone"
                      name="Telefone"
                      placeholder="Telefone"
                      value={modelCliente.Telefone}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Celular</Label>
                    <InputMask
                      className="form-control"
                      type="tel"
                      mask="(99) 99999-9999"
                      id="Celular"
                      name="Celular"
                      placeholder="Celular"
                      value={modelCliente.Celular}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Fax</Label>
                    <Input
                      type="text"
                      id="Fax"
                      name="Fax"
                      placeholder="Fax"
                      value={modelCliente.Fax}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">E-mail</Label>
                    <Input
                      type="text"
                      id="Email"
                      name="Email"
                      placeholder="Email"
                      value={modelCliente.Email}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value })}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="3">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Aniversário de Reajuste</Label>
                    <Input
                      type="date"
                      id="AniversarioReajuste"
                      name="AniversarioReajuste"
                      value={modelCliente.AniversarioReajuste}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Tipo de Faturamento</Label>
                    <Select
                      placeholder="Tipo de Faturamento"
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="TipoFaturamento"
                      noOptionsMessage={() => 'Sem registro!'}
                      options={tipoFaturamentoLista}
                      isSearchable
                      getOptionLabel={(option) => option?.label}
                      getOptionValue={(option) => option?.value}
                      value={
                        tipoFaturamentoLista.filter((option) => option.value === modelCliente.TipoFaturamento)
                      }
                      onChange={(object) => handleChangeSelect(object, 'TipoFaturamento')}
                    />
                  </FormGroup>
                </Col>
                {ehTipoFaturamentoMensal()
                  &&
                  <Col md="2">
                    <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="DiaBaseMensal">Dia base do faturamento</Label>
                      <Input
                        type="number"
                        id="DiaBaseMensal"
                        name="DiaBaseMensal"
                        value={modelCliente.DiaBaseMensal}
                        onChange={(e) => {
                          const val = e.target.value
                          const max = 31
                          const min = 1
                          const newVal = (val <= max && val >= min) || !val ? val : modelCliente.DiaBaseMensal
                          setModelCliente({ ...modelCliente, [e.target.name]: newVal })
                        }}
                      />
                    </FormGroup>
                  </Col>}
                {ehTipoFaturamentoQuinzenal()
                  &&
                  <Col md="2">
                    <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="DiaBaseQuinzenalInicio">Dia base inicial do faturamento</Label>
                      <Input
                        type="number"
                        id="DiaBaseQuinzenalInicio"
                        name="DiaBaseQuinzenalInicio"
                        value={modelCliente.DiaBaseQuinzenalInicio}
                        onChange={(e) => {
                          const val = e.target.value
                          const max = 31
                          const min = 1
                          const newVal = (val <= max && val >= min) || !val ? val : modelCliente.DiaBaseQuinzenalInicio
                          setModelCliente({ ...modelCliente, [e.target.name]: newVal })
                        }}
                      />
                    </FormGroup>
                  </Col>}
                {ehTipoFaturamentoQuinzenal()
                  &&
                  <Col md="2">
                    <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="DiaBaseQuinzenalFinal">Dia base final do faturamento</Label>
                      <Input
                        type="number"
                        id="DiaBaseQuinzenalFinal"
                        name="DiaBaseQuinzenalFinal"
                        value={modelCliente.DiaBaseQuinzenalFinal}
                        onChange={(e) => {
                          const val = e.target.value
                          const max = 31
                          const min = 1
                          const newVal = (val <= max && val >= min) || !val ? val : modelCliente.DiaBaseQuinzenalFinal
                          setModelCliente({ ...modelCliente, [e.target.name]: newVal })
                        }}
                      />
                    </FormGroup>
                  </Col>}
                {ehTipoFaturamentoSemanal()
                  &&
                  <Col md="2">
                    <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="DiaBaseSemanal">Dia base do faturamento</Label>
                      <Select
                        placeholder="Dias da semana"
                        className="React"
                        classNamePrefix="select"
                        styles={{
                          menu: provided => ({ ...provided, zIndex: 9999 }),
                          control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                        }}
                        name="DiaBaseSemanal"
                        noOptionsMessage={() => 'Sem registro!'}
                        options={List_DiasSemana}
                        isSearchable
                        getOptionLabel={(option) => option?.label}
                        getOptionValue={(option) => option?.value}
                        value={
                          List_DiasSemana.filter((option) => option.value === modelCliente.DiaBaseSemanal)
                        }
                        onChange={(object) => handleChangeSelect(object, 'DiaBaseSemanal')}
                      />
                    </FormGroup>
                  </Col>}
                <Col md="4">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Vendedor">Vendedor Responsável</Label>
                    <Select
                      placeholder="Vendedores"
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="Vendedor"
                      noOptionsMessage={() => 'Sem registro!'}
                      options={vendedores}
                      isSearchable
                      isDisabled={user.role.name.includes('Comercial')}
                      getOptionLabel={(option) => option?.username}
                      getOptionValue={(option) => option?.id}
                      value={
                        vendedores.filter((option) => option.id === modelCliente?.Vendedor?.id)
                      }
                      onChange={(object) => {
                        setModelCliente({ ...modelCliente, ['Vendedor']: object })
                      }
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Empresa">Empresa Faturamento</Label>
                    <Select
                      placeholder="Empresas"
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="Empresa"
                      noOptionsMessage={() => 'Sem registro!'}
                      options={empresaLista}
                      isSearchable
                      getOptionLabel={(option) => option?.Descricao}
                      getOptionValue={(option) => option?.id}
                      value={
                        empresaLista.filter((option) => option.id === modelCliente?.Empresa?.id)
                      }
                      onChange={(object) => {
                        setModelCliente({ ...modelCliente, ['Empresa']: object })
                      }
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <Label for="CTE" className="mb-1 font-weight-bolder">Aceita CTe</Label><br />
                  <FormGroup>
                    <Row>
                      <Col>
                        <input
                          type="radio"
                          id="CTESim"
                          name="CTE"
                          className="mr-1"
                          inline
                          checked={modelCliente.CTE === true}
                          onChange={(e) => {
                            const x = e
                            setModelCliente({ ...modelCliente, [e.target.name]: e.target.checked })
                          }
                          }
                        />
                        <span style={{ fontWeight: modelCliente.CTE ? 'bold' : '', fontSize: '0.85rem' }}>Sim</span>
                      </Col>
                      <Col>
                        <input
                          type="radio"
                          id="CTENao"
                          name="CTE"
                          inline
                          className="mr-1"
                          label=""
                          checked={modelCliente.CTE === false}
                          onChange={(e) => {
                            setModelCliente({ ...modelCliente, [e.target.name]: !e.target.checked })
                          }
                          }
                        />
                        <span style={{ fontWeight: !modelCliente.CTE ? 'bold' : '', fontSize: '0.85rem' }}>Não</span>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="PorcentagemRL">Porcentagem RL(%)</Label>
                    <Input
                      type="number"
                      id="PorcentagemRL"
                      name="PorcentagemRL"
                      value={modelCliente.PorcentagemRL}
                      onChange={(e) => {
                        const val = e.target.value
                        const max = 100
                        const min = 0
                        const newVal = (val <= max && val >= min) || !val ? val : modelCliente.PorcentagemRL
                        setModelCliente({ ...modelCliente, [e.target.name]: newVal })
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="DiasVencimento">Dias p/ Vencimento RL</Label>
                    <Input
                      type="number"
                      id="DiasVencimento"
                      name="DiasVencimento"
                      value={modelCliente.DiasVencimento}
                      onChange={(e) => {
                        setModelCliente({ ...modelCliente, [e.target.name]: e.target.value })
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="3">
                  <FormGroup>
                    <Col md="3" className="mt-1">
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Bloquear Cliente</Label>
                      <CustomInput
                        type="switch"
                        id="bloquearCliente"
                        name="customSwitch"
                        className="custom-control-primary zindex-0"
                        label=""
                        inline
                        checked={modelCliente.Bloqueado}
                        onChange={(e) => {
                          if (!e.target.checked) setModelCliente({...modelCliente, DataDesbloqueio: null})
                          setModelCliente({ ...modelCliente, Bloqueado: e.target.checked })
                        }}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                {modelCliente.Bloqueado && <Col md="3">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Data p/ Desbloqueio Temporário</Label>
                    <Input
                      type="date"
                      id="DataDesbloqueio"
                      name="DataDesbloqueio"
                      value={modelCliente.DataDesbloqueio}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>}
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Observação">Orientações de fatura</Label>
                    <Input
                      type="textarea"
                      name="ObservacaoCobranca"
                      id="ObservacaoCobranca"
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                      value={modelCliente?.ObservacaoCobranca}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Observação">Observações Gerais</Label>
                    <Input
                      type="textarea"
                      name="Observacao"
                      id="Observacao"
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value.toUpperCase() })}
                      value={modelCliente?.Observacao}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row style={{ background: '#D5DBE3', padding: '2px', margin: '0 10px 0 10px' }}>
                <Col md="12" className="mt-1" >
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '17px'
                    }}
                  >
                    Área Portal
                  </span>
                </Col>
              </Row>
              <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }}>
                <Col md="6" className="mt-1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Link Portal</Label>
                    <Input
                      type="text"
                      id="LinkPortal"
                      name="LinkPortal"
                      placeholder="Link Portal"
                      value={modelCliente.LinkPortal}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value })}
                    />
                  </FormGroup>
                </Col>
                <Col md="3" className="mt-1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Usuário Portal</Label>
                    <Input
                      type="text"
                      id="UsuarioPortal"
                      name="UsuarioPortal"
                      placeholder="Usuario Portal"
                      value={modelCliente.UsuarioPortal}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value })}
                    />
                  </FormGroup>
                </Col>
                <Col md="3" className="mt-1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Senha Portal</Label>
                    <Input
                      type="text"
                      id="SenhaPortal"
                      name="SenhaPortal"
                      placeholder="Senha Portal"
                      value={modelCliente.SenhaPortal}
                      onChange={(e) => setModelCliente({ ...modelCliente, [e.target.name]: e.target.value })}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} className="mt-4">
                <Col md="12" className="mt-1" >
                  {
                    !isHidden(toggleContatos) ? <MdKeyboardArrowDown size={30} style={{ cursor: 'pointer' }} onClick={() => handleToggleContatos()} /> : <MdKeyboardArrowUp size={30} style={{ cursor: 'pointer' }} onClick={() => handleToggleContatos()} />
                  }
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '17px'
                    }}
                  >
                    Contatos
                  </span>
                </Col>
              </Row>
              <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} hidden={isHidden(toggleContatos)}>
                {
                  modelCliente?.Contatos?.length > 0 &&
                  modelCliente?.Contatos?.map((contato, index) => {
                    return getContatos(index)
                  })
                }
                <Col className="mb-2" md="12">
                  <button
                    onClick={() => { 
                      modelCliente?.Contatos?.push({ id: 0 })
                      setModelCliente({ ...modelCliente, Contatos: modelCliente.Contatos })
                    }}
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      display: 'inline-block',
                      width: '40px',
                      height: '40px',
                      background: '#2F4B74',
                      border: '1px solid #2F4B74',
                      borderRadius: '42px',
                      lineHeight: '34px',
                      fontSize: '30px',
                      cursor: 'pointer'
                    }}
                  >+
                  </button>
                </Col>
              </Row>
              <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} className="mt-4">
                <Col md="12" className="mt-1" >
                  {
                    !isHidden(toggleFuncionarios) ? <MdKeyboardArrowDown size={30} style={{ cursor: 'pointer' }} onClick={() => handleToggleFuncionarios()} /> : <MdKeyboardArrowUp size={30} style={{ cursor: 'pointer' }} onClick={() => handleToggleFuncionarios()} />
                  }
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '17px'
                    }}
                  >
                    Funcionários Integrados
                  </span>
                </Col>
              </Row>
              <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} hidden={isHidden(toggleFuncionarios)}>
                {
                  modelCliente?.Integracoes?.length > 0 &&
                  modelCliente?.Integracoes?.map((contato, index) => {
                    return getFuncionarios(index)
                  })
                }
                <Col className="mb-2" md="12">
                  <button
                    onClick={() => { 
                      modelCliente?.Integracoes?.push({ id: 0 })
                      setModelCliente({ ...modelCliente, Integracoes: modelCliente.Integracoes })
                    }}
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      display: 'inline-block',
                      width: '40px',
                      height: '40px',
                      background: '#2F4B74',
                      border: '1px solid #2F4B74',
                      borderRadius: '42px',
                      lineHeight: '34px',
                      fontSize: '30px',
                      cursor: 'pointer'
                    }}
                  >+
                  </button>
                </Col>
              </Row>
            </Card>}
            {aba === 2 && <Card>
              <Row className="justify-content-between mt-5 mb-5 ml-2 mr-2">
                <Col md="3">
                  <h5 className="text-bold-600">Data de geração:</h5>
                  <Flatpickr
                    value={intervaloDataProposta}
                    onChange={date => handlerFiltroDataProposta(date)}
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
                <div className="event-tags d-none d-sm-flex justify-content-end mt-3 ml-1">
                  <div className="tag mr-1">
                    <span className="bullet bullet-success bullet-sm mr-50"></span>
                    <span>Proposta atual</span>
                  </div>
                </div>
                <Col style={{ textAlign: 'right' }}>
                  <Button color='secondary' onClick={() => limparPesquisaProposta()} >Limpar Pesquisa</Button>
                  {' '}
                  <Button onClick={() => handleExportToExcel(state?.filteredData, `Relatorio_Propostas_${modelCliente.RazaoSocial}`, columns)} color='primary'>
                    Exportar
                  </Button>
                </Col>
              </Row>
              {loading ? <SkeletonDataTable configDataTableSkeleton={configDataTableSkeleton} /> : <ReactTable
                  style={{ fontSize: 'small', textAlign: 'center'}}
                  filterable
                  pagination
                  responsive
                  filtered={filteredReactTable}
                  onFilteredChange={filtered => {
                    setFilteredReactTable(filtered)
                    let updatedData = []
                    if (filtered.length === 0) updatedData = state.propostas
                    for (let i = 0; i < filtered.length; i++) {
                      updatedData = matchSorter(i === 0 ? state.propostas : updatedData, filtered[i].value, { keys: [filtered[i].id] })
                    }
                    setState({ ...state, filteredData: updatedData })
                  }}
                  columns={columns}
                  defaultPageSize={20}
                  defaultSorted={[
                    {
                      id: "Codigo",
                      desc: true
                    }
                  ]}
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
                  data={state?.filteredData}
              />
            }
            </Card>}
            {aba === 3 && <Card>
              <Row className="justify-content-between mt-5 mb-5 ml-2 mr-2">
                <Col md="3">
                  <h5 className="text-bold-600">Data:</h5>
                  <Flatpickr
                    value={intervaloDataOS}
                    onChange={date => handlerFiltroDataOS(date)}
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
                <Col style={{ textAlign: 'right' }}>
                  <Button color='secondary' onClick={() => limparPesquisaOS()} >Limpar Pesquisa</Button>
                  {' '}
                  <Button onClick={() => handleExportToExcel(state?.filteredDataOrdens, `Relatorio_Ordens_Servico_${modelCliente.RazaoSocial}`, columnsOS)} color='primary'>
                    Exportar
                  </Button>
                </Col>
              </Row>
              {loading ? <SkeletonDataTable configDataTableSkeleton={configDataTableSkeletonOS} /> : <ReactTable
                  style={{ fontSize: 'small', textAlign: 'center'}}
                  filterable
                  pagination
                  responsive
                  filtered={filteredOSReactTable}
                  onFilteredChange={filtered => {
                    setFilteredOSReactTable(filtered)
                    let updatedData = []
                    if (filtered.length === 0) updatedData = state.ordens
                    for (let i = 0; i < filtered.length; i++) {
                      updatedData = matchSorter(i === 0 ? state.ordens : updatedData, filtered[i].value, { keys: [filtered[i].id] })
                    }
                    setState({ ...state, filteredDataOrdens: updatedData })
                  }}
                  columns={columnsOS}
                  defaultPageSize={20}
                  defaultSorted={[
                    {
                      id: "Codigo",
                      desc: true
                    }
                  ]}
                  noDataComponent="Ainda não existem"
                  previousText={"Anterior"}
                  nextText={"Próximo"}
                  noDataText="Não há os's para exibir"
                  pageText='Página'
                  ofText='de'
                  rowsText='itens'
                  getTheadTrProps={(state, row) => {
                    return {
                      style: { background: '#2f4b74', color: 'white', height: '2.3rem', fontWeight: 'bold' }
                    }
                  }}
                  data={state?.filteredDataOrdens}
              />
            }
            </Card>}
            {aba === 4 && <AbaMedicoes cliente={modelCliente} state={state} setState={setState} filteredReactTable={filteredMedicaoReactTable} setFilteredReactTable={setFilteredMedicaoReactTable} limparPesquisa={limparPesquisaMedicao} loading={loading} handleExportToExcel={handleExportToExcel} />}
            {aba === 5 && <AbaFaturamentos cliente={modelCliente} state={state} setState={setState} filteredReactTable={filteredFaturamentoReactTable} setFilteredReactTable={setFilteredFaturamentoReactTable} limparPesquisa={limparPesquisaFaturamento} loading={loading} handleExportToExcel={handleExportToExcel} />}
            {aba === 6 && <AbaContasReceber cliente={modelCliente} state={state} setState={setState} filteredReactTable={filteredContasReceberReactTable} setFilteredReactTable={setFilteredContasReceberReactTable} limparPesquisa={limparPesquisaContasReceber} loading={loading} handleExportToExcel={handleExportToExcel} />}
            {aba === 7 && <HistoricoContato cliente={modelCliente} vendedor={user} vendedores={vendedores} historico={props.historicoContato} loading={loading} setLoading={setLoading} handleExportToExcel={handleExportToExcel} cadastrarHistoricoContato={props.cadastrarHistoricoContato} alterarHistoricoContato={props.alterarHistoricoContato} saveHistoricoSuccess={props.saveHistoricoSuccess} />}
            {aba === 8 && <AbaDocumentos cliente={modelCliente} documentos={props.documentos} loading={loading} setLoading={setLoading} upload={props.upload} download={props.download} file={props.file} fileId={props.fileId} cadastrarClienteDocumento={props.criarClienteDocumento} deletarClienteDocumento={props.deletarClienteDocumento} user={user} />}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="text-size-button"
              disabled={isInvalidForm()}
              onClick={() => onSubmitForm()}
            >
              Salvar
            </Button>{" "}
          </ModalFooter>
        </Modal>
      </span>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    cliente: state?.cliente?.cliente,
    clienteExiste: state?.cliente?.clienteExiste,
    clienteExisteRazao: state?.cliente?.clienteExisteRazao,
    empresas: state?.empresa.empresas,
    propostas: state?.proposta.propostasClientes,
    ordens: state?.ordem.ordensClientes,
    historicoContato: state?.historicoContato?.historicoContato,
    saveHistoricoSuccess: state?.historicoContato?.saveHistoricoSuccess,
    medicoes: state.medicao.medicoes,
    faturamentos: state.faturamento.faturamentos,
    contasReceber: state.contaReceber.contasReceber,
    documentos: state.cliente.documentos,
    saveDocSuccess: state.cliente.createDocSuccess,
    deleteDocSuccess: state.cliente.deleteDocSuccess,
    fileId: state.file.fileId,
    file: state.file.file
  }
}


export default connect(mapStateToProps, {
  atualizarCliente,
  clienteExistente,
  clienteExistenteRazao,
  criarCliente,
  buscarEmpresas,
  buscarPropostasPorCliente,
  buscarOrdensPorCliente,
  buscarHistoricoContatoPorCliente,
  cadastrarHistoricoContato,
  alterarHistoricoContato,
  buscarMedicoesPorCliente,
  buscarFaturamentosPorCliente,
  buscarContasReceberPorCliente,
  buscarDocumentosPorCliente,
  upload,
  download,
  criarClienteDocumento,
  deletarClienteDocumento
})(ModalCliente)

