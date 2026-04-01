import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, CardText, CustomInput
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import Select from "react-select"
import { connect } from "react-redux"
import { formatImage } from '../../../../utility/file/index'
import uuidv4 from 'uuid/v4'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const ModalUsuario = (props) => {
  const { data, modal, handleClose, roles, aprove } = props
  const [usuario, setUsuario] = useState({})
  const [assinatura, setAssinatura] = useState(null)
  const [alterarAssinatura, setAlterarAssinatura] = useState(false)

  useEffect(() => {
    if (data) {
      setAssinatura(null)
      setAlterarAssinatura(false)
      if (data.urlSignature) {
        setAlterarAssinatura(true)
      }

      setUsuario(data)
    }
  }, [data])

  const isInvalidForm = () => {
    if (!usuario.username || !usuario.email) {
      return true
    }

    return false
  }

  const save = () => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja salvar os dados?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-outline-primary mr-1"
      },
      buttonsStyling: false,
      showLoaderOnConfirm: true,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        handleClose()
        usuario.Clientes = {
          "disconnect": [],
          "connect": []
        }
        usuario.createdBy = null;
        usuario.updatedAt = null;
        usuario.role = usuario.role.id;
        if (!alterarAssinatura && assinatura) {
          const extension = assinatura.type.split('/')[1]
          const filename = `${uuidv4()}.${extension}`
          aprove(usuario, assinatura, filename, assinatura.type)
        } else {
          aprove(usuario)
        }
      }
    })
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
            <h4 className="mt-1 mb-1"><b>Usuário</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nome</Label>
                  <Input style={!usuario.username ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="username"
                    placeholder="Nome"
                    value={usuario.username}
                    onChange={(e) => {
                      setUsuario({ ...usuario, [e.target.name]: e.target.value.toUpperCase() })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">E-mail</Label>
                  <Input style={!usuario.email ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="email"
                    placeholder="E-mail"
                    value={usuario.email}
                    onChange={(e) => {
                      setUsuario({ ...usuario, [e.target.name]: e.target.value.toUpperCase() })
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Permissão</Label>
                  <Select
                    placeholder="Permissão"
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: usuario.role?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                    }}
                    getOptionLabel={(option) => option?.name}
                    getOptionValue={(option) => option}
                    name="role"
                    noOptionsMessage={() => 'Sem permissões!'}
                    options={roles}
                    isSearchable
                    value={
                      roles.filter((option) => option.id === usuario?.role?.id)
                    }
                    onChange={(object) => setUsuario({ ...usuario, role: object })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <div>
                  <CardText className='mb-0'>Bloqueado</CardText>
                  <CustomInput
                    className='custom-control-danger'
                    type='switch'
                    id='danger'
                    name='danger'
                    inline
                    checked={usuario.blocked}
                    onChange={(e) => setUsuario({ ...usuario, blocked: e.target.checked })}
                  />
                </div>
              </Col>
              {alterarAssinatura ? <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Assinatura <a style={{marginLeft:80}} onClick={e => setAlterarAssinatura(false)}> <u>Importar nova</u></a></Label>
                  <div>
                  <img src={usuario.urlSignature} width="70%" />
                  </div>
                </FormGroup>
              </Col>  : <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Importar Assinatura <a style={{marginLeft:80}} onClick={e => setAlterarAssinatura(true)}> <u>Cancelar</u></a></Label>
                  <Input
                    type="file"
                    name="mailSignature"
                    accept="image/*"
                    placeholder="Assinatura"
                    onChange={e => {
                      setAssinatura(e.target.files[0])
                    }}
                  />
                </FormGroup>
              </Col> }
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              disabled={isInvalidForm()}
              onClick={e => save()}
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
})(ModalUsuario)

