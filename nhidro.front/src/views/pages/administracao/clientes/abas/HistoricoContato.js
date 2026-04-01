import React, { useState } from "react"
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { Button, Card, Col, Row } from "reactstrap"
import SkeletonDataTable from "../../../components/SkeletonDataTable"
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import ModalHistoricoContato from "../ModalHistoricoContato"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import moment from "moment"
import { FiEdit } from "react-icons/fi"
moment.locale("pt-br")

const MySwal = withReactContent(Swal)
const configDataTableSkeleton = {
  nameRows: [
    { name: 'CLIENTE' },
    { name: 'VENDEDOR' },
    { name: 'CONTATO' },
    { name: 'STATUS' },
    { name: 'DATA DO CONTATO' },
    { name: 'DATA AGENDADO' },
    { name: 'OBSERVAÇÕES' }
  ],
  quantityItensOnRow: 20
} 

const HistoricoContato = (props) => {
  const { cliente, vendedor, vendedores, historico, loading, setLoading, handleExportToExcel, cadastrarHistoricoContato, alterarHistoricoContato } = props
  const [filteredReactTable, setFilteredReactTable] = useState([])
  const [modal, setModal] = useState(false)
  const [data, setData] = useState(null)
  const [state, setState] = useState({
    filteredData: [],
    historico: []
  })

  const columns = [
    {
      Header: "AÇÕES",
      id: "acoes",
      accessor: 'acoes',
      filterable: false,
      notExport: true,
      width: 120,
      Cell: (row) => {
        return (<div>
          <FiEdit title='Editar' style={{margin: '5px'}} size={20} onClick={() => {
              setData(row.original)
              setModal(true)
          }}/>
        </div>)
      }
    },
    {
      Header: "CLIENTE",
      id: "Cliente",
      accessor: 'Cliente',
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
      Header: "CONTATO",
      accessor: "Contato",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Contato"] })
    },
    {
      Header: "STATUS",
      id: "Status",
      accessor: "Status",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Status"] })
    },
    {
      Header: "DATA DO CONTATO",
      id: "DataContato",
      accessor: "DataContato",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataContato"] })
    },
    {
      Header: "DATA PRÓX. CONTATO",
      id: "DataAgendado",
      accessor: "DataAgendado",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataAgendado"] })
    },
    {
      Header: "OBSERVAÇÕES",
      id: "Observacoes",
      accessor: "Observacoes",
      filterAll: true,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
    }
  ]

  useEffectAfterMount(() => {
    setLoading(false)
    const items = historico?.map(x => {
      return {
        Historico: x,
        Cliente: x.Cliente?.RazaoSocial,
        Vendedor: x.Vendedor?.username,
        Contato: `${x.Contato?.Nome} - ${x.Contato?.Setor}`,
        Status: x.Status,
        DataContato: x.DataContato ? moment(x.DataContato).local().format("DD/MM/YYYY") : '',
        DataAgendado: x.DataAgendado ? moment(x.DataAgendado).local().format("DD/MM/YYYY") : '',
        Observacoes: x.Observacoes?.toUpperCase()
      }
    })
    setState({ ...state, historico: items, filteredData: items })
  }, [historico])

  const limparPesquisa = () => {
    setFilteredReactTable([])
    setState({ ...state, filteredData: historico })
  }

  const save = (data) => {
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
      .then((ok) => {
        if (ok.value) {
          setLoading(true)
          setModal(false)
          setData(null)
          if (!data.id) {
            cadastrarHistoricoContato({ data })
          } else {
            alterarHistoricoContato({ data })
          }
        }
      })
  }

  return (
    <Card>
        <ModalHistoricoContato data={data} modal={modal} setModal={setModal} cliente={cliente} vendedor={vendedor} vendedores={vendedores} save={save} />
        <Row className="justify-content-between mt-5 mb-5 ml-2 mr-2">
            <Col style={{ textAlign: 'right' }}>
                <Button color='secondary' onClick={() => limparPesquisa()} >Limpar Pesquisa</Button>
                {' '}
                <Button onClick={() => handleExportToExcel(state?.filteredData, `Relatorio_Historico_Contatos_${cliente.RazaoSocial}`, columns)} color='primary'>
                Exportar
                </Button>
                {' '}
                <Button onClick={() => { 
                  setModal(true)
                  setData(null)
                }} color='danger'>
                Cadastrar
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
            if (filtered.length === 0) updatedData = state.historico
            for (let i = 0; i < filtered.length; i++) {
                updatedData = matchSorter(i === 0 ? state.historico : updatedData, filtered[i].value, { keys: [filtered[i].id] })
            }
            setState({ ...state, filteredData: updatedData })
            }}
            columns={columns}
            defaultPageSize={20}
            noDataComponent="Ainda não existem"
            previousText={"Anterior"}
            nextText={"Próximo"}
            noDataText="Não há histórico para exibir"
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
    </Card>
  )
}

export default HistoricoContato