import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Input, ButtonGroup, Card, CustomInput, CardText
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import { connect } from "react-redux"
import uuidv4 from 'uuid/v4'
import { List_MotivosAfastamento } from '../../../../utility/enum/Enums'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { FiDownload } from "react-icons/fi"
import { downloadURI } from "../../../../utility/file"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const ModalFuncionario = (props) => {
  const { data, modal, cargos, handleClose, save, sendFiles } = props
  const [funcionario, setFuncionarios] = useState({})
  const [aba, setAba] = useState(1)
  const [toggle, setToggle] = useState(false)
  const [afastamento, setAfastamento] = useState({
    MotivoAfastamento: '',
    InicioAfastamento: '',
    FimAfastamento: ''
  })

  useEffect(() => {
    if (data) {
      if (!data.DocumentosPessoais) data.DocumentosPessoais = []
      if (!data.DocumentosIntegracoes) data.DocumentosIntegracoes = []
      if (!data.DocumentosSeguranca) data.DocumentosSeguranca = []
      setAfastamento({
        MotivoAfastamento: data.MotivoAfastamento,
        InicioAfastamento: data.InicioAfastamento,
        FimAfastamento: data.FimAfastamento
      })
      setFuncionarios(data)
    }
  }, [data])

  const isInvalidForm = () => {
    if (!funcionario.Nome || !funcionario.Cargo?.id) {
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
            <h4 className="mt-1 mb-1"><b>Cadastro Funcionário</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <CardText className="font-weight-bolder mb-0">Nome</CardText>
                  <Input style={!funcionario.Nome ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    name="Nome"
                    placeholder="Nome"
                    value={funcionario.Nome}
                    onChange={(e) => {
                      setFuncionarios({ ...funcionario, [e.target.name]: e.target.value.toUpperCase() })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <CardText className="font-weight-bolder mb-0">Cargo</CardText>
                  <Select
                    placeholder="Cargo"
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: funcionario.Cargo?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                    }}
                    name="Cargo"
                    getOptionLabel={(option) => option?.Descricao}
                    getOptionValue={(option) => option}
                    noOptionsMessage={() => 'Sem Cargo!'}
                    options={cargos}
                    isSearchable
                    value={cargos.filter((option) => option.id === funcionario.Cargo?.id)}
                    onChange={(e) => {
                      setFuncionarios({ ...funcionario, Cargo: e })
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <CardText className="font-weight-bolder mb-0">Motivo Afastamento</CardText>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="MotivoAfastamento"
                    options={List_MotivosAfastamento}
                    isSearchable
                    value={List_MotivosAfastamento.filter((option) => option.value === funcionario.MotivoAfastamento)}
                    onChange={(e) => {
                      if (e.value === 0) { //Nenhum
                        funcionario.InicioAfastamento = null
                        funcionario.FimAfastamento = null
                      }
                      funcionario.MotivoAfastamento = e.value
                      setFuncionarios({ ...funcionario, funcionario })
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="3" className="mt-1">
                  <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Início Afastamento</CardText>
                      <Input
                          type="date"
                          id="InicioAfastamento"
                          name="InicioAfastamento"
                          placeholder="Início Afastamento"
                          value={funcionario.InicioAfastamento || ''}
                          onChange={(e) => setFuncionarios({ ...funcionario, [e.target.name]: e.target.value })}
                      />
                  </FormGroup>
              </Col>
              <Col md="3" className="mt-1">
                  <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Final Afastamento</CardText>
                      <Input
                          type="date"
                          id="FimAfastamento"
                          name="FimAfastamento"
                          placeholder="Fim Afastamento"
                          value={funcionario.FimAfastamento || ''}
                          onChange={(e) => setFuncionarios({ ...funcionario, [e.target.name]: e.target.value })}
                      />
                  </FormGroup>
              </Col>
              <Col md="3" className="mt-1">
                <div>
                  <CardText className="font-weight-bolder mb-0">Bloqueado</CardText>
                  <CustomInput
                    className='custom-control-danger'
                    type='switch'
                    id='Bloqueado'
                    name='Bloqueado'
                    inline
                    checked={funcionario.Bloqueado}
                    onChange={(e) => setFuncionarios({ ...funcionario, Bloqueado: e.target.checked })}
                  />
                </div>
              </Col>
            </Row>
            <br />
            <span>Documentos</span>
            <Row className="mb-2">
                <Col md={12} sm={12}>
                    <ButtonGroup className="mt-2">
                    <Button onClick={() => setAba(1)} color='primary' outline={true} active={aba === 1}>Pessoais</Button>
                    <Button onClick={() => {
                      setAba(2)
                    }} color='primary' outline={true} active={aba === 2}>Integrações</Button>
                    <Button onClick={() => {
                      setAba(3)
                    }} color='primary' outline={true} active={aba === 3}>Segurança</Button>
                    </ButtonGroup>
                </Col>
            </Row>
            {aba === 1 && <Card>
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
                    Pessoais
                  </span>
                </Col>
              </Row>
              <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} hidden={isHidden(toggle)}>
                {funcionario?.DocumentosPessoais?.map((x, i) => (<>
                <Row col="md-12" style={{width: '100%'}}>
                  <Col md="1" className="mt-3 ml-2">
                      <CardText className="font-weight-bolder mb-0"></CardText>
                      <CustomInput
                        type="checkbox"
                        id={uuidv4()}
                        name="download"
                        className="custom-control-primary zindex-0"
                        label=""
                        inline
                        checked={x.Selecionado}
                        onChange={(e) => {
                          funcionario.DocumentosPessoais[i].Selecionado = e.target.checked
                          setFuncionarios({ ...funcionario, DocumentosPessoais: funcionario.DocumentosPessoais })
                        }}
                      />
                  </Col>
                  <Col md="4" className="mt-1">
                    <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Descrição</CardText>
                      <Input
                        type="text"
                        name="Descricao"
                        placeholder="Descrição"
                        value={x?.Descricao}
                        onChange={(e) => {
                          funcionario.DocumentosPessoais[i].Descricao = e.target.value
                          setFuncionarios({ ...funcionario, DocumentosPessoais: funcionario.DocumentosPessoais })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  {!x.Alterar && x.UrlArquivo ? <Col md="5" className="mt-1">
                    <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Documento <a style={{marginLeft:80}} onClick={() => {
                          funcionario.DocumentosPessoais[i].Alterar = true
                          setFuncionarios({ ...funcionario, DocumentosPessoais: funcionario.DocumentosPessoais })
                    }}> <u>Alterar</u></a></CardText>
                      <div>
                      <FiDownload onClick={() => downloadURI(x.UrlArquivo, x.Descricao)} size={20} />
                      </div>
                    </FormGroup>
                  </Col> : <Col md="5" className="mt-1">
                    <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Selecione <a style={{marginLeft:80}} onClick={() => {
                          funcionario.DocumentosPessoais[i].Alterar = false
                          setFuncionarios({ ...funcionario, DocumentosPessoais: funcionario.DocumentosPessoais })
                    }}> <u>Cancelar</u></a></CardText>
                      <Input
                        type="file"
                        name="mailSignature"
                        placeholder="Documento"
                        className="form-control"
                        onChange={e => {
                          const extension = e.target.files[0].type.split('/')[1]
                          const filename = `${uuidv4()}.${extension}`
                          funcionario.DocumentosPessoais[i].FilenameOld = funcionario.DocumentosPessoais[i].Filename?.split('/')[-1]
                          funcionario.DocumentosPessoais[i].File = e.target.files[0]
                          funcionario.DocumentosPessoais[i].Filename = filename
                          funcionario.DocumentosPessoais[i].Type = e.target.files[0].type
                          funcionario.DocumentosPessoais[i].Extension = extension
                          setFuncionarios({ ...funcionario, DocumentosPessoais: funcionario.DocumentosPessoais })
                        }}
                      />
                    </FormGroup>
                  </Col> }
                  {funcionario.DocumentosPessoais?.length > 0 && <Col md="1" className="mt-3">
                    <a href='#' style={{ color: '#b10000' }} onClick={() => {
                      funcionario.DocumentosPessoais.splice(i, 1)
                      setFuncionarios({ ...funcionario, DocumentosPessoais: funcionario.DocumentosPessoais })
                    }}>
                      x
                    </a>
                  </Col>}
                </Row>
                </>))}
                <Col className="mb-2" md="12">
                  <a href='#' onClick={() => {
                    funcionario?.DocumentosPessoais?.push({ id: 0 })
                    setFuncionarios({ ...funcionario, DocumentosPessoais: funcionario.DocumentosPessoais })
                  }}>
                    Adicionar Documento
                  </a>
                </Col>
                {funcionario.DocumentosPessoais?.length > 0 && <Col>
                  <Button className="mb-2" disabled={!funcionario.DocumentosPessoais?.some(x => x.Selecionado)} onClick={() => {
                    funcionario.DocumentosPessoais.forEach(element => {
                      if (element.Selecionado && element.UrlArquivo) downloadURI(element.UrlArquivo, element.Descricao)
                    })
                  }}>Baixar Selecionados</Button>
                  <Button className="mb-2 ml-2" disabled={!funcionario.DocumentosPessoais?.some(x => x.Selecionado)} onClick={async () => {
                    const {value: copy } = await MySwal.fire({
                      text: "E-mails para cópia (Separar e-mails com ';'):",
                      input: "text",
                      showCancelButton: true,
                      confirmButtonText: "Enviar",
                      cancelButtonText: "Continuar sem cópia",
                      customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-outline-primary mr-1"
                      },
                      reverseButtons: true,
                      buttonsStyling: false,
                      showLoaderOnConfirm: true
                    })
                    
                    const files = []
                    funcionario.DocumentosPessoais.forEach(element => {
                      if (element.Selecionado && element.UrlArquivo) {
                        files.push(element)
                      }
                    })
                    sendFiles(funcionario, files, copy)
                  }}>Enviar Selecionados</Button>
                </Col>}
              </Row>
            </Card>}
            {aba === 2 && <Card>
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
                    Integrações
                  </span>
                </Col>
              </Row>
              <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} hidden={isHidden(toggle)}>
                {funcionario?.DocumentosIntegracoes?.map((x, i) => (<>
                <Row col="md-12" style={{width: '100%'}}>
                  <Col md="1" className="mt-3 ml-2">
                      <CardText className="font-weight-bolder mb-0"></CardText>
                      <CustomInput
                        type="checkbox"
                        id={uuidv4()}
                        name="download"
                        className="custom-control-primary zindex-0"
                        label=""
                        inline
                        checked={x.Selecionado}
                        onChange={(e) => {
                          funcionario.DocumentosIntegracoes[i].Selecionado = e.target.checked
                          setFuncionarios({ ...funcionario, DocumentosIntegracoes: funcionario.DocumentosIntegracoes })
                        }}
                      />
                  </Col>
                  <Col md="4" className="mt-1">
                    <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Descrição</CardText>
                      <Input
                        type="text"
                        name="Descricao"
                        placeholder="Descrição"
                        value={x?.Descricao}
                        onChange={(e) => {
                          funcionario.DocumentosIntegracoes[i].Descricao = e.target.value
                          setFuncionarios({ ...funcionario, DocumentosIntegracoes: funcionario.DocumentosIntegracoes })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  {!x.Alterar && x.UrlArquivo ? <Col md="5" className="mt-1">
                    <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Documento <a style={{marginLeft:80}} onClick={() => {
                          funcionario.DocumentosIntegracoes[i].Alterar = true
                          setFuncionarios({ ...funcionario, DocumentosIntegracoes: funcionario.DocumentosIntegracoes })
                    }}> <u>Alterar</u></a></CardText>
                      <div>
                      <FiDownload onClick={() => downloadURI(x.UrlArquivo, x.Descricao)} size={20} />
                      </div>
                    </FormGroup>
                  </Col> : <Col md="5" className="mt-1">
                    <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Selecione <a style={{marginLeft:80}} onClick={() => {
                          funcionario.DocumentosIntegracoes[i].Alterar = false
                          setFuncionarios({ ...funcionario, DocumentosIntegracoes: funcionario.DocumentosIntegracoes })
                    }}> <u>Cancelar</u></a></CardText>
                      <Input
                        type="file"
                        name="mailSignature"
                        placeholder="Documento"
                        className="form-control"
                        onChange={e => {
                          const extension = e.target.files[0].type.split('/')[1]
                          const filename = `${uuidv4()}.${extension}`
                          funcionario.DocumentosIntegracoes[i].FilenameOld = funcionario.DocumentosIntegracoes[i].Filename?.split('/')[-1]
                          funcionario.DocumentosIntegracoes[i].File = e.target.files[0]
                          funcionario.DocumentosIntegracoes[i].Filename = filename
                          funcionario.DocumentosIntegracoes[i].Type = e.target.files[0].type
                          funcionario.DocumentosIntegracoes[i].Extension = extension
                          setFuncionarios({ ...funcionario, DocumentosIntegracoes: funcionario.DocumentosIntegracoes })
                        }}
                      />
                    </FormGroup>
                  </Col> }
                  {funcionario.DocumentosIntegracoes?.length > 0 && <Col md="1" className="mt-3">
                    <a href='#' style={{ color: '#b10000' }} onClick={() => {
                      funcionario.DocumentosIntegracoes.splice(i, 1)
                      setFuncionarios({ ...funcionario, DocumentosIntegracoes: funcionario.DocumentosIntegracoes })
                    }}>
                      x
                    </a>
                  </Col>}
                </Row>
                </>))}
                <Col className="mb-2" md="12">
                  <a href='#' onClick={() => {
                    funcionario?.DocumentosIntegracoes?.push({ id: 0 })
                    setFuncionarios({ ...funcionario, DocumentosIntegracoes: funcionario.DocumentosIntegracoes })
                  }}>
                    Adicionar Documento
                  </a>
                </Col>
                {funcionario.DocumentosIntegracoes?.length > 0 && <Col>
                  <Button className="mb-2" disabled={!funcionario.DocumentosIntegracoes?.some(x => x.Selecionado)} onClick={() => {
                    funcionario.DocumentosIntegracoes.forEach(element => {
                      if (element.Selecionado && element.UrlArquivo) downloadURI(element.UrlArquivo, element.Descricao)
                    })
                  }}>Baixar Selecionados</Button>
                  <Button className="mb-2 ml-2" disabled={!funcionario.DocumentosIntegracoes?.some(x => x.Selecionado)} onClick={async () => {
                    const {value: copy } = await MySwal.fire({
                      text: "E-mails para cópia (Separar e-mails com ';'):",
                      input: "text",
                      showCancelButton: true,
                      confirmButtonText: "Enviar",
                      cancelButtonText: "Continuar sem cópia",
                      customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-outline-primary mr-1"
                      },
                      reverseButtons: true,
                      buttonsStyling: false,
                      showLoaderOnConfirm: true
                    })
                    
                    const files = []
                    funcionario.DocumentosIntegracoes.forEach(element => {
                      if (element.Selecionado && element.UrlArquivo) {
                        files.push(element)
                      }
                    })
                    sendFiles(funcionario, files, copy)
                  }}>Enviar Selecionados</Button>
                </Col>}
              </Row>
            </Card>}
            {aba === 3 && <Card>
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
                    Segurança
                  </span>
                </Col>
              </Row>
              <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} hidden={isHidden(toggle)}>
                {funcionario?.DocumentosSeguranca?.map((x, i) => (<>
                <Row col="md-12" style={{width: '100%'}}>
                  <Col md="1" className="mt-3 ml-2">
                      <CardText className="font-weight-bolder mb-0"></CardText>
                      <CustomInput
                        type="checkbox"
                        id={uuidv4()}
                        name="download"
                        className="custom-control-primary zindex-0"
                        label=""
                        inline
                        checked={x.Selecionado}
                        onChange={(e) => {
                          funcionario.DocumentosSeguranca[i].Selecionado = e.target.checked
                          setFuncionarios({ ...funcionario, DocumentosSeguranca: funcionario.DocumentosSeguranca })
                        }}
                      />
                  </Col>
                  <Col md="4" className="mt-1">
                    <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Descrição</CardText>
                      <Input
                        type="text"
                        name="Descricao"
                        placeholder="Descrição"
                        value={x?.Descricao}
                        onChange={(e) => {
                          funcionario.DocumentosSeguranca[i].Descricao = e.target.value
                          setFuncionarios({ ...funcionario, DocumentosSeguranca: funcionario.DocumentosSeguranca })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  {!x.Alterar && x.UrlArquivo ? <Col md="5" className="mt-1">
                    <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Documento <a style={{marginLeft:80}} onClick={() => {
                          funcionario.DocumentosSeguranca[i].Alterar = true
                          setFuncionarios({ ...funcionario, DocumentosSeguranca: funcionario.DocumentosSeguranca })
                    }}> <u>Alterar</u></a></CardText>
                      <div>
                      <FiDownload onClick={() => downloadURI(x.UrlArquivo, x.Descricao)} size={20} />
                      </div>
                    </FormGroup>
                  </Col> : <Col md="5" className="mt-1">
                    <FormGroup>
                      <CardText className="font-weight-bolder mb-0">Selecione <a style={{marginLeft:80}} onClick={() => {
                          funcionario.DocumentosSeguranca[i].Alterar = false
                          setFuncionarios({ ...funcionario, DocumentosSeguranca: funcionario.DocumentosSeguranca })
                    }}> <u>Cancelar</u></a></CardText>
                      <Input
                        type="file"
                        name="mailSignature"
                        placeholder="Documento"
                        className="form-control"
                        onChange={e => {
                          const extension = e.target.files[0].type.split('/')[1]
                          const filename = `${uuidv4()}.${extension}`
                          funcionario.DocumentosSeguranca[i].FilenameOld = funcionario.DocumentosSeguranca[i].Filename?.split('/')[-1]
                          funcionario.DocumentosSeguranca[i].File = e.target.files[0]
                          funcionario.DocumentosSeguranca[i].Filename = filename
                          funcionario.DocumentosSeguranca[i].Type = e.target.files[0].type
                          funcionario.DocumentosSeguranca[i].Extension = extension
                          setFuncionarios({ ...funcionario, DocumentosSeguranca: funcionario.DocumentosSeguranca })
                        }}
                      />
                    </FormGroup>
                  </Col> }
                  {funcionario.DocumentosSeguranca?.length > 0 && <Col md="1" className="mt-3">
                    <a href='#' style={{ color: '#b10000' }} onClick={() => {
                      funcionario.DocumentosSeguranca.splice(i, 1)
                      setFuncionarios({ ...funcionario, DocumentosSeguranca: funcionario.DocumentosSeguranca })
                    }}>
                      x
                    </a>
                  </Col>}
                </Row>
                </>))}
                <Col className="mb-2" md="12">
                  <a href='#' onClick={() => {
                    funcionario?.DocumentosSeguranca?.push({ id: 0 })
                    setFuncionarios({ ...funcionario, DocumentosSeguranca: funcionario.DocumentosSeguranca })
                  }}>
                    Adicionar Documento
                  </a>
                </Col>
                {funcionario.DocumentosSeguranca?.length > 0 && <Col>
                  <Button className="mb-2" disabled={!funcionario.DocumentosSeguranca?.some(x => x.Selecionado)} onClick={() => {
                    funcionario.DocumentosSeguranca.forEach(element => {
                      if (element.Selecionado && element.UrlArquivo) downloadURI(element.UrlArquivo, element.Descricao)
                    })
                  }}>Baixar Selecionados</Button>
                  <Button className="mb-2 ml-2" disabled={!funcionario.DocumentosSeguranca?.some(x => x.Selecionado)} onClick={async () => {
                    const {value: copy } = await MySwal.fire({
                      text: "E-mails para cópia (Separar e-mails com ';'):",
                      input: "text",
                      showCancelButton: true,
                      confirmButtonText: "Enviar",
                      cancelButtonText: "Continuar sem cópia",
                      customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-outline-primary mr-1"
                      },
                      reverseButtons: true,
                      buttonsStyling: false,
                      showLoaderOnConfirm: true
                    })
                    
                    const files = []
                    funcionario.DocumentosSeguranca.forEach(element => {
                      if (element.Selecionado && element.UrlArquivo) {
                        files.push(element)
                      }
                    })
                    sendFiles(funcionario, files, copy)
                  }}>Enviar Selecionados</Button>
                </Col>}
              </Row>
            </Card>}
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              disabled={isInvalidForm()}
              onClick={e => save(funcionario, afastamento)}
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
})(ModalFuncionario)

