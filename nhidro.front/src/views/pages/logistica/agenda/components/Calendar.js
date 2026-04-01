import React, { useState, useEffect } from "react"
import useEffectAfterMount from "../../../../../hooks/useEffectAfterMount"
import { buscarClientesAtivos } from "@src/redux/actions/administrador/cliente/listaClientesActions"
import { buscarEquipamentosAtivos } from "@src/redux/actions/administrador/equipamento/buscarEquipamentosActions"
import { buscarVeiculos } from "@src/redux/actions/administrador/veiculo/buscarVeiculoActions"
import { buscarAgendamentos } from "@src/redux/actions/logistica/agendamento/buscarAgendamentosActions"
import { buscarPropostas } from "@src/redux/actions/comercial/proposta/buscarPropostasActions"
import { alterarAgendamento } from "@src/redux/actions/logistica/agendamento/alterarAgendamentoActions"
import { cadastrarAgendamento, cadastrarAgendamentoLote } from "@src/redux/actions/logistica/agendamento/cadastrarAgendamentoActions"
import { deletarAgendamento } from "@src/redux/actions/logistica/agendamento/deletarAgendamentoActions"
import { Card, CardBody, Col, Button, Row, Label, FormGroup } from "reactstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Select from "react-select"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import 'moment/locale/pt-br'
import { connect } from "react-redux"
import {ToastContent } from "@utils"
import { toast, Slide } from "react-toastify"
import Spinner from '@src/@core/components/spinner/Fallback-spinner'
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../../../../../assets/scss/plugins/calendars/react-big-calendar.scss"
import Toolbar from "./Toolbar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import { Enum_StatusAgendamentos, Enum_StatusPropostas, List_CoresStatusAgendamentos } from "../../../../../utility/enum/Enums"
import ModalCadastroAgenda from "../modals/ModalCadastroAgenda"
import auth from "@src/services/auth"
moment.locale("pt-br")

const MySwal = withReactContent(Swal)
const localizer = momentLocalizer(moment)
const user = auth.getUserInfo()

const DragAndDropCalendar = withDragAndDrop(Calendar)

const CalendarApp = (props) => {
  const [state, setState] = useState({
    views: {
      month: true,
      week: true,
      day: true
    },
    events: [],
    newEvents: [],
    toggleSideBar: false,
    modal: false,
    mostrarTodos: false
  })
  const [selectedEvent, setSelectedEvent] = useState({})
  const [loading, setLoading] = useState(false)
  const [ano, setAno] = useState(moment().year())
  const [equipamento, setEquipamento] = useState({})
  const [veiculo, setVeiculo] = useState({})

  const buscarPropostas = () => {
    const mesPassado = new Date(new Date().setMonth(new Date().getMonth() - 3))
    const mesQuevem = new Date(new Date().setMonth(new Date().getMonth() + 3))
    const dataInicial = moment(mesPassado).local().format("YYYY-MM-DD")
    const dataFinal = moment(mesQuevem).local().format("YYYY-MM-DD")
    props.buscarPropostas(Enum_StatusPropostas.Aprovada, user, dataInicial, dataFinal)
  }

  const anos = [2022, 2023, 2024, 2025]

  const toolbar = Toolbar

  const hasWindow = typeof window !== 'undefined'

  const getStyleCalendar = () => {
  
    const height = hasWindow ? window.innerHeight : null
    const alturaResponsidadeAdequada = 900
    const alturaBase = 800
   
    const vhHeight800 = 100
    const vhHeight768 = 150
    const vhHeightDefault = 80
   
    let result = null
    let vhFinal = vhHeight800

    if (height < alturaResponsidadeAdequada) {
      if (height  > 850) {
        vhFinal = vhHeight800 - 30
      }

      if (height  < 768) {
        vhFinal = vhHeight768
      }

      if (height  < 650) {
        vhFinal = vhHeight768 + 40
      }

      result = Math.round((height * vhFinal) / alturaBase)
          
      return { height: `${result}vh`}
    }

    return { height: `${vhHeightDefault}vh`}
  }

  const handleClose = () => {
    setSelectedEvent({})
    setState({...state,
      modal: false
    })
  }

  const handleToastSuccess = () => {
    toast.success(
      <ToastContent
        messageTitle="Agendamento"
        messageBody="Agendamento salvo!"
        color="success"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const handleToastError = () => {
    toast.error(
      <ToastContent
        messageTitle="Agendamento"
        messageBody="Falha ao salvar!"
        color="orange"
      />,
      { transition: Slide, autoClose: 10000 }
    )
  }

  const buscarAgendas = () => {
    if (!isNaN(equipamento?.id) && ano) {
      setLoading(true)
      props.buscarAgendamentos(equipamento?.id || null, ano, veiculo?.id || null)
    }
  }

  useEffect(() => {
    setLoading(true)
    buscarPropostas()
    props.buscarEquipamentosAtivos()
    props.buscarClientesAtivos()
    props.buscarVeiculos()
  }, [])

  useEffectAfterMount(() => {
    props.equipamentos.unshift({id: 0, Equipamento: 'TODOS'})
    setLoading(false)
  }, [props?.equipamentos])

  useEffectAfterMount(() => {
    buscarAgendas()
  }, [equipamento, ano, veiculo])

  useEffectAfterMount(() => {
    if (props.agendamentos.length) {
        const agendas = []
        props.agendamentos.forEach(element => {
          if (element.Cliente?.id && element.Veiculo?.id) {
            const startDate = new Date(moment(`${element.Data}" "${element.Hora}`).toDate())
            element.Data = !isNaN(startDate) ? startDate : null
            element.start = !isNaN(startDate) ? startDate : null
            element.end = !isNaN(startDate) ? startDate : null

            element.title = element.Status === Enum_StatusAgendamentos.Viagem ? `${element.Veiculo.Placa} - VIAGEM` : element.Status === Enum_StatusAgendamentos.Manutencao ? `${element.Veiculo.Placa} - MANUTENÇÃO` : `${element.Veiculo.Placa} - ${element.Cliente?.RazaoSocial?.toUpperCase()}`

            agendas.push(element)
          }
        })

        setState({...state, events: agendas})
    } else setState({...state, events: []})
    setLoading(false)
  }, [props.agendamentos])

  useEffectAfterMount(() => {
    handleToastSuccess()
    setLoading(false)
    buscarAgendas()
  }, [props?.isFinishedAction])

  useEffectAfterMount(() => {
    handleToastError()
    setLoading(false)
  }, [props?.error])

  const handleEventColors = event => {
    const cor = List_CoresStatusAgendamentos.find(x => x.value === event.Status).color
    return { style: {backgroundColor: cor }}
  }

  const moveAgenda = ({ event, start }) => {
    if (!loading) {
      setLoading(true)
      const updatedEvent = { ...event}
    
      updatedEvent.Data = moment(start.toISOString().substring(0, 10)).format("YYYY-MM-DD")

      props.alterarAgendamento({
        Id: updatedEvent.id,
        Data: updatedEvent.Data,
        Hora: updatedEvent.Hora,
        Status: updatedEvent.Status,
        Observacoes: updatedEvent.Observacoes
      })

    }
  }

  const saveAgenda = (agenda) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja salvar o agendamento?",
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
        handleClose()
        // setLoading(true)
        agenda.Hora = moment(agenda.Hora, "HH:mm").format("HH:mm:ss.SSS")
        if (agenda.id === 0) {
          const data = {
            Data: agenda.Data,
            Hora: agenda.Hora,
            Cliente: agenda?.Cliente?.RazaoSocial,
            Equipamento: agenda?.Equipamento?.id,
            Veiculo: agenda?.Veiculo?.Placa,
            Proposta: agenda?.Proposta,
            Status: agenda?.Status,
            Observacoes: agenda?.Observacoes
          }
          if (data.Data.length) props.cadastrarAgendamentoLote(data)
          else props.cadastrarAgendamento(data)
        } else {
          const data = {
            Id: agenda.id,
            Data: new Date(agenda.Data),
            Hora: agenda.Hora,
            Status: agenda?.Status,
            Observacoes: agenda?.Observacoes
          }
          props.alterarAgendamento(data)
        }
      }
    })
  }

  const removeAgenda = (agenda) => {
    MySwal.fire({
      title: "Aviso",
      text: "Tem certeza que deseja excluir o agendamento?",
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
        handleClose()
        setLoading(true)
        const data = {
          Id: agenda.id
        }
        props.deletarAgendamento(data)
      }
    })
  }

  const handleSelectEvent = event => {
    if (!loading) {
      setState({...state,
        modal: true
      })

      setSelectedEvent(event)
    }
  }

  const { views, modal, events } = state
  return (
    <div className="app-calendar position-relative">
      <Card>
      {!loading && <CardBody>
          <Row md="12" className="mb-2">
              <Col md="2" className="mt-1">
                  <FormGroup>
                      <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Ano</Label>
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
                          options={anos}
                          isSearchable
                          getOptionLabel={(option) => option}
                          getOptionValue={(option) => option}
                          value={
                              anos?.filter((option) => option === ano)
                          }
                          onChange={(object) => {
                              setAno(object)
                          }}
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
                              control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                          }}
                          name="Equipamento"
                          noOptionsMessage={() => 'Sem registro!'}
                          options={props.equipamentos}
                          isSearchable
                          getOptionLabel={(option) => option?.Equipamento}
                          getOptionValue={(option) => option}
                          value={
                              props.equipamentos?.filter((option) => option.id === equipamento?.id)
                          }
                          onChange={(object) => {
                              setEquipamento(object)
                          }}
                      />
                  </FormGroup>
              </Col>
              <Col md="3" className="mt-1">
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
                          options={props.veiculos}
                          isSearchable
                          isClearable
                          getOptionLabel={(option) => option?.Placa}
                          getOptionValue={(option) => option}
                          value={
                              props.veiculos?.filter((option) => option.id === veiculo?.id)
                          }
                          onChange={(object) => {
                              setVeiculo(object)
                          }}
                      />
                  </FormGroup>
              </Col>
              <Col md='2' style={{marginTop: '2.5rem'}}>
                    <Button.Ripple
                        color="primary" outline={true}
                        className="mr-1 mb-1"
                        onClick={() => {
                            buscarAgendas()
                        }}
                    >
                        Atualizar
                    </Button.Ripple>
              </Col>
          </Row>
          <DragAndDropCalendar
             messages={{
              showMore: total => (
                <div
                  style={{ cursor: 'pointer' }}
                  onMouseOver={e => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                >{`mais ${total}`}
                </div>
              )
            }}
            formats={{
              eventTimeRangeFormat: () => { 
                return ""
              }
            }}
            style={getStyleCalendar()}
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            resourceAccessor="url"
            views={views}
            components={{ toolbar }}
            eventPropGetter={handleEventColors}
            popup={true}
            onEventDrop={moveAgenda}
            onSelectEvent={event => {
              handleSelectEvent(event)
            }}
            onSelectSlot={({ start, end }) => {
              if (!equipamento.id) {
                 MySwal.fire({
                  text: 'Favor selecionar um equipamento!',
                  icon: "warning"
                })
                return
              }
              if (!loading) {
                setSelectedEvent({
                  id: 0,
                  Data: [start, start],
                  Status: Enum_StatusAgendamentos.Agendado,
                  Equipamento: equipamento
                })
                setState({...state,
                  modal: true
                })
              }
            }}
            selectable={true}
          />
        </CardBody>}
        {loading && 
        <div style={{marginTop:10}}>
          <Spinner></Spinner>
        </div>}
      </Card>
      <ModalCadastroAgenda 
          data={selectedEvent}
          modal={modal} 
          handleClose={handleClose} 
          save={saveAgenda} 
          remove={removeAgenda}
          clientes={props.clientes}
          veiculos={props.veiculos}
          propostas={props.propostas}
          agendas={events}
        />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    equipamentos: state?.equipamento?.equipamentosAtivos,
    clientes: state?.cliente?.listaClientesAtivos,
    veiculos: state?.veiculo?.lista,
    agendamentos: state?.agendamento?.agendamentos,
    propostas: state?.proposta?.propostas,
    isFinishedAction: state?.agendamento?.isFinishedAction,
    error: state?.agendamento?.error
    // deleteSuccess: state.agenda.deleteSuccess,
    // deleteMessage: state.agenda.deleteMessage,
    // deleteToggle: state.agenda.deleteToggle,
    // updateSuccess: state.agenda.updateSuccess,
    // updateMessage: state.agenda.updateMessage,
    // updateToggle: state.agenda.updateToggle
  }
}

export default connect(mapStateToProps, {
  buscarEquipamentosAtivos,
  buscarClientesAtivos,
  buscarVeiculos,
  buscarAgendamentos,
  buscarPropostas,
  alterarAgendamento,
  deletarAgendamento,
  cadastrarAgendamento,
  cadastrarAgendamentoLote
  // deleteAgendamento,
  // saveAgendamento
})(CalendarApp)
