import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'

const ModalDocumento = (props) => {
  const { modal, setModal, cliente, save } = props
  const [state, setState] = useState({
    Cliente: {},
    Descricao: ''
  })
  const [documento, setDocumento] = useState(null)

  useEffect(() => {
    if (modal) {
      setState({...state, Cliente: cliente, Descricao: ''})
    }
  }, [modal])

  return (
    <div>
      <span>
        <Modal
          isOpen={modal}
          size="lg"
          toggle={() => setModal(false)}
          className="modal-dialog-centered"
          backdrop={false}
        >
          <ModalHeader
            toggle={() => setModal(false)}
            style={{ background: '#2F4B7433' }}
            cssModule={{ close: 'close button-close' }}
          >
            <h4 className="mt-1 mb-1"><b>Adicionar Documento</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cliente</Label>
                  <Input
                    disabled
                    type="text"
                    name="Cliente"
                    placeholder="Cliente"
                    value={state.Cliente?.RazaoSocial}
                    onChange={(e) => {}}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descrição</Label>
                  <Input
                    name="Descricao"
                    placeholder="Descricao"
                    value={state.Descricao}
                    onChange={(e) => setState({ ...state, Descricao: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12" className="mt-1">
                  <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Arquivo</Label>
                      <Input
                          id="file"
                          placeholder="Selecione..."
                          type="file"
                          onChange={e => {
                            setDocumento(e.target.files[0])
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
              disabled={!state.Descricao}
              onClick={e => save(state, documento)}
            >
              Adicionar
            </Button.Ripple>
          </ModalFooter>
        </Modal>
      </span>
    </div>
  )
}

export default ModalDocumento

