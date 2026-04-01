import React from "react"
import { Button, Card, Col, Row } from "reactstrap"
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import moment from "moment"
moment.locale("pt-br")

const AbaFaturamentos = (props) => {
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
            Header: "Nº NOTA",
            id: "Nota",
            accessor: (value) => value.Nota,
            filterAll: true,
            width: 120,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["Nota"] }),
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
            Header: "TIPO FATURA",
            id: "TipoFatura",
            accessor: (value) => value.TipoFatura,
            filterAll: true,
            width: 120,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["TipoFatura"] }),
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
            Header: "VALOR RATEADO",
            id: "ValorRateado",
            accessor: (value) => value.ValorRateado,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["ValorRateado"] }),
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
            Header: "DATA APROVAÇÃO",
            id: "DataAprovacao",
            accessor: (value) => value.DataAprovacao,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                    keys: ["DataAprovacao"],
                }),
        },
        {
            Header: "DATA EMISSÃO",
            id: "DataEmissao",
            accessor: (value) => value.DataEmissao,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                    keys: ["DataEmissao"],
                }),
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
                    <Button onClick={() => handleExportToExcel(state.faturamentos, `relatorio_faturamento_${cliente.RazaoSocial}`, columns)} color='primary'>
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
                    if (filtered.length === 0) updatedData = state.faturamentos
                    for (let i = 0; i < filtered.length; i++) {
                        updatedData = matchSorter(i === 0 ? state.faturamentos : updatedData, filtered[i].value, { keys: [filtered[i].id] })
                    }
                    setState({ ...state, filteredDataFaturamentos: updatedData })
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
                data={state.faturamentos}
            />
        </Card>
    )
}

export default AbaFaturamentos