import React, { useState, useEffect } from "react"
import {
    Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, Alert
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import NumberFormat from "react-number-format"
import { formatNumberReal } from '../../../../../utility/number/index'
import { Enum_StatusContasPagamento } from "../../../../../utility/enum/Enums"
import { connect } from "react-redux"
import { validarNotaFiscal } from "@src/redux/actions/financeiro/contas-a-pagar/validarNFActions"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const ModalContasCadastrar = (props) => {
    const { data, modal, handleClose, save, empresas, clientes, listas } = props
    const [parcelaIsValid, setParcelaIsValid] = useState(true)
    const [centroIsValid, setCentroIsValid] = useState(true)
    const [naturezaIsValid, setNaturezaIsValid] = useState(true)
    const [notaIsValid, setNotaIsValid] = useState({data: true})
    const [numeroNF, setNumeroNF] = useState("")
    const [fornecedorId, setFornecedorId] = useState(null)
    const [conta, setConta] = useState({
        ContaProdutos: [],
        ContaCentrosCustos: [],
        ContaNaturezasContabeis: [],
        ContaPagamento: {
            ContaPagamentoParcela: []
        },
        ValorTotal: 0
    })
    const [isToSave, setIsToSave] = useState(false)

    const fullData = () => {
        let r
        // !data ? r = conta.Fornecedor?.id > 0 && conta.Empresa?.id > 0 && conta.NumeroNF?.length > 0 && conta.DataEmissaoNF && validContaProdutos() && conta.QtdParcela &&
        // conta.TipoParcela && (conta.IntervaloPeriodo || conta.DiaPagamento) && conta?.ContaPagamento?.ContaPagamentoParcela.length > 0 : r = conta.Fornecedor?.id > 0 && 
        // conta.Empresa?.id > 0 && conta.NumeroNF?.length > 0 && conta.DataEmissaoNF && validContaProdutos() && conta.QtdParcela && conta?.ContaPagamento?.ContaPagamentoParcela.length > 0

        
        r = conta.Fornecedor?.id > 0 && conta.Empresa?.id > 0 

        return r && (!conta.NumeroNF || notaIsValid?.data) && parcelaIsValid
    }

    const calcValorTotal = () => {
        let valorTotal = 0
        const contaAux = conta
        contaAux?.ContaProdutos?.forEach(x => { if (x.Quantidade && x.ValorUnitario) valorTotal += x.Quantidade * x.ValorUnitario })
        if (valorTotal > 0) {
            conta.ValorTotal = valorTotal
            conta.ContaPagamento.QuantidadeParcela = Number(conta.ContaPagamento.ContaPagamentoParcela.length)
            conta.ContaPagamento.ValorParcela = conta.ValorTotal / conta.ContaPagamento.QuantidadeParcela
            conta?.ContaPagamento?.ContaPagamentoParcela?.forEach(x => { x.ValorParcela = conta.ContaPagamento.ValorParcela; x.ValorAPagar = conta.ContaPagamento.ValorParcela })

            setConta({ ...conta, ValorTotal: conta.ValorTotal, ContaPagamento: conta.ContaPagamento })
        }
    }

    const tipoParcelaOptions = [
        { label: "Fixo", value: "Fixo" },
        { label: "Período", value: "Periodo" }
    ]

    const gerarParcelas = () => {
        conta.ContaPagamento.ContaPagamentoParcela = []
        const dataVencimentoParcela = new Date()
        for (let i = 0; i < conta.QtdParcela; i++) {
            conta.ContaPagamento.QuantidadeParcela = Number(conta.ContaPagamento.ContaPagamentoParcela.length + 1)
            conta.ContaPagamento.ValorParcela = parseFloat((conta.ValorTotal / conta.ContaPagamento.QuantidadeParcela).toFixed(2))
            conta?.ContaPagamento?.ContaPagamentoParcela?.forEach(x => { x.ValorParcela = conta.ContaPagamento.ValorParcela; x.ValorAPagar = conta.ContaPagamento.ValorParcela })
            if (conta.TipoParcela === 'Periodo') {
                dataVencimentoParcela.setDate(dataVencimentoParcela.getDate() + conta.IntervaloPeriodo)
            } else {
                const mesParcela = (conta.DiaPagamento >= dataVencimentoParcela.getDate()) && i === 0 ? dataVencimentoParcela.getMonth() : dataVencimentoParcela.getMonth() + 1
                const diasNoMes = new Date(dataVencimentoParcela.getFullYear(), mesParcela + 1, 0).getDate()    //com o dia 0 não é 0-based para o mês
                dataVencimentoParcela.setDate(1)      //para não pular o mês
                dataVencimentoParcela.setMonth(mesParcela)
                if (conta.DiaPagamento >= diasNoMes) {
                    dataVencimentoParcela.setDate(diasNoMes)
                } else {
                    dataVencimentoParcela.setDate(conta.DiaPagamento)
                }
            }
            conta.ContaPagamento.ContaPagamentoParcela.push({ id: 0, StatusPagamento: Enum_StatusContasPagamento.Pendente, NumeroParcela: conta.ContaPagamento.QuantidadeParcela, ValorParcela: conta.ContaPagamento.ValorParcela, ValorAPagar: conta.ContaPagamento.ValorParcela, DataVencimento: dataVencimentoParcela.toISOString().split("T")[0]})
        }
        setParcelaIsValid(true)
        setConta({ ...conta, ContaPagamento: conta.ContaPagamento })
    }

    const validarNF = (nota, fornecedor) => {
        if (numeroNF === nota && fornecedorId === fornecedor) setNotaIsValid(true)
        else if (nota && fornecedor) props.validarNotaFiscal(nota, fornecedor)
    }

    useEffect(() => {
        if (modal && data) {
            if (!data.ContaProdutos) {
                data.ContaProdutos = []
                data.ContaProdutos.push({ id: 0 })
            }
            if (!data.ContaCentrosCustos || data.ContaCentrosCustos.length === 0) {
                data.ContaCentrosCustos = []
                data.ContaCentrosCustos.push({ id: 0 })
            }
            if (!data.ContaNaturezasContabeis || data.ContaNaturezasContabeis.length === 0) {
                data.ContaNaturezasContabeis = []
                data.ContaNaturezasContabeis.push({ id: 0 })
            }
            if (!data.ContaPagamento) {
                data.ValorTotal = 0
                data?.ContaProdutos?.forEach(x => { if (x.Quantidade && x.ValorUnitario) data.ValorTotal += x.Quantidade * x.ValorUnitario })
                data.ContaPagamento = {
                    ContaPagamentoParcela: []
                }
                //data.ContaPagamento.ContaPagamentoParcela.push({ id: 0, NumeroParcela: 1, ValorParcela: data.ValorTotal, ValorAPagar: data.ValorTotal, DataVencimento: null })
            }
            if (data.ContaPagamento && !data.ContaPagamento.QuantidadeParcela && data.ContaPagamento.ContaPagamentoParcela) {
                data.ContaPagamento.QuantidadeParcela = Number(data.ContaPagamento.ContaPagamentoParcela.length)
                data.ContaPagamento.ValorParcela = data.ValorTotal / data.ContaPagamento.QuantidadeParcela
            }
            data.NumeroNF = data.NumeroNF || ""
            setNumeroNF(data.NumeroNF)
            setFornecedorId(data.Fornecedor?.id)
            data.QtdParcela = data.ContaPagamento.QuantidadeParcela

            const sumCentro = data.ContaCentrosCustos.reduce((accumulator, object) => {
                return accumulator + Number(object.Valor)
            }, 0)
            setCentroIsValid(Number(sumCentro.toFixed(2)) === Number(data.ValorTotal.toFixed(2)))

            const sumNatureza = data.ContaNaturezasContabeis?.reduce((accumulator, object) => {
                return accumulator + Number(object.Valor)
            }, 0)
            setNaturezaIsValid(Number(sumNatureza.toFixed(2)) === Number(data.ValorTotal.toFixed(2)))
            setConta(data)
            setNotaIsValid({data: true})
            setIsToSave(false);
        }
    }, [modal])
  
    useEffect(() => {
      setNotaIsValid(props?.nfIsValid)
    }, [props?.nfIsValid])
  
    useEffect(() => {
      if(isToSave) {
        if (notaIsValid?.data === true) save(conta)
        else MySwal.fire({
            title: "Nota Fiscal",
            icon: "error",
            text: "Alguém incluiu a mesma nota enquanto você preenchia o cadastro, favor atualizar as informações para verificar a nota no sistema!"
          })
        setIsToSave(false);
      }
    }, [notaIsValid])

    return (
        <div>
            <span>
                <Modal
                    isOpen={modal}
                    size="lg"
                    toggle={() => handleClose()}
                    className="modal-dialog-centered"
                    backdrop={false}
                >
                    <ModalHeader
                        toggle={() => handleClose()}
                        style={{ background: '#2F4B7433' }}
                        cssModule={{ close: 'close button-close' }}
                    >
                        <h4 className="mt-1 mb-1"><b>Cadastro de contas à pagar</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="6" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Fornecedor</Label>
                                    <Select
                                        placeholder="Fornecedores"
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: conta.Fornecedor?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Fornecedor"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={listas?.fornecedores}
                                        isSearchable
                                        getOptionLabel={(option) => option?.Nome}
                                        getOptionValue={(option) => option}
                                        value={
                                            listas?.fornecedores?.filter((option) => option.id === conta?.Fornecedor?.id)
                                        }
                                        onChange={(object) => {
                                            setConta({ ...conta, Fornecedor: object })
                                            setNotaIsValid(numeroNF === conta.NumeroNF && fornecedorId === object?.id ? { data: true } : null)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Empresa Pagadora</Label>
                                    <Select
                                        placeholder="Empresas"
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
                                        getOptionValue={(option) => option?.id}
                                        value={
                                            empresas?.filter((option) => option.id === conta?.Empresa?.id)
                                        }
                                        onChange={(object) => {
                                            const empresa = object
                                            empresa.id = object.id
                                            setConta({ ...conta, Empresa: empresa })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nº Nota Fiscal</Label>
                                    <Input
                                        type="text"
                                        id="NumeroNF"
                                        name="NumeroNF"
                                        placeholder="Nº Nota Fiscal"
                                        value={conta.NumeroNF}
                                        onChange={(e) => {
                                            setConta({ ...conta, [e.target.name]: e.target.value })
                                            setNotaIsValid(numeroNF === e.target.value && fornecedorId === conta.Fornecedor?.id ? {data: true} : null)
                                        }}
                                    />
                                    {notaIsValid?.data === false &&
                                    <Alert color='danger'>
                                        <div className='alert-body'>
                                        <span className='fw-bold'>Nota já inclusa no sistema!</span>
                                        </div>
                                    </Alert>}
                                    {notaIsValid?.data === true && conta.NumeroNF &&
                                    <Alert color='success'>
                                        <div className='alert-body'>
                                        <span className='fw-bold'>Nota válida!</span>
                                        </div>
                                    </Alert>}
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Emissão Nota Fiscal</Label>
                                    <Input
                                        type="date"
                                        id="DataEmissaoNF"
                                        name="DataEmissaoNF"
                                        placeholder="Emissão Nota Fiscal"
                                        value={conta.DataEmissaoNF}
                                        onChange={(e) => setConta({ ...conta, [e.target.name]: e.target.value === "" ? null : e.target.value })}
                                    />
                                </FormGroup>
                            </Col>
                            {((conta.NumeroNF && conta.NumeroNF !== numeroNF) || (conta.Fornecedor?.id && conta.Fornecedor?.id !== fornecedorId)) && <Col md="4" className="mt-2">
                                <Button
                                    disabled={!conta.NumeroNF || !conta.Fornecedor?.id}
                                    color="secondary"
                                    className="mr-1 mb-1"
                                    onClick={e => validarNF(conta.NumeroNF, conta.Fornecedor?.id)}
                                >
                                    Validar NF
                                </Button>
                            </Col>}
                            <Col md="12" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Observações</Label>
                                    <Input
                                        type="textarea"
                                        id="Observacoes"
                                        name="Observacoes"
                                        placeholder="Observações"
                                        value={conta.Observacoes}
                                        onChange={(e) => {
                                            setConta({ ...conta, [e.target.name]: e.target.value })
                                        }}
                                        onBlur={() => setConta({ ...conta, Observacoes: conta.Observacoes?.toUpperCase() })}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <br />
                        <h5>Produtos</h5>
                        {conta?.ContaProdutos?.map((x, i) => (<Row>
                            <Col md="6" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descrição</Label>
                                    <Input style={!x.Descricao ? { borderColor: '#cc5050' } : {}}
                                        type="text"
                                        id="Descricao"
                                        name="Descricao"
                                        placeholder="Descrição"
                                        value={x.Descricao}
                                        onChange={(e) => {
                                            conta.ContaProdutos[i].Descricao = e.target.value.toUpperCase()
                                            setConta({ ...conta, ContaProdutos: conta.ContaProdutos })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            {/* <Col md="3" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CA</Label>
                                <Input
                                    type="text"
                                    id="CA"
                                    name="CA"
                                    placeholder="CA"
                                    value={x.CA}
                                    onChange={ (e) => {
                                        conta.ContaProdutos[i].CA = e.target.value
                                        setConta({ ...conta, ContaProdutos: conta.ContaProdutos })
                                    }}
                                />
                            </FormGroup>
                        </Col> */}
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Qtd.</Label>
                                    <Input style={!x.Quantidade ? { borderColor: '#cc5050' } : {}}
                                        type="number"
                                        id="Quantidade"
                                        name="Quantidade"
                                        placeholder="Qtd."
                                        value={x.Quantidade}
                                        onChange={(e) => {
                                            conta.ContaProdutos[i].Quantidade = parseInt(e.target.value)
                                            setConta({ ...conta, ContaProdutos: conta.ContaProdutos })
                                            calcValorTotal()
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Unt. (R$)</Label>
                                    <NumberFormat style={!x.ValorUnitario ? { borderColor: '#cc5050' } : {}}
                                        className="dataTable-filter mb-90 form-control"
                                        displayType="number"
                                        value={(x.ValorUnitario)}
                                        id="search-input"
                                        fixedDecimalScale
                                        decimalScale={2}
                                        placeholder="Valor Unitário"
                                        preffix="R$"
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        onValueChange={(e) => {
                                            conta.ContaProdutos[i].ValorUnitario = e.floatValue
                                            setConta({ ...conta, ContaProdutos: conta.ContaProdutos })
                                            calcValorTotal()
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            {conta.ContaProdutos.length > 1 && <Col md="1" className="mt-3">
                                <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                    conta.ContaProdutos.splice(i, 1)
                                    setConta({ ...conta, ContaProdutos: conta.ContaProdutos })
                                }}>
                                    x
                                </a>
                            </Col>}
                        </Row>))}
                        <a href='#' onClick={() => {
                            conta.ContaProdutos.push({ id: 0 })
                            setConta({ ...conta, ContaProdutos: conta.ContaProdutos })
                        }}>
                            Adicionar Produto
                        </a>
                        <br />
                        <br />
                        <br />
                        <h5>Custo Direto Cliente</h5>
                        <Row>
                            <Col md="8" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Razão Social</Label>
                                    <Select
                                        placeholder="Clientes"
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: 'hsl(0,0%,80%)' })
                                        }}
                                        name="Cliente"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={clientes}
                                        isSearchable
                                        isClearable
                                        getOptionLabel={(option) => `${option?.RazaoSocial} - ${option.Cnpj}`}
                                        getOptionValue={(option) => option}
                                        value={
                                            clientes?.filter((option) => option.id === conta?.Cliente?.id)
                                        }
                                        onChange={(object) => {
                                            setConta({ ...conta, Cliente: object })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <br />
                        <br />
                        <h5>Centros de custos</h5>
                        {conta?.ContaCentrosCustos?.map((x, i) => (<Row>
                            <Col md="6" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Centro de custo</Label>
                                    <Select
                                        placeholder="Centros de custo"
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.CentroCusto?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="CentroCusto"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={listas?.centroscusto}
                                        isSearchable
                                        getOptionLabel={(option) => option?.Descricao}
                                        getOptionValue={(option) => option}
                                        value={
                                            listas?.centroscusto?.filter((option) => option.id === x?.CentroCusto?.id)
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
                                    <NumberFormat style={!x.Valor ? { borderColor: '#cc5050' } : {}}
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
                                            conta.ContaCentrosCustos[i].Valor = e.floatValue
                                            setConta({ ...conta, ContaCentrosCustos: conta.ContaCentrosCustos })

                                            const sum = conta.ContaCentrosCustos.reduce((accumulator, object) => {
                                                return accumulator + Number(object.Valor)
                                            }, 0)
                                            setCentroIsValid(Number(sum.toFixed(2)) === Number(conta.ValorTotal.toFixed(2)))
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
                        {conta?.ContaNaturezasContabeis?.map((x, i) => (<Row>
                            <Col md="6" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Natureza contábil</Label>
                                    <Select
                                        placeholder="Naturezas contábeis"
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.NaturezaContabil?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="NaturezaContabil"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={listas?.naturezascontabeis}
                                        isSearchable
                                        getOptionLabel={(option) => option?.Descricao}
                                        getOptionValue={(option) => option}
                                        value={
                                            listas?.naturezascontabeis?.filter((option) => option.id === x?.NaturezaContabil?.id)
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
                                    <NumberFormat style={!x.Valor ? { borderColor: '#cc5050' } : {}}
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
                                            conta.ContaNaturezasContabeis[i].Valor = e.floatValue
                                            setConta({ ...conta, ContaNaturezasContabeis: conta.ContaNaturezasContabeis })

                                            const sum = conta.ContaNaturezasContabeis.reduce((accumulator, object) => {
                                                return accumulator + Number(object.Valor)
                                            }, 0)
                                            setNaturezaIsValid(Number(sum.toFixed(2)) === Number(conta.ValorTotal.toFixed(2)))
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
                        <h5>Pagamento - Valor Total: R$ {formatNumberReal(conta.ValorTotal)}</h5>
                        <br />
                        <Row>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nº de Parcelas</Label>
                                    <Input
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
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem'})
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
                                <Input style={!conta.IntervaloPeriodo ? { borderColor: '#cc5050' } : {}}
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
                                <Input
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
                                        disabled={!conta.QtdParcela || !conta.TipoParcela?.length || !conta.ContaProdutos?.length || !(conta.DiaPagamento || conta.IntervaloPeriodo) || conta.DiaPagamento > 31 || conta?.ContaPagamento?.ContaPagamentoParcela?.find(x => x.StatusPagamento !== Enum_StatusContasPagamento.Pendente)}
                                        className="mt-2"
                                        onClick={e => gerarParcelas()}
                                    >
                                        Gerar Parcelas
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                            {!conta.ContaProdutos?.length &&
                            <Alert color='danger'>
                                <div className='alert-body'>
                                <span className='fw-bold'>Antes de gerar parcelas é necessário incluir produtos!</span>
                                </div>
                            </Alert>}
                            
                        </Row>
                        {conta?.ContaPagamento?.ContaPagamentoParcela?.map((x, i) => (<Row>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nº Parcela</Label>
                                    <Input style={!x.NumeroParcela ? { borderColor: '#cc5050' } : {}}
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
                                    <Input style={!x.ValorParcela ? { borderColor: '#cc5050' } : {}}
                                        type="number"
                                        id="ValorParcela"
                                        name="ValorParcela"
                                        placeholder="Valor Parcela"
                                        value={x.ValorParcela}
                                        disabled={x.StatusPagamento !== Enum_StatusContasPagamento.Pendente}
                                        onChange={(e) => {
                                            conta.ContaPagamento.ContaPagamentoParcela[i].ValorParcela = e.target.value
                                            conta.ContaPagamento.ContaPagamentoParcela[i].ValorAPagar = e.target.value
                                            setConta({ ...conta, ContaPagamento: conta.ContaPagamento })

                                            const sum = conta.ContaPagamento.ContaPagamentoParcela.reduce((accumulator, object) => {
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
                                    <Input style={!x.DataVencimento ? { borderColor: '#cc5050' } : {}}
                                        type="date"
                                        id="DataVencimento"
                                        name="DataVencimento"
                                        placeholder="Data Vencimento"
                                        value={x.DataVencimento}
                                        disabled={x.StatusPagamento !== Enum_StatusContasPagamento.Pendente}
                                        onChange={(e) => {
                                            conta.ContaPagamento.ContaPagamentoParcela[i].DataVencimento = e.target.value === "" ? null : e.target.value
                                            setConta({ ...conta, ContaPagamento: conta.ContaPagamento })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            {/* {conta.ContaPagamento.ContaPagamentoParcela.length > 1 && <Col md="1" className="mt-3">
                            <a href='#' style={{color: '#b10000'}} onClick={() => {
                                conta.ContaPagamento.ContaPagamentoParcela.splice(i, 1)
                                conta.ContaPagamento.QuantidadeParcela = Number(conta.ContaPagamento.ContaPagamentoParcela.length)
                                conta.ContaPagamento.ValorParcela = conta.ValorTotal / conta.ContaPagamento.QuantidadeParcela
                                conta?.ContaPagamento?.ContaPagamentoParcela?.forEach(x => { x.ValorParcela = conta.ContaPagamento.ValorParcela; x.ValorAPagar = conta.ContaPagamento.ValorParcela })
                                setConta({ ...conta, ContaPagamento: conta.ContaPagamento})
                            }}>
                                x
                            </a>
                        </Col>} */}
                        </Row>))}
                        {/* <a href='#' onClick={() => {
                        conta.ContaPagamento.QuantidadeParcela = Number(conta.ContaPagamento.ContaPagamentoParcela.length + 1)
                        conta.ContaPagamento.ValorParcela = conta.ValorTotal / conta.ContaPagamento.QuantidadeParcela
                        conta?.ContaPagamento?.ContaPagamentoParcela?.forEach(x => { x.ValorParcela = conta.ContaPagamento.ValorParcela; x.ValorAPagar = conta.ContaPagamento.ValorParcela })
                        conta.ContaPagamento.ContaPagamentoParcela.push({ id: 0, NumeroParcela: conta.ContaPagamento.QuantidadeParcela, ValorParcela: conta.ContaPagamento.ValorParcela, ValorAPagar: conta.ContaPagamento.ValorParcela, DataVencimento: null })
                        setConta({ ...conta, ContaPagamento: conta.ContaPagamento})
                    }}>
                        Adicionar Parcela
                    </a> */}
                    </ModalBody>
                    <ModalFooter>
                        {conta.NumeroNF && !notaIsValid &&
                        <Alert color='warning'>
                            <div className='alert-body'>
                            <span className='fw-bold'>Favor validar o nº da nota!</span>
                            </div>
                        </Alert>}
                        <Button.Ripple
                            disabled={!fullData()}
                            color="primary"
                            className="mr-1 mb-1"
                            onClick={e => {
                                if (conta?.id || !conta.NumeroNF) save(conta);
                                else {
                                    setIsToSave(true);
                                    validarNF(conta.NumeroNF, conta.Fornecedor?.id)
                                }
                            }}
                        >
                            Salvar
                        </Button.Ripple>
                    </ModalFooter>
                </Modal>
            </span>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      nfIsValid: state?.contas?.nfIsValid
    }
  }

export default connect(mapStateToProps, {
  validarNotaFiscal
})(ModalContasCadastrar)

