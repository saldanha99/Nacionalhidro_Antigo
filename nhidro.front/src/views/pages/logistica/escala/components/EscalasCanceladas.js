import React, { useState, useEffect, useRef } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { buscarEscalas } from "@src/redux/actions/logistica/escala/buscarEscalasActions"
import { Card, CardBody, Row, Col, CardHeader } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { Enum_StatusEscalas, List_StatusOperacional } from '../../../../../utility/enum/Enums'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import moment from "moment"
moment.locale("pt-br")
import auth from "@src/services/auth"

const user = auth.getUserInfo()

const EscalasCanceladas = (props) => {
  const refComp = useRef(null)

  const configDataTableSkeleton = {
    nameRows: [
      { name: 'ID' },
      { name: 'OS' },
      { name: 'STATUS OP.' },
      { name: 'DATA' },
      { name: 'Cliente' },
      { name: 'EQUIPAMENTO' },
      { name: 'VEÍCULOS' },
      { name: 'FUNCIONÁRIOS' },
      { name: 'OBSERVAÇÕES' },
      { name: 'DATA CANCELAMENTO' },
      { name: 'MOTIVO CANCELAMENTO' }
    ],
    quantityItensOnRow: 10
  } 

  const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3))
  const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3))

  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [state, setState] = useState({})
  const [intervaloData, setIntervaloData] = useState([mesPassado, mesQuevem])

  const buscarEscalas = (intervaloData) => {
    if (intervaloData.length && intervaloData[0] && intervaloData[1]) {
      
      const dataInicial = moment(intervaloData[0]).local().format("YYYY-MM-DD")
      const dataFinal = moment(intervaloData[1]).local().format("YYYY-MM-DD")
      
      props.buscarEscalas(Enum_StatusEscalas.Cancelado, dataInicial, dataFinal)
      setLoadingSkeleton(true)
    }

  }

  const handlerFiltroData = (dateValue) => {
    setIntervaloData(dateValue)
  }
    
  useEffect(() => {
    if (selectedTipo === 'Canceladas') {
      buscarEscalas(intervaloData)
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])

  useEffectAfterMount(() => {
    setState({...state, data: props?.escalas})
    setFilteredData(props?.escalas)
    setLoadingSkeleton(false)
  }, [props?.escalas])

  useEffectAfterMount(() => {
    buscarEscalas(intervaloData)
  }, [intervaloData])

  return (
    <Card>
      <CardHeader>
          <div><h3 className="font-weight-bolder">Filtrar data</h3></div>
      </CardHeader>
      <CardBody>
        <Row className="justify-content-between">
          <Col md="3">
            <Flatpickr
              value={intervaloData}
              onChange={date => handlerFiltroData(date)}
              onClose={ (selectedDates, dateStr, instance) => {
                if (selectedDates.length === 1) {
                    instance.setDate([selectedDates[0], selectedDates[0]], true)
                }
              }}
              disabled={loadingSkeleton}
              className="form-control"
              key={Portuguese}
              options={{ mode: 'range', locale: Portuguese, dateFormat: 'd-m-Y'  }}
              name="filtroData"
              placeholder="Intervalo de datas"
              ref={refComp}
            />
          </Col>
        </Row>
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
                Header: "ID",
                accessor: 'id',
                width: 100,
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["id"] })
              },
              {
                Header: "OS",
                id: "OS",
                width: 120,
                accessor: (value) => (value.OrdemServico?.Codigo ? `${value.OrdemServico?.Codigo}/${value.OrdemServico?.Numero}` : '-'),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["OS"] })
              },
              {
                Header: "STATUS OP.",
                id: "StatusOP",
                width: 120,
                accessor: (value) => (List_StatusOperacional.find(x => x.value === value.StatusOperacao)?.label),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["OS"] })
              },
              {
                Header: "DATA",
                id: "Data",
                width: 160,
                accessor: (value) => value.Data === '-' || moment(value.Data).local().format("DD/MM/YYYY"),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Data"] })
              },
              {
                Header: "CLIENTE",
                id: "Cliente",
                accessor: (value) => value.Cliente?.RazaoSocial || '-',
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Cliente"] })
              },
              {
                Header: "EQUIPAMENTO",
                id: "Equipamento",
                accessor: (value) => value.Equipamento?.Equipamento || '-',
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Equipamento"] })
              },
              {
                Header: "VEÍCULOS",
                accessor: "VeiculosAux",
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["VeiculosAux"] })
              },
              {
                Header: "FUNCIONÁRIOS",
                accessor: "FuncionariosAux",
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["FuncionariosAux"] })
              },
              {
                Header: "OBSERVAÇÕES",
                accessor: "Observacoes",
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Observacoes"] })
              },
              {
                Header: "MOTIVO CANCELAMENTO",
                accessor: "MotivoCancelamento",
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["MotivoCancelamento"] })
              },
              {
                Header: "DATA CANCELAMENTO",
                id: "DataCancelamento",
                accessor: (value) => value.DataCancelamento === '-' || moment(value.DataCancelamento).local().format("DD/MM/YYYY"),
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataCancelamento"] })
              }
            ]}
            defaultPageSize={10}
            defaultSorted={[
              {
                id: "Codigo",
                desc: true
              }
            ]}
            noDataComponent="Ainda não existem"
            previousText={"Anterior"}
            nextText={"Próximo"}
            noDataText="Não há escalas para exibir"
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
    escalas: state?.escala?.escalas
  }
}

export default connect(mapStateToProps, {
  buscarEscalas
})(EscalasCanceladas)