import React, { useState, useEffect } from "react"
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Label, Card, CustomInput, Input, FormGroup
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import moment from "moment"
import uuidv4 from 'uuid/v4'
import Select from "react-select"
moment.locale("pt-br")

const options = [{ label: 'Sim', value: true }, { label: 'Não', value: false }]
const listStatus = ["Todos", "Manutenção", "Disponível", "Em uso"];

const ModalVeiculos = (props) => {
    const { data, modal, handleClose, veiculos, escalas, updateVeiculos } = props
    const [escala, setEscala] = useState({})
    const [list, setList] = useState([])
    const [state, setState] = useState({
      searchTextValue: '',
      status: 'Todos'
    })

    const handleFilter = (e) => {
      setState({ ...state, [e.target.name]: e?.target?.value })
    }

    const statusVeiculos = (veiculos) => {
        veiculos?.forEach(veiculo => {
            if (escalas.find(x => moment(x.Data).format('YYYY-MM-DD') === moment(data.Data).format('YYYY-MM-DD') && x.EscalaVeiculos?.some(y => y.Veiculo?.id === veiculo.id))) veiculo.Disponivel = false
            else veiculo.Disponivel = true
        })
        setList(veiculos)
    }

    useEffect(() => {
        if (data && modal) {
            setList([])
            setEscala(data)
        }
    }, [data, modal])

    useEffect(() => {
        if (escala && modal) {
            statusVeiculos(veiculos)
        }
    }, [escala])

    useEffect(() => {
        let itens = []
        if (state.searchTextValue) itens = veiculos.filter(x => x.Descricao?.toUpperCase()?.includes(state.searchTextValue.toUpperCase()) || x.Placa?.toUpperCase()?.includes(state.searchTextValue.toUpperCase()))
        else itens = veiculos

        if (state.status !== 'Todos') {
            switch(state.status) {
                case 'Manutenção': itens = itens.filter(x => x.Manutencao); break;
                case 'Disponível': itens = itens.filter(x => x.Disponivel); break;
                case 'Em uso': itens = itens.filter(x => !x.Disponivel); break;
                default: itens = itens;
            }
        }

        
        statusVeiculos(itens, data.Data)
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
                        <h4 className="mt-1 mb-1"><b>Quadro de Veículos - {escala.Cliente?.RazaoSocial}: {moment(data.Data).format("DD/MM/YYYY")}</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="6">
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
                            <Col md="6">
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
                                <span>Veículo em Manutenção</span>
                                </div>
                                <div className="tag mr-1">
                                <span className="bullet bullet-success bullet-sm mr-50"></span>
                                <span>Veículo Disponível</span>
                                </div>
                                <div className="tag mr-1">
                                <span className="bullet bullet-secondary bullet-sm mr-50"></span>
                                <span>Veículo em Uso</span>
                                </div>
                            </div>
                        </Row>
                        <Row md="12" className="mt-1">
                            <Col md="6">
                                <Card style={{paddingTop: '3rem', paddingLeft: '3rem', paddingBottom: '2rem'}}>
                                    {list?.filter(x => x.Disponivel)?.map((veiculo, i) => (<>
                                        <Row md="12" style={{width: '100%'}}>
                                            <Col md="1" className="mt-1">
                                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder"></Label>
                                                <CustomInput
                                                    type="checkbox"
                                                    id={uuidv4()}
                                                    className="custom-control-primary zindex-0"
                                                    inline
                                                    checked={veiculo.Selecionado}
                                                    onChange={(e) => {
                                                        list[i].Selecionado = e.target.checked
                                                        setList([...list], list)
                                                    }}
                                                />
                                            </Col>
                                            <Col md="1" className="mt-1">
                                                <span className={veiculo.Manutencao ? "bullet bullet-danger bullet-sm" :  veiculo.Disponivel ? "bullet bullet-success bullet-sm" : "bullet bullet-secondary bullet-sm"}></span>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Veículo</Label>
                                                    <Input
                                                        type="text"
                                                        value={`${veiculo?.Descricao} - ${veiculo?.Placa}`}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
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
                                                        name="OS"
                                                        noOptionsMessage={() => 'Sem registro!'}
                                                        options={options}
                                                        isSearchable
                                                        isClearable
                                                        value={
                                                            options?.filter((option) => option.value === veiculo.Manutencao)
                                                        }
                                                        onChange={(object) => {
                                                            list[i].Manutencao = object.value
                                                            setList([...list], list)
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </>))}
                                </Card>
                            </Col>
                            <Col md="6">
                                <Card style={{paddingTop: '3rem', paddingLeft: '3rem', paddingBottom: '2rem'}}>
                                    {list?.filter(x => !x.Disponivel)?.map((veiculo, i) => (<>
                                        <Row md="12" style={{width: '100%'}}>
                                            <Col md="1" className="mt-1">
                                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder"></Label>
                                                <CustomInput
                                                    type="checkbox"
                                                    id={uuidv4()}
                                                    className="custom-control-primary zindex-0"
                                                    inline
                                                    checked={veiculo.Selecionado}
                                                    onChange={(e) => {
                                                        list[i].Selecionado = e.target.checked
                                                        setList([...list], list)
                                                    }}
                                                />
                                            </Col>
                                            <Col md="1" className="mt-1">
                                                <span className={veiculo.Manutencao ? "bullet bullet-danger bullet-sm" :  veiculo.Disponivel ? "bullet bullet-success bullet-sm" : "bullet bullet-secondary bullet-sm"}></span>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Veículo</Label>
                                                    <Input
                                                        type="text"
                                                        value={`${veiculo?.Descricao} - ${veiculo?.Placa}`}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="3">
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
                                                        name="OS"
                                                        noOptionsMessage={() => 'Sem registro!'}
                                                        options={options}
                                                        isSearchable
                                                        isClearable
                                                        value={
                                                            options?.filter((option) => option.value === veiculo.Manutencao)
                                                        }
                                                        onChange={(object) => {
                                                            list[i].Manutencao = object.value
                                                            setList([...list], list)
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </>))}
                                </Card>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button.Ripple
                            color="primary"
                            className="mr-1 mb-1"
                            onClick={e => updateVeiculos(list?.filter(x => x.Selecionado), escala)}
                        >
                            Definir Veículos
                        </Button.Ripple>
                    </ModalFooter>
                </Modal>
            </span>
        </div>
    )
}

export default ModalVeiculos

