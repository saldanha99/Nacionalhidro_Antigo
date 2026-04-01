import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import Select from "react-select"
import { connect } from "react-redux"

const ModalNaturezas = (props) => {
  const { data, modal, handleClose, save } = props
  const [natureza, setNatureza] = useState({})
  const options = [{ label: 'Sim', value: true }, { label: 'Não', value: false }]

  useEffect(() => {
    if (data) {
      setNatureza(data)
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
            <h4 className="mt-1 mb-1"><b>Cadastro Natureza Contábil</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descrição</Label>
                  <Input
                    type="text"
                    id="Descricao"
                    name="Descricao"
                    placeholder="Descrição"
                    value={natureza.Descricao}
                    onChange={(e) => setNatureza({ ...natureza, [e.target.name]: e.target.value.toUpperCase() })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
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
                    options={options}
                    isSearchable
                    value={options.filter((option) => option.value === natureza.Inativo)}
                    onChange={(e) => {
                      setNatureza({ ...natureza, Inativo: e.value })
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
              onClick={e => save(natureza)}
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
})(ModalNaturezas)

