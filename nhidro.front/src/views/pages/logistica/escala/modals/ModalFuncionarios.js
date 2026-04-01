import React, { useState, useEffect } from "react"
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Label, Card, CustomInput, Input, FormGroup
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import moment from "moment"
import uuidv4 from 'uuid/v4'
import Select from "react-select"
import { List_MotivosAfastamento, List_StatusOperacional } from "../../../../../utility/enum/Enums"
moment.locale("pt-br")

const listStatus = ["Todos", "Afastado", "Escalado", "Disponível", "Integrado", "Int. Vencida"];

const ModalFuncionarios = (props) => {
    const { data, modal, handleClose, funcionarios, escalas, updateFuncionarios } = props
    const [escala, setEscala] = useState({})
    const [funcionariosNaoIntegrados, setFuncionariosNaoIntegrados] = useState([])
    const [state, setState] = useState({
      searchTextValue: '',
      status: 'Todos'
    })

    const statusFuncionarios = (funcionarios, dataAtual) => {
        funcionarios?.forEach(funcionario => {
            const fim_afastamento = funcionario.FimAfastamento ? funcionario.FimAfastamento : funcionario.InicioAfastamento ? funcionario.InicioAfastamento : null
            if (funcionario.MotivoAfastamento && (!fim_afastamento || new Date(fim_afastamento) > new Date(new Date().setHours(0, 0, 0, 0)))) {
                    funcionario.Afastado = true
                funcionario.Motivo = List_MotivosAfastamento.find(x => x.value === funcionario.MotivoAfastamento)
                funcionario.StatusOperacao = funcionario.Motivo?.value
            } else if (escalas.find(x => moment(x.Data).format('YYYY-MM-DD') === moment(dataAtual).format('YYYY-MM-DD') && x.EscalaFuncionarios?.some(y => y.Funcionario.id === funcionario.id))) funcionario.Disponivel = false
            else if (data.Cliente?.Integracoes?.find(x => new Date(x.ValidadeIntegracao) >= new Date(new Date().setHours(0, 0, 0, 0)) && x.Funcionario?.id == funcionario.id)) funcionario.Integrado = true
            else if (data.Cliente?.Integracoes?.find(x => new Date(x.ValidadeIntegracao) < new Date(new Date().setHours(0, 0, 0, 0)) && x.Funcionario?.id == funcionario.id)) funcionario.Vencido = true
            else funcionario.Disponivel = true
        })
    }

    const filterFuncionarios = () => {
        let funcs = funcionarios;
        if (state.searchTextValue?.length) {
            const integrados = data.Cliente?.Integracoes?.forEach(x => new Date(x.ValidadeIntegracao) >= new Date(new Date().setHours(0, 0, 0, 0)) && (x.Funcionario?.Nome?.toUpperCase()?.includes(state.searchTextValue.toUpperCase()) || x.Funcionario?.Cargo?.Descricao?.toUpperCase()?.includes(state.searchTextValue.toUpperCase())))?.map(m => m.Funcionario)
            if (data.Data) {
                statusFuncionarios(integrados, data.Data)
            }
            funcs = funcs?.filter(x => (x.Nome?.toUpperCase()?.includes(state.searchTextValue.toUpperCase()) || x.Cargo?.Descricao?.toUpperCase()?.includes(state.searchTextValue.toUpperCase())))
            funcs.forEach(x => {
                if (integrados?.some(s => s.id === x.id)) x.Integrado = true;
            })
            statusFuncionarios(funcs, data.Data)
            // setFuncionariosIntegrados(integrados)
            setFuncionariosNaoIntegrados(funcs)
        } else {
            const integrados = data.Cliente?.Integracoes?.filter(x => new Date(x.ValidadeIntegracao) >= new Date(new Date().setHours(0, 0, 0, 0)))?.map(m => m.Funcionario)
            if (data.Data) {
                statusFuncionarios(integrados, data.Data)
            }
            funcs?.forEach(x => {
                if (integrados?.some(s => s.id === x.id)) x.Integrado = true;
            })
            statusFuncionarios(funcs, data.Data)
            // setFuncionariosIntegrados(integrados)
            setFuncionariosNaoIntegrados(funcs)
        }

        if (state.status !== 'Todos') {
            switch(state.status) {
                case 'Afastado': funcs = funcs.filter(x => x.Afastado); break;
                case 'Escalado': funcs = funcs.filter(x => !x.Disponivel); break;
                case 'Disponível': funcs = funcs.filter(x => x.Disponivel); break;
                case 'Integrado': funcs = funcs.filter(x => x.Integrado); break;
                case 'Int. Vencida': funcs = funcs.filter(x => x.Vencido); break;
                default: funcs = funcs;
            }
            setFuncionariosNaoIntegrados(funcs)
        }
    }

    const handleFilter = (e) => {
      setState({ ...state, [e.target.name]: e?.target?.value })
    }

    useEffect(() => {
        if (data && modal) {
            setEscala(data)
        }
    }, [data, modal])

    useEffect(() => {
        if (escala && modal) {
            filterFuncionarios()
        }
    }, [escala])

    useEffect(() => {
        filterFuncionarios()
    }, [state])

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
                        <h4 className="mt-1 mb-1"><b>Quadro de Funcionários - {escala.Cliente?.RazaoSocial}: {moment(escala.Data).format("DD/MM/YYYY")}</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="3">
                                <Input
                                className="form-control"
                                type="text"
                                id="search-input"
                                placeholder="Procurar"
                                name="searchTextValue"
                                value={state.searchTextValue}
                                onChange={handleFilter}
                                />
                            </Col>
                            <Col md="3">
                                <Select
                                    placeholder="Status"
                                    className="React"
                                    classNamePrefix="select"
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 9999 }),
                                        control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                    }}
                                    name="OS"
                                    noOptionsMessage={() => 'Sem registro!'}
                                    options={listStatus}
                                    getOptionLabel={(option) => option}
                                    getOptionValue={(option) => option}
                                    isSearchable
                                    isClearable
                                    value={
                                        listStatus?.filter((option) => option === state.status)
                                    }
                                    onChange={(object) => {
                                        setState({...state, status: object})
                                    }}
                                />
                            </Col>
                            <div className="event-tags d-none d-sm-flex justify-content-end mt-1">
                                <div className="tag mr-1 ml-4">
                                <span className="bullet bullet-danger bullet-sm mr-50"></span>
                                <span>Funcionário Afastado</span>
                                </div>
                                <div className="tag mr-1">
                                <span className="bullet bullet-secondary bullet-sm mr-50"></span>
                                <span>Funcionário c/ Escala Agendada</span>
                                </div>
                                <div className="tag mr-1">
                                <span className="bullet bullet-success bullet-sm mr-50"></span>
                                <span>Funcionário Disponível</span>
                                </div>
                                <div className="tag mr-1">
                                <span className="bullet bullet-warning bullet-sm mr-50"></span>
                                <span>Funcionário Integrado</span>
                                </div>
                                <div className="tag mr-1">
                                <span className="bullet bullet-info bullet-sm mr-50"></span>
                                <span>Integração Vencida</span>
                                </div>
                            </div>
                        </Row>
                        <Row md="12" className="mt-1">
                            <Col md="6">
                                <Card style={{paddingTop: '3rem', paddingLeft: '3rem', paddingBottom: '2rem'}}>
                                    {funcionariosNaoIntegrados?.map((funcionario, i) => (<>
                                        {funcionario.Disponivel && <Row md="12" style={{width: '100%'}}>
                                            <Col md="1" className="mt-1">
                                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder"></Label>
                                                <CustomInput
                                                    type="checkbox"
                                                    id={uuidv4()}
                                                    className="custom-control-primary zindex-0"
                                                    inline
                                                    checked={funcionario.Selecionado}
                                                    onChange={(e) => {
                                                        funcionariosNaoIntegrados[i].Selecionado = e.target.checked
                                                        setFuncionariosNaoIntegrados([...funcionariosNaoIntegrados], funcionariosNaoIntegrados)
                                                    }}
                                                />
                                            </Col>
                                            <Col md="1" className="mt-1">
                                                <span className={funcionario.Integrado ? "bullet bullet-warning bullet-sm" : funcionario.Afastado ? "bullet bullet-danger bullet-sm" : funcionario.Vencido ? "bullet bullet-info bullet-sm" : !funcionario?.Disponivel ? "bullet bullet-secondary bullet-sm" : "bullet bullet-success bullet-sm"}></span>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Funcionário</Label>
                                                    <Input
                                                        type="text"
                                                        value={`${funcionario?.Nome} - ${funcionario?.Cargo?.Descricao} ${funcionario?.Afastado ? `(${funcionario?.Motivo?.label})` : ''}`}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
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
                                                            List_StatusOperacional?.filter((option) => option.value === funcionario.StatusOperacao)
                                                        }
                                                        onChange={(object) => {
                                                            funcionariosNaoIntegrados[i].StatusOperacao = object.value
                                                            setFuncionariosNaoIntegrados([...funcionariosNaoIntegrados], funcionariosNaoIntegrados)
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>}
                                    </>))}
                                </Card>
                            </Col>
                            <Col md="6">
                                <Card style={{paddingTop: '3rem', paddingLeft: '3rem', paddingBottom: '2rem'}}>
                                    {funcionariosNaoIntegrados?.map((funcionario, i) => (<>
                                        {!funcionario.Disponivel && <Row md="12" style={{width: '100%'}}>
                                            <Col md="1" className="mt-1">
                                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder"></Label>
                                                <CustomInput
                                                    type="checkbox"
                                                    id={uuidv4()}
                                                    className="custom-control-primary zindex-0"
                                                    inline
                                                    checked={funcionario.Selecionado}
                                                    onChange={(e) => {
                                                        funcionariosNaoIntegrados[i].Selecionado = e.target.checked
                                                        setFuncionariosNaoIntegrados([...funcionariosNaoIntegrados], funcionariosNaoIntegrados)
                                                    }}
                                                />
                                            </Col>
                                            <Col md="1" className="mt-1">
                                            <span className={funcionario.Integrado ? "bullet bullet-warning bullet-sm" : funcionario.Afastado ? "bullet bullet-danger bullet-sm" : funcionario.Vencido ? "bullet bullet-info bullet-sm" : !funcionario?.Disponivel ? "bullet bullet-secondary bullet-sm" : "bullet bullet-success bullet-sm"}></span>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Funcionário</Label>
                                                    <Input
                                                        type="text"
                                                        value={`${funcionario?.Nome} - ${funcionario?.Cargo?.Descricao} ${funcionario?.Afastado ? `(${funcionario?.Motivo?.label})` : ''}`}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
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
                                                            List_StatusOperacional?.filter((option) => option.value === funcionario.StatusOperacao)
                                                        }
                                                        onChange={(object) => {
                                                            funcionariosNaoIntegrados[i].StatusOperacao = object.value
                                                            setFuncionariosNaoIntegrados([...funcionariosNaoIntegrados], funcionariosNaoIntegrados)
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>}
                                    </>))}
                                </Card>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button.Ripple
                            color="primary"
                            className="mr-1 mb-1"
                            onClick={e => updateFuncionarios(funcionariosNaoIntegrados?.filter(x => x.Selecionado), escala)}
                        >
                            Definir Funcionários
                        </Button.Ripple>
                    </ModalFooter>
                </Modal>
            </span>
        </div>
    )
}

export default ModalFuncionarios

