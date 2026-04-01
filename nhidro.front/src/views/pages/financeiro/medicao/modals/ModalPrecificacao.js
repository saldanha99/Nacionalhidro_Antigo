import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Row,
  Col,
  Label,
  Input,
  Card,
  CardBody,
  ModalFooter,
  Button,
} from "reactstrap";
import Select from "react-select";
import "@styles/base/pages/modal.scss";
import NumberFormat from "react-number-format";
import { FiMinusCircle } from "react-icons/fi";
import { Enum_TipoPrecificacao, Lista_TiposHoraAdicional } from "../../../../../utility/enum/Enums";
import { TimeStringToFloat } from "../../../../../utility/date/date";

const ModalPrecificacao = (props) => {
  const { open, handleClose, ordem, precificar } = props;

  const [data, setData] = useState({});
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (open) {
      ordem.Servicos?.forEach(element => {
        element.TipoPrecificacao = element.TipoPrecificacao ?? Enum_TipoPrecificacao.Servico
      });
      setData(ordem);
    }
  }, [open, ordem]);

  const calcularValorExtra = (servico, horaextra) => {
    const qtd = TimeStringToFloat(horaextra?.Horas)
    return (((horaextra?.PorcentagemValor / 100) * servico.ValorHora) + servico.ValorHora) * qtd
  }

  const handlePrecificar = (data) => {
    handleValidFields(data)
  };

  const handleValidFields = (obj)=> {
    obj.Servicos?.map(item => {
      if(item.TipoPrecificacao === Enum_TipoPrecificacao.Servico) {
        if (!item.ValorUnitario || !item.Quantidade){
          setIsValid(!isValid);
        } else {
          precificar(data)
        }
      } else {
          if(!item.ValorHora){
            setIsValid(!isValid);
          } else {
            precificar(data)
          }
      }
    })
  }

  const handleChangeCalculoPrecificacao = (dataobj)=> {
    dataobj.PrecificacaoTotalServico = 0
    dataobj.PrecificacaoTotalHora = 0
    dataobj.PrecificacaoValorTotal = 0

    dataobj?.Servicos?.map((servico) => {
      if (servico.TipoPrecificacao === Enum_TipoPrecificacao.Servico) {
        servico.ValorTotal = (servico.ValorUnitario * servico.Quantidade)
        dataobj.PrecificacaoTotalServico += servico.ValorTotal
      } else {
        const hrTotal = data.HoraTotal.split(":");
        const valorHr = Number(hrTotal[0]),
        valorMin = Number(hrTotal[1]) / 60;
        
        servico.Quantidade = Number(valorHr + valorMin)

        servico.ValorExtraHora = 0;
        servico?.ServicosHorasAdicionais?.map((item) => {
          const copy = JSON.parse(JSON.stringify(item))
          item.ValorTotal = calcularValorExtra(servico, copy)
          servico.ValorExtraHora += item?.ValorTotal;
        });

        servico.ValorTotal = (servico.ValorHora * servico.Quantidade) + servico.ValorExtraHora
        dataobj.PrecificacaoTotalHora += servico.ValorTotal
      }
      dataobj.PrecificacaoValorTotal += servico.ValorTotal
    });
    dataobj.PrecificacaoValorTotal = dataobj.PrecificacaoValorTotal + dataobj.PrecificacaoValorExtra - dataobj.PrecificacaoDesconto
    setData({ ...data, dataobj });
  }

  const hasNullValue = data?.Servicos?.some(x => x.TipoPrecificacao === Enum_TipoPrecificacao.Servico? x.ValorUnitario === null || x.Quantidade === null : x.ValorHora === null);

  return (
    <div>
      <span>
        <Modal
          isOpen={open}
          size="xl"
          toggle={() => {
            handleClose();
          }}
          className="modal-dialog-centered"
          backdrop={false}
        >
          <ModalHeader
            toggle={() => {
              handleClose();
            }}
            style={{ background: "#2F4B7433" }}
            cssModule={{ close: "close button-close" }}
          >
            <h4 className="mt-1 mb-1">
              <b>Precificar OS's</b>
            </h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Nº da proposta</Label>
                  <Input
                    type="text"
                    id="nProposta"
                    name="nProposta"
                    placeholder="--"
                    disabled
                    value={data.Codigo}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Código Os</Label>
                  <Input
                    type="text"
                    id="codigoOs"
                    name="codigoOs"
                    disabled
                    placeholder="--"
                    value={`${data.Codigo} / ${data.Numero}`}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Empresa</Label>
                  <Input
                    type="text"
                    id="empresa"
                    name="empresa"
                    disabled
                    placeholder="--"
                    value={data?.Empresa?.Descricao}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Cliente</Label>
                  <Input
                    type="text"
                    id="cliente"
                    name="cliente"
                    disabled
                    placeholder="--"
                    value={data?.Cliente?.RazaoSocial}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Contato</Label>
                  <Input
                    type="text"
                    id="contato"
                    name="contato"
                    disabled
                    placeholder="--"
                    value={data?.Contato?.Nome}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Acompanhante</Label>
                  <Input
                    type="text"
                    id="acompanhante"
                    name="acompanhante"
                    disabled
                    placeholder="--"
                    value={data.Acompanhante != null ? data.Acompanhante : "--"}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Equipamento</Label>
                  <Input
                    type="text"
                    id="equipamento"
                    name="equipamento"
                    disabled
                    placeholder="--"
                    value={data?.Equipamento?.Equipamento}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Data</Label>
                  <Input
                    type="text"
                    id="data"
                    name="data"
                    disabled
                    placeholder="--"
                    value={new Date(data.DataInicial).toLocaleDateString(
                      "pt-BR",
                      { timeZone: "UTC" }
                    )}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Hora</Label>
                  <Input
                    type="time"
                    id="hora"
                    name="hora"
                    disabled
                    placeholder="--"
                    value={data.HoraInicial}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Criado por</Label>
                  <Input
                    type="text"
                    id="criadoPor"
                    name="Area"
                    disabled
                    placeholder="--"
                    value={data?.CriadoPor?.username}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Data Criação</Label>
                  <Input
                    type="text"
                    id="dataCriacao"
                    name="dataCriacao"
                    disabled
                    placeholder="--"
                    value={new Date(data.DataCriacao).toLocaleDateString(
                      "pt-BR",
                      { timeZone: "UTC" }
                    )}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Data Baixa</Label>
                  <Input
                    type="text"
                    id="dataBaixa"
                    name="dataBaixa"
                    disabled
                    placeholder="--"
                    value={new Date(data.DataBaixa).toLocaleDateString(
                      "pt-BR",
                      { timeZone: "UTC" }
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
            {data?.Servicos?.map((x, i) => (
              <Col>
                <Row>
                  <Col>
                    <Card>
                      <CardBody>
                        <Row>
                          <Col md="2">
                            <span>Tipo de Precificação</span>
                            <Row>
                              <Col md="1">
                                <input
                                  type="radio"
                                  id="servico"
                                  value="servico"
                                  className="mr-1"
                                  inline
                                  checked={x.TipoPrecificacao === Enum_TipoPrecificacao.Servico}
                                  onChange={(e) => {
                                    data.Servicos[i].TipoPrecificacao = e.target.value ? Enum_TipoPrecificacao.Servico : Enum_TipoPrecificacao.Hora
                                    setData({...data, Servicos: data.Servicos})
                                  }}
                                />
                              </Col>
                              <span style={{ marginLeft: "8px" }}>Serviço</span>
                              <Row>
                                <Col md="1">
                                  <input
                                    style={{ marginLeft: "8px" }}
                                    type="radio"
                                    id="hora"
                                    value="hora"
                                    className="mr-1"
                                    inline
                                    checked={x.TipoPrecificacao === Enum_TipoPrecificacao.Hora}
                                    onChange={(e) => {
                                      data.Servicos[i].TipoPrecificacao = e.target.value ? Enum_TipoPrecificacao.Hora : Enum_TipoPrecificacao.Servico
                                      setData({...data, Servicos: data.Servicos})
                                    }}
                                  />
                                </Col>
                                <span style={{ marginLeft: "15px" }}>Hora</span>
                              </Row>
                            </Row>
                          </Col>
                          {x.TipoPrecificacao === Enum_TipoPrecificacao. Servico ? (
                            <Row>
                              <Col md="3">
                                <FormGroup>
                                  <Label className="font-weight-bolder">
                                    Descrição do Serviço
                                  </Label>
                                  <Input
                                    type="text"
                                    id="DescricaoServico"
                                    name="DescricaoServico"
                                    placeholder="--"
                                    disabled
                                    value={x.Discriminacao}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="2">
                                <FormGroup>
                                  <Label className="font-weight-bolder">
                                    Valor Unitário
                                  </Label>
                                  <NumberFormat
                                    style={!isValid ? { borderColor: "#ea5455" } : {}}
                                    className="mb-90 form-control"
                                    displayType="number"
                                    id="valorUnitario"
                                    name="valorUnitario"
                                    fixedDecimalScale
                                    decimalScale={2}
                                    placeholder="R$"
                                    prefix="R$ "
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    value={x.ValorUnitario}
                                    onValueChange={(e) => {
                                      data.Servicos[i].ValorUnitario = e.floatValue || 0
                                      setData({ ...data, Servicos: data.Servicos });
                                      handleChangeCalculoPrecificacao(data)
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="2">
                                <FormGroup>
                                  <Label className="font-weight-bolder">
                                    Quantidade
                                  </Label>
                                  <Input
                                    style={!isValid ? { borderColor: "#ea5455" } : {}}
                                    type="text"
                                    id="qtd"
                                    name="qtd"
                                    placeholder="1"
                                    value={x.Quantidade}
                                    onChange={(e) => {
                                      if(x.ValorUnitario != null &&  x.Quantidade == 0){
                                        x.Quantidade = 1
                                      }
                                      data.Servicos[i].Quantidade = e.target.value;
                                      setData({ ...data, Servicos: data.Servicos });
                                      handleChangeCalculoPrecificacao(data)
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="2">
                                <FormGroup>
                                  <Label className="font-weight-bolder">
                                    Valor Total
                                  </Label>
                                  <NumberFormat
                                    className="mb-90 form-control"
                                    displayType="number"
                                    value={x.ValorTotal}
                                    id="resultadoTotal"
                                    name="resultadoTotal"
                                    fixedDecimalScale
                                    decimalScale={2}
                                    disabled
                                    placeholder="R$"
                                    prefix="R$ "
                                    decimalSeparator=","
                                    thousandSeparator="."
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          ) : (
                            <Col>
                              <Row>
                                <Col>
                                  <Row>
                                    <Col md="4">
                                      <FormGroup>
                                        <Label className="font-weight-bolder">
                                          Descrição do Serviço
                                        </Label>
                                        <Input
                                          type="text"
                                          id="DescricaoServico"
                                          name="DescricaoServico"
                                          placeholder="--"
                                          disabled
                                          value={x.Discriminacao}
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="2">
                                      <FormGroup>
                                        <Label className="font-weight-bolder">
                                          Tolerância
                                        </Label>
                                        <Input
                                          type="time"
                                          id="horaTolerancia"
                                          name="horaTolerancia"
                                          disabled
                                          placeholder="--"
                                          value={data.HoraTolerancia ?? data.HoraTotal}
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="2">
                                      <FormGroup>
                                        <Label className="font-weight-bolder">
                                          Hora Entrada
                                        </Label>
                                        <Input
                                          type="time"
                                          id="horaEntrada"
                                          name="horaEntrada"
                                          placeholder="--"
                                          value={data.HoraEntrada}
                                          disabled
                                          onChange={(e) => {
                                            x.HoraEntrada = e.target.value;
                                            setData({ ...data });
                                          }}
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="2">
                                      <FormGroup>
                                        <Label className="font-weight-bolder">
                                          Hora Saída
                                        </Label>
                                        <Input
                                          type="time"
                                          id="horaSaida"
                                          name="horaSaida"
                                          placeholder="--"
                                          value={data.HoraSaida}
                                          disabled
                                          onChange={(e) => {
                                            x.HoraSaida = e.target.value;
                                            setData({ ...data });
                                          }}
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="1"></Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row>
                                <Col md="2">
                                  <FormGroup>
                                    <Label className="font-weight-bolder">
                                      Almoço
                                    </Label>
                                    <Input
                                      type="time"
                                      id="horaAlmoco"
                                      name="horaAlmoco"
                                      disabled
                                      placeholder="--"
                                      value={data.HoraAlmoco}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="2">
                                  <FormGroup>
                                    <Label className="font-weight-bolder">
                                      Qtd. de horas
                                    </Label>
                                    <Input
                                      type="time"
                                      id="qtdHoras"
                                      name="qtdHoras"
                                      placeholder="Quantidade..."
                                      disabled
                                      value={data.HoraTotal}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="2">
                                  <FormGroup>
                                    <Label className="font-weight-bolder">
                                      Qtd. de horas adicionais
                                    </Label>
                                    <Input
                                      type="time"
                                      id="qtdHorasAdicionais"
                                      name="qtdHorasAdicionais"
                                      placeholder="00:00:00.000"
                                      disabled
                                      value={
                                        data.HoraAdicional != "00:00:00.000"
                                          ? data.HoraAdicional
                                          : "--"
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="2">
                                  <FormGroup>
                                    <Label className="font-weight-bolder">
                                      Valor da Hora
                                    </Label>
                                    <NumberFormat
                                      style={
                                        !isValid
                                          ? { borderColor: "#ea5455" }
                                          : {}
                                      }
                                      className="mb-90 form-control"
                                      displayType="number"
                                      value={x.ValorHora}
                                      id="valorHora"
                                      name="valorHora"
                                      fixedDecimalScale
                                      decimalScale={2}
                                      placeholder="R$"
                                      prefix="R$ "
                                      decimalSeparator=","
                                      thousandSeparator="."
                                      onValueChange={(e) => {
                                        data.Servicos[i].ValorHora = e.floatValue || 0;
                                        setData({...data, Servicos: data.Servicos})
                                        handleChangeCalculoPrecificacao(data)
                                      }}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="2">
                                  <FormGroup>
                                    <Label className="font-weight-bolder">
                                      Obs. Cobrança
                                    </Label>
                                    <Input
                                      type="text"
                                      id="obsHora"
                                      name="obshora"
                                      placeholder="Obs. Cobrança"
                                      value={x.ObservacaoCobranca}
                                      onChange={(e) => {
                                        data.Servicos[i].ObservacaoCobranca = e.target.value
                                        setData({...data, Servicos: data.Servicos})
                                      }}
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md="1"></Col>
                              </Row>
                              <Row>
                                <Col md="0.5"></Col>
                                <Col>
                                  <hr></hr>
                                </Col>
                                <Col md="1.2">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      marginLeft: "auto",
                                    }}
                                  >
                                    <Col md="8">
                                      <FormGroup>
                                        <Label className="font-weight-bolder">
                                          Valor Total
                                        </Label>
                                        <NumberFormat
                                          className="mb-90 form-control"
                                          displayType="number"
                                          value={Number(x.ValorTotal)}
                                          id="resultadoTotal"
                                          name="resultadoTotal"
                                          fixedDecimalScale
                                          decimalScale={2}
                                          disabled
                                          placeholder="R$"
                                          prefix="R$ "
                                          decimalSeparator=","
                                          thousandSeparator="."
                                        />
                                      </FormGroup>
                                    </Col>
                                  </div>
                                </Col>
                              </Row>

                              {x.ServicosHorasAdicionais?.map(
                                (h, y) => (
                                  <Row>
                                    <Col md="0.5"></Col>
                                    <Col md="3">
                                      <FormGroup>
                                        <Label className="font-weight-bolder">
                                          Tipo de hora adicional
                                        </Label>
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
                                          name="tipoHrAdd"
                                          noOptionsMessage={() =>
                                            "Sem registro!"
                                          }
                                          options={Lista_TiposHoraAdicional}
                                          isSearchable
                                          value={Lista_TiposHoraAdicional?.filter(
                                            (option) =>
                                              option?.value ===
                                              h.TipoHoraAdicional
                                          )}
                                          onChange={(e) => {
                                            h.TipoHoraAdicional = e.value;
                                            setData({ ...data });
                                          }}
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="2">
                                      <FormGroup>
                                        <Label className="font-weight-bolder">
                                          Qtd. de horas adicionais
                                        </Label>
                                        <Input
                                          type="time"
                                          id={`Horas${y}`}
                                          name="Horas"
                                          placeholder="Quantidade"
                                          value={h?.Horas}
                                          onChange={(e) => {
                                            h.Horas = e.target.value;
                                            handleChangeCalculoPrecificacao(data);
                                          }}
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="2">
                                      <FormGroup>
                                        <Label className="font-weight-bolder">
                                          Porcentagem do valor
                                        </Label>
                                        <NumberFormat
                                          className="mb-90 form-control"
                                          displayType="number"
                                          value={h?.PorcentagemValor}
                                          id={`PorcentagemValor${y}`}
                                          name="PorcentagemValor"
                                          fixedDecimalScale
                                          decimalScale={2}
                                          placeholder="Porcentagem do valor"
                                          suffix="%"
                                          decimalSeparator=","
                                          thousandSeparator="."
                                          onValueChange={(e) => {
                                            h.PorcentagemValor = e.floatValue || 0;
                                            handleChangeCalculoPrecificacao(data);
                                          }}
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col md="2">
                                      <FormGroup>
                                        <Label className="font-weight-bolder">
                                          Valor Total (Horas Adicionais)
                                        </Label>
                                        <NumberFormat
                                          className="mb-90 form-control"
                                          displayType="number"
                                          value={Number(h.ValorTotal)}
                                          id="valorTotalHR"
                                          name="valorTotalHR"
                                          fixedDecimalScale
                                          decimalScale={2}
                                          disabled
                                          placeholder="R$"
                                          prefix="R$ "
                                          decimalSeparator=","
                                          thousandSeparator="."
                                        />
                                      </FormGroup>
                                    </Col>
                                    {data.Servicos[i].ServicosHorasAdicionais
                                      .length > 0 && (
                                      <Col md="1">
                                        <FiMinusCircle
                                          title="Excluir"
                                          style={{ marginTop: "20px" }}
                                          size={20}
                                          onClick={() => {
                                            data.Servicos[i].ValorTotal -= h.ValorTotal
                                            data.Servicos[i].ServicosHorasAdicionais.splice(y);
                                            setData({ ...data });
                                          }}
                                        />
                                      </Col>
                                    )}
                                  </Row>
                                )
                              )}
                                <Row>
                                  <Col md="0.5"></Col>
                                  <Col md="3">
                                    <span
                                      style={{ color: "#2F4B74", cursor: 'pointer' }}
                                      onClick={() => {
                                        if (!data.Servicos[i].ServicosHorasAdicionais) data.Servicos[i].ServicosHorasAdicionais = []
                                        data.Servicos[i].ServicosHorasAdicionais?.push({});
                                        setData({ ...data });
                                      }}
                                    >
                                      <u>+Adicionar hora adicional</u>
                                    </span>
                                  </Col>
                                </Row>
                            </Col>
                          )}
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
            ))}

            <Row>
              <Col md="3">
                <Col md="12">
                  <FormGroup>
                    <Label className="font-weight-bolder">
                      Adicionar desconto
                    </Label>
                    <NumberFormat
                      className="mb-90 form-control"
                      displayType="number"
                      value={data.PrecificacaoDesconto}
                      id="addDesconto"
                      name="addDesconto"
                      fixedDecimalScale
                      decimalScale={2}
                      placeholder="R$"
                      prefix="R$ "
                      decimalSeparator=","
                      thousandSeparator="."
                      onValueChange={(e) => {
                        data.PrecificacaoDesconto = e.floatValue || 0
                        handleChangeCalculoPrecificacao(data)
                      }}
                    />
                  </FormGroup>
                </Col>
              </Col>
              {!data.Cte && (
                <Col md="3">
                  <Col md="12">
                    <FormGroup>
                      <Label className="font-weight-bolder">
                        Adicionar valor extra
                      </Label>
                      <NumberFormat
                        className="mb-90 form-control"
                        displayType="number"
                        value={data.PrecificacaoValorExtra}
                        id="addExtra"
                        name="addExtra"
                        fixedDecimalScale
                        decimalScale={2}
                        placeholder="R$"
                        prefix="R$ "
                        decimalSeparator=","
                        thousandSeparator="."
                        onValueChange={(e) => {
                          data.PrecificacaoValorExtra = e.floatValue || 0
                          handleChangeCalculoPrecificacao(data)
                        }}
                      />
                      {!isValid && (
                        <div className="invalid-feedback">
                          Por favor, insira um valor.
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Col>
              )}

              <Col md="6">
                <Col md="12">
                  <FormGroup>
                    <Label className="font-weight-bolder">Observação</Label>
                    <Input
                      type="text"
                      id="obs"
                      name="obs"
                      placeholder="Observação..."
                      value={data.PrecificacaoObservacao}
                      onChange={(e) => {
                        data.PrecificacaoObservacao = e.target.value;
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md="8">
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
                            value={data.PrecificacaoTotalServico}
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
                        <Col md="8">
                          <span>Total por hora</span>
                        </Col>
                        <Col md="4">
                          <NumberFormat
                            className="mb-90 form-control border-0 outline-0 bg-transparent"
                            displayType="number"
                            value={data.PrecificacaoTotalHora}
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
                        <Col md="8">
                          <span>Adicional extra</span>
                        </Col>
                        <Col md="4">
                          <NumberFormat
                            className="mb-90 form-control border-0 outline-0 bg-transparent"
                            displayType="number"
                            value={data.PrecificacaoValorExtra}
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
                        <Col md="8">
                          <span>Descontos</span>
                        </Col>
                        <Col md="4">
                          <NumberFormat
                            className="mb-90 form-control border-0 outline-0 bg-transparent"
                            displayType="number"
                            value={`R$ ${data.PrecificacaoDesconto}`}
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
                        <Col md="8">
                          <strong>Valor total do serviço</strong>
                        </Col>
                        <Col md="4">
                          <NumberFormat
                            className="mb-90 form-control border-0 outline-0 bg-transparent"
                            displayType="number"
                            value={data.PrecificacaoValorTotal}
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
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              className="mr-1 mb-1"
              onClick={(e) => {
                handleClose();
              }}>
              Cancelar
            </Button.Ripple>
              <Button.Ripple
                color="primary"
                className="mr-1 mb-1"
                disabled={hasNullValue}
                onClick={() => handlePrecificar(data)}>
                Precificar
              </Button.Ripple>
          </ModalFooter>
        </Modal>
      </span>
    </div>
  );
};

export default ModalPrecificacao;
