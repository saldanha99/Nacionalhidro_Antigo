import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import Select from "react-select"
import { connect } from "react-redux"

const ModalAcessorio = (props) => {
  const { data, modal, handleClose, save } = props
  const [acessorio, setAcessorio] = useState({})
  const optionsPadrao = [{ label: 'Sim', value: true }, { label: 'Não', value: false }]

  useEffect(() => {
    if (data) {
      setAcessorio(data)
    }
  }, [data])

  const isInvalidForm = () => {
    if (!acessorio.Nome) {
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
            <h4 className="mt-1 mb-1"><b>Cadastro Acessório</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Acessório</Label>
                  <Input style={!acessorio.Nome ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="Nome"
                    placeholder="Acessório"
                    value={acessorio.Nome}
                    onChange={(e) => {
                      setAcessorio({ ...acessorio, [e.target.name]: e.target.value })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
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
                    value={optionsPadrao.filter((option) => option.value === acessorio.Padrao)}
                    onChange={(e) => {
                      setAcessorio({ ...acessorio, Padrao: e.value })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Desativar?</Label>
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
                    value={optionsPadrao.filter((option) => option.value === acessorio.Inativo)}
                    onChange={(e) => {
                      setAcessorio({ ...acessorio, Inativo: e.value })
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
              onClick={e => save(acessorio)}
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
})(ModalAcessorio)

