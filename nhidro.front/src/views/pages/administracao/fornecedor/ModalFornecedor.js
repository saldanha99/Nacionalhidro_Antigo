import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, CustomInput
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import { connect } from "react-redux"
import { BrazilMaskComponent } from 'react-brazil'
import InputMask from "react-input-mask"

const ModalFornecedor = (props) => {
  const { data, modal, handleClose, save } = props
  const [fornecedor, setFornecedor] = useState({})

  const tiposPix = [
    'CNPJ',
    'Email',
    'Celular',
    'Aleatório'
  ]

  useEffect(() => {
    if (data) {
      setFornecedor(data)
    }
  }, [data])

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
            <h4 className="mt-1 mb-1"><b>Cadastro Fornecedor</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Razão Social</Label>
                  <Input
                    type="text"
                    id="Nome"
                    name="Nome"
                    placeholder="Razão Social"
                    value={fornecedor.Nome}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nome Fantasia</Label>
                  <Input
                    type="text"
                    id="NomeFantasia"
                    name="NomeFantasia"
                    placeholder="Nome Fantasia"
                    value={fornecedor.NomeFantasia}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CNPJ</Label>
                  <BrazilMaskComponent
                    type="text"
                    id="CNPJ"
                    name="CNPJ"
                    placeholder="CNPJ"
                    className="form-control"
                    value={fornecedor.CNPJ}
                    format="cnpj"
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Inscrição Estadual</Label>
                  <Input
                    type="text"
                    id="Inscricao"
                    name="Inscricao"
                    placeholder="Inscrição Estadual"
                    value={fornecedor.Inscricao}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="8" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Endereço</Label>
                  <Input
                    type="text"
                    id="Endereco"
                    name="Endereco"
                    placeholder="Endereço"
                    value={fornecedor.Endereco}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">E-mail</Label>
                  <Input
                    type="text"
                    id="Email"
                    name="Email"
                    placeholder="E-mail"
                    value={fornecedor.Email}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Telefone</Label>
                  <InputMask
                    className="form-control"
                    type="tel"
                    mask="(99) 99999-9999"
                    id="Telefone"
                    name="Telefone"
                    placeholder="Telefone"
                    value={fornecedor.Telefone}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value })}
                />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <FormGroup>
                <Col md="6" className="mt-1">
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Bloquear Fornecedor</Label>
                  <CustomInput
                    type="switch"
                    id="bloquearFornecedor"
                    name="customSwitch"
                    className="custom-control-primary zindex-0"
                    label=""
                    inline
                    checked={fornecedor.Bloqueado}
                    onChange={(e) => setFornecedor({ ...fornecedor, Bloqueado: e.target.checked })}
                  />
                </Col>
              </FormGroup>
            </Row>
            <br />
            <br />
            <h5>Dados Contato</h5>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Financeiro</Label>
                  <Input
                    type="textarea"
                    id="ContatoFinanceiro"
                    name="ContatoFinanceiro"
                    placeholder="Contato Financeiro"
                    value={fornecedor.ContatoFinanceiro}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Venda</Label>
                  <Input
                    type="textarea"
                    id="ContatoVenda"
                    name="ContatoVenda"
                    placeholder="Contato Venda"
                    value={fornecedor.ContatoVenda}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <br />
            <br />
            <h5>Dados Bancários</h5>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Tipo Chave PIX</Label>
                  <Select
                    placeholder="Tipo Chave"
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="TipoPix"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={tiposPix}
                    isSearchable
                    getOptionLabel={(option) => option}
                    getOptionValue={(option) => option}
                    value={
                      tiposPix.filter((option) => option === fornecedor?.TipoPix)
                    }
                    onChange={(object) => setFornecedor({ ...fornecedor, TipoPix: object })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Chave PIX</Label>
                  <Input
                    type="text"
                    id="ChavePix"
                    name="ChavePix"
                    placeholder="Chave PIX"
                    value={fornecedor.ChavePix}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Banco</Label>
                  <Input
                    type="text"
                    id="Banco"
                    name="Banco"
                    placeholder="Banco"
                    value={fornecedor.Banco}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Agência</Label>
                  <Input
                    type="text"
                    id="AgenciaBanco"
                    name="AgenciaBanco"
                    placeholder="Agência"
                    value={fornecedor.AgenciaBanco}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Conta</Label>
                  <Input
                    type="text"
                    id="ContaBanco"
                    name="ContaBanco"
                    placeholder="Conta"
                    value={fornecedor.ContaBanco}
                    onChange={(e) => setFornecedor({ ...fornecedor, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              onClick={e => save(fornecedor)}
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
  }
}


export default connect(mapStateToProps, {
})(ModalFornecedor)

