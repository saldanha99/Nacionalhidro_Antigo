import React, { useState, useEffect } from "react"
import {
    Modal, ModalHeader, ModalBody, FormGroup, ModalFooter, Button, Row, Col, Label, Input, ButtonGroup, Card, CardBody, Alert, CardText, CustomInput
} from "reactstrap"
import Select from "react-select"
import '@styles/base/pages/modal.scss'
import { Lista_TiposCobranca, Enum_TipoResponsabilidade, Enum_TiposCobranca, Enum_StatusPropostas } from "../../../../../utility/enum/Enums"
import NumberFormat from "react-number-format"
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { numeroExtenso } from "../../../../../utility/number"
import moment from "moment"
import { FiArrowLeft, FiArrowRight } from "react-icons/fi"
moment.locale("pt-br")

const ModalCadastroProposta = (props) => {
    const { data, modal, handleClose, save, clientes, vendedores, empresas, equipamentos, acessorios, responsabilidades, cargos, configuracoes, user } = props
    const [aba, setAba] = useState(1)
    const [isValid, setIsValid] = useState(false)
    const [proposta, setProposta] = useState({})
    const [acessoriosDisponiveis, setAcessoriosDisponiveis] = useState([])
    const [responsabilidadesDisponiveis, setResponsabilidadesDisponiveis] = useState([])
    const [toggleDados, setToggleDados] = useState(false)
    const [error, setError] = useState('')

    const options = [{ label: 'Sim', value: true }, { label: 'Não', value: false }]
    const optionsTipo = [{ label: 'Contratante', value: Enum_TipoResponsabilidade.Contratante }, { label: 'Contratado', value: Enum_TipoResponsabilidade.Contratado }]

    const validateEquipamentos = () => {
        for (let i = 0; i < proposta.PropostaEquipamentos.length; i++) {
            if (!proposta.PropostaEquipamentos[i].Equipamento || !proposta.PropostaEquipamentos[i].TipoCobranca) {
                return false
            }            
        }
        return true
    }

    const validateAcessorios = () => {
        for (let i = 0; i < proposta.Acessorios.length; i++) {
            if (!proposta.Acessorios[i].Nome) {
                return false
            }            
        }
        return true
    }

    const validateResponsabilidades = () => {
        for (let i = 0; i < proposta.PropostaResponsabilidades.length; i++) {
            if (!proposta.PropostaResponsabilidades[i]?.Responsabilidade || !proposta.PropostaResponsabilidades[i]?.Responsavel) {
                return false
            }            
        }
        return true
    }

    const validateEquipe = () => {
        for (let i = 0; i < proposta.PropostaEquipes.length; i++) {
            if (!proposta.PropostaEquipes[i]?.Cargo || (!proposta.PropostaEquipes[i]?.Cargo.UnicoEquipamento && !proposta.PropostaEquipes[i]?.Equipamento) || !proposta.PropostaEquipes[i]?.Quantidade) {
                return false
            }            
        }
        return true
    }

    const fullData = () => {
        if (!proposta.DataProposta) {
            setError('Favor informar a data da proposta!')
            return false
        }
        if (!proposta.DataValidade) {
            setError('Favor informar a data de validade!')
            return false
        }
        if (!proposta.Empresa?.id) {
            setError('Favor informar a empresa!')
            return false
        }
        if (!proposta.Cliente?.id) {
            setError('Favor informar o cliente!')
            return false
        }
        if (!proposta.Contato?.id) {
            setError('Favor informar o contato!')
            return false
        }
        if (!proposta.Contato?.id) {
            setError('Favor informar o contato!')
            return false
        }
        if (!validateEquipamentos()) {
            setError('Favor verificar os equipamentos!')
            return false
        } 
        if (!validateAcessorios()) {
            setError('Favor verificar os acessórios!')
            return false
        } 
        if (!validateResponsabilidades()) {
            setError('Favor verificar as responsabilidades!')
            return false
        } 
        if (!validateEquipe()) {
            setError('Favor verificar as equipes!')
            return false
        }

        return true
    }

    const gerarDescricaoValores = (proposta) => {
        if (proposta.PropostaEquipamentos) {
            let descricaoValores = ''
            proposta.PropostaEquipamentos.forEach((x, i) => {
                if (x.Equipamento && x.TipoCobranca && x.ValorCobranca) {
                    const tipoCobranca = x.TipoCobranca === Enum_TiposCobranca.Diaria ? 'Valor diária por' : x.TipoCobranca === Enum_TiposCobranca.Hora ? 'Valor hora por' : x.TipoCobranca === Enum_TiposCobranca.Frete ? 'Valor frete por' : 'Valor fechado por'
                    const mobilizazacao = `Valor por mobilização e desmobilização ${x.Equipamento.Equipamento}, horário comercial:\nR$ ${Number(x.ValorMobilizacao).toFixed(2)} (${numeroExtenso(Number(x.ValorMobilizacao).toFixed(2))})\n\n`
                    const area = x.Area ? ` para área ${x.Area},` : ''
                    const text = `     * ${tipoCobranca} ${x.Quantidade ?? 1} ${x.Equipamento.Equipamento},${area} horário comercial \nR$ ${Number(x.ValorCobranca).toFixed(2)}  (${numeroExtenso(Number(x.ValorCobranca))})\n${x.ValorMobilizacao ? mobilizazacao : ''}`
                    descricaoValores = descricaoValores + text
                }
            })
            proposta.DescricaoValores = descricaoValores

            setProposta({... proposta, DescricaoValores: proposta.DescricaoValores})
        }
    }

    const gerarDescricaoGarantia = (proposta) => {
        if (proposta.PropostaEquipamentos) {
            const temDiaria = proposta.PropostaEquipamentos.filter(x => x.TipoCobranca === Enum_TiposCobranca.Diaria)
            const temHora = proposta.PropostaEquipamentos.filter(x => x.TipoCobranca === Enum_TiposCobranca.Hora)
            const temFrete = proposta.PropostaEquipamentos.filter(x => x.TipoCobranca === Enum_TiposCobranca.Frete)
            const temFechado = proposta.PropostaEquipamentos.filter(x => x.TipoCobranca === Enum_TiposCobranca.Fechada)

            let descricao = ''

            if (temHora.length > 0) {
                temHora.forEach(x => {
                    descricao += `     ${configuracoes.find(x => x.Descricao === 'ModalidadeHora').Valor}\n`
                    descricao = descricao.replace('{{HorasDiaria}}', x.HorasDiaria ?? 10).replace('{{Equipamento}}', x.Equipamento?.Equipamento)
                })
                descricao += `${configuracoes.find(x => x.Descricao === 'DescricaoGarantiaHora').Valor}\n\n`
            }
            if (temDiaria.length > 0) {
                temDiaria.forEach(x => {
                    descricao += `     ${configuracoes.find(x => x.Descricao === 'ModalidadeDiaria').Valor}\n`
                    descricao = descricao.replace('{{HorasDiaria}}', x.HorasDiaria ?? 10).replace('{{Equipamento}}', x.Equipamento?.Equipamento)
                })
                descricao += `${configuracoes.find(x => x.Descricao === 'DescricaoGarantiaDiaria').Valor}\n\n`
            }
            if (temFrete.length > 0) descricao += `     ${configuracoes.find(x => x.Descricao === 'DescricaoGarantiaFrete').Valor}\n\n`
            if (temFechado.length > 0) {
                temFechado.forEach(x => {
                    descricao += `     ${configuracoes.find(x => x.Descricao === 'ModalidadeFechado').Valor}\n`
                    descricao = descricao.replace('{{HorasDiaria}}', x.HorasDiaria ?? 10).replace('{{Equipamento}}', x.Equipamento?.Equipamento)
                })
                descricao += `${configuracoes.find(x => x.Descricao === 'DescricaoGarantiaFechado').Valor}\n\n`
            }

            proposta.DescricaoGarantia = descricao

            setProposta({... proposta, DescricaoGarantia: proposta.DescricaoGarantia})
        }
    }

    const gerarCondicaoPagamento = (proposta) => {
        let descricao = ''
        const textPagamento = proposta.PagamentoAntecipado ? 'Pagamento antecipado' : 'Faturamento para 20 (VINTE) dias após execução dos serviços.'
        const textPagamentoExecucao = 'Após execução, será enviado relatório de prestação de serviço e depois de aceite, emitido a Nota Fiscal Eletrônica e boleto bancário, será enviado ao email da Contratante Cadastrada.'
        const textPagamentoAceite = 'Nota: Prazo para verificação e aceite dos serviços de no Maximo 02 (dois) dias, caso não tenhamos o aceite a nota será emitida automaticamente.'
        const textPagamentoDimensionamento = !proposta.Cte && !proposta.PorcentagemRL ? 'O total dos serviços será emitido em nota de serviço.' : proposta.Cte ? `O total dos serviços será emitido em CTe.` : `O total dos serviços será emitido em 02 notas, sendo:\n${proposta.PorcentagemRL}% do valor, referente ao recibo de locação. (R$ ${(proposta.Valor * (proposta.PorcentagemRL / 100)).toFixed(2)})\n${100 - proposta.PorcentagemRL}% do valor, referente a manuseio do equipamento, nota fiscal de serviço. (R$ ${(proposta.Valor * ((100 - proposta.PorcentagemRL) / 100)).toFixed(2)})`
        const textObservacaoRL = proposta.PorcentagemRL && !proposta.Cte ? 'OBS: Para atividades de locação de BENS MOVEIS, por força de veto Presidencial, foi retirado do campo de incidência o ISS. Conforme disposições do RISS consubstanciadas no decreto municipal 44.540/2004, A empresa não poderá emitir nota fiscal para atividades de locação de bens móveis tendo que emitir recibos para documentar a mesma.' : ''
        
        descricao = `${textPagamento}\n\n${textPagamentoExecucao}\n\n${textPagamentoAceite}\n\nDimensionamento em Nota Fiscal:\n\n${textPagamentoDimensionamento}\n\n${textObservacaoRL}`
        proposta.CondicaoPagamento = descricao

        setProposta({... proposta, CondicaoPagamento: proposta.CondicaoPagamento})

        return descricao
    }

    const gerarValidadeProposta = (proposta) => {
        const descricao = `Essa proposta possui validade até o dia: ${moment(proposta.DataValidade).utc().format("DD/MM/YYYY")}`        
        proposta.ValidadeProposta = descricao

        setProposta({... proposta, ValidadeProposta: proposta.ValidadeProposta})

        return descricao
    }

    const handleEquipamento = () => {
        if (proposta.PropostaEquipamentos) {
            const idsAcessorios = []
            const idsResponsabilidades = []
            proposta.PropostaEquipamentos.forEach((x, i) => {
                if (x.Equipamento) {
                    if (x.Equipamento?.EquipamentoAcessorios) {
                        const ea = x.Equipamento.EquipamentoAcessorios
                        ea.forEach(x1 => idsAcessorios.push(x1.Acessorio?.id))
                    }
                    if (x.Equipamento?.EquipamentoResponsabilidades) {
                        const er = x.Equipamento.EquipamentoResponsabilidades
                        er.forEach(x1 => idsResponsabilidades.push(x1.Responsabilidade?.id))
                    }
                }
            })
            const acessoriosDisponiveis = acessorios.filter(x => idsAcessorios.includes(x.id))
            const responsabilidadesDisponiveis = responsabilidades.filter(x => idsResponsabilidades.includes(x.id))

            proposta.PropostaResponsabilidades = []
            responsabilidadesDisponiveis.forEach(r => {
                proposta.PropostaResponsabilidades.push({ id: 0, Responsabilidade: r, Responsavel: r.Responsavel })
            })

            proposta.Acessorios = acessoriosDisponiveis
            setProposta({... proposta, Acessorios: proposta.Acessorios, PropostaResponsabilidades: proposta.PropostaResponsabilidades})
            setAcessoriosDisponiveis(acessoriosDisponiveis)
            setResponsabilidadesDisponiveis(responsabilidadesDisponiveis)
            gerarDescricaoValores(proposta)
            gerarDescricaoGarantia(proposta)
        }
    }

    const calcularValorProposta = (proposta) => {
        if (proposta.PropostaEquipamentos) {
            let valor = 0
            proposta.PropostaEquipamentos.forEach((x, i) => {
                if (x.Equipamento && x.ValorTotal) {
                    valor += x.ValorTotal
                }
            })

            setProposta({... proposta, Valor: valor})
        }
    }

    const isHidden = (toggle) => {
      if (toggle === true) {
        return true
      }
      return false
    }

    useEffect(() => {
        if (data) {
            if (!data.id && !data.Introducao) {
                data.Introducao = `Submetemos a apreciação de V.Sas., nossa proposta, visando o atendimento de sua solicitação conforme condições técnicas e comercias abaixo descriminada, a saber:`
                data.CondicaoPagamento = gerarCondicaoPagamento(data)
            }
            if (!data.PropostaEquipamentos) {
                data.PropostaEquipamentos = [{id: 0, Quantidade: 1}]
            }
            if (!data.Acessorios) {
                data.Acessorios = [{}]
            }
            if (!data.PropostaResponsabilidades) {
                data.PropostaResponsabilidades = [{id: 0}]
            }
            if (!data.PropostaEquipes) {
                data.PropostaEquipes = [{id: 0, Quantidade: 1}]
            }
            data.Status = Enum_StatusPropostas.Aberta
            setProposta(data)
        }
    }, [data])

    useEffect(() => {
        setIsValid(fullData())
    }, [proposta])
    
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
                        <h4 className="mt-1 mb-1"><b>Cadastro proposta</b></h4>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="1" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Código</Label>
                                <Input
                                    type="text"
                                    id="codigo"
                                    name="codigo"
                                    placeholder="À ser gerado"
                                    value={proposta.Codigo}
                                    disabled
                                />
                                </FormGroup>
                            </Col>
                            {proposta.Revisao > 0 && <Col md="1" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Revisão</Label>
                                <Input
                                    type="text"
                                    id="revisao"
                                    name="revisao"
                                    placeholder="Revisão"
                                    value={proposta.Revisao}
                                    disabled
                                />
                                </FormGroup>
                            </Col>}
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Data da Proposta</Label>
                                    <Input style={!proposta.DataProposta ? { borderColor: '#cc5050' } : {}}
                                        type="date"
                                        id="DataProposta"
                                        name="DataProposta"
                                        placeholder="Data da Proposta"
                                        value={proposta.DataProposta}
                                        onChange={(e) => setProposta({ ...proposta, [e.target.name]: e.target.value })}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Data de Validade</Label>
                                    <Input style={!proposta.DataValidade ? { borderColor: '#cc5050' } : {}}
                                        type="date"
                                        id="DataValidade"
                                        name="DataValidade"
                                        placeholder="Data de Validade"
                                        value={proposta.DataValidade}
                                        onChange={(e) => {
                                            proposta.DataValidade = e.target.value
                                            gerarValidadeProposta(proposta)
                                            setProposta({ ...proposta, [e.target.name]: proposta.DataValidade })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Vendedor</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: proposta.Usuario?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Usuario"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={vendedores}
                                        isSearchable
                                        isDisabled={user.role.name !== 'Gerencial'}
                                        getOptionLabel={(option) => option?.username}
                                        getOptionValue={(option) => option}
                                        value={
                                            vendedores?.filter((option) => option.id === proposta?.Usuario?.id)
                                        }
                                        onChange={(object) => {
                                            setProposta({ ...proposta, Usuario: object })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Empresa</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: proposta.Empresa?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Empresa"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={empresas}
                                        isSearchable
                                        getOptionLabel={(option) => option?.Descricao}
                                        getOptionValue={(option) => option}
                                        value={
                                            empresas?.filter((option) => option.id === proposta?.Empresa?.id)
                                        }
                                        onChange={(object) => {
                                            setProposta({ ...proposta, Empresa: object })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cliente</Label>
                                    <Select
                                        placeholder="Selecione..."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: proposta.Cliente?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Cliente"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={clientes}
                                        isSearchable
                                        isDisabled={proposta.Enviada > 0}
                                        getOptionLabel={(option) => `${option?.RazaoSocial} - ${option.Cnpj}`}
                                        getOptionValue={(option) => option}
                                        value={
                                            clientes?.filter((option) => option.id === proposta?.Cliente?.id)
                                        }
                                        onChange={(object) => {
                                            setProposta({ ...proposta, Cliente: object, Empresa: object.Empresa })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Contato</Label>
                                    <Select
                                        placeholder="Selecione.."
                                        className="React"
                                        classNamePrefix="select"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: proposta.Contato?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                        }}
                                        name="Contato"
                                        noOptionsMessage={() => 'Sem registro!'}
                                        options={proposta?.Cliente?.Contatos}
                                        isSearchable
                                        getOptionLabel={(option) => option?.Nome}
                                        getOptionValue={(option) => option}
                                        value={
                                            proposta?.Cliente?.Contatos?.filter((option) => option.id === proposta?.Contato?.id)
                                        }
                                        onChange={(object) => {
                                            setProposta({ ...proposta, Contato: object })
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" className="mt-1">
                                <FormGroup>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CC (Separar e-mails com ';'):</Label>
                                    <Input
                                        type="text"
                                        id="EmailCopia"
                                        name="EmailCopia"
                                        placeholder="Ex: email1@email.com;email2@email.com;email3@email.com"
                                        value={proposta.EmailCopia}
                                        onChange={(e) => setProposta({ ...proposta, [e.target.name]: e.target.value })}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="1" className="mt-1">
                                <div>
                                    <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Não enviar p/ cliente</Label>
                                    <CustomInput
                                    className='custom-control-info'
                                    type='switch'
                                    id='info'
                                    name='info'
                                    inline
                                    checked={proposta.NaoEnviarEmail}
                                    onChange={(e) => setProposta({ ...proposta, NaoEnviarEmail: e.target.checked })}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Introdução</Label>
                                <Input
                                    type="textarea"
                                    rows={5}
                                    id="Introducao"
                                    name="Introducao"
                                    placeholder="Introdução"
                                    value={proposta.Introducao}
                                    onChange={(e) => setProposta({ ...proposta, [e.target.name]: e.target.value })}
                                />
                                </FormGroup>
                            </Col>
                            <Col md="6" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Objetivo</Label>
                                <Input
                                    type="textarea"
                                    rows={5}
                                    id="Objetivo"
                                    name="Objetivo"
                                    placeholder="Objetivo"
                                    value={proposta.Objetivo}
                                    onChange={(e) => setProposta({ ...proposta, [e.target.name]: e.target.value })}
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} sm={12}>
                                <ButtonGroup className="mt-2">
                                <Button onClick={() => setAba(1)} color='primary' outline={true} active={aba === 1}>Equipamentos</Button>
                                <Button onClick={() => setAba(2)} color='primary' outline={true} active={aba === 2}>Acessórios</Button>
                                <Button onClick={() => setAba(3)} color='primary' outline={true} active={aba === 3}>Responsabilidades</Button>
                                <Button onClick={() => setAba(4)} color='primary' outline={true} active={aba === 4}>Equipe</Button>
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
                                        <span>Equipamentos</span>
                                    </Col>
                                </Row>
                                {proposta?.PropostaEquipamentos?.map((x, i) => (<Row hidden={isHidden(toggleDados)}>
                                    <Col md="2" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Equipamento</Label>
                                            <Select
                                                placeholder="Selecione..."
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.Equipamento?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                                }}
                                                name="Equipamento"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={equipamentos}
                                                isSearchable
                                                getOptionLabel={(option) => option?.Equipamento}
                                                getOptionValue={(option) => option}
                                                value={
                                                    equipamentos?.filter((option) => option.id === x.Equipamento?.id)
                                                }
                                                onChange={(object) => {
                                                    proposta.PropostaEquipamentos[i].Equipamento = object
                                                    calcularValorProposta(proposta)
                                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                                    handleEquipamento()
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Quantidade</Label>
                                            <Input
                                                type="number"
                                                id="Quantidade"
                                                name="Quantidade"
                                                placeholder="Quantidade"
                                                value={x.Quantidade}
                                                onChange={(e) => {
                                                    proposta.PropostaEquipamentos[i].Quantidade = Number(e.target.value)
                                                    gerarDescricaoValores(proposta)
                                                    calcularValorProposta(proposta)
                                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Área</Label>
                                            <Input
                                                type="text"
                                                id="Area"
                                                name="Area"
                                                placeholder="Area"
                                                value={x.Area}
                                                onChange={(e) => {
                                                    proposta.PropostaEquipamentos[i].Area = e.target.value
                                                    gerarDescricaoValores(proposta)
                                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Tipo de Cobrança</Label>
                                            <Select
                                                placeholder="Selecione..."
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.TipoCobranca ? 'hsl(0,0%,80%)' : '#cc5050' })
                                                }}
                                                name="tipocobranca"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={Lista_TiposCobranca}
                                                value={
                                                    Lista_TiposCobranca?.filter((option) => option.value === x.TipoCobranca)
                                                }
                                                onChange={(object) => {
                                                    proposta.PropostaEquipamentos[i].TipoCobranca = object.value
                                                    gerarDescricaoValores(proposta)
                                                    gerarDescricaoGarantia(proposta)
                                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor a Cobrar</Label>
                                            <NumberFormat
                                                className="mb-90 form-control"
                                                displayType="number"
                                                value={(x.ValorCobranca)}
                                                id="ValorCobranca"
                                                name="ValorCobranca"
                                                fixedDecimalScale
                                                decimalScale={2}
                                                placeholder="Valor a Cobrar"
                                                preffix="R$"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                onValueChange={(e) => {
                                                    proposta.PropostaEquipamentos[i].ValorCobranca = e.floatValue
                                                    if (proposta.PropostaEquipamentos[i].UsoPrevisto) proposta.PropostaEquipamentos[i].ValorTotal = (e.floatValue * proposta.PropostaEquipamentos[i].UsoPrevisto) + (proposta.PropostaEquipamentos[i].ValorMobilizacao ?? 0)
                                                    gerarDescricaoValores(proposta)
                                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                                    calcularValorProposta(proposta)
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    {/* <Col md="1" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Hora Adicional(%)</Label>
                                            <Input
                                                type="number"
                                                id="HoraAdicional"
                                                name="HoraAdicional"
                                                placeholder="Hora Adicional(%)"
                                                value={x.HoraAdicional}
                                                onChange={(e) => {
                                                    const val = e.target.value
                                                    const max = 100
                                                    const min = 0
                                                    const newVal = (val <= max && val >= min) || !val ? val : x.HoraAdicional
                                                    proposta.PropostaEquipamentos[i].HoraAdicional = Number(newVal)
                                                    gerarDescricaoGarantia(proposta)
                                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col> */}
                                    <Col md="1" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Horas por Diária</Label>
                                            <Input
                                                type="number"
                                                id="HorasDiaria"
                                                name="HorasDiaria"
                                                placeholder="Horas por Diária"
                                                value={x.HorasDiaria}
                                                onChange={(e) => {
                                                    const val = e.target.value
                                                    const max = 24
                                                    const min = 0
                                                    const newVal = (val <= max && val >= min) || !val ? val : x.HorasDiaria
                                                    proposta.PropostaEquipamentos[i].HorasDiaria = Number(newVal)
                                                    gerarDescricaoGarantia(proposta)
                                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">{x.TipoCobranca === Enum_TiposCobranca.Diaria ? 'Uso Previsto (diária)' : x.TipoCobranca === Enum_TiposCobranca.Hora ? 'Uso Previsto (horas)' : 'Uso Previsto'}</Label>
                                            <Input
                                                type="number"
                                                id="UsoPrevisto"
                                                name="UsoPrevisto"
                                                placeholder="Uso previsto"
                                                value={x.UsoPrevisto}
                                                onChange={(e) => {
                                                    proposta.PropostaEquipamentos[i].UsoPrevisto = Number(e.target.value)
                                                    if (proposta.PropostaEquipamentos[i].ValorCobranca) proposta.PropostaEquipamentos[i].ValorTotal = (Number(e.target.value) * proposta.PropostaEquipamentos[i].ValorCobranca) + (proposta.PropostaEquipamentos[i].ValorMobilizacao ?? 0)
                                                    gerarDescricaoGarantia(proposta)
                                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                                    calcularValorProposta(proposta)
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Mobilizacação</Label>
                                            <NumberFormat
                                                className="mb-90 form-control"
                                                displayType="number"
                                                value={(x.ValorMobilizacao)}
                                                id="ValorMobilizacao"
                                                name="ValorMobilizacao"
                                                fixedDecimalScale
                                                decimalScale={2}
                                                placeholder="Mobilizacação"
                                                preffix="R$"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                onValueChange={(e) => {
                                                    proposta.PropostaEquipamentos[i].ValorMobilizacao = e.floatValue
                                                    if (proposta.PropostaEquipamentos[i].ValorCobranca && proposta.PropostaEquipamentos[i].UsoPrevisto) proposta.PropostaEquipamentos[i].ValorTotal = (proposta.PropostaEquipamentos[i].UsoPrevisto * proposta.PropostaEquipamentos[i].ValorCobranca) + (proposta.PropostaEquipamentos[i].ValorMobilizacao ?? 0)
                                                    gerarDescricaoValores(proposta)
                                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                                    calcularValorProposta(proposta)
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Valor Total(R$)</Label>
                                            <NumberFormat
                                                className="mb-90 form-control"
                                                displayType="number"
                                                value={(x.ValorTotal)}
                                                id="ValorTotal"
                                                name="ValorTotal"
                                                fixedDecimalScale
                                                decimalScale={2}
                                                placeholder="Valor Total"
                                                preffix="R$"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                disabled
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-3">
                                        <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                            proposta.PropostaEquipamentos.splice(i, 1)
                                            setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                            handleEquipamento()
                                        }}>
                                            x
                                        </a>
                                    </Col>
                                </Row>))}
                                <br />
                                <a href='#' onClick={() => {
                                    proposta.PropostaEquipamentos.push({ id: 0, Quantidade: 1 })
                                    setProposta({ ...proposta, PropostaEquipamentos: proposta.PropostaEquipamentos })
                                }}>
                                    Adicionar Equipamento
                                </a>
                            </CardBody>}
                            {aba === 2 && <CardBody>
                                <Row>
                                    <Col md="12" className="mt-1" >
                                        {
                                        isHidden(toggleDados) ? <MdKeyboardArrowDown size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)}
                                        /> : <MdKeyboardArrowUp size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)} />
                                        }
                                        <span>Acessórios</span>
                                    </Col>
                                </Row>
                                {proposta?.Acessorios?.map((x, i) => (<Row hidden={isHidden(toggleDados)}>
                                    <Col md="6" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Acessório</Label>
                                            {x.id === 0 ? <Input style={!x.Nome ? { borderColor: '#cc5050' } : {}}
                                                type="text"
                                                value={x.Nome}
                                                id="Nome"
                                                name="Nome"
                                                placeholder="Nome"
                                                onChange={(e) => {
                                                    proposta.Acessorios[i].Nome = e.target.value
                                                    setProposta({ ...proposta, Acessorios: proposta.Acessorios })
                                                }}
                                            /> : <Select
                                            placeholder="Selecione..."
                                            className="React"
                                            classNamePrefix="select"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 9999 }),
                                                control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                            }}
                                            name="Acessorios"
                                            noOptionsMessage={() => 'Sem registro!'}
                                            options={acessoriosDisponiveis}
                                            isSearchable
                                            getOptionLabel={(option) => option?.Nome}
                                            getOptionValue={(option) => option}
                                            value={
                                                acessorios?.filter((option) => option.id === x.id)
                                            }
                                            onChange={(object) => {
                                                proposta.Acessorios[i] = object
                                                setProposta({ ...proposta, Acessorios: proposta.Acessorios })
                                            }}
                                        />}
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-3">
                                        <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                            proposta.Acessorios.splice(i, 1)
                                            setProposta({ ...proposta, Acessorios: proposta.Acessorios })
                                        }}>
                                            x
                                        </a>
                                    </Col>
                                </Row>))}
                                <br />
                                <a style={{marginRight: '2%'}} href='#' onClick={() => {
                                    proposta.Acessorios.push({})
                                    setProposta({ ...proposta, Acessorios: proposta.Acessorios })
                                }}>
                                    Adicionar Acessório
                                </a>
                                <a href='#' onClick={() => {
                                    proposta.Acessorios.push({ id: 0 })
                                    setProposta({ ...proposta, Acessorios: proposta.Acessorios })
                                }}>
                                    Cadastrar Acessório
                                </a>
                            </CardBody>}
                            {aba === 3 && <CardBody>
                                <Row>
                                    <Col md="12" className="mt-1" >
                                        {
                                        isHidden(toggleDados) ? <MdKeyboardArrowDown size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)}
                                        /> : <MdKeyboardArrowUp size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)} />
                                        }
                                        <span>Responsabilidades</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6" className="mt-1">
                                        <h6>Contrante</h6>
                                        {proposta?.PropostaResponsabilidades?.map((x, i) => (
                                        x.Responsavel === Enum_TipoResponsabilidade.Contratante && <Row>
                                            <a href='#' className="mt-2 ml-1" style={{ color: '#b10000' }} onClick={() => {
                                                proposta.PropostaResponsabilidades.splice(i, 1)
                                                setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                            }}>
                                                x
                                            </a>
                                            <Col md="10">
                                                <Input
                                                    style={x.Responsabilidade?.Importante ? { backgroundColor: 'rgb(253 156 156)' } : {}}
                                                    type="text"
                                                    name="Responsabilidade"
                                                    placeholder="Responsabilidade"
                                                    disabled
                                                    className="mt-1"
                                                    value={x?.Responsabilidade?.Responsabilidade}
                                                />
                                            </Col>
                                            <FiArrowRight style={{cursor: 'pointer'}} className="mt-2" size={15} onClick={() => {
                                                    proposta.PropostaResponsabilidades[i].Responsavel = Enum_TipoResponsabilidade.Contratado
                                                    setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                            }} />
                                        </Row>
                                        ))}
                                    </Col>
                                    <Col md="6" className="mt-1">
                                        <h6>Contratado</h6>
                                        {proposta?.PropostaResponsabilidades?.map((x, i) => (
                                        x.Responsavel === Enum_TipoResponsabilidade.Contratado && <Row>
                                            <FiArrowLeft style={{cursor: 'pointer'}} className="mt-2" size={15} onClick={() => {
                                                    proposta.PropostaResponsabilidades[i].Responsavel = Enum_TipoResponsabilidade.Contratante
                                                    setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                            }} />
                                            <Col md="10">
                                                <Input
                                                    style={x?.Responsabilidade?.Importante ? { backgroundColor: 'rgb(253 156 156)' } : {}}
                                                    type="text"
                                                    name="Responsabilidade"
                                                    placeholder="Responsabilidade"
                                                    disabled
                                                    className="mt-1"
                                                    value={x?.Responsabilidade?.Responsabilidade}
                                                />
                                            </Col>
                                            <Col md="1" className="mt-2">
                                                <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                                    proposta.PropostaResponsabilidades.splice(i, 1)
                                                    setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                                }}>
                                                    x
                                                </a>
                                            </Col>
                                        </Row>
                                        ))}
                                    </Col>
                                </Row>
                                {proposta?.PropostaResponsabilidades?.map((x, i) => (
                                !x.Responsavel && <Row hidden={isHidden(toggleDados)}>
                                    <Col md="6" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Responsabilidade</Label>
                                            {x.Responsabilidade?.id === 0 ? <Input style={x.Responsabilidade.Responsabilidade ? { borderColor: '#cc5050' } : {}}
                                                type="text"
                                                value={x.Responsabilidade.Responsabilidade}
                                                id="Responsabilidade"
                                                name="Responsabilidade"
                                                placeholder="Responsabilidade"
                                                onChange={(e) => {
                                                    proposta.PropostaResponsabilidades[i].Responsabilidade.Responsabilidade = e.target.value
                                                    setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                                }}
                                            /> : <Select
                                                placeholder="Selecione..."
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.Responsabilidade?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                                }}
                                                name="Responsabilidades"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={responsabilidadesDisponiveis}
                                                isSearchable
                                                getOptionLabel={(option) => option?.Responsabilidade}
                                                getOptionValue={(option) => option}
                                                value={
                                                    responsabilidades?.filter((option) => option.id === x.Responsabilidade?.id)
                                                }
                                                onChange={(object) => {
                                                    proposta.PropostaResponsabilidades[i].Responsabilidade = object
                                                    proposta.PropostaResponsabilidades[i].Responsavel = object.Responsavel
                                                    setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                                }}
                                            />}
                                        </FormGroup>
                                    </Col>
                                    <Col md="5" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Responsável</Label>
                                            <Select
                                                placeholder="Selecione..."
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.Responsavel ? 'hsl(0,0%,80%)' : '#cc5050' })
                                                }}
                                                name="Responsavel"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={optionsTipo}
                                                isSearchable
                                                value={
                                                    optionsTipo.filter((option) => option.value === x.Responsavel)
                                                }
                                                onChange={(object) => {
                                                    proposta.PropostaResponsabilidades[i].Responsavel = object.value
                                                    setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-3">
                                        <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                            proposta.PropostaResponsabilidades.splice(i, 1)
                                            setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                        }}>
                                            x
                                        </a>
                                    </Col>
                                </Row>))}
                                <br />
                                <a style={{marginRight: '2%'}} href='#' onClick={() => {
                                    proposta.PropostaResponsabilidades.push({ id: 0 })
                                    setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                }}>
                                    Adicionar Responsabilidade
                                </a>
                                <a href='#' onClick={() => {
                                    proposta.PropostaResponsabilidades.push({ id: 0, Responsabilidade: { id: 0, Ativo: true } })
                                    setProposta({ ...proposta, PropostaResponsabilidades: proposta.PropostaResponsabilidades })
                                }}>
                                    Cadastrar Responsabilidade
                                </a>
                            </CardBody>}
                            {aba === 4 && <CardBody>
                                <Row>
                                    <Col md="12" className="mt-1" >
                                        {
                                        isHidden(toggleDados) ? <MdKeyboardArrowDown size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)}
                                        /> : <MdKeyboardArrowUp size={20} style={{ cursor: 'pointer' }} onClick={() => setToggleDados(!toggleDados)} />
                                        }
                                        <span>Equipe por período</span>
                                    </Col>
                                </Row>
                                {proposta?.PropostaEquipes?.map((x, i) => (<Row hidden={isHidden(toggleDados)}>
                                    <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Cargo</Label>
                                            <Select
                                                placeholder="Selecione..."
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.Cargo?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                                }}
                                                name="Cargo"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={cargos}
                                                isSearchable
                                                getOptionLabel={(option) => option?.Descricao}
                                                getOptionValue={(option) => option}
                                                value={
                                                    cargos?.filter((option) => option.id === x.Cargo?.id)
                                                }
                                                onChange={(object) => {
                                                    proposta.PropostaEquipes[i].Cargo = object
                                                    setProposta({ ...proposta, PropostaEquipes: proposta.PropostaEquipes })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    {!x.Cargo?.UnicoEquipamento && <Col md="4" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Equipamento</Label>
                                            <Select
                                                placeholder="Selecione..."
                                                className="React"
                                                classNamePrefix="select"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 9999 }),
                                                    control: provided => ({ ...provided, minHeight: 0, height: '3rem', borderColor: x.Equipamento?.id ? 'hsl(0,0%,80%)' : '#cc5050' })
                                                }}
                                                name="Equipamento"
                                                noOptionsMessage={() => 'Sem registro!'}
                                                options={proposta.PropostaEquipamentos?.map(x => x.Equipamento)}
                                                isSearchable
                                                getOptionLabel={(option) => option?.Equipamento}
                                                getOptionValue={(option) => option}
                                                value={
                                                    proposta.PropostaEquipamentos?.map(x => x.Equipamento)?.filter((option) => option?.id === x.Equipamento?.id)
                                                }
                                                onChange={(object) => {
                                                    proposta.PropostaEquipes[i].Equipamento = object
                                                    setProposta({ ...proposta, PropostaEquipes: proposta.PropostaEquipes })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>}
                                    <Col md="2" className="mt-1">
                                        <FormGroup>
                                            <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Quantidade</Label>
                                            <Input style={!x.Quantidade ? { borderColor: '#cc5050' } : {}}
                                                type="number"
                                                value={x.Quantidade}
                                                id="Quantidade"
                                                name="Quantidade"
                                                placeholder="Quantidade"
                                                onChange={(e) => {
                                                    proposta.PropostaEquipes[i].Quantidade = Number(e.target.value)
                                                    setProposta({ ...proposta, PropostaEquipes: proposta.PropostaEquipes })
                                                }}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="1" className="mt-3">
                                        <a href='#' style={{ color: '#b10000' }} onClick={() => {
                                            proposta.PropostaEquipes.splice(i, 1)
                                            setProposta({ ...proposta, PropostaEquipes: proposta.PropostaEquipes })
                                        }}>
                                            x
                                        </a>
                                    </Col>
                                </Row>))}
                                <br />
                                <a href='#' onClick={() => {
                                    proposta.PropostaEquipes.push({ id: 0, Quantidade: 1 })
                                    setProposta({ ...proposta, PropostaEquipes: proposta.PropostaEquipes })
                                }}>
                                    Adicionar a equipe
                                </a>
                            </CardBody>}
                        </Card>
                        <Row>
                            <Col md="12" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descrição dos Valores</Label>
                                <Input
                                    type="textarea"
                                    rows={10}
                                    id="DescricaoValores"
                                    name="DescricaoValores"
                                    placeholder="Descrição dos Valores"
                                    value={proposta.DescricaoValores}
                                    onChange={(e) => setProposta({ ...proposta, [e.target.name]: e.target.value })}
                                />
                                </FormGroup>
                            </Col>
                            <Col md="12" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Descrição da Garantia</Label>
                                <Input
                                    type="textarea"
                                    rows={10}
                                    id="DescricaoGarantia"
                                    name="DescricaoGarantia"
                                    placeholder="Descrição da Garantia"
                                    value={proposta.DescricaoGarantia}
                                    onChange={(e) => setProposta({ ...proposta, [e.target.name]: e.target.value })}
                                />
                                <Alert color='danger' style={{width: '25%'}}>
                                    <div className='alert-body'>
                                    <span className='fw-bold'>Favor verificar o valor das horas adicionais antes de prosseguir!</span>
                                    </div>
                                </Alert>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="8" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Condições de Pagamento</Label>
                                <Input
                                    type="textarea"
                                    rows={10}
                                    id="CondicaoPagamento"
                                    name="CondicaoPagamento"
                                    placeholder="Condições de Pagamento"
                                    value={proposta.CondicaoPagamento}
                                    onChange={(e) => setProposta({ ...proposta, [e.target.name]: e.target.value })}
                                />
                                </FormGroup>
                            </Col>
                            <Col md="4" className="mt-1">
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="PorcentagemRL">Porcentagem RL(%)</Label>
                                        <Input
                                            type="number"
                                            id="PorcentagemRL"
                                            name="PorcentagemRL"
                                            placeholder="Porcentagem RL"
                                            value={proposta.PorcentagemRL}
                                            onChange={(e) => {
                                            const val = e.target.value
                                            const max = 100
                                            const min = 0
                                            const newVal = (val <= max && val >= min) || !val ? val : proposta.PorcentagemRL
                                            proposta.PorcentagemRL = Number(newVal)
                                            setProposta(proposta)
                                            gerarCondicaoPagamento(proposta)
                                            }}
                                        />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">CTe</Label>
                                        <Select
                                            placeholder="Selecione..."
                                            className="React"
                                            classNamePrefix="select"
                                            styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                            }}
                                            name="CTe"
                                            options={options}
                                            isSearchable
                                            value={options.filter((option) => option.value === proposta.Cte)}
                                            onChange={(e) => {
                                                proposta.Cte = e.value
                                                setProposta(proposta)
                                                gerarCondicaoPagamento(proposta)
                                            }}
                                        />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Pagamento Antecipado</Label>
                                        <Select
                                            placeholder="Selecione..."
                                            className="React"
                                            classNamePrefix="select"
                                            styles={{
                                            menu: provided => ({ ...provided, zIndex: 9999 }),
                                            control: provided => ({ ...provided, minHeight: 0, height: '3rem' })
                                            }}
                                            name="Pagamento"
                                            options={options}
                                            isSearchable
                                            value={options.filter((option) => option.value === proposta.PagamentoAntecipado)}
                                            onChange={(e) => {
                                                proposta.PagamentoAntecipado = e.value
                                                setProposta(proposta)
                                                gerarCondicaoPagamento(proposta)
                                            }}
                                        />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                        <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder" for="Valor">Valor Total(R$)</Label>
                                        <Input
                                            type="number"
                                            id="Valor"
                                            name="Valor"
                                            placeholder="Valor Total"
                                            value={proposta.Valor}
                                            onChange={(e) => {
                                            const val = e.target.value
                                            proposta.Valor = Number(val)
                                            setProposta(proposta)
                                            gerarCondicaoPagamento(proposta)
                                            }}
                                        />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="8" className="mt-1">
                                <FormGroup>
                                <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Validade da Proposta</Label>
                                <Input
                                    type="textarea"
                                    rows={10}
                                    id="ValidadeProposta"
                                    name="ValidadeProposta"
                                    placeholder="Validade da Proposta"
                                    value={proposta.ValidadeProposta}
                                    onChange={(e) => setProposta({ ...proposta, [e.target.name]: e.target.value })}
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        {!isValid && 
                        <Alert color='danger'>
                            <div className='alert-body'>
                            <span className='fw-bold'>{error}</span>
                            </div>
                        </Alert>}
                        <Button.Ripple
                            disabled={!isValid}
                            color="primary"
                            className="mr-1 mb-1"
                            onClick={e => save(proposta)}
                        >
                            {proposta.Enviada ? 'Gerar Revisão' : 'Salvar Proposta'}
                        </Button.Ripple>
                    </ModalFooter>
                </Modal>
            </span>
        </div>
    )
}

export default ModalCadastroProposta

