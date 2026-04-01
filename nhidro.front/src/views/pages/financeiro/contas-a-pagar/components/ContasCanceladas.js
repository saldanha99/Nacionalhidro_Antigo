import React, { useState, useEffect } from 'react'
import useEffectAfterMount from "@src/hooks/useEffectAfterMount"
import { connect } from "react-redux"
import { Card, CardHeader, CardBody, Input, Row, Col } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import { buscarContasCanceladas } from "@src/redux/actions/financeiro/contas-a-pagar/buscarContasActions"
import { formatNumberReal } from '../../../../../utility/number/index'
import moment from "moment"
import { convertDateFormat, dateSort } from '../../../../../utility/date/date'
moment.locale("pt-br")

const ContasCanceladas = (props) => {
  const configDataTableSkeleton = {
    nameRows: [
      { name: 'ID' },
      { name: 'EMPRESA' },
      { name: 'FORNECEDOR' },
      { name: 'Nº NF' },
      { name: 'EMISSÃO NF' },
      { name: 'VALOR TOTAL(R$)' },
      { name: 'NATUREZAS CONTÁBEIS' },
      { name: 'CENTROS DE CUSTO' },
      { name: 'DATA DE ENTRADA' },
      { name: '"MOTIVO CANCELAMENTO"' },
      { name: 'USUÁRIO' }
    ],
    quantityItensOnRow: 10
  } 
  const { selectedTipo } = props
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [searchTextValue, setSearchTextValue] = useState('')
  const [state, setState] = useState({})

  const handleFilter = (e) => {
    setSearchTextValue(e?.target?.value)  
  }
    
  const executeFilterData = (value) => {
    if (value.length) {
      let updatedData = []
      updatedData = state.data.filter((item) => {

        const startsWith =
        item?.StatusPagamento?.toUpperCase().match(value.toUpperCase())  ||
        item?.Fornecedor?.Nome?.toUpperCase().match(value.toUpperCase())  ||
        item?.NumeroNF?.toUpperCase().match(value.toUpperCase())  ||
        moment(item.DataEmissaoNF).utc().format("DD/MM/YYYY").startsWith(value) ||
        item?.Empresa?.Descricao?.toUpperCase().match(value.toUpperCase())  ||
        item?.ContaNaturezasContabeis.some(x => x.NaturezaContabil?.Descricao?.toUpperCase().match(value.toUpperCase())) ||
        item?.ContaCentrosCustos.some(x => x.CentroCusto?.Descricao?.toUpperCase().match(value.toUpperCase())) ||
        moment(item.createdAt).utc().format("DD/MM/YYYY").startsWith(value) ||
        item?.id?.toString().match(value.toUpperCase())  ||
        formatNumberReal(item?.ValorTotal).startsWith(value)

        if (startsWith) {
          return startsWith
        } else return null
      })

      return updatedData
    }
  }
    
  useEffect(() => {
    if (selectedTipo === 'Cancelado') {
      props.buscarContasCanceladas()
      setLoadingSkeleton(true)
    }
  }, [selectedTipo])
  
  useEffectAfterMount(() => {
    if (searchTextValue.length) {
      setFilteredData(executeFilterData(searchTextValue))
    } else {
      setFilteredData(state?.data)
    }
  }, [searchTextValue])

  useEffectAfterMount(() => {
    props?.listaCanceladas.forEach(value => {
      value.NaturezaContabil = ''
      value.CentroCusto = ''
      value?.ContaNaturezasContabeis?.map(item => { value.NaturezaContabil += (item.NaturezaContabil ? `${item.NaturezaContabil?.Descricao}; ` : '') })
      value?.ContaCentrosCustos?.map(item => { value.CentroCusto += (item.CentroCusto ? `${item.CentroCusto?.Descricao}; ` : '') }),
      value.DataEmissaoNF = moment(value.DataEmissaoNF).local().format("DD/MM/YYYY"),
      value.DataEntrada = moment(value.createdAt).local().format("DD/MM/YYYY")
      value.Id = value.id
    })
    setState({...state, data: props?.listaCanceladas})
    setFilteredData(props?.listaCanceladas)
    setLoadingSkeleton(false)
  }, [props?.listaCanceladas])

  return (
        <Card>
          <CardHeader>
              <div><h3 className="font-weight-bolder">Procurar</h3></div>
          </CardHeader>
          <CardBody>
              <Row>
                  <Col md="6">
                      <Input
                          className="form-control"
                          type="text"
                          id="search-input"
                          placeholder="Procurar"
                          name="searchTextValue"
                          value={searchTextValue}
                          onChange={handleFilter}
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
                accessor: "Id",
                width: 80,
                filterAll: true,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Id"] })
              },
              {
                Header: "EMPRESA",
                id: "Empresa",
                accessor: (value) => value.Empresa.Descricao || '-',
                filterAll: true,
                width: 180,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Empresa"] })
              },
              {
                Header: "FORNECEDOR",
                id: "Fornecedor",
                accessor: (value) => value.Fornecedor.Nome,
                filterAll: true,
                width: 180,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Fornecedor"] })
              },
              {
                Header: "Nº NF",
                accessor: "NumeroNF",
                filterAll: true,
                width: 80,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NumeroNF"] })
              },
              {
                Header: "EMISSÃO NF",
                id: "DataEmissaoNF",
                accessor: "DataEmissaoNF",
                filterAll: true,
                width: 150,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEmissaoNF"] }),
                sortType: 'datetime',
                sortMethod: (a, b) => {
                  const convertedB = convertDateFormat(b);
                  const convertedA = convertDateFormat(a);
            
                  return dateSort(convertedA, convertedB);
                }
              },
              {
                Header: "VALOR TOTAL(R$)",
                id: "ValorTotal",
                accessor: (value) => value.ValorTotal?.toFixed(2) || '-',
                filterAll: true,
                width: 150,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["ValorTotal"] })
              },
              {
                Header: "NATUREZAS CONTÁBEIS",
                id: "NaturezaContabil",
                accessor: (value) => value.NaturezaContabil || '-',
                filterAll: true,
                width: 180,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["NaturezaContabil"] })
              },
              {
                Header: "CENTROS DE CUSTO",
                id: "CentroCusto",
                accessor: (value) => value.CentroCusto || '-',
                filterAll: true,
                width: 180,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["CentroCusto"] })
              },
              {
                Header: "DATA DE ENTRADA",
                id: "DataEntrada",
                accessor: "DataEntrada",
                filterAll: true,
                width: 150,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["DataEntrada"] }),
                sortType: 'datetime',
                sortMethod: (a, b) => {
                  const convertedB = convertDateFormat(b);
                  const convertedA = convertDateFormat(a);
            
                  return dateSort(convertedA, convertedB);
                }
              },
              {
                Header: "MOTIVO CANCELAMENTO",
                id: "MotivoCancelamento",
                accessor: (value) => value.MotivoCancelamento || '-',
                filterAll: true,
                width: 200,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["MotivoCancelamento"] })
              },
              {
                Header: "USUÁRIO",
                id: "Usuario",
                accessor: (value) => value?.UsuarioLancamento?.username,
                filterAll: true,
                width: 150,
                filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["Usuario"] })
              }
            ]}
            defaultPageSize={10}
            noDataComponent="Ainda não existem"
            previousText={"Anterior"}
            nextText={"Próximo"}
            noDataText="Não há contas para exibir"
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
    listaCanceladas: state?.contas?.listaCanceladas,
    error: state?.contas?.error
  }
}

export default connect(mapStateToProps, {
  buscarContasCanceladas
})(ContasCanceladas)