import React, { useState, useEffect } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { buscarPropostas } from "@src/redux/actions/comercial/proposta/buscarPropostasActions"
import { Card, CardBody } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { formatNumberReal } from '../../../../../utility/number/index'
import { Enum_StatusPropostas } from '../../../../../utility/enum/Enums'
import auth from "@src/services/auth"
import moment from "moment"
moment.locale("pt-br")
const user = auth.getUserInfo()

const PropostasCanceladas = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'Código' },
      { name: 'Revisão' },
      { name: 'Cliente' },
      { name: 'Vendedor' },
      { name: 'Data de Geração' },
      { name: 'Validade' },
      { name: 'Valor' },
      { name: 'Motivo do Cancelamento' },
      { name: 'Data de Cancelamento' }
    ],
    quantityItensOnRow: 10
  } 
  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [state, setState] = useState({})
    
  useEffect(() => {
    if (selectedTipo === 'Canceladas') {
      props.buscarPropostas(Enum_StatusPropostas.Cancelado, user)
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    setState({...state, data: props?.propostas})
    setFilteredData(props?.propostas)
    setLoadingSkeleton(false)
  }, [props?.propostas])

  return (
    <Card>
      <CardBody>
      </CardBody>
      {
        loadingSkeleton
        && <SkeletonDataTable configDataTableSkeleton={configDataTableSkeleton} />
      } 
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
                Header: "MOTIVO DO CANCELAMENTO",
                accessor: "MotivoCancelamento",
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["MotivoCancelamento"] })
              },
              {
                Header: "DATA DE CANCELAMENTO",
                id: "DataStatus",
                accessor: (value) => (moment(value.DataCancelamento).isValid() ? moment(value.DataCancelamento).local().format("DD/MM/YYYY") : '-'),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataCancelamento"] })
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
  buscarPropostas
})(PropostasCanceladas)