import React from "react"
import { Button, Card, Col, Row } from "reactstrap"
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import moment from "moment"
moment.locale("pt-br")

const AbaContasReceber = (props) => {
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
            Header: "ID",
            id: "Id",
            accessor: "Id",
            filterAll: true,
            width: 80,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["Id"] }),
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
            id: "cliente",
            accessor: (value) => value.Cliente || "-",
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["cliente"] }),
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
            Header: "TIPO FATURA",
            id: "TipoFatura",
            accessor: (value) => value.TipoFatura,
            filterAll: true,
            width: 120,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["TipoFatura"] }),
        },
        {
            Header: "DATA EMISSÃO",
            id: "DataEmissao",
            accessor: (value) => value.DataEmissao || "-",
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                    keys: ["DataEmissao"],
                }),
        },
        {
            Header: "VALOR RECEBER (R$)",
            id: "ValorTotal",
            accessor: (value) => value.ValorTotal,
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["ValorTotal"] }),
        },
        {
            Header: "DATA DE ENTRADA",
            id: "DataEnvio",
            accessor: (value) =>
                moment(value.DataEnvio)?.utc().format("DD/MM/YYYY") || "-",
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["DataEnvio"] }),
        },
        {
            Header: "DATA CANCELAMENTO",
            id: "DataCancelamento",
            accessor: (value) => value.DataCancelamento || "-",
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["DataCancelamento"] }),
        },
        {
            Header: "MOTIVO CANCELAMENTO",
            id: "MotivoCancelamento",
            accessor: (value) => value.MotivoCancelamento || "-",
            filterAll: true,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["MotivoCancelamento"] }),
        },
        {
            Header: "TIPO INSERÇÃO",
            id: "InsercaoManual",
            accessor: (value) => value?.InsercaoManual ? 'MANUAL' : 'AUTOMÁTICO',
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, { keys: ["InsercaoManual"] }),
        },
        {
            Header: "USUÁRIO",
            id: "Usuario",
            accessor: (value) => value?.Usuario || "-",
            filterAll: true,
            width: 150,
            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Usuario"] })
        }
    ]
    return (
        <Card>
            <Row className="justify-content-between mt-5 mb-5 ml-2 mr-2">
                <Col style={{ textAlign: 'right' }}>
                    <Button color='secondary' onClick={() => limparPesquisa()} >Limpar Pesquisa</Button>
                    {' '}
                    <Button onClick={() => handleExportToExcel(state.faturamentos, `relatorio_contasReceber_${cliente.RazaoSocial}`, columns)} color='primary'>
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
                data={state.contasReceber}
            />
        </Card>
    )
}

export default AbaContasReceber