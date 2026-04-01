import React, { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input } from "reactstrap"
import XMLParser from 'react-xml-parser'

const ModalImportarContas = (props) => {
    const { modal, handleClose, save } = props
    const [contas, setContas] = useState([])

    const handleFileChange = (event) => {
        const contasAux = []
        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i]

            const reader = new FileReader()
            reader.onload = (function (file) { 
                return function(e) {
                    const data = e.target.result
                    const xml = new XMLParser().parseFromString(data)
                    const xmlFornecedor = xml.children[0].children[0].children.find(x => x.name === 'emit')
                    const xmlNota = xml.children[0].children[0].children.find(x => x.name === 'ide')
                    const xmlEnderecoFornecedor = xmlFornecedor.children.find(x => x.name === 'enderEmit')
                    const xmlDestinatario = xml.children[0].children[0].children.find(x => x.name === 'dest')

                    let enderecoFornecedor = ''
                    const logradouro = xmlEnderecoFornecedor.children.find(x => x.name === 'xLgr').value
                    const numero = xmlEnderecoFornecedor.children.find(x => x.name === 'nro').value
                    const bairro = xmlEnderecoFornecedor.children.find(x => x.name === 'xBairro').value
                    const cidade = xmlEnderecoFornecedor.children.find(x => x.name === 'xMun').value
                    const estado = xmlEnderecoFornecedor.children.find(x => x.name === 'UF').value
                    const telefone = xmlEnderecoFornecedor.children.find(x => x.name === 'fone').value
        
                    enderecoFornecedor = `${logradouro}, ${numero} - ${bairro} - ${cidade}/${estado}`
        
                    let valorTotal = 0
        
                    const contaProdutos = []
                    const xmlProdutos = xml.children[0].children[0].children.filter(x => x.name === 'det')
        
                    for (const item of xmlProdutos) {
                        const xmlProd = item.children.find(x => x.name === 'prod')
        
                        const produto = {
                            Descricao: xmlProd.children.find(x => x.name === 'xProd').value,
                            ValorUnitario: Number(xmlProd.children.find(x => x.name === 'vUnCom').value),
                            Quantidade: Number(xmlProd.children.find(x => x.name === 'qCom').value),
                            ValorTotal: Number(xmlProd.children.find(x => x.name === 'vProd').value)
                        }
                        valorTotal += produto.ValorTotal
                        contaProdutos.push(produto)
                    }
        
                    const conta = {
                        FileName: file.name,
                        Fornecedor: {
                            Nome: xmlFornecedor.children.find(x => x.name === 'xNome').value,
                            NomeFantasia: xmlFornecedor.children.find(x => x.name === 'xFant')?.value ?? xmlFornecedor.children.find(x => x.name === 'xNome').value,
                            CNPJ: xmlFornecedor.children.find(x => x.name === 'CNPJ').value,
                            Inscricao: xmlFornecedor.children.find(x => x.name === 'IE').value,
                            Endereco: enderecoFornecedor,
                            Telefone: telefone
                        },
                        Empresa: {
                            Descricao: xmlDestinatario.children.find(x => x.name === 'xNome').value,
                            CNPJ: xmlDestinatario.children.find(x => x.name === 'CNPJ').value,
                            InscricaoEstadual: xmlDestinatario.children.find(x => x.name === 'IE').value
                        },
                        ContaProdutos: contaProdutos,
                        ContaPagamento: {
                            QuantidadeParcela: 1,
                            ValorParcela: valorTotal,
                            ContaPagamentoParcela: [
                                {
                                    id: 0, 
                                    NumeroParcela: 1, 
                                    ValorParcela: valorTotal, 
                                    ValorAPagar: valorTotal, 
                                    DataVencimento: null
                                }
                            ]
                        },
                        ValorTotal: valorTotal,
                        NumeroNF: xmlNota.children.find(x => x.name === 'nNF').value,
                        DataEmissaoNF: new Date(xmlNota.children.find(x => x.name === 'dhEmi').value)
                    }
        
                    contasAux.push(conta)
                    setContas(contasAux)
                }
            })(file)
            reader.readAsBinaryString(file)
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
                >
                <ModalHeader  
                    toggle={() => handleClose()} 
                    style={{background: '#2F4B7433'}}
                    cssModule={{close: 'close button-close'}}
                >
                    <h4 className="mt-1 mb-1"><b>Importação de contas à pagar</b></h4>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md="8" className="mt-1">
                            <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">NF-e (XML)</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".xml"
                                    multiple
                                    onChange={event => handleFileChange(event)
                                    }
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button.Ripple
                        disabled={false}
                        color="primary"
                        className="mr-1 mb-1"
                        onClick={e => save(contas)}
                    >
                        Importar
                    </Button.Ripple>
                </ModalFooter>
                </Modal>
            </span>
        </div>
    )
}

export default ModalImportarContas
  
