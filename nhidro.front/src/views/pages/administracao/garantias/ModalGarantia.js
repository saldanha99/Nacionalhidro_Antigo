import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import { connect } from "react-redux"

const ModalGarantia = (props) => {
  const { data, modal, handleClose, save } = props
  const [garantia, setGarantia] = useState({})

  useEffect(() => {
    if (data) {
      setGarantia(data)
    }
  }, [data])

  const isInvalidForm = () => {
    if (!garantia.Descricao) {
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
            <h4 className="mt-1 mb-1"><b>Cadastro de Garantia</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descrição</Label>
                  <Input style={!garantia.Descricao ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    id="Descricao"
                    name="Descricao"
                    placeholder="Descrição"
                    value={garantia.Descricao}
                    onChange={(e) => setGarantia({ ...garantia, [e.target.name]: e.target.value })}
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
              onClick={e => save(garantia)}
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
})(ModalGarantia)

