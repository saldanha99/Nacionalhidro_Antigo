import React, { useState, useEffect, useRef } from "react"
import {
    Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, ButtonGroup, Card, CardBody, Alert, CardHeader, CustomInput
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { Enum_StatusEscalas, Enum_TiposCobranca, Lista_TiposCobranca, List_DiasSemana, List_StatusOperacional } from "../../../../../utility/enum/Enums"
import moment from "moment"
import { gerarTextoEquipes, groupByEquipamento } from "../../../../../utility/Utils"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { HoraParaMinuto, MinutoParaHora, FormatarHoraParaTime } from "../../../../../utility/date/date"
import ModalFuncionarios from "../../escala/modals/ModalFuncionarios"
import ModalVeiculos from "../../escala/modals/ModalVeiculos"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss"
import { Portuguese} from "flatpickr/dist/l10n/pt.js"
moment.locale("pt-br")

const MySwal = withReactContent(Swal)
const options = [{ label: 'Sim', value: true }, { label: 'Não', value: false }]

const ModalCadastroOrdem = (props) => {
    const refComp = useRef(null)
    const { data, modal, handleClose, save, veiculos, funcionarios, escalas, empresas, onlyView } = props
    const [equipamentos, setEquipamentos] = useState([])
    const [aba, setAba] = useState(1)
    const [toggleDados, setToggleDados] = useState(false)
    const [ordem, setOrdem] = useState({})
    const [equipesProposta, setEquipesProposta] = useState('')
    const [modalFuncionarios, setModalFuncionarios] = useState(false)
    const [modalVeiculos, setModalVeiculos] = useState(false)

    const isHidden = (toggle) => {
        if (toggle === true) {
          return true
        }
        return false
    }

    const validateServicos = () => {
        for (let i = 0; i < ordem.Servicos.length; i++) {
            if (!ordem.Servicos[i].Discriminacao) {
                return false
            }            
        }
        return true
    }

    const validateEquipes = (baixa) => {
        if (baixa && !ordem.Escala?.EscalaFuncionarios?.length) return false
        if (baixa && !ordem.Escala?.EscalaVeiculos?.length) return false

        for (let i = 0; i < ordem.Escala?.EscalaFuncionarios?.length; i++) {
            if (!ordem.Escala.EscalaFuncionarios[i].Funcionario?.id) {
                return false
            }            
        }
        for (let i = 0; i < ordem.Escala?.EscalaVeiculos?.length; i++) {
            if (!ordem.Escala.EscalaVeiculos[i].Veiculo?.id) {
                return false
            }            
        }
        return true
    }

    const fullData = (baixa) => {
        return ordem.TipoCobranca && ordem.DataInicial && ordem.HoraInicial && ordem.Contato?.id > 0 && ordem.Equipamento?.id > 0 && validateServicos() && validateEquipes(baixa)
    }

    const handleVeiculo = () => {
        ordem.Escala.FuncionariosIndisponiveis = ''
        const idsFuncionarios = []
        if (ordem.Escala.Veiculos) {
            ordem.Escala.Veiculos.forEach(veiculo => {
                veiculo.Funcionarios?.forEach(func => {
                    if (!func.MotivoAfastamento) idsFuncionarios.push(func?.id)
                    else ordem.Escala.FuncionariosIndisponiveis += `${func.Nome};`
                })
            })
            ordem.Escala.Funcionarios = funcionarios.filter(x => idsFuncionarios.includes(x.id))
        }

        setOrdem({... ordem, Escala: ordem.Escala})
    }

    const handleEquipamento = () => {
        let idsVeiculos = []
        if (ordem.Escala.Equipamento) {
            idsVeiculos = ordem.Escala.Equipamento?.Veiculos?.map(x => x.id)
            ordem.Escala.Veiculos = veiculos.filter(x => idsVeiculos?.includes(x.id))
        }

        setOrdem({... ordem, Escala: ordem.Escala})
        handleVeiculo()
    }

    const handleCloseFuncionarios = () => {
      setModalFuncionarios(false)
    }

    const handleCloseVeiculos = () => {
      setModalVeiculos(false)
    }

    const updateFuncionarios = (integrados, naoIntegrados) => {
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

                ordem.Escala.EscalaFuncionarios = []

                funcionarios.forEach(element => {
                    ordem.Escala.EscalaFuncionarios.push({
                        Funcionario: element,
                        StatusOperacao: element.StatusOperacao
                    })
                })
                setOrdem({... ordem, Escala: ordem.Escala})
                handleCloseFuncionarios()
              }
            })
        } else {
            let funcionarios = integrados?.length ? integrados : []
            funcionarios = funcionarios.concat(naoIntegrados)

            ordem.Escala.EscalaFuncionarios = []

            funcionarios.forEach(element => {
                ordem.Escala.EscalaFuncionarios.push({
                    Funcionario: element,
                    StatusOperacao: element.StatusOperacao
                })
            })
            setOrdem({... ordem, Escala: ordem.Escala})
            handleCloseFuncionarios()
        }
    }

    const updateVeiculos = (veiculos) => {
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
              ordem.Escala.EscalaVeiculos = []
              veiculos.forEach(element => {
                ordem.Escala.EscalaVeiculos.push({
                      Veiculo: element,
                      Manutencao: element.Manutencao
                    })
              })
              setOrdem({... ordem, Escala: ordem.Escala})
              handleCloseVeiculos()
            }
          })
      } else {
        ordem.Escala.EscalaVeiculos = []
        veiculos.forEach(element => {
          ordem.Escala.EscalaVeiculos.push({
                Veiculo: element,
                Manutencao: element.Manutencao
              })
        })
        setOrdem({... ordem, Escala: ordem.Escala})
        handleCloseVeiculos()
      }
    }

    const calcularTempoTotal = (data) => {
        const horaPadrao = HoraParaMinuto(data.HoraPadrao)
        let entrada = HoraParaMinuto(data.HoraEntrada)
        let saida = HoraParaMinuto(data.HoraSaida)
        let tolerancia = HoraParaMinuto(data.HoraTolerancia)
        let almoco = ordem.DescontarAlmoco ? HoraParaMinuto(data.HoraAlmoco) : 0

        if (isNaN(almoco) === true) {
            almoco = 0
        }

        if (isNaN(tolerancia) === true) {
            tolerancia = 0
        }

        if (saida < entrada) {
            saida += 12 * 60
            entrada -= 12 * 60
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
        if (modal && data) {
            if (!data.OrdemEquipamento) {
                data.OrdemEquipamento = {id: 0}
            }
            if (!data.Escala) {
                data.Escala = {id: 0, Status: Enum_StatusEscalas.Aberta, Data: new Date()}
            }
            if (!data.Servicos) {
                data.Servicos = [{Discriminacao: ''}]
            }
            data.Codigo = data.Codigo || data.Proposta?.Codigo
            const equipes = groupByEquipamento(data.Proposta?.PropostaEquipes?.filter(x => !x.Cargo?.UnicoEquipamento && x.Equipamento), 'Equipamento')
            setEquipesProposta(gerarTextoEquipes(equipes))
            setEquipamentos(data.Proposta?.PropostaEquipamentos?.map(x => x.Equipamento))
            setOrdem(data)
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
                        <h4 className="mt-1 mb-1"><b>Abertura de OS</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        {ordem?.Escala && !onlyView && <ModalFuncionarios data={JSON.parse(JSON.stringify(ordem?.Escala || {}))} modal={modalFuncionarios} handleClose={handleCloseFuncionarios} funcionarios={JSON.parse(JSON.stringify(funcionarios))} escalas={escalas} updateFuncionarios={updateFuncionarios} />}
                        {ordem?.Escala && !onlyView && <ModalVeiculos data={JSON.parse(JSON.stringify(ordem?.Escala || {}))} modal={modalVeiculos} handleClose={handleCloseVeiculos} veiculos={JSON.parse(JSON.stringify(veiculos)) } escalas={escalas} updateVeiculos={updateVeiculos} />}
                        <Row>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Nº Proposta</Label>
                                <Input
                                    type="text"
                                    id="proposta"
                                    name="proposta"
                                    placeholder="Nº Proposta"
                                    value={ordem.Proposta?.Codigo}
                                    disabled
                                />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Código OS</Label>
                                <Input
                                    type="text"
                                    id="codigo"
                                    name="codigo"
                                    placeholder="À ser gerado"
                                    value={`${ordem.Codigo}/${ordem.Numero}`}
                                    disabled
                                />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Data Inicial</Label>
                                    <Flatpickr style={!ordem.DataInicial ? { borderColor: '#cc5050' } : {}}
                                        value={ordem.DataInicial}
                                        onClose={ (selectedDates, dateStr, instance) => {
                                            if (selectedDates.length === 1) {
                                                setOrdem({ ...ordem, DataInicial: selectedDates[0]})
                                                instance.setDate([selectedDates[0], selectedDates[0]], true)
                                            }

                                            setOrdem({ ...ordem, DataInicial: selectedDates})
                                        }}
                                        className="form-control"
                                        key={Portuguese}
                                        options={{ mode: ordem.id ? 'single' : 'range', locale: Portuguese, dateFormat: 'd-m-Y'  }}
                                        name="Data"
                                        placeholder="Data"
                                        ref={refComp}
                                        disabled={onlyView}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Hora Inicial</Label>
                                    <Input style={!ordem.HoraInicial ? { borderColor: '#cc5050' } : {}}
                                        type="time"
                                        id="HoraInicial"
                                        name="HoraInicial"
                                        placeholder="Hora Inicial"
                                        value={ordem.HoraInicial}
                                        onChange={(e) => setOrdem({ ...ordem, [e.target.name]: e.target.value })}
                                        disabled={onlyView}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Tipo de Cobrança</Label>
                                    <Select
                                        placeholder="Cobrança"
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: ordem.TipoCobranca ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="tipocobranca"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={Lista_TiposCobranca}
                                        value={
                                            Lista_TiposCobranca?.filter((option) => option.value === ordem.TipoCobranca)
                                        }
                                        onChange={(object) => {
                                            setOrdem({ ...ordem, TipoCobranca: object.value })
                                        }}
                                        isDisabled={onlyView}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Empresa</Label>
                                    {!onlyView ? <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: ordem.Empresa?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Empresa"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={empresas}
                                        isSearchable
                                        getOptionLabel={(option) => option?.Descricao}
                                        getOptionValue={(option) => option}
                                        value={
                                            empresas?.filter((option) => option.id === ordem?.Empresa?.id)
                                        }
                                        onChange={(object) => {
                                            setOrdem({ ...ordem, Empresa: object })
                                        }}
                                    /> : <Input
                                        type="text"
                                        id="empresa"
                                        name="empresa"
                                        value={ordem.Empresa?.Descricao}
                                        disabled
                                    />}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Dias da Semana</Label>
                                    <Select className="react-select" classNamePrefix="select"
                                        styles={{
                                            multiValue: provided => ({ ...provided, backgroundColor: '#808080'}),
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                        }}
                                        id="dias" placeholder="Dias"
                                        value={ordem.DiasSemana}
                                        options={List_DiasSemana}
                                        getOptionValue={(option) => option?.value}
                                        onChange={(object) => {
                                            ordem.DiasSemana = object
                                            setOrdem({ ...ordem, DiasSemana: ordem.DiasSemana })
                                        }}
                                        isMulti
                                        isDisabled={onlyView}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Quantidade p/ dia</Label>
                                    <Input
                                        type="number"
                                        id="QuantidadeDia"
                                        name="QuantidadeDia"
                                        placeholder="Quantidade p/ dia"
                                        value={ordem.QuantidadeDia}
                                        onChange={(e) => setOrdem({ ...ordem, [e.target.name]: e.target.value })}
                                        disabled={onlyView}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="3" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cliente</Label>
                                        <Input
                                            type="text"
                                            id="cliente"
                                            name="cliente"
                                            placeholder="Cliente"
                                            value={ordem?.Cliente?.RazaoSocial}
                                            disabled
                                        />
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Contato</Label>
                                    <Select
                                        placeholder="Contatos"
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: ordem.Contato?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Contato"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={ordem?.Cliente?.Contatos}
                                        isSearchable
                                        isDisabled={onlyView}
                                        getOptionLabel={(option) => option?.Nome}
                                        getOptionValue={(option) => option}
                                        value={
                                            ordem?.Cliente?.Contatos?.filter((option) => option.id === ordem?.Contato?.id)
                                        }
                                        onChange={(object) => {
                                            setOrdem({ ...ordem, Contato: object })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Acompanhante</Label>
                                        <Input
                                            type="text"
                                            id="Acompanhante"
                                            name="Acompanhante"
                                            placeholder="Acompanhante"
                                            value={ordem?.Acompanhante}
                                            onChange={(e) => {
                                                setOrdem({ ...ordem, Acompanhante: e.target.value })
                                            }}
                                            disabled={onlyView}
                                        />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} sm={12}>
                                <ButtonGroup className="mt-2">
                                    <Button onClick={() => setAba(1)} color='primary' outline={true} active={aba === 1}>Serviços</Button>
                                    <Button onClick={() => setAba(2)} color='primary' outline={true} active={aba === 2}>Escala</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Card className='card-statistics'>
                            {aba === 1 && <CardBody>
                                <Row>
                                    <Col md="12" className="mt-1" >
                                        {
                                        isHidden(toggleDados) ? <MdKeyboardArrowDown size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)}
                                        /> : <MdKeyboardArrowUp size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)} />
                                        }
                                        <span>Serviços</span>
                                    </Col>
                                </Row>
                                <Row hidden={isHidden(toggleDados)}>
                                    <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Equipamento</Label>
                                            <Select
                                                placeholder="Equipamentos"
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: ordem?.Equipamento?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                                }}
                                                name="Equipamento"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={equipamentos}
                                                isSearchable
                                                isClearable
                                                isDisabled={onlyView}
                                                getOptionLabel={(option) => option?.Equipamento}
                                                getOptionValue={(option) => option}
                                                value={
                                                    equipamentos?.filter((option) => option.id === ordem?.Equipamento?.id)
                                                }
                                                onChange={(object) => {
                                                    ordem.TipoCobranca = ordem.Proposta?.PropostaEquipamentos?.find(x => x.Equipamento?.id === object.id)?.TipoCobranca
                                                    ordem.HoraPadrao = FormatarHoraParaTime(ordem.Proposta?.PropostaEquipamentos?.find(x => x.Equipamento?.id === object.id)?.HorasDiaria)
                                                    ordem.Escala.Equipamento = object
                                                    setOrdem({ ...ordem, TipoCobranca: ordem.TipoCobranca, HoraPadrao: ordem.HoraPadrao, Equipamento: object, Escala: ordem.Escala })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {ordem?.Servicos?.map((x, i) => (<Row hidden={isHidden(toggleDados)}>
                                    <Col md="6" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descrição do Serviço</Label>
                                            <Input style={!x.Discriminacao ? { borderColor: '#cc5050' } : {}}
                                                type="text"
                                                value={x.Discriminacao}
                                                id="Discriminacao"
                                                name="Discriminacao"
                                                placeholder="Discriminação"
                                                onChange={(e) => {
                                                    ordem.Servicos[i].Discriminacao = e.target.value
                                                    setOrdem({ ...ordem, Servicos: ordem.Servicos })
                                                }}
                                                disabled={onlyView}
                                            />
                                        </FormGroup>
                                    </Col>
                                    {!onlyView && <Col md="1" className="mt-3">
                                        <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                            ordem.Servicos.splice(i, 1)
                                            setOrdem({ ...ordem, Servicos: ordem.Servicos })
                                        }}>
                                            x
                                        </a>
                                    </Col>}
                                </Row>))}
                                <br />
                                {!onlyView && <a style={{marginRight: '2%'}} href='#' onClick={() => {
                                    ordem.Servicos.push({})
                                    setOrdem({ ...ordem, Servicos: ordem.Servicos })
                                }}>
                                    Adicionar Serviço
                                </a>}
                            </CardBody>}
                            {aba === 2 && <CardBody>
                                <Row>
                                    <Col md="12" className="mt-1" >
                                        {
                                        isHidden(toggleDados) ? <MdKeyboardArrowDown size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)}
                                        /> : <MdKeyboardArrowUp size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)} />
                                        }
                                        <span>Escala</span>
                                    </Col>
                                </Row>
                                {equipesProposta && <Row hidden={isHidden(toggleDados)}>
                                    <Col md="12" className="mt-1">
                                        <Alert color='info'>
                                            <div className='alert-body'>
                                            <span className='fw-bold'>{equipesProposta}</span>
                                            </div>
                                        </Alert>
                                    </Col>
                                </Row>}
                                <Row hidden={isHidden(toggleDados)}>
                                    <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Equipamento</Label>
                                            <Select
                                                placeholder="Equipamentos"
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                                }}
                                                name="Equipamento"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={equipamentos}
                                                isSearchable
                                                isClearable
                                                isDisabled={onlyView}
                                                getOptionLabel={(option) => option?.Equipamento}
                                                getOptionValue={(option) => option}
                                                value={
                                                    equipamentos?.filter((option) => option.id === ordem.Escala?.Equipamento?.id)
                                                }
                                                onChange={(object) => {
                                                    ordem.Escala.Equipamento = object
                                                    setOrdem({ ...ordem, Escala: ordem.Escala })
                                                    handleEquipamento()
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
                                {!onlyView && <Row style={{ background: 'white' }} className="mt-1">
                                    <Col md="12">
                                        <a href="#" style={{ fontWeight: 'bold', fontSize: '12px' }} onClick={() => setModalVeiculos(true)}>
                                        Ver Quadro de Veículos
                                        </a>
                                    </Col>
                                </Row>}
                                {ordem.Escala?.EscalaVeiculos?.map((x, i) => (<Row>
                                    <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Veículo</Label>
                                            {!onlyView ? <Select
                                                placeholder="Selecione..."
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.Veiculo?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
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
                                                    ordem.Escala.EscalaVeiculos[i].Veiculo = object
                                                    setOrdem({ ...ordem, Escala: ordem.Escala })
                                                }}
                                            /> : <Input
                                                type="text"
                                                value={x.Veiculo?.Placa}
                                                id="Discriminacao"
                                                name="Discriminacao"
                                                disabled
                                            />}
                                        </FormGroup>
                                    </Col>
                                    {!onlyView && <Col md="2" className="mt-1">
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
                                                isDisabled={onlyView}
                                                value={options.filter((option) => option.value === x.Manutencao)}
                                                onChange={(e) => {
                                                    ordem.Escala.EscalaVeiculos[i].Manutencao = e.value
                                                    setOrdem({ ...ordem, Escala: ordem.Escala })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>}
                                    {ordem.Escala?.EscalaVeiculos?.length > 1 && !onlyView && <Col md="1" className="mt-3">
                                        <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                            ordem.Escala.EscalaVeiculos.splice(i, 1)
                                            setOrdem({ ...ordem, Escala: ordem.Escala })
                                        }}>
                                            x
                                        </a>
                                    </Col>}
                                </Row>))}
                                {!onlyView && <a href='#' onClick={() => {
                                    if (!ordem.Escala.EscalaVeiculos) ordem.Escala.EscalaVeiculos = []
                                    ordem.Escala.EscalaVeiculos.push({ id: 0, Manutencao: false })
                                    setOrdem({ ...ordem, Escala: ordem.Escala })
                                }}>
                                    Adicionar veículo
                                </a>}
                                <br />
                                <Row>
                                    <Col md="12" className="mt-3" >
                                        <span>Funcionários</span>
                                    </Col>
                                </Row>
                                <br />
                                {!onlyView && <Row style={{ background: 'white' }} className="mt-1">
                                    <Col md="12">
                                        <a href="#" style={{ fontWeight: 'bold', fontSize: '12px' }} onClick={() => setModalFuncionarios(true)}>
                                        Ver Quadro de Funcionários
                                        </a>
                                    </Col>
                                </Row>}
                                {ordem.Escala?.EscalaFuncionarios?.map((x, i) => (<Row>
                                    <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Funcionário</Label>
                                            {!onlyView ? <Select
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
                                                isDisabled={onlyView}
                                                getOptionLabel={(option) => `${option?.Nome} - ${option?.Cargo?.Descricao}`}
                                                getOptionValue={(option) => option}
                                                value={
                                                    funcionarios?.filter((option) => option.id === x.Funcionario?.id)
                                                }
                                                onChange={(object) => {
                                                    ordem.Escala.EscalaFuncionarios[i].Funcionario = object
                                                    setOrdem({ ...ordem, Escala: ordem.Escala })
                                                }}
                                            /> : <Input
                                                type="text"
                                                value={x.Funcionario?.Nome}
                                                id="Functionario"
                                                name="Funcionario"
                                                disabled
                                            />}
                                        </FormGroup>
                                    </Col>
                                    {!onlyView && <Col md="2" className="mt-1">
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
                                                isDisabled={onlyView}
                                                value={
                                                    List_StatusOperacional?.filter((option) => option.value === x.StatusOperacao)
                                                }
                                                onChange={(object) => {
                                                    ordem.Escala.EscalaFuncionarios[i].StatusOperacao = object.value
                                                    setOrdem({ ...ordem, Escala: ordem.Escala })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>}
                                    {ordem.Escala?.EscalaFuncionarios?.length > 1 && !onlyView && <Col md="1" className="mt-3">
                                        <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                            ordem.Escala.EscalaFuncionarios.splice(i, 1)
                                            setOrdem({ ...ordem, Escala: ordem.Escala })
                                        }}>
                                            x
                                        </a>
                                    </Col>}
                                </Row>))}
                                {!onlyView && <a href='#' onClick={() => {
                                    if (!ordem.Escala.EscalaFuncionarios) ordem.Escala.EscalaFuncionarios = []
                                    ordem.Escala.EscalaFuncionarios.push({ id: 0 })
                                    setOrdem({ ...ordem, Escala: ordem.Escala })
                                }}>
                                    Adicionar funcionário
                                </a>}
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
                                            value={ordem.Escala?.Observacoes}
                                            onChange={(e) => {
                                                ordem.Escala.Observacoes = e.target.value
                                                setOrdem({ ...ordem, Escala: ordem.Escala })
                                            }}
                                            disabled={onlyView}
                                        />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <br />
                            </CardBody>}
                        </Card>
                        <Row>
                            <Col md="12" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Observações</Label>
                                <Input
                                    type="textarea"
                                    rows={10}
                                    id="Observacoes"
                                    name="Observacoes"
                                    placeholder="Observações"
                                    value={ordem.Observacoes}
                                    onChange={(e) => setOrdem({ ...ordem, [e.target.name]: e.target.value })}
                                    disabled={onlyView}
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12" className="mt-1" >
                                <span>Efetuar Baixa</span>
                            </Col>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">{ordem.TipoCobranca !== Enum_TiposCobranca.Frete ? "Mínimo de Horas" : "Tolerância"}</Label>
                                    <Input
                                        type="time"
                                        id="HoraPadrao"
                                        name="HoraPadrao"
                                        placeholder="Hora Inicial"
                                        value={ordem.HoraPadrao}
                                        onChange={(e) => setOrdem({ ...ordem, [e.target.name]: e.target.value })}
                                        onBlur={(e) => calcularTempoTotal(ordem)}
                                        disabled={onlyView}
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
                                        disabled={onlyView}
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
                                        disabled={onlyView}
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
                                        disabled={onlyView}
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
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descontar Almoço?</Label>
                                    <CustomInput
                                        type="switch"
                                        id="almoco"
                                        name="DescontarAlmoco"
                                        className="custom-control-primary zindex-0"
                                        label=""
                                        inline
                                        checked={ordem.DescontarAlmoco}
                                        onChange={(e) => {
                                            ordem.DescontarAlmoco = e.target.checked
                                            setOrdem({ ...ordem, DescontarAlmoco: e.target.checked })
                                            calcularTempoTotal(ordem)
                                        }}
                                        disabled={onlyView}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    {!onlyView && <ModalFooter>
                        {ordem.CriadoPor?.id && <span style={{marginRight: '70%'}}>
                            Criado por: {ordem.CriadoPor.username} - {moment(ordem.DataCriacao).format('DD/MM/YYYY HH:mm')}
                        </span>}
                        <Button.Ripple
                            disabled={!fullData(true) || (ordem.TipoCobranca === Enum_TiposCobranca.Hora && (!ordem.HoraEntrada || !ordem.HoraSaida))}
                            color="danger"
                            className="mr-1 mb-1"
                            onClick={e => {
                                MySwal.fire({
                                  title: "Aviso",
                                  text: "Antes de prosseguir, confira a escala e outras informações! Prosseguir?",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Sim",
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
                                        save(ordem, true)
                                    }
                                })
                            }}
                        >
                            Baixar Ordem
                        </Button.Ripple>
                        <Button.Ripple
                            disabled={!fullData()}
                            color="primary"
                            className="mr-1 mb-1"
                            onClick={e => save(ordem)}
                        >
                            {ordem.id ? 'Salvar Ordem' : 'Abrir Ordem'}
                        </Button.Ripple>
                    </ModalFooter>}
                </Modal>
            </span>
        </div>
    )
}

export default ModalCadastroOrdem

