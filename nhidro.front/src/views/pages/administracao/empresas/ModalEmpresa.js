import React, { useState, useEffect, isValidElement } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, CustomInput
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import { connect } from "react-redux"
import { BrazilMaskComponent } from 'react-brazil'
import InputMask from "react-input-mask"
import { Lista_RegimeTributario } from '../../../../utility/enum/Enums'
import Select from "react-select"
import { cidades } from "../../../../utility/cidades_ibge"

const ModalEmpresa = (props) => {
  const { data, modal, handleClose, save } = props
  const [empresa, setEmpresa] = useState({
    EmpresaBanco: []
  })

  useEffect(() => {
    if (data) {
      if (!data.EmpresaBanco) {
        data.EmpresaBanco = []
        data.EmpresaBanco.push({ id: 0 })
      }
      setEmpresa(data)
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
            <h4 className="mt-1 mb-1"><b>Cadastro Empresa</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Razão Social</Label>
                  <Input
                    type="text"
                    id="Descricao"
                    name="Descricao"
                    placeholder="Descrição"
                    value={empresa.Descricao}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CNPJ</Label>
                  <BrazilMaskComponent
                    type="text"
                    id="CNPJ"
                    name="CNPJ"
                    placeholder="CNPJ"
                    className="form-control"
                    value={empresa.CNPJ}
                    format="cnpj"
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="8" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Endereço</Label>
                  <Input
                    type="text"
                    id="Endereco"
                    name="Endereco"
                    placeholder="Endereço"
                    value={empresa.Endereco}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Número</Label>
                  <Input
                    type="number"
                    id="Numero"
                    name="Numero"
                    placeholder="Numero"
                    value={empresa.Numero}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: parseInt(e.target.value) })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Complemento</Label>
                  <Input
                    type="text"
                    id="Logradouro"
                    name="Logradouro"
                    placeholder="Complemento"
                    value={empresa.Logradouro}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Bairro</Label>
                  <Input
                    type="text"
                    id="Bairro"
                    name="Bairro"
                    placeholder="Bairro"
                    value={empresa.Bairro}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">UF</Label>
                  <Input
                    type="text"
                    id="UF"
                    name="UF"
                    placeholder="UF"
                    value={empresa.UF}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="3" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Telefone</Label>
                  <InputMask
                    className="form-control"
                    type="tel"
                    mask="(99) 99999-9999"
                    id="Telefone"
                    name="Telefone"
                    placeholder="Telefone"
                    value={empresa.Telefone}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Município</Label>
                  <Select
                    placeholder="Município"
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="Municipio"
                    getOptionLabel={(option) => option.Nome?.toUpperCase()}
                    getOptionValue={(option) => option.Nome}
                    noOptionsMessage={() => 'Sem registro!'}
                    options={cidades.filter(x => x.Uf === empresa.UF)}
                    isSearchable
                    value={
                      cidades.filter((option) => option.Uf === empresa.UF && option.Nome.toUpperCase() === empresa.Municipio?.toUpperCase())
                    }
                    onChange={(option) => {
                      setEmpresa({ ...empresa, Municipio: option.Nome?.toUpperCase(), CodigoMunicipio: option.Codigo?.toString() })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="3" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CEP</Label>
                  <Input
                    type="text"
                    id="CEP"
                    name="CEP"
                    placeholder="CEP"
                    value={empresa.CEP}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CNAE</Label>
                  <Input
                    type="text"
                    id="CNAE"
                    name="Cnae"
                    placeholder="CNAE"
                    value={empresa.Cnae}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">RNTRC</Label>
                  <Input
                    type="text"
                    id="RNTRC"
                    name="Rntrc"
                    placeholder="RNTRC"
                    value={empresa.Rntrc}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Inscrição Estadual</Label>
                  <Input
                    type="text"
                    id="Inscricao"
                    name="InscricaoEstadual"
                    placeholder="Inscrição Estadual"
                    value={empresa.InscricaoEstadual}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Inscrição Municipal</Label>
                  <Input
                    type="text"
                    id="InscricaoMunicipal"
                    name="InscricaoMunicipal"
                    placeholder="Inscrição Municipal"
                    value={empresa.InscricaoMunicipal}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Regime Tributário</Label>
                  <Select
                    placeholder="Regime Tributario"
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="RegimeTributario"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={Lista_RegimeTributario}
                    isSearchable
                    value={
                      Lista_RegimeTributario?.filter((option) => option.value === empresa.RegimeTributario)
                    }
                    onChange={(option) => setEmpresa({ ...empresa, RegimeTributario: option.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Dados de Depósito</Label>
                  <Input
                    type="text"
                    id="DadosDeposito"
                    name="DadosDeposito"
                    placeholder="Dados Depósito"
                    value={empresa.DadosDeposito}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Natureza Operação</Label>
                  <Input
                    type="text"
                    id="NaturezaOperacao"
                    name="NaturezaOperacao"
                    placeholder="Natureza Operação"
                    value={empresa.NaturezaOperacao}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Focus Token</Label>
                  <Input
                    type="text"
                    id="FocusToken"
                    name="FocusToken"
                    placeholder="Focus Token"
                    value={empresa.FocusToken}
                    onChange={(e) => setEmpresa({ ...empresa, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <br />
            <h5>Banco</h5>
            {empresa?.EmpresaBanco?.map((x, i) => (<Row>
              <Col md="5" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Banco</Label>
                  <Input style={!x.Banco ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="Banco"
                    placeholder="Banco"
                    value={x.Banco}
                    onChange={(e) => {
                      empresa.EmpresaBanco[i].Banco = e.target.value.toUpperCase()
                      setEmpresa({ ...empresa, EmpresaBanco: empresa.EmpresaBanco })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="3" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Agência</Label>
                  <Input style={!x.Agencia ? { borderColor: '#cc5050' } : {}}
                    type="number"
                    name="Agencia"
                    placeholder="Agencia"
                    value={x.Agencia}
                    onChange={(e) => {
                      empresa.EmpresaBanco[i].Agencia = e.target.value
                      setEmpresa({ ...empresa, EmpresaBanco: empresa.EmpresaBanco })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Conta</Label>
                  <Input style={!x.Conta ? { borderColor: '#cc5050' } : {}}
                    type="number"
                    name="Conta"
                    placeholder="Conta"
                    value={x.Conta}
                    onChange={(e) => {
                      empresa.EmpresaBanco[i].Conta = e.target.value
                      setEmpresa({ ...empresa, EmpresaBanco: empresa.EmpresaBanco })
                    }}
                  />
                </FormGroup>
              </Col>
              {/* empresa.EmpresaBanco.length > 1 && <Col md="1" className="mt-3">
                <a href='#' style={{ color: '#b10000' }} onClick={() => {
                  empresa.EmpresaBanco.splice(i, 1)
                  setEmpresa({ ...empresa, EmpresaBanco: empresa.EmpresaBanco })
                }}>
                  x
                </a>
              </Col> */}
            </Row>))}
            <a href='#' onClick={() => {
              empresa?.EmpresaBanco?.push({ id: 0 })
              setEmpresa({ ...empresa, EmpresaBanco: empresa.EmpresaBanco })
            }}>
              Adicionar Banco
            </a>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              onClick={e => save(empresa)}
              disabled={!empresa?.Descricao?.length || !empresa?.CNPJ?.length}
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
})(ModalEmpresa)

