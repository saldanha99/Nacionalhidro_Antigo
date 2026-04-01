import React, { useState, useEffect } from "react"
import {
  Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, CustomInput
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import { connect } from "react-redux"
import Select from "react-select"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { formatImage } from '../../../../utility/file/index'
import swal from 'sweetalert'
import uuidv4 from 'uuid/v4'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { Enum_TipoResponsabilidade } from "../../../../utility/enum/Enums"

const ModalEquipamento = (props) => {
  const { data, modal, handleClose, aprove, responsabilidadesPadrao, responsabilidadesAtivos, acessoriosOptions, acessoriosPadrao, veiculos, naturezas, setData } = props
  const [equipamento, setEquipamento] = useState({
    EquipamentoResponsabilidades: [],
    EquipamentoAcessorios: []
  })
  const [optionsAtivos] = useState([{ label: 'Sim', value: true }, { label: 'Não', value: false }])
  const [updateImagem, setUpdateImagem] = useState(false)
  const [urlImagem, setUrlImagem] = useState('')
  const [textImagem, setTextImagem] = useState('')
  const [toggleResponsabilidades, setToggleResponsabilidades] = useState(false)
  const [toggleAcessorios, setToggleAcessorios] = useState(false)
  const [toggleVeiculos, setToggleVeiculos] = useState(false)

  useEffect(() => {
    if (data) {
      if (!data.EquipamentoResponsabilidades) {
        data.EquipamentoResponsabilidades = []
        if (responsabilidadesPadrao.length === 0) {
          data.EquipamentoResponsabilidades.push({ id: 0 })
        } else {
          responsabilidadesPadrao.forEach(r => {
            data.EquipamentoResponsabilidades.push({ Responsabilidade: r })
          })
        }
      }
      if (!data.EquipamentoAcessorios) {
        data.EquipamentoAcessorios = []
        if (acessoriosPadrao.length === 0) {
          data.EquipamentoAcessorios.push({ id: 0 })
        } else {
          acessoriosPadrao.forEach(a => {
            data.EquipamentoAcessorios.push({ Acessorio: a })
          })
        }
      }
      if (!data.Veiculos) {
        data.Veiculos = []
      }

      if (data.UrlImagem) {
        setUrlImagem(data.UrlImagem)
        setUpdateImagem(true)
      } else {
        setUrlImagem('')
        setTextImagem('')
      }
      if (!data?.id) {
        data.Ativo = true
      }
      setEquipamento(data)
    }
  }, [data])

  useEffect(() => {
    if (modal) {
      if (data.UrlImagem) {
        setUrlImagem(data.UrlImagem)
        setUpdateImagem(true)
      }
    } else {
      setUrlImagem('')
      setTextImagem('')
      setUpdateImagem(false)
      setEquipamento({})
      setData(null)
    }
  }, [modal])

  const handleChange = (value) => {
    if (!value.includes('<img src="data:') || value === '<p><br></p>') return setTextImagem('')
    const array = value.split('<img src="data:')
    const countImages = array.length
    if (countImages > 2) {
      return setTextImagem(`<p><img src="data:${array[2]}`)
    }
    setTextImagem(value)
  }

  const save = () => {
    const span = document.createElement("span")
    span.innerHTML = "Tem certeza que deseja salvar os dados?"
    swal({
      title: "Aviso",
      content: span,
      icon: "warning",
      buttons: ['Cancelar', 'Continuar'],
      dangerMode: true
    })
      .then((ok) => {
        if (ok) {
          handleClose()
          if (!updateImagem && textImagem) {
            const image = formatImage(textImagem)
            const extension = image.type.split('/')[1]
            const filename = `${uuidv4()}.${extension}`
            aprove(equipamento, image.buffer, filename, image.type)
          } else {
            aprove(equipamento)
          }
        } else swal("Processo cancelado!")
      })
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
            <h4 className="mt-1 mb-1"><b>Cadastro equipamento</b></h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Equipamento</Label>
                  <Input style={!equipamento.Equipamento ? { borderColor: '#cc5050' } : {}}
                    type="text"
                    id="Equipamento"
                    name="Equipamento"
                    placeholder="Equipamento"
                    value={equipamento.Equipamento}
                    onChange={(e) => setEquipamento({ ...equipamento, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descrição</Label>
                  <Input
                    type="textarea"
                    id="Descricao"
                    name="Descricao"
                    placeholder="Descrição"
                    value={equipamento.Descricao}
                    onChange={(e) => setEquipamento({ ...equipamento, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Ativo</Label>
                  <Select
                    placeholder="Ativo"
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="Ativo"
                    noOptionsMessage={() => 'Sem ativo!'}
                    options={optionsAtivos}
                    isSearchable
                    value={
                      optionsAtivos.filter((option) => option.value === equipamento?.Ativo)
                    }
                    onChange={(e) => setEquipamento({ ...equipamento, Ativo: e.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Imagem</Label>
                  {!updateImagem ? <ReactQuill value={textImagem || ''}
                    id="img-equip"
                    placeholder='Cole ou carregue aqui sua imagem...'
                    modules={{
                      toolbar: [['image']]
                    }}
                    onChange={e => handleChange(e)} /> : <Col>
                    <p>
                      <img width={350} src={urlImagem} />
                    </p>
                    <Button.Ripple
                      color="primary"
                      className="mr-1 mb-1"
                      onClick={() => {
                        setTextImagem('')
                        setUpdateImagem(false)
                      }}
                    >
                      Alterar imagem
                    </Button.Ripple>
                  </Col>
                  }
                </FormGroup>
              </Col>
            </Row>
            <br />
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} className="mt-4">
              <Col md="12" className="mt-1" >
                {
                  isHidden(toggleResponsabilidades) ? <MdKeyboardArrowDown size={30} style={{ cursor: 'pointer' }} onClick={() => setToggleResponsabilidades(!toggleResponsabilidades)}
                  /> : <MdKeyboardArrowUp size={30} style={{ cursor: 'pointer' }} onClick={() => setToggleResponsabilidades(!toggleResponsabilidades)} />
                }
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '17px'
                  }}
                >
                  Responsabilidades
                </span>
              </Col>
            </Row>
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} hidden={isHidden(toggleResponsabilidades)}>
              {equipamento?.EquipamentoResponsabilidades?.map((x, i) => (<>
                <Col md="8" className="mt-1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Responsabilidade</Label>
                    {x?.Responsabilidade?.Padrao ? <Input
                      type="text"
                      name="Responsabilidade"
                      placeholder="Responsabilidade"
                      disabled
                      value={x?.Responsabilidade.Responsabilidade}
                      onChange={(e) => {
                        equipamento.Responsabilidades[i].Responsabilidade.Responsabilidade = e.target.value
                        setEquipamento({ ...equipamento, Responsabilidades: equipamento.Responsabilidades })
                      }}
                    /> : <Select
                      placeholder="Responsabilidade"
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="Tipo"
                      noOptionsMessage={() => 'Sem Responsabilidade!'}
                      options={responsabilidadesAtivos}
                      isSearchable
                      value={responsabilidadesAtivos?.filter((option) => option.value.id === x?.Responsabilidade?.id)}
                      onChange={(e) => {
                        equipamento.EquipamentoResponsabilidades[i].Responsabilidade = e.value
                        setEquipamento({ ...equipamento, EquipamentoResponsabilidades: equipamento.EquipamentoResponsabilidades })
                      }}
                    />}
                  </FormGroup>
                </Col>
                <Col md="3" className="mt-1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Responsável</Label>
                    <Input
                      type="text"
                      name="Responsavel"
                      placeholder="Responsável"
                      disabled
                      value={x?.Responsabilidade?.Responsavel === Enum_TipoResponsabilidade.Contratado ? 'Contratado' : x?.Responsabilidade?.Responsavel === Enum_TipoResponsabilidade.Contratante ? 'Contratante' : '-'}
                    />
                  </FormGroup>
                </Col>
                {equipamento.EquipamentoResponsabilidades.length > 0 && <Col md="1" className="mt-3">
                  <a href='#' style={{ color: '#b10000' }} onClick={() => {
                    equipamento.EquipamentoResponsabilidades.splice(i, 1)
                    setEquipamento({ ...equipamento, EquipamentoResponsabilidades: equipamento.EquipamentoResponsabilidades })
                  }}>
                    x
                  </a>
                </Col>}
              </>))}
              <Col className="mb-2" md="12">
                <a href='#' onClick={() => {
                  equipamento?.EquipamentoResponsabilidades?.push({ id: 0 })
                  setEquipamento({ ...equipamento, EquipamentoResponsabilidades: equipamento.EquipamentoResponsabilidades })
                }}>
                  Adicionar Responsabilidade
                </a>
              </Col>
            </Row>
            <br />
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} className="mt-4">
              <Col md="12" className="mt-1" >
                {
                  isHidden(toggleAcessorios) ? <MdKeyboardArrowDown size={30} style={{ cursor: 'pointer' }} onClick={() => setToggleAcessorios(!toggleAcessorios)}
                  /> : <MdKeyboardArrowUp size={30} style={{ cursor: 'pointer' }} onClick={() => setToggleAcessorios(!toggleAcessorios)} />
                }
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '17px'
                  }}
                >
                  Acessórios
                </span>
              </Col>
            </Row>
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} hidden={isHidden(toggleAcessorios)}>
              {equipamento?.EquipamentoAcessorios?.map((x, i) => (<>
                <Col md="8" className="mt-1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Acessório</Label>
                    {x?.Acessorio?.Padrao ? <Input
                      type="text"
                      name="Nome"
                      placeholder="Nome"
                      value={x?.Acessorio.Nome}
                      disabled
                      onChange={(e) => {
                        equipamento.EquipamentoAcessorios[i].Acessorio.Nome = e.target.value
                        setEquipamento({ ...equipamento, EquipamentoAcessorios: equipamento.EquipamentoAcessorios })
                      }}
                    /> : <Select
                      placeholder="Acessório"
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="Nome"
                      noOptionsMessage={() => 'Sem Acessório!'}
                      options={acessoriosOptions}
                      isSearchable
                      value={acessoriosOptions?.filter((option) => option.value.id === x?.Acessorio?.id)}
                      onChange={(e) => {
                        equipamento.EquipamentoAcessorios[i].Acessorio = e.value
                        setEquipamento({ ...equipamento, EquipamentoAcessorios: equipamento.EquipamentoAcessorios })
                      }}
                    />}
                  </FormGroup>
                </Col>
                {equipamento.EquipamentoAcessorios.length > 0 && <Col md="1" className="mt-3">
                  <a href='#' style={{ color: '#b10000' }} onClick={() => {
                    equipamento.EquipamentoAcessorios.splice(i, 1)
                    setEquipamento({ ...equipamento, EquipamentoAcessorios: equipamento.EquipamentoAcessorios })
                  }}>
                    x
                  </a>
                </Col>}
              </>))}
              <Col className="mb-2" md="12">
                <a href='#' onClick={() => {
                  equipamento?.EquipamentoAcessorios?.push({ id: 0 })
                  setEquipamento({ ...equipamento, EquipamentoAcessorios: equipamento.EquipamentoAcessorios })
                }}>
                  Adicionar Acessório
                </a>
              </Col>
            </Row>
            <br />
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} className="mt-4">
              <Col md="12" className="mt-1" >
                {
                  isHidden(toggleVeiculos) ? <MdKeyboardArrowDown size={30} style={{ cursor: 'pointer' }} onClick={() => setToggleVeiculos(!toggleVeiculos)}
                  /> : <MdKeyboardArrowUp size={30} style={{ cursor: 'pointer' }} onClick={() => setToggleVeiculos(!toggleVeiculos)} />
                }
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '17px'
                  }}
                >
                  Veículos
                </span>
              </Col>
            </Row>
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} hidden={isHidden(toggleVeiculos)}>
              {equipamento?.Veiculos?.map((x, i) => (<>
                <Col md="8" className="mt-1">
                  <FormGroup>
                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Veículo</Label>
                    <Select
                      placeholder="Veículo"
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 }),
                        control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                      }}
                      name="Nome"
                      noOptionsMessage={() => 'Sem Veículo!'}
                      options={veiculos}
                      getOptionLabel={(option) => option?.Descricao}
                      getOptionValue={(option) => option}
                      isSearchable
                      value={veiculos?.filter((option) => option.id === x?.id)}
                      onChange={(e) => {
                        equipamento.Veiculos[i] = e
                        setEquipamento({ ...equipamento, Veiculos: equipamento.Veiculos })
                      }}
                    />
                  </FormGroup>
                </Col>
                {equipamento.Veiculos.length > 0 && <Col md="1" className="mt-3">
                  <a href='#' style={{ color: '#b10000' }} onClick={() => {
                    equipamento.Veiculos.splice(i, 1)
                    setEquipamento({ ...equipamento, Veiculos: equipamento.Veiculos })
                  }}>
                    x
                  </a>
                </Col>}
              </>))}
              <Col className="mb-2" md="12">
                <a href='#' onClick={() => {
                  equipamento?.Veiculos?.push({ id: 0 })
                  setEquipamento({ ...equipamento, Veiculos: equipamento.Veiculos })
                }}>
                  Adicionar Veículo
                </a>
              </Col>
            </Row>
            <br />
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }} className="mt-4">
              <Col md="12" className="mt-1" >
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '17px'
                  }}
                >
                  Natureza Contábil
                </span>
              </Col>
            </Row>
            <Row style={{ background: '#E3E3E3', padding: '2px', margin: '0 10px 0 10px' }}>
              <Col md="12" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Natureza</Label>
                  <Select
                    placeholder="Natureza"
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                    }}
                    name="Nome"
                    noOptionsMessage={() => 'Sem Natureza!'}
                    options={naturezas}
                    getOptionLabel={(option) => option?.Descricao}
                    getOptionValue={(option) => option}
                    isSearchable
                    value={naturezas?.filter((option) => option.id === equipamento.Natureza?.id)}
                    onChange={(e) => {
                      setEquipamento({ ...equipamento, Natureza: e })
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
              onClick={() => save()}
              disabled={!equipamento?.Equipamento?.length || !equipamento?.Descricao?.length || (equipamento.Ativo === null || equipamento.Ativo === undefined)}
            >
              Salvar
            </Button.Ripple>
          </ModalFooter>
        </Modal>
      </span>
    </div>
  )
}

const mapStateToProps = () => {
  return {
  }
}

export default connect(mapStateToProps, {
})(ModalEquipamento)

