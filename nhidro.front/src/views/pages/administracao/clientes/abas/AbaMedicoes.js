import React from "react"
import { Button, Card, Col, Row } from "reactstrap"
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import moment from "moment"
moment.locale("pt-br")

const AbaMedicoes = (props) => {
    const { state, setState, limparPesquisa, filteredReactTable, setFilteredReactTable, loading, handleExportToExcel, cliente } = props
    const columns = [
        {
            Header: "STATUS",
            id: "Status",
            accessor: (value) => value.Status,
            filterAll: true,
            width: 120,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["Status"] }),
        },
        {
            Header: "MEDIÇÃO",
            id: "Medicao",
            accessor: (value) => value.Medicao,
            filterAll: true,
            width: 120,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["Medicao"] }),
        },
        {
            Header: "EMPRESA",
            id: "Empresa",
            accessor: (value) => value.Empresa,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["Empresa"] }),
        },
        {
            Header: "CLIENTE",
            id: "Cliente",
            accessor: (value) => value.Cliente,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["Cliente"] }),
        },
        {
            Header: "CONTATO",
            id: "Contato",
            accessor: (value) => value.Contato,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["Contato"] }),
        },
        {
            Header: "VALOR TOTAL",
            id: "ValorTotal",
            accessor: (value) => value.ValorTotal,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["ValorTotal"] }),
        },
        {
            Header: "APROVAÇÃO INTERNA",
            id: "AprovacaoInterna",
            accessor: (value) => value.AprovacaoInterna,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                    keys: ["AprovacaoInterna"],
                }),
        },
        {
            Header: "COBRANÇA ENVIADA",
            id: "CobrancaEnviada",
            accessor: (value) => value.CobrancaEnviada,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["CobrancaEnviada"] }),
        },
        {
            Header: "DATA CANCELAMENTO",
            id: "DataCancelamento",
            accessor: (value) => value.DataCancelamento,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["DataCancelamento"] }),
        },
        {
            Header: "MOTIVO CANCELAMENTO",
            id: "MotivoCancelamento",
            accessor: (value) => value.MotivoCancelamento,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["MotivoCancelamento"] }),
        }
    ]
    return (
        <Card>
            <Row className="justify-content-between mt-5 mb-5 ml-2 mr-2">
                <Col style={{ textAlign: 'right' }}>
                    <Button color='secondary' onClick={() => limparPesquisa()} >Limpar Pesquisa</Button>
                    {' '}
                    <Button onClick={() => handleExportToExcel(state.medicoes, `relatorio_medicao_${cliente.RazaoSocial}`, columns)} color='primary'>
                        Exportar
                    </Button>
                </Col>
            </Row>
            <ReactTable loading={loading}
                style={{ fontSize: 'small', textAlign: 'center' }}
                filterable
                pagination
                responsive
                filtered={filteredReactTable}
                onFilteredChange={filtered => {
                    setFilteredReactTable(filtered)
                    let updatedData = []
                    if (filtered.length === 0) updatedData = state.medicoes
                    for (let i = 0; i < filtered.length; i++) {
                        updatedData = matchSorter(i === 0 ? state.medicoes : updatedData, filtered[i].value, { keys: [filtered[i].id] })
                    }
                    setState({ ...state, filteredDataMedicoes: updatedData })
                }}
                columns={columns}
                defaultPageSize={20}
                defaultSorted={[
                    {
                        id: "Medicao",
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
                loadingText='Carregando...'
                getTheadTrProps={(state, row) => {
                    return {
                        style: { background: '#2f4b74', color: 'white', height: '2.3rem', fontWeight: 'bold' }
                    }
                }}
                data={state.medicoes}
            />
        </Card>
    )
}

export default AbaMedicoes