import React, { useState, useEffect, useRef } from "react"
import {
    Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, Alert,
    CustomInput
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import moment from "moment"
import { Enum_StatusAgendamentos, List_StatusAgendamentos } from "../../../../../utility/enum/Enums"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
import { compareDates } from "../../../../../utility/date/date"
moment.locale("pt-br")

const ModalCadastroAgenda = (props) => {
    const refComp = useRef(null)
    const { data, modal, handleClose, save, remove, clientes, veiculos, propostas, agendas } = props
    const [isValid, setIsValid] = useState(false)
    const [agenda, setAgenda] = useState({})
    const [veiculoIndisponivel, setVeiculoIndisponivel] = useState(false)

    const fullData = () => {
        return agenda.Data && agenda.Hora && agenda.Cliente?.id > 0 && agenda.Equipamento?.id && agenda.Veiculo?.id
    }

    useEffect(() => {
        if (data) {
            setAgenda(data)
        }
    }, [data])

    useEffect(() => {
        setIsValid(fullData())
    }, [agenda])

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
                        <h4 className="mt-1 mb-1"><b>Agendamento</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Proposta</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                        }}
                                        name="Proposta"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={propostas}
                                        isSearchable
                                        getOptionLabel={(option) => `${option?.Codigo}/${option.Revisao}`}
                                        getOptionValue={(option) => option}
                                        value={
                                            propostas?.filter((option) => option.id === agenda.Proposta?.id)
                                        }
                                        onChange={(object) => {
                                            setAgenda({ ...agenda, Proposta: object })
                                        }}
                                        isDisabled={agenda?.id}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-1">
                                <FormGroup>
                                    <Label className="font-weight-bolder">Data</Label>
                                    <Flatpickr
                                        value={agenda.Data}
                                        onChange={date => {
                                            let data
                                            if (date.length && date[0]?.setHours(0, 0, 0, 0) === date[1]?.setHours(0, 0, 0, 0)) data = date[0]
                                            else if (date.length) data = date
                                            
                                            setVeiculoIndisponivel(agenda.Veiculo?.id ? 
                                                agendas.some(x => x.Veiculo?.id === agenda.Veiculo.id && 
                                                    data.length ? (compareDates(data[0], x.Data) || compareDates(data[1], x.Data)) : compareDates(data, x.Data)) : 
                                                false)
                                            setAgenda({ ...agenda, Data: data})
                                        }}
                                        onClose={ (selectedDates, dateStr, instance) => {
                                        if (selectedDates.length === 1) {
                                            instance.setDate([selectedDates[0], selectedDates[0]], true)
                                        }
                                        }}
                                        className="form-control"
                                        key={Portuguese}
                                        options={{ mode: agenda.id ? 'single' : 'range', locale: Portuguese, dateFormat: 'd-m-Y'  }}
                                        name="Data"
                                        placeholder="Data"
                                        ref={refComp}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label className="font-weight-bolder">Hora</Label>
                                    <Input style={!agenda.Hora ? { borderColor: '#cc5050' } : {}}
                                        type="time"
                                        id="Hora"
                                        name="Hora"
                                        placeholder="Hora"
                                        value={agenda.Hora}
                                        onChange={(e) => setAgenda({ ...agenda, [e.target.name]: e.target.value })}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="5" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cliente</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: agenda.Cliente?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Cliente"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={clientes}
                                        isSearchable
                                        getOptionLabel={(option) => option?.RazaoSocial}
                                        getOptionValue={(option) => option}
                                        value={
                                            clientes?.filter((option) => option.id === agenda.Cliente?.id)
                                        }
                                        onChange={(object) => {
                                            setAgenda({ ...agenda, Cliente: object })
                                        }}
                                        isDisabled={agenda?.id}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Equipamento</Label>
                                    <Input style={!agenda.Equipamento?.id ? { borderColor: '#cc5050' } : {}}
                                        type="text"
                                        id="Equipamento"
                                        name="Equipamento"
                                        placeholder="Equipamento"
                                        value={agenda.Equipamento?.Equipamento}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Veículos</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: agenda.Veiculo?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Veiculo"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={veiculos}
                                        isSearchable
                                        getOptionLabel={(option) => `${option?.Descricao} - ${option?.Placa}`}
                                        getOptionValue={(option) => option}
                                        value={
                                            veiculos?.filter((option) => option.id === agenda.Veiculo?.id)
                                        }
                                        onChange={(object) => {
                                            const dataAgenda1 = agenda.Data[0];
                                            const dataAgenda2 = agenda.Data[1];
                                            setVeiculoIndisponivel(agenda.Data ? 
                                                agendas.some(x => x.Veiculo?.id === object.id && 
                                                    agenda.Data.length ? (compareDates(dataAgenda1, x.Data) || compareDates(dataAgenda2, x.Data)) : compareDates(agenda.Data, x.Data)) :
                                                false) //incluir data no filtro
                                            setAgenda({ ...agenda, Veiculo: object })
                                        }}
                                        isDisabled={agenda.id}
                                    />
                                    {veiculoIndisponivel && 
                                    <Alert color='danger'>
                                        <div className='alert-body'>
                                        <span className='fw-bold'>Veículo possui agenda neste dia!</span>
                                        </div>
                                    </Alert>}
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Status</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: agenda.Status ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Status"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={List_StatusAgendamentos}
                                        isSearchable
                                        getOptionLabel={(option) => option?.label}
                                        getOptionValue={(option) => option?.value}
                                        value={
                                            List_StatusAgendamentos?.filter((option) => option.value === agenda.Status)
                                        }                                        onChange={(object) => {
                                            setAgenda({ ...agenda, Status: object.value })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            {agenda.Status === Enum_StatusAgendamentos.Confirmado && <Col md="6" className="mt-1">
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Gerar Escala?</Label>
                                <CustomInput
                                type="switch"
                                id="GerarEscala"
                                name="customSwitch"
                                className="custom-control-primary zindex-0"
                                label=""
                                inline
                                checked={agenda.GerarEscala}
                                onChange={(e) => {
                                    setAgenda({ ...agenda, GerarEscala: e.target.checked })
                                }}
                                />
                            </Col>}
                            <Col md="12" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Observações</Label>
                                <Input
                                    type="textarea"
                                    rows={2}
                                    id="Observacoes"
                                    name="Observacoes"
                                    placeholder="Observações"
                                    value={agenda.Observacoes}
                                    onChange={(e) => {
                                        setAgenda({ ...agenda, Observacoes: e.target.value })
                                    }}
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button.Ripple
                            disabled={!agenda.id}
                            color="danger"
                            className="mr-1 mb-1"
                            onClick={e => remove(agenda)}
                        >
                            Deletar Agenda
                        </Button.Ripple>
                        <Button.Ripple
                            disabled={!isValid}
                            color="primary"
                            className="mr-1 mb-1"
                            onClick={e => save(agenda)}
                        >
                            Salvar Agenda
                        </Button.Ripple>
                    </ModalFooter>
                </Modal>
            </span>
        </div>
    )
}

export default ModalCadastroAgenda

