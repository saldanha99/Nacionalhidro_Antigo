import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import Select from "react-select"
import { connect } from "react-redux"

const ModalCargo = (props) => {
  const { data, modal, handleClose, save } = props
  const [cargo, setCargo] = useState({})
  const options = [{ label: 'Sim', value: true }, { label: 'Não', value: false }]

  useEffect(() => {
    if (data) {
      setCargo(data)
    }
  }, [data])

  const isInvalidForm = () => {
    if (!cargo.Descricao) {
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
            <h4 className="mt-1 mb-1"><b>Cadastro Cargo</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descrição</Label>
                  <Input style={!cargo.Descricao ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    id="Descricao"
                    name="Descricao"
                    placeholder="Descrição"
                    value={cargo.Descricao}
                    onChange={(e) => setCargo({ ...cargo, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Único por equipamento</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="Unico"
                    options={options}
                    isSearchable
                    value={options.filter((option) => option.value === cargo.UnicoEquipamento)}
                    onChange={(e) => {
                      setCargo({ ...cargo, UnicoEquipamento: e.value })
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
              onClick={e => save(cargo)}
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
})(ModalCargo)

