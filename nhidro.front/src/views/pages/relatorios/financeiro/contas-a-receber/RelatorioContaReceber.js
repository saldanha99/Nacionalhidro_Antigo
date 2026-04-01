import React, { useState, useEffect, useRef } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { Card, Row, Col, Button, CardBody } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import { buscarContasReceberRelatorio } from "@src/redux/actions/financeiro/contas-a-receber"
import Select from "react-select"
import Flatpickr from "react-flatpickr"
import "./light.css"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import { exportToExcel } from '../../../../../utility/Utils'
import { getHeader } from './headers'
import moment from "moment"
moment.locale("pt-br")

const RelatorioContaReceber = (props) => {
  const refComp = useRef(null)

  const data1 = new Date(new Date().setMonth(new Date().getMonth() - 6))
  const data2 = new Date(new Date().setMonth(new Date().getMonth() + 6))

  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [columns, setColumns] = useState(getHeader('relatorio-simplificado'))
  const [intervaloData, setIntervaloData] = useState([data1, data2])

  const [filteredReactTable, setFilteredReactTable] = useState([])
  const [state, setState] = useState({
    filteredData: []
  })

  const [relatorio, setRelatorio] = useState('relatorio-simplificado')
  const relatorios = [
    { label: 'Contas a Receber - Simplificado', value: 'relatorio-simplificado' },
    { label: 'Titulos Recebidos', value: 'relatorio-recebidas' },
    { label: 'Contas a Receber - Competência', value: 'relatorio-competencia' },
    { label: 'Contas a Receber - Competência/Centro de Custo', value: 'relatorio-centro' },
    { label: 'Contas a Receber - Competência/Natureza', value: 'relatorio-natureza' },
    { label: 'Contas a Receber - Atraso', value: 'relatorio-atraso' },
    { label: 'Antecipação de Recebíveis', value: 'relatorio-antecipado' },
    { label: 'Contas a Receber - Ciclo Operacional', value: 'relatorio-ciclo' }
  ]

  const groupObjByColumns = () => {
    const arr = state?.filteredData.map(x => {
      const obj = {}
      columns.forEach(c => {
        c?.id?.length ? obj[c.Header] = x[c.id] : obj[c.Header] = x[c.accessor]
      })
      return obj
    })

    return _.sortBy(arr, 'codigo')
  }

  const handleExportToExcel = () => {
    const nome = relatorios.find(f => f.value === relatorio).label
    exportToExcel(groupObjByColumns(), `Relatorio ${nome}`.toLocaleUpperCase())
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

  const handleFiltrarBtn = (relatorio, intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      setColumns(getHeader(relatorio))
      props.buscarContasReceberRelatorio(intervaloData[0], intervaloData[1], relatorio)
      setFilteredReactTable([])
      setLoadingSkeleton(true)
    }
  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
  }

  useEffectAfterMount(() => {
    setState({ ...state, data: props?.relatorio, filteredData: props?.relatorio })
    setLoadingSkeleton(false)
  }, [props?.relatorio])

  useEffect(() => {
    if ((filteredReactTable?.length === 0 || state?.filteredData?.length === 0) && !intervaloData) {
      setState({ ...state, filteredData: state.data })
    }
  }, [state.filteredData])

  useEffect(() => {
    handleFiltrarBtn(relatorio, intervaloData)
  }, [intervaloData, relatorio])

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
        <CardBody style={{ backgroundColor: '#2f4b74', justifyContent: 'flex-start' }}>
          <Row>
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
            <Col className="mb-1" md="3">
              <h5 className="text-bold-600" style={{ color: 'white' }}>Data:</h5>
              <Flatpickr
                value={intervaloData}
                onChange={date => handlerFiltroData(date)}
                onClose={ (selectedDates, dateStr, instance) => {
                  if (selectedDates.length === 1) {
                      instance.setDate([selectedDates[0], selectedDates[0]], true)
                  }
                }}
                className="form-control"
                style={{ backgroundColor: "#fff" }}
                key={Portuguese}
                options={{ mode: 'range', locale: Portuguese, dateFormat: 'd-m-Y'  }}
                name="filtroData"
                placeholder="Intervalo de datas"
                ref={refComp}
              />
            </Col>
          </Row>
        </CardBody>
        <ReactTable
          loading={loadingSkeleton}
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
          noDataText="Não há relatórios para exibir"
          className="-striped -highlight"
          pageText='Página'
          ofText='de'
          rowsText='itens'
          loadingText='Carregando...'
          previousText={"Anterior"}
          nextText={"Próximo"}
          data={state?.filteredData}
        />
      </Card>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    relatorio: state?.contaReceber?.relatorio,
    error: state?.contaReceber?.error
  }
}

export default connect(mapStateToProps, {
  buscarContasReceberRelatorio
})(RelatorioContaReceber)