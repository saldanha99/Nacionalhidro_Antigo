import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'

const ModalAdicionarDocumento = (props) => {
  const { modal, setModal, empresa, save } = props
  const [state, setState] = useState({
    Empresa: {},
    Descricao: '',
    DataVencimento: ''
  })
  const [documento, setDocumento] = useState(null)

  useEffect(() => {
    if (modal) {
      setState({...state, Empresa: empresa, Descricao: ''})
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
              <Col md="5" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Empresa</Label>
                  <Input
                    disabled
                    type="text"
                    name="Empresa"
                    placeholder="Empresa"
                    value={state.Empresa?.Descricao}
                    onChange={(e) => {}}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mt-1">
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
              <Col md="3" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Vencimento</Label>
                  <Input
                    type="date"
                    name="Vencimento"
                    placeholder="Vencimento"
                    value={state.DataVencimento}
                    onChange={(e) => setState({ ...state, DataVencimento: e.target.value })}
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
              disabled={!state.Descricao || !state.DataVencimento}
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

export default ModalAdicionarDocumento

