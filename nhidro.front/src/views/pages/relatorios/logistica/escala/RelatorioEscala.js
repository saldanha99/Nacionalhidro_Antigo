import React, { useState, useEffect, useRef } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { Card, Row, Col, Button, CardBody } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { buscarEscalasRelatorio } from "@src/redux/actions/logistica/escala/buscarEscalasActions"
import { buscarEmpresas } from "@src/redux/actions/administrador/empresa/buscarEmpresasActions"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import Select from "react-select"
import { exportToExcel } from '../../../../../utility/Utils'
import { getHeader } from './headers'
import moment from "moment"
moment.locale("pt-br")

const RelatorioEscala = (props) => {
  const refComp = useRef(null)
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'ID' },
      { name: 'DATA' },
      { name: 'HORA' },
      { name: 'CLIENTE' },
      { name: 'CNPJ' },
      { name: 'EQUIPAMENTO' },
      { name: 'VEÍCULOS' },
      { name: 'FUNCIONÁRIOS' },
      { name: 'OBSERVAÇÕES' },
      { name: 'ORDEM SERVIÇO' },
      { name: 'STATUS' }
    ],
    quantityItensOnRow: 10
  }

  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [columns, setColumns] = useState(getHeader('relatorio-simplificado'))
  const [dataInicial, setDataInicial] = useState(moment().subtract(1, 'month').toDate())
  const [dataFinal, setDataFinal] = useState(moment().add(1, 'month').toDate())
  const [empresa, setEmpresa] = useState(0)

  const [filteredReactTable, setFilteredReactTable] = useState([])
  const [state, setState] = useState({
    filteredData: []
  })

  const [relatorio, setRelatorio] = useState('relatorio-simplificado')
  const relatorios = [
    { label: 'Relatório Simplificado', value: 'relatorio-simplificado' },
    { label: 'Relatório de Alocação', value: 'relatorio-funcionario' }
  ]

  const groupObjByColumns = () => {
    const arr = state?.filteredData.map(x => {
      const obj = {}
      columns.forEach(c => {
        c?.id?.length ? obj[c.Header] = x[c.id] : obj[c.Header] = x[c.accessor]
      })
      return obj
    })

    return _.sortBy(arr, 'Funcionário')
  }

  const handleExportToExcel = () => {
    exportToExcel(groupObjByColumns(), `Relatorio_Escalas_${moment(new Date()).utc().format("YYYYMMDDhmmss")}`)
  }

  const opcoesEmpresas = [{ id: 0, Descricao: 'Todas as Empresas' }, ...(props.empresas || [])]

  const handleChangeRelatorio = (e) => {
    if (e) {
      setRelatorio(e.value)
    }
  }

  const handleChangeEmpresa = (e) => {
    if (e) {
      setEmpresa(e.id || 0)
    }
  }

  const limparPesquisa = () => {
    setFilteredReactTable([])
    setState({ ...state, filteredData: state.data })
  }

  const handleFiltrarBtn = (relatorio, dtIni, dtFim, empresaId) => {
    if (dtIni && dtFim) {
      setColumns(getHeader(relatorio))
      if (relatorio === 'relatorio-simplificado') props.buscarEscalasRelatorio(dtIni, dtFim)
      else props.buscarEscalasRelatorio(dtIni, dtFim, empresaId || 0, true)
      setFilteredReactTable([])
      setLoadingSkeleton(true)
    }
  }

  useEffect(() => {
    props.buscarEmpresas()
  }, [])

  useEffectAfterMount(() => {
    setState({ ...state, data: props?.relatorio, filteredData: props?.relatorio })
    setLoadingSkeleton(false)
  }, [props?.relatorio])

  useEffect(() => {
    if ((filteredReactTable?.length === 0 || state?.filteredData?.length === 0) && (!dataInicial || !dataFinal)) {
      setState({ ...state, filteredData: state.data })
    }
  }, [state.filteredData])

  useEffect(() => {
    handleFiltrarBtn(relatorio, dataInicial, dataFinal, empresa)
  }, [dataInicial, dataFinal, relatorio, empresa])

  const handleDateUpdate = (setter) => (dates, dateStr) => {
    if (dates && dates[0] && moment(dates[0]).isValid()) {
      setter(dates[0])
    } else if (dateStr) {
      const m = moment(dateStr, ['DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD', 'DDMMYYYY', 'D-M-YYYY', 'D/M/YYYY'])
      if (m.isValid()) setter(m.toDate())
    }
  }

  const handleDateBlur = (setter) => (e) => {
    const val = e?.target?.value
    if (val) {
      const m = moment(val, ['DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD', 'DDMMYYYY', 'D-M-YYYY', 'D/M/YYYY'])
      if (m.isValid()) setter(m.toDate())
    }
  }

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
            <Col className="mb-1" md="2" sm="6">
              <h5 className="text-bold-600" style={{ color: 'white' }}>Data Inicial:</h5>
              <Flatpickr
                value={dataInicial}
                onChange={handleDateUpdate(setDataInicial)}
                onClose={handleDateUpdate(setDataInicial)}
                onValueUpdate={handleDateUpdate(setDataInicial)}
                onBlur={handleDateBlur(setDataInicial)}
                className="form-control bg-white text-dark"
                style={{ backgroundColor: "#ffffff", height: '3rem', cursor: 'pointer', color: '#222' }}
                options={{
                  mode: 'single',
                  locale: Portuguese,
                  dateFormat: 'd-m-Y',
                  allowInput: true,
                  parseDate: (datestr) => {
                    const m = moment(datestr, ['DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD', 'DDMMYYYY', 'D-M-YYYY', 'D/M/YYYY'])
                    return m.isValid() ? m.toDate() : new Date(datestr)
                  }
                }}
                name="dataInicial"
                placeholder="Data Inicial"
              />
            </Col>
            <Col className="mb-1" md="2" sm="6">
              <h5 className="text-bold-600" style={{ color: 'white' }}>Data Final:</h5>
              <Flatpickr
                value={dataFinal}
                onChange={handleDateUpdate(setDataFinal)}
                onClose={handleDateUpdate(setDataFinal)}
                onValueUpdate={handleDateUpdate(setDataFinal)}
                onBlur={handleDateBlur(setDataFinal)}
                className="form-control bg-white text-dark"
                style={{ backgroundColor: "#ffffff", height: '3rem', cursor: 'pointer', color: '#222' }}
                options={{
                  mode: 'single',
                  locale: Portuguese,
                  dateFormat: 'd-m-Y',
                  allowInput: true,
                  parseDate: (datestr) => {
                    const m = moment(datestr, ['DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD', 'DDMMYYYY', 'D-M-YYYY', 'D/M/YYYY'])
                    return m.isValid() ? m.toDate() : new Date(datestr)
                  }
                }}
                name="dataFinal"
                placeholder="Data Final"
              />
            </Col>
            {relatorio === 'relatorio-funcionario' && <Col className="mb-1" md="3" sm="12">
              <h5 className="text-bold-600" style={{ color: 'white' }}>Empresa Prestadora:</h5>
              <Select
                className="React"
                classNamePrefix="select"
                styles={{
                  menu: provided => ({ ...provided, zIndex: 9999 }),
                  control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                }}
                name="empresa"
                options={opcoesEmpresas}
                isSearchable
                value={opcoesEmpresas?.filter((option) => option.id === empresa)}
                getOptionLabel={(option) => option?.Descricao}
                getOptionValue={(option) => option?.id}
                onChange={e => handleChangeEmpresa(e)}
              />
            </Col>}
            <Col md="2" className="mt-1"><Button style={{ marginTop: '10px' }} color='secondary' onClick={e => handleFiltrarBtn(relatorio, dataInicial, dataFinal, empresa)}>Buscar</Button></Col>
          </Row>
        </CardBody>
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
            defaultPageSize={50}
            defaultSorted={relatorio === 'relatorio-funcionario' ? [
              {
                id: "Funcionario",
                desc: false
              },
              {
                id: "Data"
              }
            ] : []}
            noDataText="Não há relatórios para exibir"
            className="-striped -highlight"
            pageText='Página'
            ofText='de'
            rowsText='itens'
            previousText={"Anterior"}
            nextText={"Próximo"}
            data={state?.filteredData}
          />
        }
      </Card>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    empresas: state?.empresa?.empresas,
    relatorio: state?.escala?.relatorio,
    error: state?.escala?.error
  }
}

export default connect(mapStateToProps, {
  buscarEmpresas,
  buscarEscalasRelatorio
})(RelatorioEscala)