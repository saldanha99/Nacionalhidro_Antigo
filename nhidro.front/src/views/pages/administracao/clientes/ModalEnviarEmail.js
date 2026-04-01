import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'

const ModalEnviarEmail = (props) => {
  const { data, modal, setModal, send } = props
  const [state, setState] = useState({
    clientes: [],
    assunto: '',
    mensagem: '',
    arquivos: []
  })

  useEffect(() => {
    if (data) {
      setState({...state, clientes: data, arquivos: [], assunto: '', mensagem: ''})
    }
  }, [data])

  const handleFileChange = async (event) => {
      const arquivos = []
      for (const file of event.target.files) {
          const arquivo = await new Promise((resolve, reject) => {
            const arquivo = {
            name: file.name
            }
            const reader = new FileReader()
            reader.onload = (function () { 
                return function(e) {
                    arquivo.value = e.target.result
                    resolve(arquivo)
                }
            })(file)
            reader.readAsDataURL(file)
          })
          arquivos.push(arquivo)
      }
      
      setState({ ...state, arquivos })
  }

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
            <h4 className="mt-1 mb-1"><b>Disparo de e-mail p/ clientes</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Assunto</Label>
                  <Input style={!state.assunto ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="assunto"
                    placeholder="Assunto"
                    value={state.assunto}
                    onChange={(e) => {
                      setState({ ...state, [e.target.name]: e.target.value })
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Mensagem</Label>
                  <Input style={!state.mensagem ? { borderColor: '#cc5050' } : {}}
                    type="textarea"
                    row={4}
                    name="mensagem"
                    placeholder="Mensagem"
                    value={state.mensagem}
                    onChange={(e) => {
                      setState({ ...state, [e.target.name]: e.target.value })
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Anexos:</Label>
                      <Input
                        type="file"
                        name="arquivos"
                        placeholder="Anexos"
                        className="form-control"
                        multiple
                        onChange={e => handleFileChange(e)}
                      />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              disabled={!state.assunto || !state.mensagem}
              onClick={e => send(state)}
            >
              Enviar
            </Button.Ripple>
          </ModalFooter>
        </Modal>
      </span>
    </div>
  )
}

export default ModalEnviarEmail

