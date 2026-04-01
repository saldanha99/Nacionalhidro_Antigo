import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import { Enum_FormaPagamento, List_FormasPagamento } from '../../../../../utility/enum/Enums'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const tiposPix = [
    'CNPJ',
    'Email',
    'Celular',
    'Aleatório'
]

const ModalContasPagar = (props) => {
    const { data, modal, handleClose, save, corrigirConta, salvarParcela, bancos } = props
    const [conta, setConta] = useState({})
    const [pagamento, setPagamento] = useState({})
    const [parcela, setParcela] = useState({})
    const [valorPagar, setValorPagar] = useState(0)
    const [fileCheque, setFileCheque] = useState('')
    const [isValid, setIsValid] = useState(false)

    const fullData = () => {
        if (!(valorPagar === 0 && pagamento.Valor === 0) && !(pagamento.Valor && pagamento.Valor > 0 && pagamento.Valor <= valorPagar)) return false
        if (!(pagamento.EmpresaBanco && pagamento.EmpresaBanco?.id > 0)) return false
        switch (pagamento.FormaPagamento) {
            case Enum_FormaPagamento.Cheque:
                return (fileCheque || pagamento.UrlCheque) && pagamento.NumeroCheque
            case Enum_FormaPagamento.Dinheiro:
                return true
            case Enum_FormaPagamento.Pix:
                return pagamento.TipoPix && pagamento.ChavePix
            case Enum_FormaPagamento.Transferencia:
                return pagamento.Banco && pagamento.AgenciaBanco && pagamento.ContaBanco
            default:
                return true
        }
    }

    const handleCheque = (value) => {
        if (!value.includes('<img src="data:') || value === '<p><br></p>') return setState('')
        const array = value.split('<img src="data:')
        const countImages = array.length
        if (countImages > 2) {
          return setFileCheque(`<p><img src="data:${array[2]}`)
        }
        setFileCheque(value)
    }

    const adicionarObservacao = (data) => {
        MySwal.fire({
          title: "Aviso",
          icon: "info",
          text: "Adicionar Observação?",
          showCancelButton: true,
          confirmButtonText: "Sim",
          cancelButtonText: "Não",
          customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-outline-primary mr-1"
          },
          buttonsStyling: false,
          showLoaderOnConfirm: true,
          reverseButtons: true
        }).then(function (result) {
          if (result.value) {
            MySwal.fire({
              text: "Observação:",
              input: "text",
              showCancelButton: true,
              confirmButtonText: "Salvar",
              cancelButtonText: "Cancelar",
              customClass: {
                confirmButton: "btn btn-primary",
                cancelButton: "btn btn-outline-primary mr-1"
              },
              reverseButtons: true,
              preConfirm: (value) => {
                if (value) {
                  data.Observacao = value.toUpperCase()
                  save(data, fileCheque)
                }
              },
              buttonsStyling: false,
              showLoaderOnConfirm: true
            })
          } else save(data, fileCheque)
        })
      }

    useEffect(() => {
        if (data.Parcela) {
            setIsValid(false)
            setConta(data)
            const valorAPagar = Math.round((data.Parcela.ValorParcela + data.Parcela.ValorAcrescimo - data.Parcela.ValorDecrescimo) * 100) / 100 - data.Parcela.ValorPago
            setParcela(data.Parcela)
            setValorPagar(valorAPagar)

            const pagamento = {
                TipoPix: data.Parcela.TipoPix,
                ChavePix: data.Parcela.ChavePix,
                Banco: data.Parcela.Banco,
                ContaBanco: data.Parcela.ContaBanco,
                AgenciaBanco: data.Parcela.AgenciaBanco,
                Parcela: data.Parcela,
                ContaId: data.id,
                Valor: valorAPagar
            }
            setPagamento(pagamento)
        }
    }, [data])
    
    useEffect(() => {
        setIsValid(fullData())
    }, [fileCheque])
    
    useEffect(() => {
        setIsValid(fullData())
    }, [pagamento])
    
    useEffect(() => {
        if (parcela) {
            const valorAc = parcela.ValorAcrescimo ?? 0
            const valorDc = parcela.ValorDecrescimo ?? 0
            setPagamento({... pagamento, Valor: Math.round((parcela.ValorParcela + valorAc - valorDc) * 100) / 100 - parcela.ValorPago})
            setValorPagar(Math.round((parcela.ValorParcela + valorAc - valorDc) * 100) / 100 - parcela.ValorPago)
        }
    }, [parcela])

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
                    style={{background: '#2F4B7433'}}
                    cssModule={{close: 'close button-close'}}
                >
                    <h4 className="mt-1 mb-1"><b>Cadastrar pagamento</b></h4>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md="6" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Fornecedor</Label>
                                <Input
                                    type="text"
                                    id="Fornecedor"
                                    name="Fornecedor"
                                    placeholder="Fornecedor"
                                    value={conta.Fornecedor?.Nome}
                                    onChange={ (e) => {}}
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Empresa</Label>
                                    <Input
                                        type="text"
                                        id="Empresa"
                                        name="Empresa"
                                        placeholder="Empresa"
                                        value={conta.Empresa?.Descricao}
                                        onChange={ (e) => {}}
                                        disabled
                                        />
                                </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nº Nota Fiscal</Label>
                                <Input
                                    type="text"
                                    id="NumeroNF"
                                    name="NumeroNF"
                                    placeholder="Nº Nota Fiscal"
                                    value={conta.NumeroNF}
                                    disabled
                                    onChange={(e) => {}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Observações</Label>
                                <Input
                                    type="textarea"
                                    id="Observacoes"
                                    name="Observacoes"
                                    placeholder="Observações"
                                    value={conta.Observacoes}
                                    onChange={ (e) => {}}
                                    disabled
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
                                    placeholder="Vencimento"
                                    value={parcela.DataVencimento}
                                    onChange={ (e) => {}}
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Data de Pagamento</Label>
                                <Input
                                    type="date"
                                    id="DataVencimentoReal"
                                    name="DataVencimentoReal"
                                    placeholder="Data de Pagamento"
                                    value={parcela.DataVencimentoReal}
                                    onChange={ (e) => setParcela({ ...parcela, [e.target.name]: e.target.value })}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="2" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Parcela</Label>
                                <Input
                                    type="text"
                                    id="NumeroParcela"
                                    name="NumeroParcela"
                                    placeholder="Parcela"
                                    value={conta.NumeroParcela}
                                    onChange={ (e) => {}}
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor da parcela(R$)</Label>
                                <Input
                                    type="text"
                                    id="ValorParcela"
                                    name="ValorParcela"
                                    placeholder="Valor da parcela(R$)"
                                    value={parcela.ValorParcela?.toFixed(2)}
                                    onChange={ (e) => {}}
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor pago(R$)</Label>
                                <Input
                                    type="text"
                                    id="ValorPago"
                                    name="ValorPago"
                                    placeholder="Valor pago(R$)"
                                    value={parcela.ValorPago?.toFixed(2) || 0.00}
                                    onChange={ (e) => {}}
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor de acréscimo(R$)</Label>
                                <Input
                                    type="number"
                                    id="ValorAcrescimo"
                                    name="ValorAcrescimo"
                                    placeholder="Valor de acréscimo(R$)"
                                    value={parcela.ValorAcrescimo}
                                    onChange={ (e) => setParcela({ ...parcela, [e.target.name]: Number(e.target.value) ?? null })}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor de decréscimo(R$)</Label>
                                <Input
                                    type="number"
                                    id="ValorDecrescimo"
                                    name="ValorDecrescimo"
                                    placeholder="Valor de decréscimo(R$)"
                                    value={parcela.ValorDecrescimo}
                                    onChange={ (e) => setParcela({ ...parcela, [e.target.name]: Number(e.target.value) ?? null })}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor à pagar(R$)</Label>
                                <Input
                                    type="text"
                                    id="ValorAPagar"
                                    name="ValorAPagar"
                                    placeholder="Valor à pagar(R$)"
                                    value={valorPagar.toFixed(2)}
                                    onChange={ (e) => {}}
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="3" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Forma de pagamento</Label>
                                <Select
                                    placeholder="Formas pagto."
                                    className="React"
                                    classNamePrefix="select"
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 9999 }),
                                        control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: pagamento.FormaPagamento ? 'hsl(0,0%,80%)' : '#cc5050'})
                                    }}
                                    name="FormaPagamento"
                                    noOptionsMessage={() => 'Sem registro!'}
                                    options={List_FormasPagamento}
                                    isSearchable
                                    getOptionLabel={(option) => option?.label}
                                    getOptionValue={(option) => option.value}
                                    value={
                                        List_FormasPagamento.filter((option) => option.value === pagamento?.FormaPagamento)
                                    }
                                    onChange={ (object) =>  setPagamento({ ...pagamento, FormaPagamento: object.value})}
                                />
                            </FormGroup>
                        </Col>
                        {pagamento.FormaPagamento === Enum_FormaPagamento.Pix && <Col md="3" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Tipo Chave PIX</Label>
                                <Select
                                    placeholder="Tipo Chave"
                                    className="React"
                                    classNamePrefix="select"
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 9999 }),
                                        control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: pagamento.TipoPix ? 'hsl(0,0%,80%)' : '#cc5050'})
                                    }}
                                    name="TipoPix"
                                    noOptionsMessage={() => 'Sem registro!'}
                                    options={tiposPix}
                                    isSearchable
                                    getOptionLabel={(option) => option}
                                    getOptionValue={(option) => option}
                                    value={
                                        tiposPix.filter((option) => option === pagamento?.TipoPix)
                                    }
                                    onChange={ (object) =>  setPagamento({ ...pagamento, TipoPix: object})}
                                    isDisabled={true}
                                />
                            </FormGroup>
                        </Col>}
                        {pagamento.FormaPagamento === Enum_FormaPagamento.Pix && <Col md="6" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Chave PIX</Label>
                                <Input style={!pagamento.ChavePix ? {borderColor: '#cc5050'} : {}}
                                    type="text"
                                    id="ChavePix"
                                    name="ChavePix"
                                    placeholder="Chave PIX"
                                    value={pagamento.ChavePix}
                                    onChange={ (e) => setPagamento({ ...pagamento, [e.target.name]: e.target.value })}
                                    disabled
                                />
                            </FormGroup>
                        </Col>}
                        {pagamento.FormaPagamento === Enum_FormaPagamento.Boleto && <Col md="9" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Código de barras</Label>
                                <Input
                                    type="text"
                                    id="CodigoBarras"
                                    name="CodigoBarras"
                                    placeholder="Código de barras"
                                    value={pagamento.CodigoBarras}
                                    onChange={ (e) => setPagamento({ ...pagamento, [e.target.name]: e.target.value })}
                                />
                            </FormGroup>
                        </Col>}
                        {(pagamento.FormaPagamento === Enum_FormaPagamento.Transferencia || pagamento.FormaPagamento === Enum_FormaPagamento.DebitoAutomatico) && <Col md="3" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Banco</Label>
                                <Input style={!pagamento.Banco ? {borderColor: '#cc5050'} : {}}
                                    type="text"
                                    id="Banco"
                                    name="Banco"
                                    placeholder="Banco"
                                    value={pagamento.Banco}
                                    onChange={ (e) => setPagamento({ ...pagamento, [e.target.name]: e.target.value })}
                                    disabled
                                />
                            </FormGroup>
                        </Col>}
                        {(pagamento.FormaPagamento === Enum_FormaPagamento.Transferencia || pagamento.FormaPagamento === Enum_FormaPagamento.DebitoAutomatico) && <Col md="3" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Agência</Label>
                                <Input style={!pagamento.AgenciaBanco ? {borderColor: '#cc5050'} : {}}
                                    type="text"
                                    id="AgenciaBanco"
                                    name="AgenciaBanco"
                                    placeholder="Agência"
                                    value={pagamento.AgenciaBanco}
                                    onChange={ (e) => setPagamento({ ...pagamento, [e.target.name]: e.target.value })}
                                    disabled
                                />
                            </FormGroup>
                        </Col>}
                        {(pagamento.FormaPagamento === Enum_FormaPagamento.Transferencia || pagamento.FormaPagamento === Enum_FormaPagamento.DebitoAutomatico) && <Col md="3" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Conta</Label>
                                <Input style={!pagamento.ContaBanco ? {borderColor: '#cc5050'} : {}}
                                    type="text"
                                    id="ContaBanco"
                                    name="ContaBanco"
                                    placeholder="Banco"
                                    value={pagamento.ContaBanco}
                                    onChange={ (e) => setPagamento({ ...pagamento, [e.target.name]: e.target.value })}
                                    disabled
                                />
                            </FormGroup>
                        </Col>}
                        {pagamento.FormaPagamento === Enum_FormaPagamento.Cheque && <Col md="3" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nº cheque</Label>
                                <Input style={!pagamento.NumeroCheque ? {borderColor: '#cc5050'} : {}}
                                    type="text"
                                    id="NumeroCheque"
                                    name="NumeroCheque"
                                    placeholder="Nº cheque"
                                    value={pagamento.NumeroCheque}
                                    onChange={ (e) => setPagamento({ ...pagamento, [e.target.name]: e.target.value })}
                                />
                            </FormGroup>
                        </Col>}
                        {pagamento.FormaPagamento === Enum_FormaPagamento.Cheque && <Col md="6" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Importar cheque</Label>
                                <ReactQuill value={fileCheque}
                                placeholder='Cole ou carregue aqui sua imagem...'
                                modules={{
                                toolbar: [['image']]
                                }}
                                onChange={e => handleCheque(e)} />
                            </FormGroup>
                        </Col>}
                    </Row>
                    <Row>
                        <Col md="8" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Banco de saída</Label>
                                <Select
                                    placeholder="Bancos"
                                    className="React"
                                    classNamePrefix="select"
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 9999 }),
                                        control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: pagamento.EmpresaBanco ? 'hsl(0,0%,80%)' : '#cc5050'})
                                    }}
                                    name="EmpresaBanco"
                                    noOptionsMessage={() => 'Sem registro!'}
                                    options={bancos}
                                    isSearchable
                                    getOptionLabel={(option) => `${option?.Banco} - Ag: ${option?.Agencia} - CC: ${option?.Conta }`}
                                    getOptionValue={(option) => option?.id}
                                    value={
                                        bancos.filter((option) => option.id === pagamento?.EmpresaBanco?.id)
                                    }
                                    onChange={ (object) =>  setPagamento({ ...pagamento, EmpresaBanco: object})}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor do pagamento(R$)</Label>
                                <Input style={!pagamento.Valor && valorPagar > 0 ? {borderColor: '#cc5050'} : {}}
                                    type="number"
                                    id="Valor"
                                    name="Valor"
                                    placeholder="Valor do pagamento"
                                    value={pagamento.Valor}
                                    onChange={ (e) => {
                                        setPagamento({ ...pagamento, [e.target.name]: Number(e.target.value) ?? null })
                                    }}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <Row md={12} className="ml-1 mb-1">
                    <Col md={8}>
                        <Button.Ripple
                            color="primary"
                            onClick={e => {
                                corrigirConta(conta)
                            }}
                        >
                            Corrigir Conta
                        </Button.Ripple>
                    </Col>
                    <Col md={2}>
                        <Button.Ripple
                            disabled={!parcela.DataVencimentoReal}
                            color="primary"
                            onClick={e => {
                                salvarParcela(parcela)
                            }}
                        >
                            Salvar
                        </Button.Ripple>
                    </Col>
                    <Col md={2}>
                        <Button.Ripple
                            disabled={!isValid}
                            color="primary"
                            onClick={e => {
                                parcela.ValorAPagar = valorPagar
                                pagamento.Parcela = parcela
                                adicionarObservacao(pagamento)
                            }}
                        >
                            Pagar
                        </Button.Ripple>
                    </Col>
                </Row>
                </Modal>
            </span>
        </div>
    )
}

export default ModalContasPagar
  
