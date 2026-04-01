import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Button,
  Row,
  Col,
  Label,
  Input,
  Card,
  CardBody,
  CustomInput,
} from "reactstrap";
import Select from "react-select";
import "@styles/base/pages/modal.scss";
import NumberFormat from "react-number-format";
import { Search } from "react-feather";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { buscarPropostasMedicaoPorCliente } from "@src/redux/actions/comercial/proposta/buscarPropostasActions";
import { buscarOrdensMedicao } from "../../../../../redux/actions/logistica/ordem-servico/buscarOrdensActions";
import { connect } from "react-redux";
import { Enum_StatusMedicao, Enum_StatusPrecificacao } from "../../../../../utility/enum/Enums";
import { FiPlus, FiMinus } from "react-icons/fi";
import moment from "moment";

const ModalNovaMedicao = (props) => {
  const { modal, handleClose, clientes, empresas, handlePrecificar, criarMedicao } = props;

  const [propostas, setPropostas] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [search, setSearch] = useState({
    Cliente: {},
    Proposta: {},
    Data: [],
  });
  const [model, setModel] = useState({
    Ordens: [],
    Empresa: {},
    Cliente: {},
    Contato: {},
    Revisao: 0,
    EmailCopia: '',
    Cte: false,
    ValorRL: 0,
    ValorServico: 0,
    ValorCte: 0,
    PorcentagemRL: 0,
    TotalServico: 0,
    TotalHora: 0,
    Adicional: 0,
    Desconto: 0,
    ValorTotal: 0,
    Status: Enum_StatusMedicao.EmAberto,
    DataCriacao: new Date(),
    CriadoPor: {}
  });
  const [togglePrecificadas, setTogglePrecificadas] = useState(false)
  const [toggleNaoPrecificadas, setToggleNaoPrecificadas] = useState(true)
  const [selectAll, setSelectAll] = useState(false)

  const options = [
    { label: "Sim", value: true },
    { label: "Não", value: false },
  ];

  useEffect(() => {
    if (modal) {
      setSearch({
        Acompanhante: '',
        Cliente: {},
        Contato: {},
        Proposta: {},
        Data: []
      })
      setModel({
        Ordens: [],
        Cliente: {},
        Contato: {},
        Empresa: {},
        Revisao: 0,
        EmailCopia: '',
        Cte: false,
        ValorRL: 0,
        ValorServico: 0,
        ValorCte: 0,
        PorcentagemRL: 0,
        TotalServico: 0,
        TotalHora: 0,
        Adicional: 0,
        Desconto: 0,
        ValorTotal: 0,
        Status: Enum_StatusMedicao.EmAberto,
        DataCriacao: new Date(),
        CriadoPor: {}
      })
      setTogglePrecificadas(false)
      setToggleNaoPrecificadas(true)
      setSelectAll(false)
      setPropostas([])
      setOrdens([])
    }
  }, [modal]);

  useEffect(() => {
    setPropostas(props.propostas);
  }, [props.propostas]);

  useEffect(() => {
    setSelectAll(false)
    setOrdens(props.ordens);
  }, [props.ordens]);

  useEffect(() => {
    calcularValores(model.Ordens)
  }, [model.PorcentagemRL]);

  useEffect(() => {
    setSearch({... search, 
      Contato: {},
      Acompanhante: '',
      Proposta: {}
    });
    setModel({
      Ordens: [],
      Cliente: search.Cliente,
      Empresa: {},
      Contato: {},
      Revisao: 0,
      EmailCopia: '',
      Cte: false,
      ValorRL: 0,
      ValorServico: 0,
      ValorCte: 0,
      PorcentagemRL: (search.Cliente?.PorcentagemRL || 0) * 100,
      TotalServico: 0,
      TotalHora: 0,
      Adicional: 0,
      Desconto: 0,
      ValorTotal: 0,
      Status: Enum_StatusMedicao.EmAberto,
      DataCriacao: new Date(),
      CriadoPor: {}
    })
    setOrdens([])
  }, [search.Cliente]);

  const calcularValores = (ordens) => {
    if (!model.Cliente?.id) return
    const selecionadas = ordens?.filter(x => x.Selecionado)
    let totalServico = 0
    let totalHora = 0
    let adicional = 0
    let desconto = 0
    let totalCobranca = 0

    selecionadas.forEach(os => {
      totalServico += os.PrecificacaoTotalServico || 0
      totalHora += os.PrecificacaoTotalHora || 0
      adicional += os.PrecificacaoValorExtra || 0
      desconto += os.PrecificacaoDesconto || 0
      totalCobranca += os.PrecificacaoValorTotal || 0    
    })

    const valorLocacao = totalCobranca * ((model.PorcentagemRL / 100) || 0)
    const valorServico = totalCobranca - valorLocacao

    setModel({...model, Ordens: selecionadas, TotalServico: totalServico, TotalHora: totalHora, Adicional: adicional, Desconto: desconto, ValorTotal: totalCobranca, 
      ValorCte: totalCobranca, ValorServico: valorServico, ValorRL: valorLocacao})
  }

  const handlerFiltroData = (dateValue) => {
    setSearch({ ...search, Data: dateValue });
  };

  const buscarOrdens = (e) => {
    props.buscarOrdensMedicao(search);
  };

  const isNotValid = () => {
    return !model.Ordens || model.Ordens.length === 0 || !model.Contato?.id || !model.Empresa?.id
  }

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
            style={{ background: "#2F4B7433" }}
            cssModule={{ close: "close button-close" }}
          >
            <h4 className="mt-1 mb-1">
              <b>Criar Nova Medição</b>
            </h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Data</Label>
                  <Flatpickr
                    value={search.Data}
                    onChange={(date) => handlerFiltroData(date)}
                    onClose={(selectedDates, dateStr, instance) => {
                      if (selectedDates.length === 1) {
                        instance.setDate(
                          [selectedDates[0], selectedDates[0]],
                          true
                        );
                      }
                    }}
                    className="form-control"
                    key={Portuguese}
                    options={{
                      mode: "range",
                      locale: Portuguese,
                      dateFormat: "d-m-Y",
                    }}
                    name="filtroData"
                    placeholder="Intervalo de datas"
                    //ref={refComp}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Cliente</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      control: (provided) => ({
                        ...provided,
                        minHeight: 0,
                        height: "3rem",
                      }),
                    }}
                    name="Cliente"
                    noOptionsMessage={() => "Sem registro!"}
                    options={clientes}
                    isSearchable
                    getOptionLabel={(option) => option?.RazaoSocial}
                    getOptionValue={(option) => option}
                    value={clientes?.filter(
                      (option) => option.id === search?.Cliente?.id
                    )}
                    onChange={(object) => {
                      props.buscarPropostasMedicaoPorCliente(object);
                      setSearch({ ...search, Cliente: object });
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Propostas</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      control: (provided) => ({
                        ...provided,
                        minHeight: 0,
                        height: "3rem",
                      }),
                    }}
                    name="Proposta"
                    getOptionLabel={(option) =>
                      `${option?.Codigo}/${option?.Revisao}`
                    }
                    getOptionValue={(option) => option}
                    options={propostas}
                    isClearable
                    isSearchable
                    value={propostas?.filter(
                      (option) => option.id === search.Proposta.id
                    )}
                    onChange={(object) => {
                      setSearch({ ...search, Proposta: object || {} });
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md="2" style={{ marginTop: "25px" }}>
                <Button
                  color="primary"
                  disabled={!search.Cliente?.id}
                  onClick={() => {
                    buscarOrdens();
                  }}
                  className="text-size-button"
                >
                  <Search
                    style={{
                      width: "15px",
                      height: "15px",
                      marginRight: "8px",
                      marginTop: "-3px",
                    }}
                  />
                  Buscar OS's
                </Button>
              </Col>
            </Row>
          </ModalBody>
          {!ordens.length && (
            <div
              style={{
                textAlign: "right",
                marginRight: "auto",
                padding: "0px 0px 10px 18px",
              }}
            >
              <Button
                onClick={() => handleClose()}
                className="text-size-button"
              >
                Cancelar
              </Button>
            </div>
          )}
          {ordens.length > 0 && (
            <>
              <Row>
                <Col md="7">
                  <Row
                    style={{
                      marginLeft:"10px"
                    }}>
                  {
                    togglePrecificadas ? <FiPlus size={15} style={{ cursor: 'pointer', marginRight:'8px' }} onClick={() => setTogglePrecificadas(!togglePrecificadas)}
                    /> : <FiMinus size={15} style={{ cursor: 'pointer', marginRight:'8px' }} onClick={() => setTogglePrecificadas(!togglePrecificadas)} />
                    }
                    <span style={{ color: "green" }}>
                      OS's Precificadas {" "}
                    </span>
                    <span style={{ marginRight: "auto" }}> | {search.Cliente.RazaoSocial}</span>
                  </Row>
                  <Card style={{ marginLeft: "10px" }} hidden={togglePrecificadas}>
                    <CardBody>
                      <Row className='mb-1'>
                        <Col>
                          <CustomInput
                            type="checkbox"
                            id='select_all'
                            className="custom-control-primary"
                            inline
                            checked={selectAll}
                            onChange={(e) => {
                              ordens.forEach(x => { if(x.StatusPrecificacao === Enum_StatusPrecificacao.Precificada) x.Selecionado = e.target.checked })
                              calcularValores(ordens)
                              setOrdens(
                                [...ordens],
                                ordens
                              );
                              setSelectAll(e.target.checked)
                            }}
                          />
                          <span>Selecionar tudo</span>
                        </Col>
                      </Row>
                      {ordens.filter(f => { if(f.StatusPrecificacao === Enum_StatusPrecificacao.Precificada) return f }).map((os) => 
                        (<Row className="mb-2">
                          <div className="mt-1" style={{marginLeft:"10px"}}>
                            <CustomInput
                              type="checkbox"
                              id={os.id}
                              className="custom-control-primary zindex-0"
                              inline
                              checked={os?.Selecionado}
                              onChange={(e) => {
                                ordens.find(x => x.id === os.id).Selecionado =
                                  e.target.checked;
                                calcularValores(ordens)
                                setOrdens(
                                  [...ordens],
                                  ordens
                                );
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Código</span>
                            <span style={{ marginTop: "8px" }}>{os.Codigo}/{os.Numero}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Cliente</span>
                            <span style={{ marginTop: "8px" }}>{os.Cliente.RazaoSocial.length > 30 ? `${os.Cliente.RazaoSocial.slice(0, 30)}...` : os.Cliente.RazaoSocial}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Contato</span>
                            <span style={{ marginTop: "8px" }}>{os.Contato?.Nome}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Equipamento</span>
                            <span style={{ marginTop: "8px" }}>{os.Equipamento?.Equipamento}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Data</span>
                            <span style={{ marginTop: "8px" }}>{moment(os.DataInicial).format('DD/MM/YYYY')}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                              marginLeft: "auto",
                            }}
                          >
                            <span>Valor Total</span>
                            <span
                              style={{
                                marginTop: "8px",
                                backgroundColor: "#E1E1E1",
                                fontWeight: 700,
                              }}
                            >
                              R$ {os.PrecificacaoValorTotal?.toFixed(2)}
                            </span>
                          </div>
                      </Row>))}
                    </CardBody>
                  </Card>
                </Col>
                <Col md="5">
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    {
                    toggleNaoPrecificadas ? <FiPlus size={15} style={{ cursor: 'pointer', marginRight:'8px' }} onClick={() => setToggleNaoPrecificadas(!toggleNaoPrecificadas)}
                    /> : <FiMinus size={15} style={{ cursor: 'pointer', marginRight:'8px' }} onClick={() => setToggleNaoPrecificadas(!toggleNaoPrecificadas)} />
                    }
                    <span style={{ color: "red" }}>OS's não Precificadas </span>
                    <span style={{ marginRight: "auto" }}> | {search.Cliente.RazaoSocial}</span>
                  </div>
                  <Card style={{ marginRight: "18px" }} hidden={toggleNaoPrecificadas}>
                    <CardBody>
                      {ordens.filter(f => { if(!f.StatusPrecificacao) return f }).map((os) => 
                        (<Row className="mb-2">
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Codigo</span>
                            <span style={{ marginTop: "8px" }}>{os.Codigo}/{os.Numero}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Cliente</span>
                            <span style={{ marginTop: "8px" }}>{os.Cliente.RazaoSocial.length > 30 ? `${os.Cliente.RazaoSocial.slice(0, 30)}...` : os.Cliente.RazaoSocial}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Contato</span>
                            <span style={{ marginTop: "8px" }}>{os.Contato?.Nome}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Equipamento</span>
                            <span style={{ marginTop: "8px" }}>{os.Equipamento?.Equipamento}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                            }}
                          >
                            <span>Data</span>
                            <span style={{ marginTop: "8px" }}>{moment(os.DataInicial).format('DD/MM/YYYY')}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 5px 0px 8px",
                              marginLeft: "auto",
                            }}
                          >
                            <span style={{ marginTop: "8px", cursor: 'pointer' }} onClick={() => handlePrecificar(os)}>
                              <u>Precificar</u>
                            </span>
                          </div>
                      </Row>))}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md="7" style={{marginLeft:'10px'}}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="font-weight-bolder">
                          Empresa
                        </Label>
                        <Select
                          placeholder="Selecione.."
                          className="React"
                          classNamePrefix="select"
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 9999 }),
                            control: (provided) => ({
                              ...provided,
                              minHeight: 0,
                              height: "3rem",
                            }),
                          }}
                          style={
                            !model?.Empresa?.id
                              ? { borderColor: "#ea5455" }
                              : {}
                          }
                          name="Empresa"
                          noOptionsMessage={() => "Sem registro!"}
                          options={empresas}
                          isSearchable
                          getOptionLabel={(option) => option.Descricao}
                          getOptionValue={(option) => option}
                          value={empresas?.filter(
                            (option) => option.id === model?.Empresa?.id
                          )}
                          onChange={(object) => {
                            setModel({ ...model, Empresa: object });
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="font-weight-bolder">
                          Contato da Medição
                        </Label>
                        <Select
                          placeholder="Selecione.."
                          className="React"
                          classNamePrefix="select"
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 9999 }),
                            control: (provided) => ({
                              ...provided,
                              minHeight: 0,
                              height: "3rem",
                            }),
                          }}
                          style={
                            !model?.Contato?.id
                              ? { borderColor: "#ea5455" }
                              : {}
                          }
                          name="ContatoMedicao"
                          noOptionsMessage={() => "Sem registro!"}
                          options={search?.Cliente?.Contatos}
                          isSearchable
                          getOptionLabel={(option) => `${option?.Nome} - ${option.Email?.toLowerCase() || ''}`}
                          getOptionValue={(option) => option}
                          value={search?.Cliente?.Contatos?.filter(
                            (option) => option.id === model?.Contato?.id
                          )}
                          onChange={(object) => {
                            setModel({ ...model, Contato: object });
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="font-weight-bolder">
                          Solicitante (Nome - Email)
                        </Label>
                        <Input
                          type="text"
                          id="Solicitante"
                          name="Solicitante"
                          placeholder="Solicitante"
                          value={model.Solicitante}
                          onChange={(e) =>
                            setModel({
                              ...model,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="font-weight-bolder">
                          CC (Separar e-mails com ';'):
                        </Label>
                        <Input
                          type="text"
                          id="EmailCopia"
                          name="EmailCopia"
                          placeholder="Ex: email1@email.com;email2@email.com;email3@email.com"
                          value={model.EmailCopia}
                          onChange={(e) =>
                            setModel({
                              ...model,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="font-weight-bolder">CTe</Label>
                        <Select
                          placeholder="Selecione..."
                          className="React"
                          classNamePrefix="select"
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 9999 }),
                            control: (provided) => ({
                              ...provided,
                              minHeight: 0,
                              height: "3rem",
                            }),
                          }}
                          name="Cte"
                          options={options}
                          isSearchable
                          value={options.filter(
                            (option) => option.value === model.Cte
                          )}
                          onChange={(e) => {
                            setModel({...model, Cte: e.value});
                          }}
                        />
                      </FormGroup>
                    </Col>
                    {model.Cte === true ? (
                      <Col md="6">
                        <FormGroup>
                          <Label className="font-weight-bolder">Valor CTe</Label>
                          <NumberFormat
                            className="mb-90 form-control"
                            displayType="number"
                            value={model.ValorCte}
                            id="ValorCte"
                            name="ValorCte"
                            fixedDecimalScale
                            decimalScale={2}
                            placeholder="Valor por CTe"
                            prefix="R$ "
                            decimalSeparator=","
                            thousandSeparator="."
                            onValueChange={(e) => {}}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    ) :
                    <Col md="6">
                      <FormGroup>
                        <Label className="font-weight-bolder">
                          Valor por locação de equipamento
                        </Label>
                        <NumberFormat
                          className="mb-90 form-control"
                          displayType="number"
                          value={model.ValorRL}
                          id="ValorRL"
                          name="ValorRL"
                          fixedDecimalScale
                          decimalScale={2}
                          placeholder="Valor por Locação"
                          prefix="R$ "
                          decimalSeparator=","
                          thousandSeparator="."
                          onValueChange={(e) => {}}
                          disabled
                        />
                      </FormGroup>
                    </Col>}
                  </Row>
                  {!model.Cte && <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="font-weight-bolder">
                          Porcentagem de recibo de locação (%)
                        </Label>
                        <NumberFormat
                          className="mb-90 form-control"
                          displayType="number"
                          value={model.PorcentagemRL}
                          id="PorcentagemRL"
                          name="PorcentagemRL"
                          fixedDecimalScale
                          decimalScale={2}
                          placeholder="Porcentagem RL"
                          suffix="%"
                          decimalSeparator=","
                          thousandSeparator="."
                          onValueChange={(e) => {
                            setModel({...model, PorcentagemRL: e.floatValue || 0});
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="font-weight-bolder">
                          Valor por serviço
                        </Label>
                        <NumberFormat
                          className="mb-90 form-control"
                          displayType="number"
                          value={model.ValorServico}
                          id="ValorServico"
                          name="ValorServico"
                          fixedDecimalScale
                          decimalScale={2}
                          placeholder="Valor por Serviço"
                          prefix="R$ "
                          decimalSeparator=","
                          thousandSeparator="."
                          onValueChange={(e) => {}}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>}
                </Col>
                <Col md="5" style={{marginLeft:'10px'}}>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col md="8">
                          <span>Total por serviço</span>
                        </Col>
                        <Col md="4">
                          <NumberFormat
                            className="mb-90 form-control border-0 outline-0 bg-transparent"
                            displayType="number"
                            value={
                              Number(model.TotalServico)
                            }
                            id="ValorServico"
                            name="ValorServico"
                            fixedDecimalScale
                            decimalScale={2}
                            disabled
                            placeholder="R$"
                            prefix="R$ "
                            decimalSeparator=","
                            thousandSeparator="."
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "10px" }}>
                        <Col md="8">
                          <span>Total por hora</span>
                        </Col>
                        <Col md="4">
                          <NumberFormat
                            className="mb-90 form-control border-0 outline-0 bg-transparent"
                            displayType="number"
                            value={
                              Number(model.TotalHora)
                            }
                            id="TotalHora"
                            name="TotalHora"
                            fixedDecimalScale
                            decimalScale={2}
                            disabled
                            placeholder="R$"
                            prefix="R$ "
                            decimalSeparator=","
                            thousandSeparator="."
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "10px" }}>
                        <Col md="8">
                          <span>Adicional extra</span>
                        </Col>
                        <Col md="4">
                          <NumberFormat
                            className="mb-90 form-control border-0 outline-0 bg-transparent"
                            displayType="number"
                            value={model.Adicional}
                            id="Adicional"
                            name="Adicional"
                            fixedDecimalScale
                            decimalScale={2}
                            disabled
                            placeholder="R$"
                            prefix="R$ "
                            decimalSeparator="."
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "10px" }}>
                        <Col md="8">
                          <span>Descontos</span>
                        </Col>
                        <Col md="4">
                          <NumberFormat
                            className="mb-90 form-control border-0 outline-0 bg-transparent"
                            displayType="number"
                            value={Number(model.Desconto)}
                            id="Desconto"
                            name="Desconto"
                            fixedDecimalScale
                            decimalScale={2}
                            disabled
                            placeholder="R$"
                            prefix="R$ "
                            decimalSeparator="."
                          />
                        </Col>
                      </Row>
                      <hr></hr>
                      <Row style={{ marginTop: "10px" }}>
                        <Col md="8">
                          <strong>Valor Total da Cobrança</strong>
                        </Col>
                        <Col md="4">
                          <NumberFormat
                            className="mb-90 form-control border-0 outline-0 bg-transparent"
                            displayType="number"
                            value={Number(model.ValorTotal)}
                            id="ValorTotal"
                            name="ValorTotal"
                            fixedDecimalScale
                            decimalScale={2}
                            disabled
                            placeholder="R$"
                            prefix="R$ "
                            decimalSeparator="."
                          />
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <div
                style={{
                  textAlign: "right",
                  marginLeft: "auto",
                  padding: "0px 0px 10px 18px",
                }}
              >
                <Button
                  onClick={() => handleClose()}
                  className="text-size-button"
                  /* disabled={loadingSkeleton || !newCode} */
                >
                  Cancelar
                </Button>
                <Button
                  style={{ marginRight: "18px", marginLeft: "18px" }}
                  onClick={() => criarMedicao(model)}
                  className="text-size-button"
                  color="primary"
                  disabled={isNotValid()}
                >
                  Criar Medição
                </Button>
              </div>
            </>
          )}
        </Modal>
      </span>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    propostas: state?.proposta?.propostasMedicao,
    ordens: state?.ordem.ordensMedicao,
  };
};

export default connect(mapStateToProps, {
  buscarPropostasMedicaoPorCliente,
  buscarOrdensMedicao
})(ModalNovaMedicao);
