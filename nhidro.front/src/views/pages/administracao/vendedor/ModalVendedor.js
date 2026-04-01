import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import { connect } from "react-redux"

const ModalVendedor = (props) => {
  const { data, modal, handleClose, save } = props
  const [vendedor, setVendedor] = useState({})

  useEffect(() => {
    if (data) {
      setVendedor(data)
    }
  }, [data])

  const isInvalidForm = () => {
    if (!vendedor.Nome) {
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
            <h4 className="mt-1 mb-1"><b>Cadastro Vendedor</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Vendedor</Label>
                  <Input style={!vendedor.Nome ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="Nome"
                    placeholder="Nome"
                    value={vendedor.Nome}
                    onChange={(e) => {
                      setVendedor({ ...vendedor, [e.target.name]: e.target.value })
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
              onClick={e => save(vendedor)}
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
})(ModalVendedor)

