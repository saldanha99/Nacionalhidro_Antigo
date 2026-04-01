import React, { useState, useEffect } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { Card, CardHeader, Row, Col, Button } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../components/SkeletonDataTable'
import { buscarFornecedor } from "@src/redux/actions/administrador/fornecedor/buscarFornecedorActions"
import { buscarCentroCusto } from "@src/redux/actions/administrador/centro-custo/buscarCentroCustoActions"
import { buscarNatureza } from "@src/redux/actions/administrador/natureza-contabil/buscarNaturezaActions"
import { buscarEmpresasBancos } from "@src/redux/actions/administrador/empresa/buscarEmpresasBancosActions"
import Select from "react-select"
import { exportToExcel } from '../../../../utility/Utils'
import { getHeader } from './headers'
import moment from "moment"
moment.locale("pt-br")

const RelatorioGestao = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'CONTA ID' },
      { name: 'PARCELA' },
      { name: 'Nº NF' },
      { name: 'EMISSÂO NF' },
      { name: 'VENCIMENTO' },
      { name: 'DATA DE PAGAMENTO' },
      { name: 'VALOR PAGO(R$)' },
      { name: 'VALOR PARCELA(R$)' },
      { name: 'VALOR ACRÉSCIMO(R$)' },
      { name: 'VALOR DECRÉSCIMO(R$)' },
      { name: 'VALOR À PAGAR(R$)' },
      { name: 'STATUS PARCELA' },
      { name: 'FORNECEDOR' },
      { name: 'EMPRESA' },
      { name: 'CENTRO DE CUSTO' },
      { name: 'NATUREZA CONTÁBIL' },
      { name: 'STATUS CONTA' }
    ],
    quantityItensOnRow: 10

  }
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [columns, setColumns] = useState(getHeader('relatorio-fornecedores'))

  const [filteredReactTable, setFilteredReactTable] = useState([])
  const [state, setState] = useState({
    fornecedores: [],
    centros: [],
    naturezas: [],
    empresasBancos: [],
    data: [],
    filteredData: []
  })

  const [relatorio, setRelatorio] = useState('relatorio-fornecedores')
  const relatorios = [
    { label: 'Relatório Fornecedores', value: 'relatorio-fornecedores' },
    { label: 'Relatório de Naturezas Contábeis', value: 'relatorio-naturezas-contabeis' },
    { label: 'Relatório de Centro de Custos', value: 'relatorio-centro-custos' },
    { label: 'Relatório de Contas Bancárias', value: 'relatorio-bancos' }
  ]

  const groupObjByColumns = () => {
    const arr = state?.filteredData.map(x => {
      const obj = {}
      columns.forEach(c => {
        if (!c?.id && c.accessor.includes('.')) {
          const s = c.accessor.split('.')
          obj[c.Header] = x[s[0]] ? x[s[0]][s[1]] : null
        } else {
          c?.id?.length ? obj[c.Header] = x[c.id] : obj[c.Header] = x[c.accessor]
        }
      })
      delete obj.createdAt
      delete obj.updatedAt
      if (obj.hasOwnProperty('Bloqueado')) obj.Bloqueado = obj.Bloqueado ? 'Sim' : 'Não'
      return obj
    })

    return arr
  }

  const handleExportToExcel = () => {
    exportToExcel(groupObjByColumns(), `Relatorio_${moment(new Date()).utc().format("YYYYMMDDhmmss")}`)
  }

  const handleChangeRelatorio = (e) => {
    if (e) {
      setRelatorio(e.value)
    }
  }

  const limparPesquisa = () => {
    setFilteredReactTable([])
    setState({ ...state, filteredData: state.data })
  }

  useEffect(() => {
    props.buscarFornecedor()
    setLoadingSkeleton(true)
  }, [])

  useEffectAfterMount(() => {
    setState({ ...state, data: props?.fornecedor, filteredData: props?.fornecedor })
    setLoadingSkeleton(false)
  }, [props?.fornecedor])

  useEffectAfterMount(() => {
    setState({ ...state, data: props?.centros, filteredData: props?.centros })
    setLoadingSkeleton(false)
  }, [props?.centros])

  useEffectAfterMount(() => {
    setState({ ...state, data: props?.naturezas, filteredData: props?.naturezas })
    setLoadingSkeleton(false)
  }, [props?.naturezas])

  useEffectAfterMount(() => {
    setState({ ...state, data: props?.empresasBancos, filteredData: props?.empresasBancos })
    setLoadingSkeleton(false)
  }, [props?.empresasBancos])

  useEffect(() => {
    if ((filteredReactTable?.length === 0 || state?.filteredData?.length === 0)) {
      setState({ ...state, filteredData: state.data })
    }
  }, [state.filteredData])

  useEffect(() => {
    setLoadingSkeleton(true)
    setFilteredReactTable([])
    setColumns(getHeader(relatorio))
    switch (relatorio) {
      case 'relatorio-fornecedores': props.buscarFornecedor() 
        break
      case 'relatorio-naturezas-contabeis': props.buscarNatureza()
        break
      case 'relatorio-centro-custos': props.buscarCentroCusto() 
        break
      case 'relatorio-bancos': props.buscarEmpresasBancos() 
        break
    }
  }, [relatorio])

  return (
    <div>
      <Row className="mt-5">
        <Col style={{ textAlign: 'right' }}>
          <Button color='secondary' onClick={() => limparPesquisa()} >Limpar Pesquisa</Button>
          {' '}
          <Button onClick={() => handleExportToExcel()} color='primary'>
            Exportar
          </Button>
        </Col>
      </Row>
      <Card style={{ marginTop: '1%' }}>
        <CardHeader style={{ backgroundColor: '#2f4b74', justifyContent: 'flex-start' }}>
          <Col className="mb-1" md="3" sm="12">
            <h5 className="text-bold-600" style={{ color: 'white' }}>Relatório:</h5>
            <Select
              className="React"
              classNamePrefix="select"
              styles={{
                menu: provided => ({ ...provided, zIndex: 9999 }),
                control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
              }}
              name="unidade"
              options={relatorios}
              isSearchable
              value={relatorios.filter((option) => option.value === relatorio)}
              onChange={e => handleChangeRelatorio(e)}
            />
          </Col>
        </CardHeader>
        {
          loadingSkeleton
          && <div style={{overflow: 'hidden'}}>
              <SkeletonDataTable configDataTableSkeleton={configDataTableSkeleton} />
            </div>
        }
        {
          !loadingSkeleton
          && <ReactTable
            style={{ fontSize: 'small', background: '', textAlign: 'center' }}
            filterable
            pagination
            filtered={filteredReactTable}
            onFilteredChange={filtered => {
              setFilteredReactTable(filtered)
              let updatedData = []
              if (filtered.length === 0) updatedData = state.data
              for (let i = 0; i < filtered.length; i++) {
                updatedData = matchSorter(i === 0 ? state.data : updatedData, filtered[i].value, { keys: [filtered[i].id] })
              }
              setState({ ...state, filteredData: updatedData })
            }}
            defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value
            }
            columns={columns}
            defaultPageSize={20}
            defaultSorted={[
              {
                id: "id",
                desc: false
              }
            ]}
            noDataText="Não há relatórios para exibir"
            className="-striped -highlight"
            pageText='Página'
            ofText='de'
            rowsText='itens'
            previousText={"Anterior"}
            nextText={"Próximo"}
            data={state.filteredData}
          />
        }
      </Card>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    fornecedor: state?.fornecedor?.lista,
    centros: state?.centro?.lista,
    naturezas: state?.natureza?.lista,
    empresasBancos: state?.empresa?.empresasBancos,
    relatorio: state?.contas?.relatorio,
    error: state?.contas?.error
  }
}

export default connect(mapStateToProps, {
  buscarFornecedor,
  buscarCentroCusto,
  buscarNatureza,
  buscarEmpresasBancos
})(RelatorioGestao)