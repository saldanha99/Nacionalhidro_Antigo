import React, { useState, useEffect } from "react"
import {
    Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, Alert, CustomInput
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import moment from "moment"
import ModalFuncionarios from "./ModalFuncionarios"
import { List_MotivosAfastamento, List_StatusOperacional } from "../../../../../utility/enum/Enums"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import ModalVeiculos from "./ModalVeiculos"
moment.locale("pt-br")

const MySwal = withReactContent(Swal)
const options = [{ label: 'Sim', value: true }, { label: 'Não', value: false }]

const ModalCadastroEscala = (props) => {
    const { data, modal, handleClose, save, equipamentos, clientes, ordens, veiculos, funcionarios, escalas, empresas } = props
    const [isValid, setIsValid] = useState(false)
    const [escala, setEscala] = useState({})
    const [os, setOs] = useState()
    const [modalFuncionarios, setModalFuncionarios] = useState(false)
    const [modalVeiculos, setModalVeiculos] = useState(false)

    const validateEquipes = () => {
        for (let i = 0; i < escala?.EscalaFuncionarios.length; i++) {
            if (!escala.EscalaFuncionarios[i].Funcionario?.id) {
                return false
            }            
        }
        return true
    }

    const fullData = () => {
        return escala.Data && validateEquipes() && escala.Equipamento?.id && escala.Empresa?.id
    }

    const handleCloseFuncionarios = () => {
      setModalFuncionarios(false)
    }

    const handleCloseVeiculos = () => {
      setModalVeiculos(false)
    }

    const updateFuncionarios = (integrados, naoIntegrados, escala) => {
        const temFuncIndisponivel = integrados?.some(x => x.Afastado) || naoIntegrados?.some(x => x.Afastado)
        if (temFuncIndisponivel) {  
          MySwal.fire({
            title: "Aviso",
            text: "Existem funcionários afastados selecionados. Deseja prosseguir?",
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
          })
            .then((result) => {
              if (result.value) {
                let funcionarios = integrados?.length ? integrados : []
                funcionarios = funcionarios.concat(naoIntegrados)

                escala.EscalaFuncionarios = []

                funcionarios.forEach(element => {
                    escala.EscalaFuncionarios.push({
                        Funcionario: element,
                        StatusOperacao: element.StatusOperacao
                    })
                })
                setEscala({... escala, EscalaFuncionarios: escala.EscalaFuncionarios})
                handleCloseFuncionarios()
              }
            })
        } else {
            let funcionarios = integrados?.length ? integrados : []
            funcionarios = funcionarios.concat(naoIntegrados)

            escala.EscalaFuncionarios = []

            funcionarios.forEach(element => {
                escala.EscalaFuncionarios.push({
                    Funcionario: element,
                    StatusOperacao: element.StatusOperacao
                })
            })
            setEscala({... escala, EscalaFuncionarios: escala.EscalaFuncionarios})
            handleCloseFuncionarios()
        }
    }

    const updateVeiculos = (veiculos, escala) => {
      const temIndisponivel = veiculos?.some(x => x.Manutencao)
      if (temIndisponivel) {  
        MySwal.fire({
          title: "Aviso",
          text: "Existem veículos em manutenção selecionados. Deseja prosseguir?",
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
        })
          .then((result) => {
            if (result.value) {
              escala.EscalaVeiculos = []
              veiculos.forEach(element => {
                escala.EscalaVeiculos.push({
                      Veiculo: element,
                      Manutencao: element.Manutencao
                    })
              })
              setEscala({... escala, EscalaVeiculos: escala.EscalaVeiculos})
              handleCloseVeiculos()
            }
          })
      } else {
        escala.EscalaVeiculos = []
        veiculos.forEach(element => {
          escala.EscalaVeiculos.push({
                Veiculo: element,
                Manutencao: element.Manutencao
              })
        })
        setEscala({... escala, EscalaVeiculos: escala.EscalaVeiculos})
        handleCloseVeiculos()
      }
    }

    useEffect(() => {
        if (data) {
            if (!data.EscalaFuncionarios) {
                data.EscalaFuncionarios = [{id: 0}]
            }
            setEscala(data)
            setOs(data.OrdemServico?.id)
        }
    }, [data])

    useEffect(() => {
        setIsValid(fullData())
    }, [escala])

    return (
        <div>
            <span>
                <Modal
                    isOpen={modal}
                    size="xl"
                    toggle={() => handleClose()}
                    className="modal-dialog-centered"
                    backdrop={false}
                >
                    <ModalHeader
                        toggle={() => handleClose()}
                        style={{ background: '#2F4B7433' }}
                        cssModule={{ close: 'close button-close' }}
                    >
                        <h4 className="mt-1 mb-1"><b>Escala</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        <ModalFuncionarios data={JSON.parse(JSON.stringify(escala)) } modal={modalFuncionarios} handleClose={handleCloseFuncionarios} funcionarios={JSON.parse(JSON.stringify(funcionarios)) } escalas={escalas} updateFuncionarios={updateFuncionarios} />
                        <ModalVeiculos data={JSON.parse(JSON.stringify(escala)) } modal={modalVeiculos} handleClose={handleCloseVeiculos} veiculos={JSON.parse(JSON.stringify(veiculos)) } escalas={escalas} updateVeiculos={updateVeiculos} />
                        <Row>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label className="font-weight-bolder">Código OS</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                        }}
                                        name="OS"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={ordens}
                                        isSearchable
                                        isClearable
                                        getOptionLabel={(option) => `${option?.Codigo}/${option?.Numero}`}
                                        getOptionValue={(option) => option}
                                        value={
                                            ordens?.filter((option) => option.id === escala.OrdemServico?.id)
                                        }
                                        onChange={(object) => {
                                            if (object) setEscala({ ...escala, Cliente: object.Cliente, Equipamento: object.Equipamento, Data: object.DataInicial, OrdemServico: object, Empresa: object.Empresa })
                                            else setEscala({... escala, OrdemServico: object})
                                        }}
                                    />
                                    {escala.OrdemServico?.Escala?.id && escala.OrdemServico?.Escala?.id !== os &&
                                    <Alert color='danger'>
                                        <div className='alert-body'>
                                        <span className='fw-bold'>OS já possui uma escala, se prosseguir a escala existente será substituída!</span>
                                        </div>
                                    </Alert>}
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label className="font-weight-bolder">Data</Label>
                                    <Input style={!escala.Data ? { borderColor: '#cc5050' } : {}}
                                        type="date"
                                        id="Data"
                                        name="Data"
                                        placeholder="Data"
                                        value={escala.Data}
                                        onChange={(e) => { 
                                            setEscala({ ...escala, [e.target.name]: e.target.value })
                                        }}
                                        disabled={escala.OrdemServico?.id}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label className="font-weight-bolder">Hora</Label>
                                    <Input
                                        type="time"
                                        id="Hora"
                                        name="Hora"
                                        placeholder="Hora"
                                        value={escala.Hora}
                                        onChange={(e) => setEscala({ ...escala, [e.target.name]: e.target.value })}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Empresa</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: escala.StatusOperacao || escala.Empresa?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Empresa"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={empresas}
                                        isSearchable
                                        getOptionLabel={(option) => option?.Descricao}
                                        getOptionValue={(option) => option}
                                        value={
                                            empresas?.filter((option) => option.id === escala.Empresa?.id)
                                        }
                                        onChange={(object) => {
                                            setEscala({ ...escala, Empresa: object })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-1">
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
                                            clientes?.filter((option) => option.id === escala.Cliente?.id)
                                        }
                                        onChange={(object) => {
                                            escala.Cliente = object
                                            escala.Empresa = object.Empresa?.id ? object.Empresa : escala.Empresa
                                            setEscala({ ...escala, escala })
                                        }}
                                        isDisabled={escala.OrdemServico?.id}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Equipamento</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: escala.StatusOperacao || escala.Equipamento?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Equipamento"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={equipamentos}
                                        isSearchable
                                        getOptionLabel={(option) => option?.Equipamento}
                                        getOptionValue={(option) => option}
                                        value={
                                            equipamentos?.filter((option) => option.id === escala.Equipamento?.id)
                                        }
                                        onChange={(object) => {
                                            setEscala({ ...escala, Equipamento: object })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12" className="mt-3" >
                                <span>Veículos</span>
                            </Col>
                        </Row>
                        <br />
                        <Row style={{ background: 'white' }} className="mt-1">
                            <Col md="12">
                                <a href="#" style={{ fontWeight: 'bold', fontSize: '12px' }} onClick={() => setModalVeiculos(true)}>
                                Ver Quadro de Veículos
                                </a>
                            </Col>
                        </Row>
                        {escala?.EscalaVeiculos?.map((x, i) => (<Row>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Veículo</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                        }}
                                        name="Veiculo"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={veiculos}
                                        isSearchable
                                        isClearable
                                        getOptionLabel={(option) => option?.Placa}
                                        getOptionValue={(option) => option}
                                        value={
                                            veiculos?.filter((option) => option.id === x.Veiculo?.id)
                                        }
                                        onChange={(object) => {
                                            escala.EscalaVeiculos[i].Veiculo = object
                                            setEscala({ ...escala, Escala: escala })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
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
                                        value={options.filter((option) => option.value === x.Manutencao)}
                                        onChange={(e) => {
                                            escala.EscalaVeiculos[i].Manutencao = e.value
                                            setEscala({ ...escala, Escala: escala })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-3">
                                <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                    escala.EscalaVeiculos.splice(i, 1)
                                    setEscala({ ...escala, Escala: escala })
                                }}>
                                    x
                                </a>
                            </Col>
                        </Row>))}
                        <a href='#' onClick={() => {
                            if (!escala.EscalaVeiculos) escala.EscalaVeiculos = []
                            escala.EscalaVeiculos.push({ id: 0, Manutencao: false })
                            setEscala({ ...escala, Escala: escala })
                        }}>
                            Adicionar veículo
                        </a>
                        <br />
                        <Row>
                            <Col md="12" className="mt-3" >
                                <span>Funcionários</span>
                            </Col>
                        </Row>
                        <br />
                        <Row style={{ background: 'white' }} className="mt-1">
                            <Col md="12">
                                <a href="#" style={{ fontWeight: 'bold', fontSize: '12px' }} onClick={() => setModalFuncionarios(true)}>
                                Ver Quadro de Funcionários
                                </a>
                            </Col>
                        </Row>
                        {escala?.EscalaFuncionarios?.map((x, i) => (<Row>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Funcionário</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.Funcionario?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Funcionario"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={funcionarios}
                                        isSearchable
                                        isClearable
                                        getOptionLabel={(option) => `${option?.Nome} - ${option?.Cargo?.Descricao}`}
                                        getOptionValue={(option) => option}
                                        value={
                                            funcionarios?.filter((option) => option.id === x.Funcionario?.id)
                                        }
                                        onChange={(object) => {
                                            if (object.MotivoAfastamento && new Date(object.FimAfastamento) > new Date(new Date().setHours(0, 0, 0, 0))) {
                                                object.Afastado = true
                                                object.Motivo = List_MotivosAfastamento.find(x => x.value === object.MotivoAfastamento)
                                                object.StatusOperacao = object.Motivo?.value
                                                escala.EscalaFuncionarios[i].StatusOperacao = object.Motivo?.value
                                            } else if (escalas.find(x => x.id !== escala.id && x.Data === escala.Data && x.EscalaFuncionarios?.some(y => y.Funcionario.id === object.id))) object.Disponivel = false
                                            else object.Disponivel = true

                                            if (object.Afastado) {
                                                MySwal.fire({
                                                    title: "Aviso",
                                                    text: "O funcionário selecionado está afastado!",
                                                    icon: "warning",
                                                    customClass: {
                                                      confirmButton: "btn btn-danger"
                                                    },
                                                    buttonsStyling: false
                                                  })
                                            } else if (!object.Disponivel) MySwal.fire({
                                                title: "Aviso",
                                                text: "O funcionário selecionado já está escalado em outro cliente!",
                                                icon: "warning",
                                                customClass: {
                                                  confirmButton: "btn btn-danger"
                                                },
                                                buttonsStyling: false
                                              })
                                            escala.EscalaFuncionarios[i].Funcionario = object
                                            setEscala({ ...escala, Escala: escala })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Status Operacional</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                        }}
                                        name="OS"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={List_StatusOperacional}
                                        isSearchable
                                        isClearable
                                        value={
                                            List_StatusOperacional?.filter((option) => option.value === x.StatusOperacao)
                                        }
                                        onChange={(object) => {
                                            escala.EscalaFuncionarios[i].StatusOperacao = object.value
                                            setEscala({ ...escala, Escala: escala })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem", marginBottom: "2%"}} className="font-weight-bolder">Não compareceu</Label><br/>
                                    <CustomInput
                                        type="checkbox"
                                        id={`Ausente-${i}`}
                                        className="custom-control-primary zindex-0"
                                        inline
                                        checked={escala.EscalaFuncionarios[i].Ausente}
                                        onChange={(e) => {
                                            escala.EscalaFuncionarios[i].Ausente = e.target.checked
                                            setEscala({ ...escala, Escala: escala })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-3">
                                <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                    escala.EscalaFuncionarios.splice(i, 1)
                                    setEscala({ ...escala, Escala: escala })
                                }}>
                                    x
                                </a>
                            </Col>
                        </Row>))}
                        <a href='#' onClick={() => {
                            escala.EscalaFuncionarios.push({ id: 0 })
                            setEscala({ ...escala, Escala: escala })
                        }}>
                            Adicionar funcionário
                        </a>
                        <br />
                        <Row>
                            <Col md="12" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Observações</Label>
                                <Input
                                    type="textarea"
                                    rows={2}
                                    id="Observacoes"
                                    name="Observacoes"
                                    placeholder="Observações"
                                    value={escala.Observacoes}
                                    onChange={(e) => {
                                        setEscala({ ...escala, Observacoes: e.target.value })
                                    }}
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button.Ripple
                            disabled={!isValid}
                            color="primary"
                            className="mr-1 mb-1"
                            onClick={e => save(escala)}
                        >
                            Salvar Escala
                        </Button.Ripple>
                    </ModalFooter>
                </Modal>
            </span>
        </div>
    )
}

export default ModalCadastroEscala

