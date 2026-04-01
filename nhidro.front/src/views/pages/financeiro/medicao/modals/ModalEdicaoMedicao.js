import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  CardFooter,
} from "reactstrap";
import Select from "react-select";
import "@styles/base/pages/modal.scss";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { FiArrowLeft, FiEdit, FiSave, FiSend, FiXCircle } from "react-icons/fi";
import NumberFormat from "react-number-format";
import { Enum_StatusMedicao, Enum_StatusPrecificacao } from "../../../../../utility/enum/Enums";

const ModalEdicaoMedicao = (props) => {
  const { modalEdicao, medicao, ordens, vendedores, handleClose, handlePrecificar, alterarMedicao, alterarStatusMedicao } = props;

  const [model, setModel] = useState({
    Ordens: [],
    OrdensRemovidas: [],
    Empresa: {},
    Cliente: {},
    Contato: {},
    Revisao: 0,
    Cte: false,
    ValorRL: 0,
    TotalServico: 0,
    ValorCte: 0,
    PorcentagemRL: 0,
    TotalHora: 0,
    Adicional: 0,
    Desconto: 0,
    ValorTotal: 0,
    Status: Enum_StatusMedicao.EmAberto,
    DataCriacao: new Date(),
    Codigo: 0,
    DataAprovacaoInterna: new Date(),
    DataCobranca: new Date(),
    EmailCopia: "",
    ValorServico: 0,
    Observacoes: ""
  });
  const [adicionarOS, setAdicionarOS] = useState(false)
  const [ordensList, setOrdensList] = useState([])

  const options = [
    { label: "Sim", value: true },
    { label: "Não", value: false },
  ];

  useEffect(() => {
    if (modalEdicao) {
      setAdicionarOS(false)
      setModel(medicao);
    }
  }, [modalEdicao]);

  useEffect(() => {
    setOrdensList(JSON.parse(JSON.stringify(ordens)))
  }, [ordens]);

  useEffect(() => {
    calcularValores(model.Ordens);
  }, [model.PorcentagemRL]);

  const removerOrdem = (ordem) => {
    if (ordem?.id) {
      const idxObj = model.Ordens.findIndex(object => {
        return object.id === ordem.id;
      });
      
      const removidas = model.Ordens.splice(idxObj, 1);
      removidas[0].StatusPrecificacao = Enum_StatusPrecificacao.Precificada
      if (!model.OrdensRemovidas) model.OrdensRemovidas = []
      model.OrdensRemovidas.push(removidas[0]?.id)
      ordensList.push(removidas[0])
      setOrdensList(ordensList)
      setModel({...model, Ordens: model.Ordens, OrdensRemovidas: model.OrdensRemovidas })
      calcularValores(model.Ordens)
    }
  };

  const calcularValores = (ordens) => {
    let totalServico = 0;
    let totalHora = 0;
    let adicional = 0;
    let desconto = 0;
    let totalCobranca = 0;

    ordens.forEach((os) => {
      totalServico += os.PrecificacaoTotalServico || 0;
      totalHora += os.PrecificacaoTotalHora || 0;
      adicional += os.PrecificacaoValorExtra || 0;
      desconto += os.PrecificacaoDesconto || 0;
      totalCobranca += os.PrecificacaoValorTotal || 0;
    });

    const valorLocacao = totalCobranca * (model.PorcentagemRL / 100 || 0);
    const valorServico = totalCobranca - valorLocacao;

    setModel({
      ...model,
      TotalServico: totalServico,
      TotalHora: totalHora,
      Adicional: adicional,
      Desconto: desconto,
      ValorTotal: totalCobranca,
      ValorCte: totalCobranca,
      ValorServico: valorServico,
      ValorRL: valorLocacao,
    });
  };

  return (
    <div>
      <span>
        <Modal
          isOpen={modalEdicao}
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
              <b>
                Medição {model.Codigo} | Revisão {model.Revisao}
              </b>
            </h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="12">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "10px",
                  }}
                >
                  <strong>Os's incluídas na Medição {medicao.Codigo} </strong>
                  {model.Status === Enum_StatusMedicao.EmAberto && (
                    <span style={{ marginRight: "auto" }}>
                      {" "}
                      (Clique no botão para editar os valores)
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="9">
                {medicao?.Ordens?.map((os) => (
                  <Row>
                    <Col md="11">
                      <Card>
                        <CardBody>
                          <Row className="mb-1">
                            {model.Status === Enum_StatusMedicao.EmAberto && <Col md="0.5" className="mt-1">
                              <FiEdit
                                title="Editar"
                                style={{ margin: "5px" }}
                                size={20}
                                onClick={() => handlePrecificar(os)}
                              />
                            </Col>}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "4px 5px 0px 8px",
                              }}
                            >
                              <span>Código</span>
                              <span style={{ marginTop: "8px" }}>
                                {os?.Codigo}/{os?.Numero}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "4px 5px 0px 8px",
                                width:"220px"
                              }}
                            >
                              <span>Cliente</span>
                              <span style={{ marginTop: "8px" }}>
                                {os.Cliente?.RazaoSocial}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "4px 5px 0px 8px",
                              }}
                            >
                              <span>Contato</span>
                              <span style={{ marginTop: "8px" }}>
                                {os.Contato?.Nome}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "4px 5px 0px 8px",
                                width:"220px"
                              }}
                            >
                              <span>Equipamento</span>
                              <span style={{ marginTop: "8px" }}>
                                {os.Equipamento?.Equipamento}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "4px 5px 0px 8px",
                                marginLeft: "auto",
                              }}>
                              <Label className="font-weight-bolder">Valor Total</Label>
                              <NumberFormat
                                className="mb-90 form-control"
                                style={{border:'0 none', fontWeight:700, width:'100px'}}
                                displayType="number"
                                value={os.PrecificacaoValorTotal}
                                id="ValorCte"
                                name="ValorCte"
                                fixedDecimalScale
                                decimalScale={2}
                                placeholder="Valor por CTe"
                                prefix="R$ "
                                decimalSeparator="."
                                onValueChange={(e) => {}}
                                disabled
                              />
                            </div>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    {model.Status === Enum_StatusMedicao.EmAberto && <Col md="0.5">
                      <FiXCircle
                        title="Cancelar"
                        style={{ margin: "30px 0px 0px 0px" }}
                        size={20}
                        onClick={() => {
                          removerOrdem(os)
                        }}
                      />
                    </Col>}
                  </Row>
                  ))}
                {model.Status === Enum_StatusMedicao.EmAberto &&
                ordensList.length > 0 &&
                <CardFooter>
                {!adicionarOS ? 
                  <Row>
                    <Col md="3">
                      <span
                        style={{
                          color: "#2F4B74",
                          fontWeight: "700",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setAdicionarOS(true)
                        }}
                      >
                        <u>+ Adicionar OS</u>
                      </span>
                    </Col>
                  </Row> :
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label className="font-weight-bolder">OS's</Label>
                        <Select
                          placeholder="Selecione..."
                          className="React"
                          classNamePrefix="select"
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 9999,
                            }),
                            control: (provided) => ({
                              ...provided,
                              minHeight: 0,
                              height: "3rem",
                            }),
                          }}
                          name="Ordens"
                          getOptionLabel={(option) => `${option?.Codigo}/${option.Numero} - ${option.Cliente?.RazaoSocial} - ${option.Equipamento?.Equipamento}`}
                          getOptionValue={(option) => option}
                          options={ordensList.filter(x => x.StatusPrecificacao === Enum_StatusPrecificacao.Precificada)}
                          isSearchable
                          onChange={(e) => {
                            model.Ordens.push(e)
                            let index = ordensList.indexOf(e)
                            ordensList.splice(index, 1)

                            if (model.OrdensRemovidas) {
                              index = model.OrdensRemovidas.indexOf(e.id)
                              model.OrdensRemovidas.splice(index, 1)
                            }

                            setOrdensList(ordensList)
                            setAdicionarOS(false)
                            setModel({ ...model, Ordens: model.Ordens, OrdensRemovidas: model.OrdensRemovidas || [] });
                            calcularValores(model.Ordens)
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>}
                </CardFooter>}
                <FormGroup>
                  <Label
                    style={{ fontSize: "12px" }}
                    className="font-weight-bolder">
                    Observação
                  </Label>
                  <Input
                    type="textarea"
                    id="Observacoes"
                    name="Observacoes"
                    placeholder="Observação"
                    value={model.Observacoes}
                    onChange={(e) => setModel({ ...model, [e.target.name]: e.target.value })}
                    disabled={
                      model.Status !== Enum_StatusMedicao.EmAberto
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label className="font-weight-bolder">Solicitante (Nome - Email)</Label>
                  <Input
                    type="text"
                    id="Solicitante"
                    name="Solicitante"
                    placeholder="Solicitante"
                    value={model.Solicitante}
                    onChange={(e) => setModel({ ...model, [e.target.name]: e.target.value })}
                    disabled={
                      model.Status !== Enum_StatusMedicao.EmAberto
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="font-weight-bolder">Vendedor Responsável</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                      control: (provided) => ({
                        ...provided,
                        minHeight: 0,
                        height: "3rem",
                      }),
                    }}
                    name="Vendedor"
                    options={vendedores}
                    getOptionLabel={(option) => option?.username}
                    getOptionValue={(option) => option}
                    isDisabled={
                      model.Status !== Enum_StatusMedicao.EmAberto
                    }
                    isSearchable
                    value={vendedores.filter(
                      (option) => option.id === model.Vendedor?.id
                    )}
                    onChange={(e) => {
                      setModel({ ...model, Vendedor: e });
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="font-weight-bolder">CTe</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                      control: (provided) => ({
                        ...provided,
                        minHeight: 0,
                        height: "3rem",
                      }),
                    }}
                    name="Cte"
                    options={options}
                    isDisabled={
                      model.Status !== Enum_StatusMedicao.EmAberto
                    }
                    isSearchable
                    value={options.filter(
                      (option) => option.value === model.Cte
                    )}
                    onChange={(e) => {
                      setModel({ ...model, Cte: e.value });
                    }}
                  />
                </FormGroup>
                {model.Cte === true ? (
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
                ) : (
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
                      decimalSeparator="."
                      onValueChange={(e) => {
                        setModel({
                          ...model,
                          PorcentagemRL: e.floatValue || 0
                        });
                      }}
                      disabled={
                        model.Status !== Enum_StatusMedicao.EmAberto
                      }
                    />
                  </FormGroup>
                )}
                {!model.Cte && (
                  <>
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
                        decimalSeparator="."
                        onValueChange={(e) => {}}
                        disabled
                      />
                    </FormGroup>
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
                        decimalSeparator="."
                        onValueChange={(e) => {}}
                        disabled
                      />
                    </FormGroup>
                  </>
                )}
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="7">
                        <span>Total por serviço</span>
                      </Col>
                      <Col md="5">
                        <NumberFormat
                          className="mb-90 form-control border-0 outline-0 bg-transparent"
                          displayType="number"
                          value={Number(model.TotalServico)}
                          id="totalPorServico"
                          name="totalPorServico"
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
                      <Col md="7">
                        <span>Total por hora</span>
                      </Col>
                      <Col md="5">
                        <NumberFormat
                          className="mb-90 form-control border-0 outline-0 bg-transparent"
                          displayType="number"
                          value={Number(model.TotalHora)}
                          id="totalPorHr"
                          name="totalPorHr"
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
                      <Col md="7">
                        <span>Adicional extra</span>
                      </Col>
                      <Col md="5">
                        <NumberFormat
                          className="mb-90 form-control border-0 outline-0 bg-transparent"
                          displayType="number"
                          value={model.Adicional}
                          id="adicionalExtra"
                          name="adicionalExtra"
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
                      <Col md="7">
                        <span>Descontos</span>
                      </Col>
                      <Col md="5">
                        <NumberFormat
                          className="mb-90 form-control border-0 outline-0 bg-transparent"
                          displayType="number"
                          value={Number(model.Desconto)}
                          id="descontos"
                          name="descontos"
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
                      <Col md="7">
                        <strong>Valor Total da Cobrança</strong>
                      </Col>
                      <Col md="5">
                        <NumberFormat
                          className="mb-90 form-control border-0 outline-0 bg-transparent"
                          displayType="number"
                          value={Number(model.ValorTotal)}
                          id="descontos"
                          name="descontos"
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
            <ModalFooter>
              {model.Status === Enum_StatusMedicao.EmAberto && (
              <Button.Ripple
                className="mr-1 mb-1"
                onClick={() => {
                  alterarMedicao(model)
                }}
              >
                <FiSave
                  title="Salvar"
                  style={{ margin: "5px" }}
                  size={20}
                />
                  Salvar medição
              </Button.Ripple>
              )}
              {model.Status === Enum_StatusMedicao.EmAberto && (
              <Button.Ripple
                color="primary"
                className="mr-1 mb-1"
                onClick={() => {
                  const data = JSON.parse(JSON.stringify(model))
                  data.Status = Enum_StatusMedicao.Conferencia
                  data.DataConferencia = new Date()
                  alterarMedicao(data)
                }}
              >
                <FiSend
                  title="Conferir"
                  style={{ margin: "5px" }}
                  size={20} 
                />
                  Enviar para conferência
                </Button.Ripple>
              )}

              {(model.Status === Enum_StatusMedicao.Conferencia || model.Status === Enum_StatusMedicao.Validada) && (
              <Button.Ripple
                className="mr-1 mb-1"
                onClick={() => {
                  const data = JSON.parse(JSON.stringify(model))
                  data.Status = Enum_StatusMedicao.EmAberto
                  alterarStatusMedicao(data, true)
                }}
              >
                <FiArrowLeft
                  title="Corrigir"
                  style={{ margin: "5px" }}
                  size={20}
                />
                  Solicitar correção
              </Button.Ripple>
              )}
              {model.Status === Enum_StatusMedicao.Conferencia && (
              <Button.Ripple
                color="primary"
                className="mr-1 mb-1"
                onClick={() => {
                  const data = JSON.parse(JSON.stringify(model))
                  data.DataAprovacaoInterna = new Date()
                  data.Status = Enum_StatusMedicao.Validada
                  alterarStatusMedicao(data)
                }}
              >
                <FiSend
                  title="Conferir"
                  style={{ margin: "5px" }}
                  size={20}
                />
                  Validar medição
                </Button.Ripple>
              )}
            </ModalFooter>
          </ModalBody>
        </Modal>
      </span>
    </div>
  );
};

export default ModalEdicaoMedicao;
