import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Card,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonGroup,
} from "reactstrap";
import Select from "react-select";
import "@styles/base/pages/modal.scss";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { FiMinusCircle } from "react-icons/fi";
import { cidades } from "../../../../../utility/cidades_ibge";
import moment from "moment";

const ModalEmitirNFS = (props) => {
  const {
    modal,
    handleClose,
    gerar,
    empresas
  } = props;

  const [model, setModel] = useState({
    prestador: {},
    tomador: {
      endereco: {}
    },
    servico: {},
    itens: []
  });
  const [aba, setAba] = useState(1);

  useEffect(() => {
    if (modal) {
      setAba(1)
      setModel({
        prestador: {},
        tomador: { endereco: {} },
        servico: {
          iss_retido: true,
          aliquota: 5,
          aliquota_inss: 11,
          codigo_cnae: '812900000',
          item_lista_servico: '0710'
        },
        itens: [{
          discriminacao: 'SERVIÇOS PRESTADOS', 
          quantidade: 1, 
          valor_unitario: 1,
          valor_total: 1, 
          tributavel: true
        }],
        optante_simples_nacional: true,
      })
    }
  }, [modal])

  const isButtonDisabled = (!model?.EmpresaBanco || !model.data_emissao_aux || !model.data_vencimento || !model.empresa_id || !model.tomador?.cnpj || !model.tomador?.razao_social || !model.tomador?.endereco?.logradouro
    || !model.tomador?.endereco?.numero || !model.tomador?.endereco?.bairro || !model.tomador?.endereco?.cep || !model.tomador?.endereco?.uf || !model.tomador?.endereco?.codigo_municipio || !model.servico?.iss_retido || !model.servico?.item_lista_servico || !model.servico?.codigo_cnae
    || !model.servico?.aliquota || !model.itens?.length || !model.tributacao_rps);

  const salvar = () => {
    const time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    model.data_emissao = moment(`${model.data_emissao_aux} ${time}`, 'YYYY-MM-DD HH:mm:ss').format()
    model.servico.discriminacao = `${model.servico.discriminacao_aux}.\nVENCIMENTO: ${moment(model.data_vencimento).format('DD/MM/YYYY')}.\nDADOS PARA DEPÓSITO: Banco: ${model.EmpresaBanco?.Banco} Ag: ${model.EmpresaBanco?.Agencia} C/C: ${model.EmpresaBanco?.Conta}`
    for (var property in model) {
      if (typeof model[property] === 'string') model[property] = model[property]?.trim()
    }
    gerar(model)
  }

  return (
    <div>
      <span>
        <Modal
          isOpen={modal}
          size="xl"
          toggle={() => handleClose()}
          className="modal-dialog-centered"
          backdrop={false}>
          <ModalHeader
            toggle={() => handleClose()}
            style={{ background: "#2F4B7433" }}
            cssModule={{ close: "close button-close" }}>
            <h4 className="mt-1 mb-1">
              <b>
                Emissão de NFSe
              </b>
            </h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <Row>
                  <Col md={12} sm={12}>
                    <ButtonGroup className="mt-2 mb-2">
                      <Button onClick={() => setAba(1)} color='primary' outline={true} active={aba === 1}>Geral</Button>
                      <Button onClick={() => setAba(2)} color='primary' outline={true} active={aba === 2}>Itens</Button>
                    </ButtonGroup>
                  </Col>
                  <Card style={{ width: '100%' }}>
                    {aba === 1 && <Row className='ml-1 mr-1'>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Empresa
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="select"
                            id="empresa"
                            name="empresa"
                            value={model?.empresa_id}
                            onChange={(e) => {
                              const empresa = empresas.find(x => x.id === Number(e.target.value))
                              model.empresa = empresa
                              model.empresa_id = empresa.id
                              model.prestador.cnpj = empresa.CNPJ
                              model.prestador.inscricao_municipal = empresa.InscricaoMunicipal
                              model.prestador.codigo_municipio = empresa.CodigoMunicipio
                              setModel({ ...model })
                            }}
                          >
                            <option value={''}></option>
                            {empresas.map((empresa) => (
                              <option value={empresa.id}>{empresa.Descricao}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            CNPJ Tomador
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="text"
                            id="cnpj_cliente"
                            name="cnpj_cliente"
                            value={model.tomador.cnpj}
                            onChange={(e) => {
                              model.tomador.cnpj = e.target.value
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Razão Social Tomador
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="text"
                            id="nome_cliente"
                            name="nome_cliente"
                            value={model.tomador.razao_social}
                            onChange={(e) => {
                              model.tomador.razao_social = e.target.value
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Logradouro Tomador
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="text"
                            id="logradouro_cliente"
                            name="logradouro_cliente"
                            value={model.tomador.logradouro}
                            onChange={(e) => {
                              model.tomador.logradouro = e.target.value
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Número Tomador
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="text"
                            id="numero_cliente"
                            name="numero_cliente"
                            value={model.tomador?.endereco?.numero || ''}
                            onChange={(e) => {
                              if (!model.tomador.endereco) model.tomador.endereco = {};
                              model.tomador.endereco.numero = e.target.value
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Complemento Tomador
                          </Label>
                          <Input
                            type="text"
                            id="complemento_cliente"
                            name="complemento_cliente"
                            value={model.tomador?.endereco?.complemento || ''}
                            onChange={(e) => {
                              if (!model.tomador.endereco) model.tomador.endereco = {};
                              model.tomador.endereco.complemento = e.target.value
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Bairro Tomador
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="text"
                            id="bairro_cliente"
                            name="bairro_cliente"
                            value={model.tomador?.endereco?.bairro || ''}
                            onChange={(e) => {
                              if (!model.tomador.endereco) model.tomador.endereco = {};
                              model.tomador.endereco.bairro = e.target.value
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            CEP Tomador
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="text"
                            id="cep_cliente"
                            name="cep_cliente"
                            value={model.tomador?.endereco?.cep || ''}
                            onChange={(e) => {
                              if (!model.tomador.endereco) model.tomador.endereco = {};
                              model.tomador.endereco.cep = e.target.value
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            UF Tomador
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="text"
                            id="uf_cliente"
                            name="uf_cliente"
                            value={model.tomador?.endereco?.uf || ''}
                            onChange={(e) => {
                              if (!model.tomador.endereco) model.tomador.endereco = {};
                              model.tomador.endereco.uf = e.target.value?.toUpperCase()
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Município Tomador
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="select"
                            id="municipio_cliente"
                            name="municipio_cliente"
                            value={model.tomador.codigo_municipio}
                            onChange={(e) => {
                              model.tomador.codigo_municipio = e.target.value
                              if (model.tomador.codigo_municipio === model.prestador.codigo_municipio) model.tributacao_rps = 'T'
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          >
                            <option value={''}></option>
                            {cidades.filter(f => f.Uf === model.tomador.uf).map((x) => (
                              <option value={x.Codigo}>{x.Nome}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Telefone Tomador
                          </Label>
                          <Input
                            type="text"
                            id="telefone"
                            name="telefone"
                            value={model.tomador.telefone}
                            onChange={(e) => {
                              model.tomador.telefone = e.target.value
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            E-mail Tomador
                          </Label>
                          <Input
                            type="text"
                            id="email"
                            name="email"
                            value={model.tomador.email}
                            onChange={(e) => {
                              model.tomador.email = e.target.value
                              setModel({ ...model, tomador: model.tomador })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            CNAE
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="text"
                            id="codigo_cnae"
                            name="codigo_cnae"
                            value={model.servico.codigo_cnae}
                            onChange={(e) => {
                              model.servico.codigo_cnae = e.target.value
                              setModel({ ...model, servico: model.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Tributação
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="select"
                            id="tributacao_rps"
                            name="tributacao_rps"
                            value={model.tributacao_rps}
                            disabled={model.tomador.codigo_municipio === model.prestador.codigo_municipio}
                            onChange={(e) => setModel({ ...model, [e.target.name]: e.target.value })}
                          >
                            <option value={''}></option>
                            <option value="C">Isenta de ISS</option>
                            <option value="E">Não Incidência no Município</option>
                            <option value="F">Imune</option>
                            <option value="k">ExigibilidE Susp.Dec.J/Proc.A</option>
                            <option value="N">Não Tributável</option>
                            <option value="T">Tributável</option>
                            <option value="G">Tributável Fixo</option>
                            <option value="H">Tributável S.N.</option>
                            <option value="M">Micro Empreendedor Individual (MEI)</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            PIS(%)
                          </Label>
                          <Input
                            type="number"
                            id="aliquota_pis"
                            name="aliquota_pis"
                            value={model.servico.aliquota_pis}
                            onChange={(e) => {
                              model.servico.aliquota_pis = e.target.value
                              setModel({ ...model, servico: model.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            COFINS(%)
                          </Label>
                          <Input
                            type="number"
                            id="aliquota_cofins"
                            name="aliquota_cofins"
                            value={model.servico.aliquota_cofins}
                            onChange={(e) => {
                              model.servico.aliquota_cofins = e.target.value
                              setModel({ ...model, servico: model.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            ISS Retido
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="select"
                            id="iss_retido"
                            name="iss_retido"
                            value={model.servico.iss_retido}
                            onChange={(e) => {
                              model.servico.iss_retido = e.target.value === 'true'
                              setModel({ ...model, servico: model.servico })
                            }}
                          >
                            <option value={''}></option>
                            <option value={true}>Sim</option>
                            <option value={false}>Não</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            INSS(%)
                          </Label>
                          <Input
                            type="number"
                            id="aliquota_inss"
                            name="aliquota_inss"
                            value={model.servico.aliquota_inss}
                            onChange={(e) => {
                              model.servico.aliquota_inss = e.target.value
                              setModel({ ...model, servico: model.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            IR(%)
                          </Label>
                          <Input
                            type="number"
                            id="aliquota_ir "
                            name="aliquota_ir "
                            value={model.servico.aliquota_ir }
                            onChange={(e) => {
                              model.servico.aliquota_ir  = e.target.value
                              setModel({ ...model, servico: model.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            CSLL(%)
                          </Label>
                          <Input
                            type="number"
                            id="aliquota_csll"
                            name="aliquota_csll"
                            value={model.servico.aliquota_csll}
                            onChange={(e) => {
                              model.servico.aliquota_csll = e.target.value
                              setModel({ ...model, servico: model.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Base Calc. ISS(R$)
                          </Label>
                          <Input
                            type="number"
                            id="base_calculo"
                            name="base_calculo"
                            value={model.servico.base_calculo}
                            onChange={(e) => {
                              model.servico.base_calculo = e.target.value
                              setModel({ ...model, servico: model.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Alíquota(%)
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="number"
                            id="aliquota"
                            name="aliquota"
                            value={model.servico.aliquota}
                            onChange={(e) => {
                              model.servico.aliquota = e.target.value
                              setModel({ ...model, servico: model.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label
                            style={{ fontSize: "12px" }}
                            className="font-weight-bolder" >
                            Discriminação do serviço
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="textarea"
                            id="discriminacao_aux"
                            name="discriminacao_aux"
                            value={model.servico.discriminacao_aux}
                            onChange={(e) => {
                              model.servico.discriminacao_aux = e.target.value
                              setModel({ ...model, servico: model.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>}
                    {aba === 2 && <Card className='ml-1 mr-1'>
                      {model.itens?.map(
                        (x, i) => (
                          <Row md={12}>
                            <Col md={5}>
                              <FormGroup>
                                <Label
                                  style={{ fontSize: "12px" }}
                                  className="font-weight-bolder" >
                                  Discriminação
                                </Label>
                                <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                                  type="text"
                                  id={`discriminacao${i}`}
                                  name="discriminacao"
                                  value={x.discriminacao}
                                  onBlur={(e) => {
                                    model.itens[i].discriminacao = model.itens[i].discriminacao?.trimEnd()
                                    setModel({ ...model, itens: model.itens })
                                  }}
                                  onChange={(e) => {
                                    model.itens[i][e.target.name] = e.target.value
                                    setModel({ ...model, itens: model.itens })
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                              <FormGroup>
                                <Label
                                  style={{ fontSize: "12px" }}
                                  className="font-weight-bolder" >
                                  Quantidade
                                </Label>
                                <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                                  type="number"
                                  id={`quantidade${i}`}
                                  name="quantidade"
                                  value={x.quantidade}
                                  onChange={(e) => {
                                    model.itens[i][e.target.name] = e.target.value
                                    setModel({ ...model, itens: model.itens })
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                              <FormGroup>
                                <Label
                                  style={{ fontSize: "12px" }}
                                  className="font-weight-bolder" >
                                  Valor Unitário
                                </Label>
                                <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                                  type="number"
                                  id={`valor_unitario${i}`}
                                  name="valor_unitario"
                                  value={x.valor_unitario}
                                  onChange={(e) => {
                                    model.itens[i][e.target.name] = e.target.value
                                    model.itens[i].valor_total = (model.itens[i].valor_unitario || 0) * (model.itens[i].quantidade || 0)
                                    setModel({ ...model, itens: model.itens })
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                              <FormGroup>
                                <Label
                                  style={{ fontSize: "12px" }}
                                  className="font-weight-bolder" >
                                  Valor Total
                                </Label>
                                <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                                  type="number"
                                  id={`valor_total${i}`}
                                  name="valor_total"
                                  value={x.valor_total}
                                  onChange={(e) => {
                                    model.itens[i][e.target.name] = e.target.value
                                    setModel({ ...model, itens: model.itens })
                                  }}
                                />
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                              <FormGroup>
                                <Label
                                  style={{ fontSize: "12px" }}
                                  className="font-weight-bolder" >
                                  Tributável
                                </Label>
                                <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                                  type="select"
                                  id={`tributavel${i}`}
                                  name="tributavel"
                                  value={x.tributavel}
                                  onChange={(e) => {
                                    model.itens[i][e.target.name] = e.target.value === 'true'
                                    setModel({ ...model, itens: model.itens })
                                  }}
                                >
                                  <option value={''}></option>
                                  <option value={true}>Sim</option>
                                  <option value={false}>Não</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col md="1">
                              <FiMinusCircle
                                title="Excluir"
                                style={{ marginTop: "20px" }}
                                size={20}
                                onClick={() => {
                                  model.itens.splice(i, 1);
                                  setModel({ ...model });
                                }}
                              />
                            </Col>
                          </Row>
                        )
                      )}
                      <Row md={12}>
                        <Col md="3">
                          <span
                            style={{ color: "#2F4B74", cursor: 'pointer' }}
                            onClick={() => {
                              if (!model.itens) model.itens = []
                              model.itens?.push({});
                              setModel({ ...model });
                            }}
                          >
                            <u>+Adicionar item</u>
                          </span>
                        </Col>
                      </Row>
                    </Card>}
                  </Card>
                </Row>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label className="font-weight-bolder">
                    Data de emissão
                  </Label>
                  <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                    type="date"
                    value={model.data_emissao_aux}
                    id="data_emissao_aux"
                    name="data_emissao_aux"
                    onChange={(e) => setModel({ ...model, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="font-weight-bolder">
                    Data de vencimento
                  </Label>
                  <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                    type="date"
                    value={model.data_vencimento}
                    id="data_vencimento"
                    name="data_vencimento"
                    onChange={(e) => setModel({ ...model, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <Label className="font-weight-bolder">Banco</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      control: provided => ({ ...provided, borderColor: !isButtonDisabled ? 'hsl(0,0%,80%)' : '#cc5050' })
                    }}
                    name="Banco"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={model?.empresa?.EmpresaBanco}
                    isSearchable
                    getOptionLabel={(option) => `Banco: ${option?.Banco} Ag: ${option.Agencia} C/C: ${option.Conta} `}
                    getOptionValue={(option) => option}
                    value={
                      model?.empresa?.EmpresaBanco?.filter((option) => option?.id === model?.EmpresaBanco?.id)
                    }
                    onChange={(object) => {
                      setModel({ ...model, EmpresaBanco: object })
                    }}
                  />
                </FormGroup>
                <ModalFooter>
                  <Button.Ripple
                    className="mr-1 mb-1"
                    color="primary"
                    // disabled={isButtonDisabled}
                    onClick={() => {
                      salvar()
                    }}>
                    Gerar Fatura
                  </Button.Ripple>
                </ModalFooter>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </span>
    </div>
  );
};

export default ModalEmitirNFS;
