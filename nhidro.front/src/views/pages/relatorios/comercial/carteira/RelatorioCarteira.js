import React, { useState, useEffect, useRef } from 'react'
import { Card, Row, Col, Button, CardBody } from 'reactstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import { matchSorter } from "match-sorter"
import qs from "qs"
import api from "@src/services/api"
import SkeletonDataTable from '../../../components/SkeletonDataTable'
import Flatpickr from "react-flatpickr"
import "../proposta/light.css"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese } from "flatpickr/dist/l10n/pt.js"
import Select from "react-select"
import { exportToExcel, normalize, rotuloVendedor } from '../../../../../utility/Utils'
import { formatNumberReal } from "../../../../../utility/number"
import { Enum_StatusPropostas } from '../../../../../utility/enum/Enums'
import moment from "moment"
moment.locale("pt-br")

const SEM_VENDEDOR = 'SEM VENDEDOR'

// Carteira de clientes por vendedor (pedido da diretoria, 30/10/2026): cada cliente
// aparece com o vendedor do cadastro, e as propostas do período entram na conta dele
const montarCarteira = (clientes, propostas) => {
  // uma proposta por número: vale a última revisão
  const ultimas = {}
  propostas.forEach(p => {
    const atual = ultimas[p.Codigo]
    if (!atual || (p.Revisao || 0) > (atual.Revisao || 0)) ultimas[p.Codigo] = p
  })

  const porCliente = {}
  Object.values(ultimas).forEach(p => {
    const id = p.Cliente?.id
    if (!id) return
    const item = porCliente[id] || { propostas: 0, aprovadas: 0, valorAprovado: 0, valorAberto: 0, ultima: null }
    item.propostas += 1
    if (p.Status === Enum_StatusPropostas.Aprovada) {
      item.aprovadas += 1
      item.valorAprovado += Number(p.Valor) || 0
    }
    if (p.Status === Enum_StatusPropostas.Aberta) item.valorAberto += Number(p.Valor) || 0
    if (!item.ultima || moment(p.DataProposta).isAfter(item.ultima)) item.ultima = p.DataProposta
    porCliente[id] = item
  })

  return clientes.map(c => {
    const item = porCliente[c.id] || { propostas: 0, aprovadas: 0, valorAprovado: 0, valorAberto: 0, ultima: null }
    return {
      CodigoVendedor: c.Vendedor?.CodigoVendedor || '-',
      Vendedor: c.Vendedor ? c.Vendedor.username : SEM_VENDEDOR,
      VendedorId: c.Vendedor?.id || 0,
      Cliente: c.RazaoSocial,
      NomeFantasia: c.NomeFantasia || '-',
      Documento: c.Cnpj || c.Cpf || '-',
      Cidade: c.Cidade ? `${c.Cidade}${c.EstadoSigla ? `/${c.EstadoSigla}` : ''}` : '-',
      Propostas: item.propostas,
      Aprovadas: item.aprovadas,
      ValorAprovado: item.valorAprovado,
      ValorAberto: item.valorAberto,
      UltimaProposta: item.ultima ? moment(item.ultima).format('DD/MM/YYYY') : '-'
    }
  })
}

const resumirPorVendedor = (linhas) => {
  const grupos = {}
  linhas.forEach(l => {
    const chave = l.VendedorId
    const g = grupos[chave] || { VendedorId: l.VendedorId, CodigoVendedor: l.CodigoVendedor, Vendedor: l.Vendedor, Clientes: 0, ClientesComProposta: 0, Propostas: 0, Aprovadas: 0, ValorAprovado: 0, ValorAberto: 0 }
    g.Clientes += 1
    if (l.Propostas > 0) g.ClientesComProposta += 1
    g.Propostas += l.Propostas
    g.Aprovadas += l.Aprovadas
    g.ValorAprovado += l.ValorAprovado
    g.ValorAberto += l.ValorAberto
    grupos[chave] = g
  })
  // sem vendedor por último, para chamar atenção no fim da lista
  return Object.values(grupos).sort((a, b) => {
    if (a.Vendedor === SEM_VENDEDOR) return 1
    if (b.Vendedor === SEM_VENDEDOR) return -1
    const ordem = (g) => (g.CodigoVendedor !== "-" ? `0${g.CodigoVendedor}` : `1${g.Vendedor}`)
    return ordem(a).localeCompare(ordem(b))
  })
}

// Painel comercial (pedido da Lucielle, 30/10): desempenho de quem fez a proposta no
// período. Fechada = aprovada; não efetivada = reprovada ou cancelada; aguardando
// retorno = em aberto e já enviada ao cliente; em elaboração = em aberto e não enviada
const painelPorVendedor = (propostas) => {
  const ultimas = {}
  propostas.forEach(p => {
    const atual = ultimas[p.Codigo]
    if (!atual || (p.Revisao || 0) > (atual.Revisao || 0)) ultimas[p.Codigo] = p
  })

  const grupos = {}
  Object.values(ultimas).forEach(p => {
    const id = p.Usuario?.id || 0
    const g = grupos[id] || {
      VendedorId: id, CodigoVendedor: p.Usuario?.CodigoVendedor || '-', Vendedor: p.Usuario?.username || SEM_VENDEDOR,
      Feitas: 0, Clientes: new Set(), Fechadas: 0, NaoEfetivadas: 0, Aguardando: 0, EmElaboracao: 0,
      ValorFechado: 0, ValorAguardando: 0
    }
    const valor = Number(p.Valor) || 0
    g.Feitas += 1
    if (p.Cliente?.id) g.Clientes.add(p.Cliente.id)
    if (p.Status === Enum_StatusPropostas.Aprovada) {
      g.Fechadas += 1
      g.ValorFechado += valor
    } else if (p.Status === Enum_StatusPropostas.Reprovada || p.Status === Enum_StatusPropostas.Cancelado) {
      g.NaoEfetivadas += 1
    } else if (p.Status === Enum_StatusPropostas.Aberta && p.Enviada) {
      g.Aguardando += 1
      g.ValorAguardando += valor
    } else if (p.Status === Enum_StatusPropostas.Aberta) {
      g.EmElaboracao += 1
    }
    grupos[id] = g
  })

  return Object.values(grupos)
    .map(g => ({ ...g, Clientes: g.Clientes.size, Conversao: g.Feitas ? Math.round((g.Fechadas / g.Feitas) * 100) : 0 }))
    .sort((a, b) => {
      if (a.Vendedor === SEM_VENDEDOR) return 1
      if (b.Vendedor === SEM_VENDEDOR) return -1
      const ordem = (g) => (g.CodigoVendedor !== "-" ? `0${g.CodigoVendedor}` : `1${g.Vendedor}`)
      return ordem(a).localeCompare(ordem(b))
    })
}

const somarPainel = (linhas) => {
  const t = { CodigoVendedor: '', Vendedor: 'TOTAL', Feitas: 0, Clientes: 0, Fechadas: 0, NaoEfetivadas: 0, Aguardando: 0, EmElaboracao: 0, ValorFechado: 0, ValorAguardando: 0 }
  linhas.forEach(l => {
    ['Feitas', 'Clientes', 'Fechadas', 'NaoEfetivadas', 'Aguardando', 'EmElaboracao', 'ValorFechado', 'ValorAguardando'].forEach(k => { t[k] += l[k] })
  })
  t.Conversao = t.Feitas ? Math.round((t.Fechadas / t.Feitas) * 100) : 0
  return t
}

const colunasPainel = [
  { Header: "Cód.", accessor: "CodigoVendedor", width: 70 },
  { Header: "Vendedor", accessor: "Vendedor" },
  { Header: "Propostas feitas", accessor: "Feitas" },
  { Header: "Clientes atendidos", accessor: "Clientes" },
  { Header: "Fechadas", accessor: "Fechadas" },
  { Header: "Não efetivadas", accessor: "NaoEfetivadas" },
  { Header: "Aguardando retorno", accessor: "Aguardando" },
  { Header: "Em elaboração", accessor: "EmElaboracao" },
  { Header: "Conversão (%)", id: "Conversao", accessor: (v) => `${v.Conversao}%` },
  { Header: "Valor fechado (R$)", id: "ValorFechado", accessor: (v) => formatNumberReal(v.ValorFechado) },
  { Header: "Valor aguardando (R$)", id: "ValorAguardando", accessor: (v) => formatNumberReal(v.ValorAguardando) }
]

const filtroTexto = (chave) => (filter, rows) => matchSorter(rows, filter.value, { keys: [chave] })

const colunasResumo = [
  { Header: "Cód.", accessor: "CodigoVendedor", width: 70, filterable: false },
  { Header: "Vendedor", accessor: "Vendedor", filterable: false },
  { Header: "Clientes na carteira", accessor: "Clientes", filterable: false },
  { Header: "Clientes com proposta", accessor: "ClientesComProposta", filterable: false },
  { Header: "Propostas", accessor: "Propostas", filterable: false },
  { Header: "Aprovadas", accessor: "Aprovadas", filterable: false },
  { Header: "Valor aprovado (R$)", id: "ValorAprovado", accessor: (v) => formatNumberReal(v.ValorAprovado), filterable: false },
  { Header: "Valor em aberto (R$)", id: "ValorAberto", accessor: (v) => formatNumberReal(v.ValorAberto), filterable: false }
]

const colunasClientes = [
  { Header: "Cód.", accessor: "CodigoVendedor", width: 70, filterAll: true, filterMethod: filtroTexto("CodigoVendedor") },
  { Header: "Vendedor", accessor: "Vendedor", filterAll: true, filterMethod: filtroTexto("Vendedor") },
  { Header: "Cliente", accessor: "Cliente", filterAll: true, filterMethod: filtroTexto("Cliente") },
  { Header: "Nome fantasia", accessor: "NomeFantasia", filterAll: true, filterMethod: filtroTexto("NomeFantasia") },
  { Header: "CNPJ/CPF", accessor: "Documento", filterAll: true, filterMethod: filtroTexto("Documento") },
  { Header: "Cidade", accessor: "Cidade", filterAll: true, filterMethod: filtroTexto("Cidade") },
  { Header: "Propostas", accessor: "Propostas", width: 90, filterable: false },
  { Header: "Aprovadas", accessor: "Aprovadas", width: 90, filterable: false },
  { Header: "Valor aprovado (R$)", id: "ValorAprovado", accessor: (v) => formatNumberReal(v.ValorAprovado), filterable: false },
  { Header: "Última proposta", accessor: "UltimaProposta", width: 110, filterable: false }
]

const exportar = (linhas, colunas, nome) => {
  const tabela = linhas.map(l => {
    const obj = {}
    colunas.forEach(c => {
      obj[c.Header] = typeof c.accessor === 'function' ? c.accessor(l) : l[c.accessor]
    })
    return obj
  })
  exportToExcel(tabela, `${nome}_${moment().format("YYYYMMDDHHmmss")}`)
}

const RelatorioCarteira = () => {
  const refComp = useRef(null)
  const [intervaloData, setIntervaloData] = useState([moment().startOf('year').toDate(), new Date()])
  const [carregando, setCarregando] = useState(true)
  const [clientes, setClientes] = useState([])
  const [propostas, setPropostas] = useState([])
  const [vendedor, setVendedor] = useState('todos')
  const [soComProposta, setSoComProposta] = useState(false)

  const buscarClientes = () => {
    const query = qs.stringify({ populate: ['Vendedor'], sort: 'RazaoSocial:asc' }, { encodeValuesOnly: true })
    api.get(`api/clientes?${query}`, (data) => {
      setClientes(Array.isArray(data?.data) ? normalize(data) : [])
    })
  }

  const buscarPropostas = (datas) => {
    if (!datas?.[0] || !datas?.[1]) return
    setCarregando(true)
    const query = qs.stringify({
      filters: { DataProposta: { $between: [moment(datas[0]).format('YYYY-MM-DD'), moment(datas[1]).format('YYYY-MM-DD')] } },
      populate: ['Cliente', 'Usuario']
    }, { encodeValuesOnly: true })
    api.get(`api/propostas?${query}`, (data) => {
      setPropostas(Array.isArray(data?.data) ? normalize(data) : [])
      setCarregando(false)
    })
  }

  useEffect(() => {
    buscarClientes()
    buscarPropostas(intervaloData)
  }, [])

  const linhas = montarCarteira(clientes, propostas)
  const opcoesVendedor = [
    { value: 'todos', label: 'Todos' },
    { value: 0, label: SEM_VENDEDOR },
    ...resumirPorVendedor(linhas)
      .filter(g => g.Vendedor !== SEM_VENDEDOR)
      .map(g => ({ value: g.VendedorId, label: rotuloVendedor({ username: g.Vendedor, CodigoVendedor: g.CodigoVendedor !== '-' ? g.CodigoVendedor : null }) }))
  ]
  const linhasFiltradas = linhas.filter(l => (vendedor === 'todos' || l.VendedorId === vendedor) && (!soComProposta || l.Propostas > 0))
  const resumo = resumirPorVendedor(linhasFiltradas)
  // no painel o filtro de vendedor vale para quem fez a proposta
  const painel = painelPorVendedor(propostas).filter(g => vendedor === 'todos' || g.VendedorId === vendedor)
  const totalPainel = somarPainel(painel)

  return (
    <div>
      <Row className="mt-5">
        <Col style={{ textAlign: 'right' }}>
          <Button color='secondary' onClick={() => exportar([...painel, totalPainel], colunasPainel, 'Painel_Comercial')}>
            Exportar painel
          </Button>
          {' '}
          <Button color='secondary' onClick={() => exportar(resumo, colunasResumo, 'Resumo_Carteira_Vendedores')}>
            Exportar resumo
          </Button>
          {' '}
          <Button color='primary' onClick={() => exportar(linhasFiltradas, colunasClientes, 'Carteira_Clientes_Vendedor')}>
            Exportar clientes
          </Button>
        </Col>
      </Row>
      <Card style={{ marginTop: '1%' }}>
        <CardBody style={{ backgroundColor: '#2f4b74', justifyContent: 'flex-start' }}>
          <Row>
            <Col className="mb-1" md="4" sm="12">
              <h5 className="text-bold-600" style={{ color: 'white' }}>Vendedor:</h5>
              <Select
                className="React"
                classNamePrefix="select"
                styles={{
                  menu: provided => ({ ...provided, zIndex: 9999 }),
                  control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                }}
                name="vendedor"
                options={opcoesVendedor}
                isSearchable
                value={opcoesVendedor.filter(o => o.value === vendedor)}
                onChange={e => setVendedor(e.value)}
              />
            </Col>
            <Col className="mb-1" md="3">
              <h5 className="text-bold-600" style={{ color: 'white' }}>Data das propostas:</h5>
              <Flatpickr
                value={intervaloData}
                onChange={date => setIntervaloData(date)}
                onClose={(selectedDates, dateStr, instance) => {
                  if (selectedDates.length === 1) {
                    instance.setDate([selectedDates[0], selectedDates[0]], true)
                  }
                }}
                className="form-control"
                style={{ backgroundColor: "#fff" }}
                key={Portuguese}
                options={{ mode: 'range', locale: Portuguese, dateFormat: 'd-m-Y' }}
                name="filtroData"
                placeholder="Intervalo de datas"
                ref={refComp}
              />
            </Col>
            <Col md="2" className="mt-1">
              <Button style={{ marginTop: '10px' }} color='secondary' onClick={() => buscarPropostas(intervaloData)}>Buscar</Button>
            </Col>
            <Col md="3" className="mt-2">
              <label style={{ color: 'white', marginTop: '14px' }}>
                <input type="checkbox" checked={soComProposta} onChange={e => setSoComProposta(e.target.checked)} />
                {' '}Só clientes com proposta no período
              </label>
            </Col>
          </Row>
        </CardBody>
        {carregando ? <div style={{ overflow: 'hidden' }}>
          <SkeletonDataTable configDataTableSkeleton={{ nameRows: colunasClientes.map(c => ({ name: c.Header.toUpperCase() })), quantityItensOnRow: colunasClientes.length }} />
        </div> : <>
          <h5 className="text-bold-600 mt-2 ml-1">Painel comercial: propostas do período por quem fez</h5>
          <Row className="mx-0 mb-1">
            {[
              ['Propostas feitas', totalPainel.Feitas],
              ['Fechadas', totalPainel.Fechadas],
              ['Não efetivadas', totalPainel.NaoEfetivadas],
              ['Aguardando retorno', totalPainel.Aguardando],
              ['Conversão', `${totalPainel.Conversao}%`],
              ['Valor fechado', `R$ ${formatNumberReal(totalPainel.ValorFechado)}`]
            ].map(([rotulo, valor]) => (
              <Col key={rotulo} md="2" sm="6" className="mb-1">
                <div style={{ border: '1px solid #dee2e6', borderRadius: 6, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6e6b7b' }}>{rotulo}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2f4b74' }}>{valor}</div>
                </div>
              </Col>
            ))}
          </Row>
          <ReactTable
            style={{ fontSize: 'small', textAlign: 'center' }}
            columns={colunasPainel}
            data={painel.length ? [...painel, totalPainel] : []}
            pageSize={Math.max(painel.length + 1, 1)}
            showPagination={false}
            noDataText="Nenhuma proposta no período"
            className="-striped -highlight"
          />
          <h5 className="text-bold-600 mt-2 ml-1">Carteira: clientes de cada vendedor no cadastro</h5>
          <ReactTable
            style={{ fontSize: 'small', textAlign: 'center' }}
            columns={colunasResumo}
            data={resumo}
            pageSize={Math.max(resumo.length, 1)}
            showPagination={false}
            noDataText="Nenhum cliente encontrado"
            className="-striped -highlight"
          />
          <h5 className="text-bold-600 mt-2 ml-1">Clientes ({linhasFiltradas.length})</h5>
          <ReactTable
            style={{ fontSize: 'small', textAlign: 'center' }}
            filterable
            pagination
            defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}
            columns={colunasClientes}
            defaultPageSize={20}
            noDataText="Nenhum cliente encontrado"
            className="-striped -highlight"
            pageText='Página'
            ofText='de'
            rowsText='itens'
            previousText={"Anterior"}
            nextText={"Próximo"}
            data={linhasFiltradas}
          />
        </>}
      </Card>
    </div>
  )
}

export default RelatorioCarteira
