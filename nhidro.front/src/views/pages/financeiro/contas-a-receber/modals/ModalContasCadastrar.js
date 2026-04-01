import React, { useState, useEffect } from "react"
import {
    Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, Alert
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import NumberFormat from "react-number-format"
import { formatNumberReal } from '../../../../../utility/number/index'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import moment from "moment"
moment.locale("pt-br")
import { Enum_StatusParcelaReceber, List_TiposFatura } from "../../../../../utility/enum/Enums"

const ModalContasCadastrar = (props) => {
    const { data, modal, handleClose, save, validarNota, notaIsValid, setNotaIsValid, faturamentos, buscarFaturamentos, centros, naturezas, clientes, empresas} = props

    const [isValid, setIsValid] = useState(false)
    const [parcelaIsValid, setParcelaIsValid] = useState(true)
    const [centroIsValid, setCentroIsValid] = useState(true)
    const [naturezaIsValid, setNaturezaIsValid] = useState(true)
    const [conta, setConta] = useState({
        ContaProdutos: [],
        ContaCentrosCustos: [],
        ContaNaturezasContabeis: [],
        ContaRecebimento: {
            ContaRecebimentoParcela: []
        }
    })
    const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 12));
    const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 12));

    const [search, setSearch] = useState({
        Periodo: [mesPassado, mesQuevem]
    });

    const fullData = () => {
        let r
        !data ? r = conta.Empresa?.id && conta.DataEmissao && conta.QtdParcela &&
        conta.TipoParcela && (conta.IntervaloPeriodo || conta.DiaPagamento) && conta?.ContaRecebimento?.ContaRecebimentoParcela.length > 0 : 
        r = conta.Empresa?.id && conta.DataEmissao && conta.QtdParcela && conta?.ContaRecebimento?.ContaRecebimentoParcela.length > 0

        return r
    }

    const tipoParcelaOptions = [
        { label: "Fixo", value: "Fixo" },
        { label: "Período", value: "Periodo" }
    ]

    const gerarParcelas = () => {
        conta.ContaRecebimento.ContaRecebimentoParcela = []
        const dataVencimentoParcela = new Date()
        for (let i = 0; i < conta.QtdParcela; i++) {
            conta.ContaRecebimento.QuantidadeParcela = Number(conta.ContaRecebimento.ContaRecebimentoParcela.length + 1)
            conta.ContaRecebimento.ValorParcela = conta.ValorTotal / conta.ContaRecebimento.QuantidadeParcela
            conta?.ContaRecebimento?.ContaRecebimentoParcela?.forEach(x => { x.ValorParcela = conta.ContaRecebimento.ValorParcela; x.ValorAPagar = conta.ContaRecebimento.ValorParcela })
            if (conta.TipoParcela === 'Periodo') {
                dataVencimentoParcela.setDate(dataVencimentoParcela.getDate() + conta.IntervaloPeriodo)
            } else {
                const mesParcela = (conta.DiaPagamento > dataVencimentoParcela.getDate()) && i === 0 ? dataVencimentoParcela.getMonth() : dataVencimentoParcela.getMonth() + 1
                const diasNoMes = new Date(dataVencimentoParcela.getFullYear(), mesParcela + 1, 0).getDate()    //com o dia 0 não é 0-based para o mês
                dataVencimentoParcela.setDate(1)      //para não pular o mês
                dataVencimentoParcela.setMonth(mesParcela)
                if (conta.DiaPagamento >= diasNoMes) {
                    dataVencimentoParcela.setDate(diasNoMes)
                } else {
                    dataVencimentoParcela.setDate(conta.DiaPagamento)
                }
            }
            conta.ContaRecebimento.ContaRecebimentoParcela.push({ id: 0, StatusRecebimento: Enum_StatusParcelaReceber.Pendente, NumeroParcela: conta.ContaRecebimento.QuantidadeParcela, ValorParcela: conta.ContaRecebimento.ValorParcela, ValorAPagar: conta.ContaRecebimento.ValorParcela, DataVencimento: dataVencimentoParcela.toISOString().split("T")[0]})
        }
        setParcelaIsValid(true)
        setConta({ ...conta, ContaRecebimento: conta.ContaRecebimento })
    }

    const handleInserir = () =>{
        setConta({...conta, InsercaoManual: true});
    }

    useEffect(() => {
        setSearch({Periodo: [mesPassado, mesQuevem]})
        setNotaIsValid(null)
        if (data) {
            if (!data.ContaCentrosCustos || data.ContaCentrosCustos.length === 0) {
                data.ContaCentrosCustos = []
                data.ContaCentrosCustos.push({ id: 0 })
            }
            if (!data.ContaNaturezasContabeis || data.ContaNaturezasContabeis.length === 0) {
                data.ContaNaturezasContabeis = []
                data.ContaNaturezasContabeis.push({ id: 0 })
            }
            if (!data.ContaRecebimento) {
                data.ContaRecebimento = {
                    ContaRecebimentoParcela: []
                }
            }
            data.QtdParcela = data.ContaRecebimento.QuantidadeParcela
            setConta(data)
        }
    }, [modal])

    useEffect(() => {
        setIsValid(fullData())
    }, [conta])

    useEffect(() => {
        buscarFaturamentos(search)
    }, [search])


    return (
        <div>
            <span>
                <Modal
                    isOpen={modal}
                    size="lg"
                    toggle={() => handleClose()}
                    className="modal-dialog-centered"
                    backdrop={false}>
                    <ModalHeader
                        toggle={() => handleClose()}
                        style={{ background: '#2F4B7433' }}
                        cssModule={{ close: 'close button-close' }}>
                        <h4 className="mt-1 mb-1"><b>Contas à receber</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        {!conta.id && !conta.InsercaoManual && <Row>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nota</Label>
                                    <Select
                                        placeholder="Nota"
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                        }}
                                        name="Faturamento"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={faturamentos}
                                        isSearchable
                                        getOptionLabel={(option) => `${option.TipoFatura} - ${option?.Nota}`}
                                        getOptionValue={(option) => option}
                                        value={
                                            faturamentos?.filter((option) => option.id === conta.Faturamento?.id)
                                        }
                                        onChange={(object) => {
                                            const valor_icms = object.TipoFatura === 'CTE' ? object.ValorRateado * (object.DadosFaturamento?.icms_aliquota || 0)/100 : 0

                                            const centros_custo = []
                                            const naturezas_contabil = []

                                            object.Medicao?.Ordens?.forEach((ordem) => {
                                                const veiculo = ordem.Escala?.EscalaVeiculos[0]?.Veiculo
                                                const centro = centros.find(x => x.Descricao.includes(veiculo?.Placa))

                                                const porcentagem = object.TipoFatura === 'CTE' ? 100 : object.TipoFatura === 'RL' ? object.Medicao.PorcentagemRL : 100 - object.Medicao.PorcentagemRL
                                                const valor_rateado = (ordem.PrecificacaoValorTotal || 0) * (porcentagem / 100);
                                                centros_custo.push({id: 0, CentroCusto: centro, Valor: valor_rateado})
                                                naturezas_contabil.push({id: 0, NaturezaContabil: ordem.Equipamento?.Natureza, Valor: valor_rateado})
                                            })
                                            const conta = {
                                                Empresa: object.Empresa,
                                                Cliente: object.Cliente,
                                                DataVencimento: object.DataVencimento ? moment(object.DataVencimento).format('YYYY-MM-DD') : null,
                                                Faturamento: object,
                                                InsercaoManual: false,
                                                Nota: object.Nota,
                                                TipoFatura: object.TipoFatura,
                                                DataEmissao: moment(object.DataEmissao).add(3, 'hours').format('YYYY-MM-DD'),
                                                ValorIss: object.ValorIss,
                                                ValorInss: object.ValorInss,
                                                ValorPis: object.ValorPis,
                                                ValorCofins: object.ValorCofins,
                                                ValorIr: object.ValorIr,
                                                ValorCsll: object.ValorCsll,
                                                ValorIcms: valor_icms,
                                                ValorBruto: object.ValorRateado || 0,
                                                ValorTotal: object.TipoFatura === 'RL' ? object.ValorRateado : object.TipoFatura === 'CTE' ? 
                                                    object.ValorRateado - valor_icms :
                                                    object.ValorRateado - (object.ValorInss || 0) - (object.ValorIss || 0) - (object.ValorCofins || 0) - (object.ValorCsll || 0) - (object.ValorIr || 0) - (object.ValorPis || 0),
                                                ContaCentrosCustos: centros_custo,
                                                ContaNaturezasContabeis: naturezas_contabil,
                                                ContaRecebimento: {ContaRecebimentoParcela: []},
                                                QtdParcela: '',
                                                TipoParcela: null,
                                                DiaPagamento: null,
                                                IntervaloPeriodo: null
                                            }
                                            setConta(conta)
                                        }}
                                    />
                                </FormGroup>
                            </Col> 
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cliente</Label>
                                    <Select
                                        placeholder="Cliente"
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                        }}
                                        name="Fornecedor"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={clientes}
                                        isSearchable
                                        isClearable
                                        getOptionLabel={(option) => option?.RazaoSocial}
                                        getOptionValue={(option) => option}
                                        value={
                                            clientes?.filter((option) => option.id === search?.Cliente?.id)
                                        }
                                        onChange={(object) => {
                                            setSearch({ ...search, Cliente: object })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <div>
                                <h4 style={{fontSize:"0.7rem"}} className="font-weight-bolder">Período</h4>
                                </div>
                                <Flatpickr
                                    value={search.Periodo}
                                    onChange={(date) => setSearch({...search, Periodo: date })}
                                    onClose={(selectedDates, dateStr, instance) => {
                                        if (selectedDates.length === 1) {
                                        instance.setDate([selectedDates[0], selectedDates[0]], true);
                                        }
                                    }}
                                    className="form-control"
                                    key={Portuguese}
                                    options={{
                                        mode: "range",
                                        locale: Portuguese,
                                        dateFormat: "d-m-Y",
                                    }}
                                    name="filtroData"
                                    placeholder="Intervalo de datas"
                                    //ref={refComp}
                                />
                            </Col>
                        </Row>}
                        {((!conta.id && !conta.InsercaoManual) && (!conta.Faturamento || !conta.Faturamento.id)) && (
                            <>
                                <a href='#' onClick={() => { handleInserir()}}>
                                    Inserir recebimento manual
                                </a>
                                <br />
                                <br />
                            </>
                        )}
                        {(conta.InsercaoManual || conta.Faturamento?.id || conta.id) && <>
                        <hr/>
                            <Row>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Número da Nota</Label>
                                        {/* <Input style={!conta.Nota || !notaIsValid ? { borderColor: '#cc5050' } : {}} */}
                                        <Input style={!conta.Nota ? { borderColor: '#cc5050' } : {}}
                                        type="text"
                                            id="Nota"
                                            name="Nota"
                                            placeholder="Nº Nota"
                                            disabled={!conta.InsercaoManual}
                                            value={conta.Nota}
                                            onChange={(e) => {setConta({...conta, [e.target.name]: e.target.value})}}
                                            onBlur={e => { 
                                                validarNota(e.target.value, conta.Empresa?.id, conta.TipoFatura) 
                                            }}
                                        />
                                        {/* {!notaIsValid && 
                                        <Alert color='danger'>
                                            <div className='alert-body'>
                                            <span className='fw-bold'>Nota já inclusa no sistema!</span>
                                            </div>
                                        </Alert>} */}
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Tipo Fatura</Label>
                                        {conta.InsercaoManual ? <Select
                                            placeholder="Selecione..."
                                            className="React"
                                            classNamePrefix="select"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 9999 }),
                                                control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: conta.TipoFatura ? 'hsl(0,0%,80%)' : '#cc5050' })
                                            }}
                                            name="TipoFatura"
                                            noOptionsMessage={() => 'Sem registro!'}
                                            options={List_TiposFatura}
                                            isSearchable
                                            value={
                                                List_TiposFatura?.filter((option) => option.value === conta?.TipoFatura)
                                            }
                                            onChange={(object) => {
                                                setConta({ ...conta, TipoFatura: object.value })
                                                validarNota(conta.Nota, conta.Empresa?.id, object.value) 
                                            }}
                                        /> : <Input
                                            type="text"
                                            id="TipoFatura"
                                            name="TipoFatura"
                                            placeholder="Tipo Fatura"
                                            disabled
                                            value={conta?.TipoFatura}
                                            onChange={() => {}}
                                        />}
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Empresa</Label>
                                        {conta.InsercaoManual ? <Select
                                            placeholder="Selecione..."
                                            className="React"
                                            classNamePrefix="select"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 9999 }),
                                                control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: conta.Empresa?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                            }}
                                            name="Empresa"
                                            noOptionsMessage={() => 'Sem registro!'}
                                            options={empresas}
                                            isSearchable
                                            getOptionLabel={(option) => option?.Descricao}
                                            getOptionValue={(option) => option}
                                            value={
                                                empresas?.filter((option) => option.id === conta?.Empresa?.id)
                                            }
                                            onChange={(object) => {
                                                setConta({ ...conta, Empresa: object })
                                                validarNota(conta.Nota, object?.id, conta.TipoFatura) 
                                            }}
                                        /> : <Input
                                            type="text"
                                            id="empresa"
                                            name="empresa"
                                            value={conta.Empresa?.Descricao}
                                            disabled
                                        />}
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cliente</Label>
                                        {conta.InsercaoManual ? <Select
                                            placeholder="Cliente"
                                            className="React"
                                            classNamePrefix="select"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 9999 }),
                                                control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                            }}
                                            name="Cliente"
                                            noOptionsMessage={() => 'Sem registro!'}
                                            options={clientes}
                                            isSearchable
                                            getOptionLabel={(option) => option?.RazaoSocial}
                                            getOptionValue={(option) => option}
                                            value={
                                                clientes?.filter((option) => option.id === conta?.Cliente?.id)
                                            }
                                            onChange={(object) => {
                                                setConta({ ...conta, Cliente: object })
                                            }}
                                        /> : <Input
                                            type="text"
                                            id="Cliente"
                                            name="Cliente"
                                            placeholder="Cliente"
                                            disabled
                                            value={conta.Cliente?.RazaoSocial}
                                            onChange={() => {}}
                                        />}
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Emissão Nota</Label>
                                        <Input 
                                            type="date"
                                            id="DataEmissao"
                                            name="DataEmissao"
                                            placeholder="Emissão Nota"
                                            disabled={!conta.InsercaoManual}
                                            value={conta?.DataEmissao}
                                            onChange={(e) => {setConta({...conta, [e.target.name]: e.target.value})}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Data Vencimento</Label>
                                        <Input
                                            type="date"
                                            id="DataVencimento"
                                            name="DataVencimento"
                                            placeholder="Data Vencimento"
                                            value={conta?.DataVencimento}
                                            disabled={!conta.InsercaoManual}
                                            onChange={(e) => {setConta({...conta, [e.target.name]: e.target.value})}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Bruto(R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            disabled={!conta.InsercaoManual}
                                            value={conta?.ValorBruto}
                                            id="search-input"
                                            name="ValorBruto"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ValorBruto = e.floatValue || 0
                                                setConta({ ...conta }, conta)
                                            }}/>
                                    </FormGroup>
                                </Col>
                                {conta.TipoFatura === 'CTE' && <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Imp. ICMS(R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            disabled={!conta.InsercaoManual}
                                            value={conta?.ValorIcms}
                                            id="search-input"
                                            name="ValorIcms"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ValorIcms = e.floatValue || 0
                                                setConta({ ...conta }, conta)
                                            }}/>
                                    </FormGroup>
                                </Col>}
                                {conta.TipoFatura === 'NF' && <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Imp. ISS(R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            disabled={!conta.InsercaoManual}
                                            value={conta?.ValorIss}
                                            id="search-input"
                                            name="ValorIss"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ValorIss = e.floatValue || 0
                                                setConta({ ...conta }, conta)
                                            }}/>
                                    </FormGroup>
                                </Col>}
                                {conta.TipoFatura === 'NF' && <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Imp. INSS(R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            disabled={!conta.InsercaoManual}
                                            value={conta?.ValorInss}
                                            id="search-input"
                                            name="ValorInss"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ValorInss = e.floatValue || 0
                                                setConta({ ...conta }, conta)
                                            }}/>
                                    </FormGroup>
                                </Col>}
                                {conta.TipoFatura === 'NF' && <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Imp. PIS(R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            disabled={!conta.InsercaoManual}
                                            value={conta?.ValorPis}
                                            id="search-input"
                                            name="ValorPis"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ValorPis = e.floatValue || 0
                                                setConta({ ...conta }, conta)
                                            }}/>
                                    </FormGroup>
                                </Col>}
                                {conta.TipoFatura === 'NF' && <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Imp. COFINS(R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            disabled={!conta.InsercaoManual}
                                            value={conta?.ValorCofins}
                                            id="search-input"
                                            name="ValorCofins"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ValorCofins = e.floatValue || 0
                                                setConta({ ...conta }, conta)
                                            }}/>
                                    </FormGroup>
                                </Col>}
                                {conta.TipoFatura === 'NF' && <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Imp. IR(R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            disabled={!conta.InsercaoManual}
                                            value={conta?.ValorIr}
                                            id="search-input"
                                            name="ValorIr"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ValorIr = e.floatValue || 0
                                                setConta({ ...conta }, conta)
                                            }}/>
                                    </FormGroup>
                                </Col>}
                                {conta.TipoFatura === 'NF' && <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Imp. CSLL(R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            disabled={!conta.InsercaoManual}
                                            value={conta?.ValorCsll}
                                            id="search-input"
                                            name="ValorCsll"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ValorCsll = e.floatValue || 0
                                                setConta({ ...conta }, conta)
                                            }}/>
                                    </FormGroup>
                                </Col>}
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Líquido(R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            value={conta?.ValorTotal}
                                            id="search-input"
                                            name="ValorTotal"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ValorTotal = e.floatValue || 0
                                                setConta({ ...conta }, conta)
                                            }}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <br />
                            <h5>Centros de custos</h5>
                            {conta?.ContaCentrosCustos?.map((x, i) => (
                            <Row>
                                <Col md="6" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Centro de custo</Label>
                                        <Select
                                            placeholder="Centros de custo"
                                            className="React"
                                            classNamePrefix="select"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 9999 }),
                                                control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                            }}
                                            name="CentroCusto"
                                            noOptionsMessage={() => 'Sem registro!'}
                                            options={centros}
                                            isSearchable
                                            getOptionLabel={(option) => option?.Descricao}
                                            getOptionValue={(option) => option}
                                            value={
                                                centros?.filter((option) => option.id === x?.CentroCusto?.id)
                                            }
                                            onChange={(object) => {
                                                conta.ContaCentrosCustos[i].CentroCusto = object
                                                setConta({ ...conta, ContaCentrosCustos: conta.ContaCentrosCustos })
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor(R$)</Label>
                                        <NumberFormat /* style={!x.Valor ? { borderColor: '#cc5050' } : {}} */
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            value={(x.Valor)}
                                            id="search-input"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ContaCentrosCustos[i].Valor = e.floatValue || 0
                                                setConta({ ...conta, ContaCentrosCustos: conta.ContaCentrosCustos })

                                                const sum = conta.ContaCentrosCustos.reduce((accumulator, object) => {
                                                    return accumulator + Number(object.Valor)
                                                }, 0)

                                                setCentroIsValid(Number(sum.toFixed(2)) === Number(conta.ValorBruto.toFixed(2)))
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                                {conta.ContaCentrosCustos.length > 1 && <Col md="1" className="mt-3">
                                    <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                        conta.ContaCentrosCustos.splice(i, 1)
                                        setConta({ ...conta, ContaCentrosCustos: conta.ContaCentrosCustos })
                                    }}>
                                        x
                                    </a>
                                </Col>}
                            </Row>))}
                            <a href='#' onClick={() => {
                                conta.ContaCentrosCustos.push({ id: 0 })
                                setConta({ ...conta, ContaCentrosCustos: conta.ContaCentrosCustos })
                            }}>
                                Adicionar Centro de Custo
                            </a>
                            <br />
                            <br />
                            <br />
                            <h5>Naturezas Contábeis</h5>
                            {conta?.ContaNaturezasContabeis?.map((x, i) => (
                            <Row>
                                <Col md="6" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Natureza contábil</Label>
                                        <Select
                                            placeholder="Naturezas contábeis"
                                            className="React"
                                            classNamePrefix="select"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 9999 }),
                                                control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                            }}
                                            name="NaturezaContabil"
                                            noOptionsMessage={() => 'Sem registro!'}
                                            options={naturezas}
                                            isSearchable
                                            getOptionLabel={(option) => option?.Descricao}
                                            getOptionValue={(option) => option}
                                            value={
                                                naturezas?.filter((option) => option.id === x?.NaturezaContabil?.id)
                                            }
                                            onChange={(object) => {
                                                conta.ContaNaturezasContabeis[i].NaturezaContabil = object
                                                setConta({ ...conta, ContaNaturezasContabeis: conta.ContaNaturezasContabeis })
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor(R$)</Label>
                                        <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            value={(x.Valor)}
                                            id="search-input"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ContaNaturezasContabeis[i].Valor = e.floatValue || 0
                                                setConta({ ...conta, ContaNaturezasContabeis: conta.ContaNaturezasContabeis })

                                                const sum = conta.ContaNaturezasContabeis.reduce((accumulator, object) => {
                                                    return accumulator + Number(object.Valor)
                                                }, 0)

                                                setNaturezaIsValid(Number(sum.toFixed(2)) === Number(conta.ValorBruto.toFixed(2)))
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                                {conta.ContaNaturezasContabeis.length > 1 && <Col md="1" className="mt-3">
                                    <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                        conta.ContaNaturezasContabeis.splice(i, 1)
                                        setConta({ ...conta, ContaNaturezasContabeis: conta.ContaNaturezasContabeis })
                                    }}>
                                        x
                                    </a>
                                </Col>}
                            </Row>))}
                            <a href='#' onClick={() => {
                                conta.ContaNaturezasContabeis.push({ id: 0 })
                                setConta({ ...conta, ContaNaturezasContabeis: conta.ContaNaturezasContabeis })
                            }}>
                                Adicionar Natureza Contábil
                            </a>
                            <br />
                            <br />
                            <br />
                            <h5>Recebimento - Valor Total: R$ {formatNumberReal(conta.ValorTotal)}</h5>
                            <br />
                            <Row>
                                <Col md="2" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nº de Parcelas</Label>
                                        <Input style={!conta.QtdParcela ? {borderColor: '#cc5050'} : {}}
                                            type="number"
                                            id="QtdParcela"
                                            name="QtdParcela"
                                            placeholder="Qtd Parcelas"
                                            value={conta.QtdParcela}
                                            onChange={e => setConta({ ...conta, [e.target.name]: parseInt(e.target.value) })}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Tipo Parcela</Label>
                                        <Select
                                            placeholder="Tipo Parcela"
                                            className="React"
                                            classNamePrefix="select"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 9999 }),
                                                control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: conta?.TipoParcela ? 'hsl(0,0%,80%)' : '#cc5050'})
                                            }}
                                            name="TipoParcela"
                                            options={tipoParcelaOptions}
                                            value={
                                                tipoParcelaOptions.filter((option) => option.value === conta?.TipoParcela)
                                            }
                                            onChange={(option) => {
                                                setConta({ ...conta, TipoParcela: option.value })
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                                {conta?.TipoParcela === "Periodo" ? <Col md={3} className="mt-1">
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Intervalo do período</Label>
                                    <Input style={!conta.IntervaloPeriodo ? {borderColor: '#cc5050'} : {}}
                                        type="number"
                                        id="IntervaloPeriodo"
                                        name="IntervaloPeriodo"
                                        placeholder="Periodo"
                                        value={conta.IntervaloPeriodo}
                                        onChange={e => setConta({ ...conta, [e.target.name]: parseInt(e.target.value) })}
                                    />
                                </Col> : conta?.TipoParcela &&
                                <Col md={3} className="mt-1">
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Dia do Pagamento</Label>
                                    <Input style={!conta.DiaPagamento ? {borderColor: '#cc5050'} : {}}
                                        type="number"
                                        id="DiaPagamento"
                                        name="DiaPagamento"
                                        placeholder="DiaPagamento"
                                        value={conta.DiaPagamento}
                                        onChange={e => setConta({ ...conta, [e.target.name]: parseInt(e.target.value) })}
                                    />
                                </Col>}
                                <Col md="3" className="mt-1">
                                    <FormGroup>
                                        <Button.Ripple
                                            color="primary"
                                            disabled={!conta.QtdParcela || !conta.TipoParcela?.length || !(conta.DiaPagamento || conta.IntervaloPeriodo) || conta.DiaPagamento > 31}
                                            className="mt-2"
                                            onClick={e => gerarParcelas()}>
                                            Gerar Parcelas
                                        </Button.Ripple>
                                    </FormGroup>
                                </Col>

                            </Row>
                            {conta?.ContaRecebimento?.ContaRecebimentoParcela?.map((x, i) => (<Row>
                                <Col md="2" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nº Parcela</Label>
                                        <Input 
                                            type="text"
                                            id="NumeroParcela"
                                            name="NumeroParcela"
                                            placeholder="Nº Parcela"
                                            value={x.NumeroParcela}
                                            disabled
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Parcela (R$)</Label>
                                        <NumberFormat
                                            className="mb-90 form-control"
                                            displayType="number"
                                            value={(x.ValorParcela)}
                                            id="ValorParcela"
                                            name="ValorParcela"
                                            disabled={x.StatusRecebimento !== Enum_StatusParcelaReceber.Pendente}
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor Parcela"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            onValueChange={(e) => {
                                                conta.ContaRecebimento.ContaRecebimentoParcela[i].ValorParcela = e.floatValue || 0
                                                conta.ContaRecebimento.ContaRecebimentoParcela[i].ValorAPagar = e.floatValue || 0
                                                setConta({ ...conta, ContaRecebimento: conta.ContaRecebimento })

                                                const sum = conta.ContaRecebimento.ContaRecebimentoParcela.reduce((accumulator, object) => {
                                                    return accumulator + Number(object.ValorParcela)
                                                }, 0)

                                                setParcelaIsValid(Number(sum.toFixed(2)) === Number(conta.ValorTotal.toFixed(2)))
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Vencimento</Label>
                                        <Input 
                                            type="date"
                                            id="DataVencimento"
                                            name="DataVencimento"
                                            placeholder="Data Vencimento"
                                            value={x.DataVencimento}
                                            disabled={x.StatusRecebimento !== Enum_StatusParcelaReceber.Pendente}
                                            onChange={(e) => {
                                                conta.ContaRecebimento.ContaRecebimentoParcela[i].DataVencimento = e.target.value
                                                setConta({ ...conta, ContaRecebimento: conta.ContaRecebimento })
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            ))}
                            <Row>
                                <Col md="6" className="mt-1">
                                    <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Observações</Label>
                                        <Input
                                            type="textarea"
                                            id="Observacoes"
                                            name="Observacoes"
                                            placeholder="Observações"
                                            value={conta.Observacoes}
                                            onChange={(e) => setConta({ ...conta, [e.target.name]: e.target.value.toUpperCase() })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </>}
                    </ModalBody>
                    {(conta.InsercaoManual || conta.Faturamento?.id || conta.id) && <ModalFooter>
                        <Button.Ripple
                            disabled={!isValid || !parcelaIsValid || !centroIsValid || !naturezaIsValid || !conta.Nota || !conta.TipoFatura || !conta.Empresa || !conta.Cliente || !conta.DataEmissao || !conta.ValorTotal}
                            color="primary"
                            className="mr-1 mb-1"
                            onClick={e => save(conta)} >
                            {conta.id ? 'Salvar' : 'Cadastrar'}
                        </Button.Ripple>
                    </ModalFooter>}
                </Modal>
            </span>
        </div>
    )
}

export default ModalContasCadastrar

