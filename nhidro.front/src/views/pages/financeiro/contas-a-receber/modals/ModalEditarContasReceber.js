import React, { useState, useEffect } from "react"
import {
    Modal, ModalHeader, ModalBody, FormGroup, Button, Row, Col, Label, Input, CardBody, Card, CustomInput
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import NumberFormat from "react-number-format"
import { List_FormasPagamento } from "../../../../../utility/enum/Enums"
import moment from "moment";
moment.locale("pt-br");

const ModalEditarContasReceber = (props) => {
    const { conta, parcela, modal, handleClose, salvar, receber, corrigir } = props
    const [recebimento, setRecebimento] = useState({})
    const [valorReceber, setValorReceber] = useState(0)

    useEffect(() => {
        if (parcela) {
            parcela.ValorAReceber = parcela.ValorAReceber || parcela.ValorParcela
            parcela.ValorAReceber = parcela.ValorAReceber - parcela.ValorAcrescimo + parcela.ValorDecrescimo
            setValorReceber(parcela.ValorAReceber)
            const rec = {
                Parcela: parcela,
                Valor: parcela.ValorAReceber,
                ContaId: conta.id,
                EmpresaBanco: conta.Faturamento?.EmpresaBanco,
                DataVencimento: moment(parcela.DataVencimento).format('YYYY-MM-DD'),
                DataRecebimento: moment(parcela.DataVencimentoReal).format('YYYY-MM-DD'),
                TaxaJuros: 0
            }
            setRecebimento(rec)
            calcular_adicionais(rec)
        }
    }, [parcela])
    
    const calcular_adicionais = (recebimento) => {
        if (recebimento.Parcela) {
            const valorAc = recebimento.Parcela.ValorAcrescimo ?? 0
            const valorDc = recebimento.Parcela.ValorDecrescimo ?? 0
            let valor = recebimento.Parcela.ValorAReceber + valorAc - valorDc
            let operacao = 0
            if (recebimento.Antecipar && recebimento.TaxaJuros) {
                operacao = valor * ((recebimento.TaxaJuros || 0) / 100)
                valor -= operacao
            }
            setRecebimento({... recebimento, Valor: valor, ValorOperacao: operacao })
            setValorReceber(valor)
        }
    }

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
                        <h4 className="mt-1 mb-1"><b>Receber parcela</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        <hr/>
                            <Row>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Número da Nota</Label>
                                        <Input
                                            type="text"
                                            id="Nota"
                                            name="Nota"
                                            placeholder="Nº Nota"
                                            disabled
                                            value={conta.Nota}
                                            onChange={() => {}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Tipo Fatura</Label>
                                        <Input
                                            type="text"
                                            id="TipoFatura"
                                            name="TipoFatura"
                                            placeholder="Tipo Fatura"
                                            disabled
                                            value={conta.TipoFatura}
                                            onChange={() => {}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Empresa</Label>
                                        <Input
                                            type="text"
                                            id="Empresa"
                                            name="Empresa"
                                            placeholder="Empresa"
                                            disabled
                                            value={conta.Empresa?.Descricao}
                                            onChange={() => {}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Cliente</Label>
                                        <Input
                                            type="text"
                                            id="Cliente"
                                            name="Cliente"
                                            placeholder="Cliente"
                                            disabled
                                            value={conta.Cliente?.RazaoSocial}
                                            onChange={() => {}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Emissão Nota</Label>
                                        <Input 
                                            type="date"
                                            id="EmissãoNota"
                                            name="EmissãoNota"
                                            placeholder="Emissão Nota"
                                            disabled
                                            value={conta.DataEmissao}
                                            onChange={() => {}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Data de Vencimento</Label>
                                        <Input 
                                            type="date"
                                            id="DataVencimento"
                                            name="DataVencimento"
                                            disabled
                                            value={recebimento.DataVencimento}
                                            onChange={() => {}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Valor Total</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            value={conta.ValorTotal}
                                            id="search-input"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            disabled
                                            onValueChange={(e) => {}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Parcela</Label>
                                        <Input 
                                            type="text"
                                            id="Parcela"
                                            name="Parcela"
                                            placeholder="Parcela"
                                            disabled
                                            value={parcela?.NumeroParcela}
                                            onChange={() => {}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Valor da parcela (R$)</Label>
                                         <NumberFormat 
                                            className="dataTable-filter mb-90 form-control"
                                            displayType="number"
                                            value={parcela?.ValorParcela}
                                            id="search-input"
                                            fixedDecimalScale
                                            decimalScale={2}
                                            placeholder="Valor"
                                            preffix="R$"
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            disabled
                                            onValueChange={(e) => {}}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6" className="mt-1">
                                    <FormGroup>
                                        <Label className="font-weight-bolder">Observações</Label>
                                        <Input
                                            type="textarea"
                                            id="Observacoes"
                                            name="Observacoes"
                                            placeholder="Observações"
                                            value={conta.Observacoes}
                                            disabled
                                            onChange={() => {}}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label className="font-weight-bolder">Forma de recebimento</Label>
                                            <Select
                                                placeholder="Formas pagto."
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: recebimento.FormaPagamento ? 'hsl(0,0%,80%)' : '#cc5050'})
                                                }}
                                                name="FormaPagamento"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={List_FormasPagamento}
                                                isSearchable
                                                getOptionLabel={(option) => option?.label}
                                                getOptionValue={(option) => option.value}
                                                value={
                                                    List_FormasPagamento.filter((option) => option.value === recebimento?.FormaPagamento)
                                                }
                                                onChange={ (object) =>  setRecebimento({ ...recebimento, FormaPagamento: object.value})}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="8" className="mt-1">
                                        <FormGroup>
                                            <Label className="font-weight-bolder">Banco de Recebimento</Label>
                                            <Select
                                                placeholder="Selecione..."
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: recebimento?.EmpresaBanco?.id ? 'hsl(0,0%,80%)' : '#cc5050'})
                                                }}
                                                name="Banco"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={conta?.Empresa?.EmpresaBanco}
                                                isSearchable
                                                getOptionLabel={(option) => `Banco: ${option?.Banco} Ag: ${option.Agencia} C/C: ${option.Conta} `}
                                                getOptionValue={(option) => option}
                                                value={
                                                    conta?.Empresa?.EmpresaBanco?.filter((option) => option?.id === recebimento?.EmpresaBanco?.id)
                                                }
                                                onChange={(object) => {
                                                    setRecebimento({ ...recebimento, EmpresaBanco: object})
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label className="font-weight-bolder">Valor de acréscimo(R$)</Label>
                                             <NumberFormat 
                                                className="dataTable-filter mb-90 form-control"
                                                displayType="number"
                                                value={recebimento.Parcela?.ValorAcrescimo}
                                                id="search-input"
                                                name="valorAcrescimo"
                                                fixedDecimalScale
                                                decimalScale={2}
                                                placeholder="Valor"
                                                preffix="R$"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                onValueChange={(e) => {
                                                    recebimento.Parcela.ValorAcrescimo = e.floatValue || 0
                                                    calcular_adicionais(recebimento)
                                                }}/>
                                        </FormGroup>
                                    </Col>
                                    <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label className="font-weight-bolder">Valor de decréscimo(R$)</Label>
                                            <NumberFormat 
                                                className="dataTable-filter mb-90 form-control"
                                                displayType="number"
                                                value={recebimento.Parcela?.ValorDecrescimo}
                                                id="search-input"
                                                name="valorDecrescimo"
                                                fixedDecimalScale
                                                decimalScale={2}
                                                placeholder="Valor"
                                                preffix="R$"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                onValueChange={(e) => {
                                                    recebimento.Parcela.ValorDecrescimo = e.floatValue || 0
                                                    calcular_adicionais(recebimento)
                                                }}/>
                                        </FormGroup>
                                    </Col>
                                    <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label className="font-weight-bolder">Valor a Receber</Label>
                                            <Input
                                                type="text"
                                                id="ValorAReceber"
                                                name="ValorAReceber"
                                                placeholder="Valor a receber(R$)"
                                                value={valorReceber?.toFixed(2)}
                                                onChange={ (e) => {}}
                                                disabled
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" >
                                        <FormGroup>
                                            <Label className="font-weight-bolder">Antecipar Recebimento</Label>
                                            <CustomInput
                                                type="checkbox"
                                                id="anteciparRecebimento"
                                                name="anteciparRecebimento"
                                                className="custom-control-primary zindex-0"
                                                label=""
                                                checked={recebimento.Antecipar}
                                                onChange={(e) => setRecebimento({ ...recebimento, Antecipar: e.target.checked })}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {recebimento.Antecipar ? (
                                        <>
                                            <Col md="3" className="mt-1">
                                                <FormGroup>
                                                    <Label className="font-weight-bolder">Data de Antecipação</Label>
                                                    <Input
                                                        type="date"
                                                        id="DataRecebimento"
                                                        name="DataRecebimento"
                                                        value={recebimento.DataRecebimento}
                                                        onChange={ (e) => setRecebimento({ ...recebimento, [e.target.name]: e.target.value })}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="3" className="mt-1">
                                                <FormGroup>
                                                    <Label className="font-weight-bolder">Taxa de Juros(%)</Label>
                                                    <NumberFormat 
                                                        className="dataTable-filter mb-90 form-control"
                                                        displayType="number"
                                                        value={recebimento.TaxaJuros}
                                                        id="search-input"
                                                        name="TaxaJuros"
                                                        fixedDecimalScale
                                                        decimalScale={2}
                                                        placeholder="Taxa de juros"
                                                        preffix="R$"
                                                        decimalSeparator=","
                                                        thousandSeparator="."
                                                        onValueChange={(e) => {
                                                            recebimento.TaxaJuros = e.floatValue || 0
                                                            recebimento.ValorOperacao = valorReceber * ((recebimento.TaxaJuros || 0) / 100)
                                                            recebimento.Valor = valorReceber - recebimento.ValorOperacao
                                                            setRecebimento({ ...recebimento }, recebimento)
                                                        }}/>
                                                </FormGroup>
                                            </Col>
                                            <Col md="3" className="mt-1">
                                                <FormGroup>
                                                    <Label className="font-weight-bolder">Valor da Operação (R$)</Label>
                                                    <NumberFormat 
                                                        className="dataTable-filter mb-90 form-control"
                                                        displayType="number"
                                                        value={recebimento.ValorOperacao}
                                                        id="search-input"
                                                        name="ValorOperacao"
                                                        fixedDecimalScale
                                                        decimalScale={2}
                                                        placeholder="Valor da Operação"
                                                        preffix="R$"
                                                        decimalSeparator=","
                                                        thousandSeparator="."
                                                        disabled
                                                        onValueChange={() => {}}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="3" className="mt-1">
                                            <FormGroup>
                                                <Label className="font-weight-bolder">Valor líquido a receber </Label>
                                                <NumberFormat 
                                                    className="dataTable-filter mb-90 form-control"
                                                    displayType="number"
                                                    value={recebimento.Valor}
                                                    id="search-input"
                                                    fixedDecimalScale
                                                    decimalScale={2}
                                                    placeholder="Valor"
                                                    preffix="R$"
                                                    decimalSeparator=","
                                                    thousandSeparator="."
                                                    disabled
                                                    onValueChange={(e) => {}}
                                                />
                                            </FormGroup>
                                        </Col> 
                                        </>
                                    ):(
                                        <>
                                        <Col md="4" className="mt-1">
                                            <FormGroup>
                                                <Label className="font-weight-bolder">Data de Recebimento</Label>
                                                <Input style={!recebimento.DataRecebimento ? {borderColor: '#cc5050'} : {}}
                                                    type="date"
                                                    id="DataRecebimento"
                                                    name="DataRecebimento"
                                                    value={recebimento.DataRecebimento}
                                                    onChange={ (e) => setRecebimento({ ...recebimento, [e.target.name]: e.target.value })}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="4" className="mt-1">
                                            <FormGroup>
                                                <Label className="font-weight-bolder">Valor do recebimento(R$)</Label>
                                                <NumberFormat 
                                                    className="dataTable-filter mb-90 form-control"
                                                    displayType="number"
                                                    value={recebimento.Valor}
                                                    id="search-input"
                                                    fixedDecimalScale
                                                    decimalScale={2}
                                                    placeholder="Valor"
                                                    preffix="R$"
                                                    decimalSeparator=","
                                                    thousandSeparator="."
                                                    onValueChange={(e) => {
                                                        recebimento.Valor = e.floatValue || 0
                                                        setRecebimento({...recebimento, Valor: recebimento.Valor})
                                                    }}
                                                />
                                            </FormGroup>
                                        </Col>
                                        </>
                                    )}
                                </Row>
                            </CardBody>
                        </Card> 
                    </ModalBody>
                    <Row md={12} className="ml-1 mb-1">
                        <Col md={7}>
                            <Button.Ripple onClick={() => corrigir(conta)}>
                                Corrigir Conta
                            </Button.Ripple>
                        </Col>
                        <Col md={2}>
                            <Button.Ripple onClick={() => salvar({id: parcela.id, DataVencimentoReal: recebimento.DataRecebimento})} disabled={!recebimento.DataRecebimento}>
                                Salvar Data
                            </Button.Ripple>
                        </Col>
                        <Col md={3}>
                            <Button.Ripple onClick={() => receber(recebimento)}
                            disabled={!recebimento.FormaPagamento || ! recebimento?.EmpresaBanco?.id || !valorReceber || !recebimento.DataRecebimento}
                                color="primary">
                                Baixar Recebimento
                            </Button.Ripple>
                        </Col>
                    </Row>
                </Modal>
            </span>
        </div>
    )
}

export default ModalEditarContasReceber

