import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, CustomInput
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import Select from "react-select"
import moment from "moment"
moment.locale("pt-br")

const statusOptions = ['NOVO', 'RETORNAR LIGAÇÃO', 'FINALIZADO']

const ModalHistoricoContato = (props) => {
  const { data, modal, setModal, cliente, vendedor, vendedores, clientes, save } = props
  const [state, setState] = useState({
    Cliente: null,
    DescricaoCliente: '',
    Vendedor: {},
    Contato: null,
    DataContato: '',
    DataAgendado: null,
    Observacoes: '',
    Status: 'NOVO'
  })
  const [isCliente, setIsCliente] = useState(false)

  useEffect(() => {
    if (modal) {
      if (data) {
        setState(data.Historico)
      } else {
        setState({...state, Cliente: cliente ?? null, Vendedor: vendedor.role.name !== 'Gerencial' ? vendedor : {}, Contato: {}, DataContato: moment().format('YYYY-MM-DD'), DataAgendado: '', Observacoes: '', Status: 'NOVO'})
      }
      setIsCliente(cliente?.id || data?.Historico?.Cliente?.id)
    }
  }, [modal])

  useEffect(() => {
    if (!isCliente) {
      setState({...state, Cliente: null, Contato: null})
    } else {
      setState({...state, DescricaoCliente: ''})
    }
  }, [isCliente])

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
            <h4 className="mt-1 mb-1"><b>Histórico de Contato</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Já é cliente?</Label>
                <CustomInput
                  type="switch"
                  id="isCliente"
                  name="customSwitch"
                  className="custom-control-primary zindex-0"
                  label=""
                  inline
                  checked={isCliente}
                  onChange={(e) => {
                    setIsCliente(e.target.checked)
                  }}
                />
              </Col>
            </Row>
            <Row>
              {isCliente ? <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cliente</Label>
                  <Select
                      placeholder="Selecione..."
                      className="React"
                      classNamePrefix="select"
                      styles={{
                          menu: provided => ({ ...provided, zIndex: 9999 }),
                          control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="Cliente"
                      noOptionsMessage={() => 'Sem registro!'}
                      options={clientes}
                      isSearchable
                      getOptionLabel={(option) => option?.RazaoSocial}
                      getOptionValue={(option) => option}
                      value={
                        clientes?.filter((option) => option.id === state.Cliente?.id)
                      }
                      onChange={(object) => {
                        setState({ ...state, Cliente: object })
                      }}
                  />
                </FormGroup>
              </Col> : <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cliente</Label>
                  <Input
                    type="text"
                    name="DescricaoCliente"
                    placeholder="Cliente"
                    value={state.DescricaoCliente}
                    onChange={(e) => setState({ ...state, DescricaoCliente: e.target.value })}
                  />
                </FormGroup>
              </Col>}
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Vendedor</Label>
                  <Select
                      placeholder="Selecione..."
                      className="React"
                      classNamePrefix="select"
                      styles={{
                          menu: provided => ({ ...provided, zIndex: 9999 }),
                          control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: state.Vendedor?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                      }}
                      name="Vendedor"
                      noOptionsMessage={() => 'Sem registro!'}
                      options={vendedores}
                      isSearchable
                      isDisabled={vendedor.role.name !== 'Gerencial'}
                      getOptionLabel={(option) => option?.username}
                      getOptionValue={(option) => option}
                      value={
                        vendedores?.filter((option) => option.id === state.Vendedor?.id)
                      }
                      onChange={(object) => {
                        setState({ ...state, Vendedor: object })
                      }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              {isCliente && <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Contato</Label>
                  <Select
                      placeholder="Selecione..."
                      className="React"
                      classNamePrefix="select"
                      styles={{
                          menu: provided => ({ ...provided, zIndex: 9999 }),
                          control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: state.Contato?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                      }}
                      name="Contato"
                      noOptionsMessage={() => 'Sem registro!'}
                      options={state.Cliente?.Contatos}
                      isSearchable
                      getOptionLabel={(option) => `${option?.Nome}-${option.Setor}`}
                      getOptionValue={(option) => option}
                      value={
                        state.Cliente?.Contatos?.filter((option) => option.id === state.Contato?.id)
                      }
                      onChange={(object) => {
                        setState({ ...state, Contato: object })
                      }}
                  />
                </FormGroup>
              </Col>}
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Data do Contato</Label>
                  <Input
                    type="date"
                    name="DataContato"
                    placeholder="Data do Contato"
                    value={state.DataContato}
                    onChange={(e) => setState({ ...state, DataContato: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Data do Próx. Contato</Label>
                  <Input
                    type="date"
                    name="DataAgendado"
                    placeholder="Data do Próx. Contato"
                    value={state.DataAgendado}
                    onChange={(e) => setState({ ...state, DataAgendado: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Status</Label>
                  <Select
                      placeholder="Selecione..."
                      className="React"
                      classNamePrefix="select"
                      styles={{
                          menu: provided => ({ ...provided, zIndex: 9999 }),
                          control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="Contato"
                      noOptionsMessage={() => 'Sem registro!'}
                      options={statusOptions}
                      getOptionLabel={(option) => option}
                      getOptionValue={(option) => option}
                      value={
                        statusOptions?.filter((option) => option === state.Status)
                      }
                      onChange={(object) => {
                        setState({ ...state, Status: object })
                      }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Observações</Label>
                  <Input
                    type="textarea"
                    rows={3}
                    name="Observacoes"
                    placeholder="Observações"
                    value={state.Observacoes}
                    onChange={(e) => setState({ ...state, Observacoes: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              disabled={!state.Vendedor?.id || !state.DataContato}
              onClick={e => save(state)}
            >
              Salvar
            </Button.Ripple>
          </ModalFooter>
        </Modal>
      </span>
    </div>
  )
}

export default ModalHistoricoContato

