import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import Select from "react-select"
import { connect } from "react-redux"
import { List_TiposVeiculo } from "../../../../utility/enum/Enums"
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
const options = [{ label: 'Sim', value: true }, { label: 'Não', value: false }]

const ModalVeiculo = (props) => {
  const { data, modal, handleClose, save, funcionarios } = props
  const [veiculo, setVeiculos] = useState({})
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    if (data) {
      if (!data.Funcionarios) {
        data.Funcionarios = []
        data.Funcionarios.push({id: 0})
      }
      setVeiculos(data)
    }
  }, [data])

  const isInvalidForm = () => {
    if (!veiculo.Descricao || !veiculo.Placa || veiculo.Funcionarios.find(x => x.id === 0)) {
      return true
    }

    return false
  }

  const isHidden = (toggle) => {
    if (toggle === true) {
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
            <h4 className="mt-1 mb-1"><b>Cadastro Veículo</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Veículo</Label>
                  <Input style={!veiculo.Descricao ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="Descricao"
                    placeholder="Veículo"
                    value={veiculo.Descricao}
                    onChange={(e) => {
                      setVeiculos({ ...veiculo, [e.target.name]: e.target.value.toUpperCase() })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Placa</Label>
                  <Input style={!veiculo.Placa ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="Placa"
                    placeholder="Placa"
                    value={veiculo.Placa}
                    onChange={(e) => {
                      setVeiculos({ ...veiculo, [e.target.name]: e.target.value.toUpperCase() })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Tipo</Label>
                  <Select
                    placeholder="Tipo"
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="Tipo"
                    noOptionsMessage={() => 'Sem Tipo!'}
                    options={List_TiposVeiculo}
                    isSearchable
                    value={List_TiposVeiculo.filter((option) => option.value === veiculo.Tipo)}
                    onChange={(e) => {
                      setVeiculos({ ...veiculo, Tipo: e.value })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Manutenção</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="Manutencao"
                    options={options}
                    isSearchable
                    value={options.filter((option) => option.value === veiculo.Manutencao)}
                    onChange={(e) => {
                      setVeiculos({ ...veiculo, Manutencao: e.value })
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <br />
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} className="mt-4">
              <Col md="12" className="mt-1" >
                {
                  isHidden(toggle) ? <MdKeyboardArrowDown size={30} style={{ cursor: 'pointer' }} onClick={() => setToggle(!toggle)}
                  /> : <MdKeyboardArrowUp size={30} style={{ cursor: 'pointer' }} onClick={() => setToggle(!toggle)} />
                }
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '17px'
                  }}
                >
                  Funcionários
                </span>
              </Col>
            </Row>
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} hidden={isHidden(toggle)}>
              {veiculo?.Funcionarios?.map((x, i) => (<>
                <Col md="8" className="mt-1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Funcionário</Label>
                    <Select
                      placeholder="Funcionário"
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                      }}
                      name="Funcionario"
                      noOptionsMessage={() => 'Sem Funcionário!'}
                      getOptionLabel={(option) => `${option?.Nome} - ${option?.Cargo?.Descricao}`}
                      getOptionValue={(option) => option}
                      options={funcionarios}
                      isSearchable
                      value={funcionarios?.filter((option) => option.id === x?.id)}
                      onChange={(e) => {
                        veiculo.Funcionarios[i] = e
                        setVeiculos({ ...veiculo, Funcionarios: veiculo.Funcionarios })
                      }}
                    />
                  </FormGroup>
                </Col>
                {veiculo.Funcionarios.length > 0 && <Col md="1" className="mt-3">
                  <a href='#' style={{ color: '#b10000' }} onClick={() => {
                    veiculo.Funcionarios.splice(i, 1)
                    setVeiculos({ ...veiculo, Funcionarios: veiculo.Funcionarios })
                  }}>
                    x
                  </a>
                </Col>}
              </>))}
              <Col className="mb-2" md="12">
                <a href='#' onClick={() => {
                  veiculo?.Funcionarios?.push({ id: 0 })
                  setVeiculos({ ...veiculo, Funcionarios: veiculo.Funcionarios })
                }}>
                  Adicionar Funcionário
                </a>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              disabled={isInvalidForm()}
              onClick={e => save(veiculo)}
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
})(ModalVeiculo)

