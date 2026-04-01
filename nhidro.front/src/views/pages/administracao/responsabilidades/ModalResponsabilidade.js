import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import Select from "react-select"
import { connect } from "react-redux"
import { Enum_TipoResponsabilidade } from "../../../../utility/enum/Enums"

const ModalResponsabilidade = (props) => {
  const { data, modal, handleClose, save, setData } = props
  const [responsabilidade, setResponsabilidade] = useState({})

  const optionsTipo = [{ label: 'Contratante', value: Enum_TipoResponsabilidade.Contratante }, { label: 'Contratado', value: Enum_TipoResponsabilidade.Contratado }]
  const optionsPadrao = [{ label: 'Sim', value: true }, { label: 'Não', value: false }]

  useEffect(() => {
    if (data) {
      setResponsabilidade(data)
    }
  }, [data])
  
  useEffect(() => {
    if (modal && !data?.id) {
      setResponsabilidade({...responsabilidade, Ativo: true})
    } else if (!modal) {
      setResponsabilidade({})
      setData(null)
    }
  }, [modal])

  const isInvalidForm = () => {
    if (!responsabilidade.Responsabilidade) {
      return true
    }

    return false
  }

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
            <h4 className="mt-1 mb-1"><b>Cadastro Responsabilidade</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="8" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Responsabilidade</Label>
                  <Input style={!responsabilidade.Responsabilidade ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="Responsabilidade"
                    placeholder="Responsabilidade"
                    value={responsabilidade.Responsabilidade}
                    onChange={(e) => {
                      setResponsabilidade({ ...responsabilidade, [e.target.name]: e.target.value })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                  <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Responsável</Label>
                      <Select
                          placeholder="Responsável"
                          className="React"
                          classNamePrefix="select"
                          styles={{
                              menu: provided => ({ ...provided, zIndex: 9999 }),
                              control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: responsabilidade.Responsavel ? 'hsl(0,0%,80%)' : '#cc5050' })
                          }}
                          name="Responsavel"
                          noOptionsMessage={() => 'Sem registro!'}
                          options={optionsTipo}
                          isSearchable
                          value={optionsTipo.filter((option) => option.value === responsabilidade.Responsavel)}
                          onChange={(e) => {
                            setResponsabilidade({ ...responsabilidade, Responsavel: e.value })
                          }}
                      />
                  </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Padrão</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="Padrao"
                    noOptionsMessage={() => 'Sem Padrao!'}
                    options={optionsPadrao}
                    isSearchable
                    value={optionsPadrao.filter((option) => option.value === responsabilidade.Padrao)}
                    onChange={(e) => {
                      setResponsabilidade({ ...responsabilidade, Padrao: e.value })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Destacar como importante</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="Importante"
                    options={optionsPadrao}
                    isSearchable
                    value={optionsPadrao.filter((option) => option.value === responsabilidade.Importante)}
                    onChange={(e) => {
                      setResponsabilidade({ ...responsabilidade, Importante: e.value })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Inativo</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="Inativo"
                    options={optionsPadrao}
                    isSearchable
                    value={optionsPadrao.filter((option) => option.value === responsabilidade.Inativo)}
                    onChange={(e) => {
                      setResponsabilidade({ ...responsabilidade, Inativo: e.value })
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              disabled={isInvalidForm()}
              onClick={e => save(responsabilidade)}
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
})(ModalResponsabilidade)

