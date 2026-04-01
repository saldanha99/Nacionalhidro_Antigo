import React, { useState, useEffect } from "react"
import {
    Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input
} from "reactstrap"
import '@styles/base/pages/modal.scss'
import moment from "moment"
import { HoraParaMinuto, MinutoParaHora } from "../../../../../utility/date/date"
moment.locale("pt-br")

const ModalBaixarOrdem = (props) => {
    const { modal, handleClose, save } = props
    const [ordem, setOrdem] = useState({})

    const calcularTempoTotal = (data) => {
        const horaPadrao = HoraParaMinuto(data.HoraPadrao)
        const entrada = HoraParaMinuto(data.HoraEntrada)
        const saida = HoraParaMinuto(data.HoraSaida)
        const tolerancia = HoraParaMinuto(data.HoraTolerancia)
        const almoco = HoraParaMinuto(data.HoraAlmoco)

        if (isNaN(almoco) === true) {
            almoco = 0
        }

        if (isNaN(tolerancia) === true) {
            tolerancia = 0
        }

        const calculoTotalHora = ((saida - entrada) - (almoco + tolerancia))

        let totalTempoHora = 0
        let totalTempoHoraAdicional = 0

        if (calculoTotalHora < horaPadrao) {
            totalTempoHora = horaPadrao
        } else {
            totalTempoHora = horaPadrao
            totalTempoHoraAdicional = (calculoTotalHora - horaPadrao)
        }
        
        const horaAdicional = moment(MinutoParaHora(totalTempoHoraAdicional), "HH:mm").format("HH:mm:ss.SSS")
        const horaTotal = moment(MinutoParaHora(totalTempoHora), "HH:mm").format("HH:mm:ss.SSS")
        setOrdem({...ordem, HoraAdicional: horaAdicional, HoraTotal: horaTotal})
    }

    useEffect(() => {
        if (modal) {
            setOrdem({})
        }
    }, [modal])

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
                        <h4 className="mt-1 mb-1"><b>Baixa em lote</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="12" className="mt-1" >
                                <span>Dados Baixa</span>
                            </Col>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Hora Padrão</Label>
                                    <Input
                                        type="time"
                                        id="HoraPadrao"
                                        name="HoraPadrao"
                                        placeholder="Hora Inicial"
                                        value={ordem.HoraPadrao}
                                        onChange={(e) => setOrdem({ ...ordem, [e.target.name]: e.target.value })}
                                        onBlur={(e) => calcularTempoTotal(ordem)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Tolerância</Label>
                                    <Input
                                        type="time"
                                        id="HoraTolerancia"
                                        name="HoraTolerancia"
                                        placeholder="Tolerância"
                                        value={ordem.HoraTolerancia}
                                        onChange={(e) => setOrdem({ ...ordem, [e.target.name]: e.target.value })}
                                        onBlur={(e) => calcularTempoTotal(ordem)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Entrada</Label>
                                    <Input
                                        type="time"
                                        id="HoraEntrada"
                                        name="HoraEntrada"
                                        placeholder="Entrada"
                                        value={ordem.HoraEntrada}
                                        onChange={(e) => setOrdem({ ...ordem, [e.target.name]: e.target.value })}
                                        onBlur={(e) => calcularTempoTotal(ordem)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Saída</Label>
                                    <Input
                                        type="time"
                                        id="HoraSaida"
                                        name="HoraSaida"
                                        placeholder="Saída"
                                        value={ordem.HoraSaida}
                                        onChange={(e) => setOrdem({ ...ordem, [e.target.name]: e.target.value })}
                                        onBlur={(e) => calcularTempoTotal(ordem)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Almoço</Label>
                                    <Input
                                        type="time"
                                        id="HoraAlmoco"
                                        name="HoraAlmoco"
                                        placeholder="Almoço"
                                        value={ordem.HoraAlmoco}
                                        onChange={(e) => setOrdem({ ...ordem, [e.target.name]: e.target.value })}
                                        onBlur={(e) => calcularTempoTotal(ordem)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Horas Totais</Label>
                                    <Input
                                        type="time"
                                        id="HoraTotal"
                                        name="HoraTotal"
                                        placeholder="Horas Totais"
                                        value={ordem.HoraTotal}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Hora Adicional</Label>
                                    <Input
                                        type="time"
                                        id="HoraAdicional"
                                        name="HoraAdicional"
                                        placeholder="Hora Adicional"
                                        value={ordem.HoraAdicional}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button.Ripple
                            color="danger"
                            className="mr-1 mb-1"
                            onClick={e => {
                                save(ordem)
                            }}
                        >
                            Baixar Ordens
                        </Button.Ripple>
                    </ModalFooter>
                </Modal>
            </span>
        </div>
    )
}

export default ModalBaixarOrdem

