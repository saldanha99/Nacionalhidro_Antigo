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
  ButtonGroup,
} from "reactstrap";
import Select from "react-select";
import "@styles/base/pages/modal.scss";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import NumberFormat from "react-number-format";
import {
  Enum_RegimeTributario,
  Enum_StatusFaturamento,
} from "../../../../../utility/enum/Enums";
import moment from "moment";
import { FiMinusCircle } from "react-icons/fi";
import { cidades } from "../../../../../utility/cidades_ibge";

const ModalEdicaoFaturamento = (props) => {
  const {
    modal,
    faturamento,
    handleClose,
    save, gerar
  } = props;

  const [model, setModel] = useState({
    EmpresaBanco: {},
    DataAprovacao: new Date(),
    DataCancelamento: new Date(),
    DataCriacao: new Date(),
    DataEmissao: new Date(),
    DataEnvio: new Date(),
    Descricao: "",
    Medicao: {},
    MotivoCancelamento: 0,
    Nota: 0,
    Observacoes: "",
    Status: Enum_StatusFaturamento.EmAberto,
    TipoFatura: "",
    UrlArquivoNota: 0,
    UrlImagemAprovacao: 0,
    ValorRateado: 0,
    ValorTotal: 0
  });

  const [dadosFatura, setDadosFatura] = useState({});
  const [aba, setAba] = useState(1);
  const [abaDocumento, setAbaDocumento] = useState(1);

  useEffect(() => {
    if (modal) {
      faturamento.DataEmissao = faturamento.DataEmissao ? moment(faturamento.DataEmissao).utc().format('YYYY-MM-DD') : moment().utc().format('YYYY-MM-DD')
      faturamento.ValorLiquido = faturamento.ValorLiquido || faturamento.ValorRateado
      if (!faturamento.DataVencimento) {
        let vencimento = new Date()
        vencimento.setDate(vencimento.getDate() + faturamento.Cliente?.DiasVencimento || 0)
        faturamento.DataVencimento = moment(vencimento).format('YYYY-MM-DD')
      }
      if (faturamento.TipoFatura === 'CTE') setDadosFatura(faturamento.DadosFaturamento ?? {
        nfes: [], 
        outros_documentos: [], 
        quantidades: [{}], 
        valor_receber: faturamento.ValorRateado, 
        valor_total: faturamento.ValorRateado,
        modal: "01",
        tipo_servico: 0,
        retirar_mercadoria: "1",
        cfop: "5353",
        indicador_inscricao_estadual_tomador: "9",
        icms_situacao_tributaria: "90_simples_nacional",
        icms_indicador_simples_nacional: "1",
        icms_base_calculo: faturamento.ValorRateado
      })
      else if (faturamento.TipoFatura === 'NF') {
        let dados = faturamento.DadosFaturamento ?? {
          servico: {
            iss_retido: 1,
            aliquota_pis: faturamento.Empresa.RegimeTributario === Enum_RegimeTributario.Simples ? null : 0.65,
            aliquota_cofins: faturamento.Empresa.RegimeTributario === Enum_RegimeTributario.Simples ? null : 3,
            aliquota_ir: faturamento.Empresa.RegimeTributario === Enum_RegimeTributario.Simples ? null : 1,
            aliquota_csll: faturamento.Empresa.RegimeTributario === Enum_RegimeTributario.Simples ? null : 1,
            base_calculo: faturamento.ValorRateado
          }, 
          itens: [
            {
              discriminacao: 'SERVIÇOS PRESTADOS', 
              quantidade: 1, 
              valor_unitario: faturamento.ValorRateado,
              valor_total: faturamento.ValorRateado, 
              tributavel: true
            }
          ],
          natureza_operacao: faturamento.Cliente.CodigoMunicipio === faturamento.Empresa.CodigoMunicipio ? '1' : '2',
          optante_simples_nacional: faturamento.Empresa.RegimeTributario === Enum_RegimeTributario.Simples ? true : false
        }

        dados.prestador = {
          cnpj: faturamento.Empresa.CNPJ,
          inscricao_municipal: faturamento.Empresa.InscricaoMunicipal,
          codigo_municipio: faturamento.Empresa.CodigoMunicipio
        }
        dados.tomador = {
          cnpj: faturamento.Cliente.Cnpj,
          razao_social: faturamento.Cliente.RazaoSocial,
          telefone: faturamento.Cliente.Telefone?.trimEnd(),
          email: faturamento.Cliente.Email?.trimEnd(),
          inscricao_municipal: faturamento.Cliente.InscricaoMunicipal ?? '000000',
          endereco: {
            logradouro: faturamento.Cliente.Endereco?.trimEnd(),
            numero: faturamento.Cliente.Numero?.trimEnd(),
            complemento: faturamento.Cliente.Complemento?.trimEnd(),
            bairro: faturamento.Cliente.Bairro?.trimEnd(),
            cep: faturamento.Cliente.Cep?.trimEnd(),
            uf: faturamento.Cliente.EstadoSigla?.trimEnd(),
            codigo_municipio: faturamento.Cliente.CodigoMunicipio?.trimEnd()
          }
        }
        dados.servico.codigo_municipio = faturamento.Cliente.CodigoMunicipio
        dados.servico.codigo_cnae = faturamento.Empresa.Cnae
        dados.servico.item_lista_servico = '0710'
        dados.tributacao_rps = faturamento.Cliente.CodigoMunicipio === faturamento.Empresa.CodigoMunicipio ? 'T' : 'E'
        setDadosFatura(dados)
      }
      setAba(1)
      setModel(faturamento)
    }
  }, [modal, faturamento])

  const isButtonDisabled = model.TipoFatura === 'CTE' ? (!model?.EmpresaBanco || !model.DataEmissao || !model.DataVencimento || !dadosFatura.cfop || !dadosFatura.natureza_operacao || !dadosFatura.uf_envio || !dadosFatura.municipio_envio || !dadosFatura.uf_inicio || !dadosFatura.municipio_inicio
    || !dadosFatura.uf_fim || !dadosFatura.municipio_fim || !dadosFatura.indicador_inscricao_estadual_tomador || !dadosFatura.tomador || !dadosFatura.valor_total || !dadosFatura.valor_receber || !dadosFatura.cnpj_cliente
    || !dadosFatura.inscricao_estadual_cliente || !dadosFatura.nome_cliente || !dadosFatura.logradouro_cliente || !dadosFatura.numero_cliente || !dadosFatura.bairro_cliente || !dadosFatura.cep_cliente || !dadosFatura.uf_cliente || !dadosFatura.municipio_cliente || !dadosFatura.icms_situacao_tributaria)
    : model.TipoFatura === 'NF' ? (!model?.EmpresaBanco || !model.DataEmissao || !model.DataVencimento || !dadosFatura.servico.iss_retido || !dadosFatura.servico.aliquota || !dadosFatura.itens.length)
    : (!model?.EmpresaBanco || !model.DataEmissao || !model.DataVencimento);

  const salvarCTE = (cidades, salvar) => {
    dadosFatura.data_emissao = model.DataEmissao
    dadosFatura.tipo_documento = "0"
    dadosFatura.regime_tributario_emitente = "1"
    dadosFatura.modal_rodoviario = {
      rntrc: model.Empresa.Rntrc
    }

    if (dadosFatura.indicador_inscricao_estadual_tomador === '2') {
      model.Cliente.Ie = 'ISENTO' 
    }

    //emitente
    dadosFatura.cnpj_emitente = model.Empresa.CNPJ.replaceAll('.', '').replaceAll('/', '').replaceAll('-', '')
    dadosFatura.inscricao_estadual_emitente = model.Empresa.InscricaoEstadual.replaceAll('.', '')
    dadosFatura.nome_emitente = model.Empresa.Descricao
    dadosFatura.nome_fantasia_emitente = model.Empresa.Descricao
    dadosFatura.logradouro_emitente = model.Empresa.Logradouro
    dadosFatura.numero_emitente = model.Empresa.Numero
    dadosFatura.complemento_emitente = ''
    dadosFatura.bairro_emitente = model.Empresa.Bairro
    dadosFatura.codigo_municipio_emitente = cidades.find(x => x.Nome.toUpperCase() === model.Empresa.Municipio?.toUpperCase() && x.Uf === model.Empresa.UF)?.Codigo?.toString()
    dadosFatura.municipio_emitente = model.Empresa.Municipio
    dadosFatura.uf_emitente = model.Empresa.UF

    //remetente
    dadosFatura.cnpj_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.Cnpj : dadosFatura.cnpj_cliente
    dadosFatura.inscricao_estadual_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.Ie : dadosFatura.inscricao_estadual_cliente
    dadosFatura.nome_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.RazaoSocial : dadosFatura.nome_cliente
    dadosFatura.nome_fantasia_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.NomeFantasia : dadosFatura.nome_fantasia_cliente
    dadosFatura.telefone_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.Telefone : dadosFatura.telefone_cliente
    dadosFatura.logradouro_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.Endereco : dadosFatura.logradouro_cliente
    dadosFatura.numero_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.Numero : dadosFatura.numero_cliente
    dadosFatura.complemento_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.Complemento : dadosFatura.complemento_cliente
    dadosFatura.bairro_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.Bairro : dadosFatura.bairro_cliente
    dadosFatura.municipio_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.Cidade : dadosFatura.municipio_cliente
    dadosFatura.cep_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.Cep : dadosFatura.cep_cliente
    dadosFatura.uf_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? model.Cliente.EstadoSigla : dadosFatura.uf_cliente
    dadosFatura.codigo_municipio_remetente = !dadosFatura.remetente ? null : dadosFatura.remetente === 'Tomador' ? cidades.find(x => x.Nome.toUpperCase() === model.Cliente.Cidade?.toUpperCase() && x.Uf === model.Cliente.EstadoSigla)?.Codigo?.toString() : cidades.find(x => x.Nome === dadosFatura.municipio_cliente && x.Uf === dadosFatura.uf_cliente)?.Codigo?.toString()

    //expedidor
    dadosFatura.cnpj_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.Cnpj : dadosFatura.cnpj_cliente
    dadosFatura.inscricao_estadual_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.Ie : dadosFatura.inscricao_estadual_cliente
    dadosFatura.nome_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.RazaoSocial : dadosFatura.nome_cliente
    dadosFatura.nome_fantasia_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.NomeFantasia : dadosFatura.nome_fantasia_cliente
    dadosFatura.telefone_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.Telefone : dadosFatura.telefone_cliente
    dadosFatura.logradouro_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.Endereco : dadosFatura.logradouro_cliente
    dadosFatura.numero_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.Numero : dadosFatura.numero_cliente
    dadosFatura.complemento_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.Complemento : dadosFatura.complemento_cliente
    dadosFatura.bairro_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.Bairro : dadosFatura.bairro_cliente
    dadosFatura.municipio_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.Cidade : dadosFatura.municipio_cliente
    dadosFatura.cep_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.Cep : dadosFatura.cep_cliente
    dadosFatura.uf_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? model.Cliente.EstadoSigla : dadosFatura.uf_cliente
    dadosFatura.codigo_municipio_expedidor = !dadosFatura.expedidor ? null : dadosFatura.expedidor === 'Tomador' ? cidades.find(x => x.Nome.toUpperCase() === model.Cliente.Cidade?.toUpperCase() && x.Uf === model.Cliente.EstadoSigla)?.Codigo?.toString() : cidades.find(x => x.Nome === dadosFatura.municipio_cliente && x.Uf === dadosFatura.uf_cliente)?.Codigo?.toString()

    //recebedor
    dadosFatura.cnpj_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.Cnpj : dadosFatura.cnpj_cliente
    dadosFatura.inscricao_estadual_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.Ie : dadosFatura.inscricao_estadual_cliente
    dadosFatura.nome_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.RazaoSocial : dadosFatura.nome_cliente
    dadosFatura.nome_fantasia_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.NomeFantasia : dadosFatura.nome_fantasia_cliente
    dadosFatura.telefone_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.Telefone : dadosFatura.telefone_cliente
    dadosFatura.logradouro_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.Endereco : dadosFatura.logradouro_cliente
    dadosFatura.numero_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.Numero : dadosFatura.numero_cliente
    dadosFatura.complemento_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.Complemento : dadosFatura.complemento_cliente
    dadosFatura.bairro_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.Bairro : dadosFatura.bairro_cliente
    dadosFatura.municipio_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.Cidade : dadosFatura.municipio_cliente
    dadosFatura.cep_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.Cep : dadosFatura.cep_cliente
    dadosFatura.uf_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? model.Cliente.EstadoSigla : dadosFatura.uf_cliente
    dadosFatura.codigo_municipio_recebedor = !dadosFatura.recebedor ? null : dadosFatura.recebedor === 'Tomador' ? cidades.find(x => x.Nome.toUpperCase() === model.Cliente.Cidade?.toUpperCase() && x.Uf === model.Cliente.EstadoSigla)?.Codigo?.toString() : cidades.find(x => x.Nome === dadosFatura.municipio_cliente && x.Uf === dadosFatura.uf_cliente)?.Codigo?.toString()

    //destinatario
    dadosFatura.cnpj_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.Cnpj : dadosFatura.cnpj_cliente
    dadosFatura.inscricao_estadual_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.Ie : dadosFatura.inscricao_estadual_cliente
    dadosFatura.nome_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.RazaoSocial : dadosFatura.nome_cliente
    dadosFatura.nome_fantasia_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.NomeFantasia : dadosFatura.nome_fantasia_cliente
    dadosFatura.telefone_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.Telefone : dadosFatura.telefone_cliente
    dadosFatura.logradouro_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.Endereco : dadosFatura.logradouro_cliente
    dadosFatura.numero_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.Numero : dadosFatura.numero_cliente
    dadosFatura.complemento_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.Complemento : dadosFatura.complemento_cliente
    dadosFatura.bairro_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.Bairro : dadosFatura.bairro_cliente
    dadosFatura.municipio_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.Cidade : dadosFatura.municipio_cliente
    dadosFatura.cep_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.Cep : dadosFatura.cep_cliente
    dadosFatura.uf_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? model.Cliente.EstadoSigla : dadosFatura.uf_cliente
    dadosFatura.codigo_municipio_destinatario = !dadosFatura.destinatario ? null : dadosFatura.destinatario === 'Tomador' ? cidades.find(x => x.Nome.toUpperCase() === model.Cliente.Cidade?.toUpperCase() && x.Uf === model.Cliente.EstadoSigla)?.Codigo?.toString() : cidades.find(x => x.Nome === dadosFatura.municipio_cliente && x.Uf === dadosFatura.uf_cliente)?.Codigo?.toString()

    for (var property in dadosFatura) {
      if (typeof dadosFatura[property] === 'string') dadosFatura[property] = dadosFatura[property]?.trimEnd()
    }

    model.DadosFaturamento = dadosFatura
    model.ValorLiquido = model.ValorRateado - (model.ValorRateado * (dadosFatura.icms_aliquota || 0) / 100)
    salvar ? save(model) : gerar(model)
  }

  const salvarNF = (salvar) => {
    const time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    dadosFatura.data_emissao = moment(`${model.DataEmissao} ${time}`, 'YYYY-MM-DD HH:mm:ss').format()
    dadosFatura.servico.discriminacao = `${dadosFatura.servico.discriminacao_aux}.\nVENCIMENTO: ${moment(model.DataVencimento).format('DD/MM/YYYY')}.\nDADOS PARA DEPÓSITO: Banco: ${model.EmpresaBanco?.Banco} Ag: ${model.EmpresaBanco?.Agencia} C/C: ${model.EmpresaBanco?.Conta}`
    dadosFatura.servico.valor_inss = model.ValorRateado * (dadosFatura.servico?.aliquota_inss || 0) / 100
    dadosFatura.servico.valor_pis = model.ValorRateado * (dadosFatura.servico?.aliquota_pis || 0) / 100
    dadosFatura.servico.valor_cofins = model.ValorRateado * (dadosFatura.servico?.aliquota_cofins || 0) / 100
    dadosFatura.servico.valor_ir = model.ValorRateado * (dadosFatura.servico?.aliquota_ir || 0) / 100
    dadosFatura.servico.valor_csll = model.ValorRateado * (dadosFatura.servico?.aliquota_csll || 0) / 100
    // dadosFatura.servico.valor_iss = model.ValorRateado * (dadosFatura.servico?.aliquota || 0) / 100

    for (var property in dadosFatura) {
      if (typeof dadosFatura[property] === 'string') dadosFatura[property] = dadosFatura[property]?.trimEnd()
    }

    model.DadosFaturamento = dadosFatura
    model.ValorIss = model.ValorRateado * (dadosFatura.servico?.aliquota || 0) / 100
    // model.ValorIss = dadosFatura.servico.valor_iss
    model.ValorInss = dadosFatura.servico.valor_inss
    model.ValorIr = dadosFatura.servico.valor_ir
    model.ValorPis = dadosFatura.servico.valor_pis
    model.ValorCofins = dadosFatura.servico.valor_cofins
    model.ValorCsll = dadosFatura.servico.valor_csll
    model.ValorLiquido = model.ValorRateado - (model.ValorIss || 0) - (model.ValorInss || 0) - (model.ValorIr || 0) - (model.ValorPis || 0) - (model.ValorCofins || 0) - (model.ValorCsll || 0)
    salvar ? save(model) : gerar(model)
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
                Emissão de Fatura: Medição {model?.Medicao?.Codigo} | Revisão{" "}
                {model?.Medicao?.Revisao}
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
                  }}>
                  <strong>
                    Os's incluídas na Medição {model.Medicao?.Codigo}{" "}
                  </strong>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col md="12">
                    <Card>
                      <CardBody>
                        {model?.Medicao?.Ordens?.map((os) => (<Row >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 10px 0px 20px",
                            }}>
                            <span>Código</span>
                            <span style={{ marginTop: "8px" }}>
                              {os?.Codigo}/
                              {os?.Numero}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 0px 0px 20px",
                            }}>
                            <span>Cliente</span>
                            <span style={{ marginTop: "8px" }}>
                              {model?.Cliente?.RazaoSocial.length > 30 ? `${model?.Cliente?.RazaoSocial.slice(0, 30)}...` : model?.Cliente?.RazaoSocial}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 10px 0px 20px",
                            }}>
                            <span>Contato</span>
                            <span style={{ marginTop: "8px" }}>
                              {os?.Contato?.Nome}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 10px 0px 20px",
                            }}>
                            <span>Equipamento</span>
                            <span style={{ marginTop: "8px" }}>
                              {os?.Equipamento?.Equipamento}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "4px 10px 0px 8px",
                              marginLeft: "auto",
                            }}>
                            <Label className="font-weight-bolder">Valor Total</Label>
                            <NumberFormat
                              className="mb-90 form-control"
                              style={{ border: '0 none', fontWeight: 700, width: '100px' }}
                              displayType="number"
                              value={os?.PrecificacaoValorTotal}
                              id="ValorCte"
                              name="ValorCte"
                              fixedDecimalScale
                              decimalScale={2}
                              placeholder="Valor total"
                              prefix="R$ "
                              decimalSeparator=","
                              thousandSeparator="."
                              onValueChange={(e) => { }}
                              disabled
                            />
                          </div>
                        </Row>))}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                {model.TipoFatura === 'CTE' ? <>
                  <Row>
                    <Col md={12} sm={12}>
                      <ButtonGroup className="mt-2 mb-2">
                        <Button onClick={() => setAba(1)} color='primary' outline={true} active={aba === 1}>Geral</Button>
                        <Button onClick={() => setAba(2)} color='primary' outline={true} active={aba === 2}>Cliente Tomador</Button>
                        <Button onClick={() => setAba(3)} color='primary' outline={true} active={aba === 3}>Tributação</Button>
                        <Button onClick={() => setAba(4)} color='primary' outline={true} active={aba === 4}>Carga</Button>
                        <Button onClick={() => setAba(5)} color='primary' outline={true} active={aba === 5}>Documentos</Button>
                      </ButtonGroup>
                    </Col>
                    <Card style={{width: '100%'}}>
                      {aba === 1 && <Row className='ml-1 mr-1'>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              CFOP
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="number"
                              id="cfop"
                              name="cfop"
                              placeholder="CFOP"
                              value={dadosFatura.cfop}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Natureza Operação
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="natureza_operacao"
                              name="natureza_operacao"
                              value={dadosFatura.natureza_operacao}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              UF Envio
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="uf_envio"
                              name="uf_envio"
                              value={dadosFatura.uf_envio}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Município Envio
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="municipio_envio"
                              name="municipio_envio"
                              value={dadosFatura.municipio_envio}
                              onChange={(e) => {
                                const cidade = cidades.find(x => x.Nome === e.target.value && x.Uf === dadosFatura.uf_envio)
                                dadosFatura.municipio_envio = cidade.Nome
                                dadosFatura.codigo_municipio_envio = cidade.Codigo?.toString()
                                setDadosFatura({ ...dadosFatura })
                              }}
                            >
                              <option value={''}></option>
                              {cidades.filter(f => f.Uf === dadosFatura.uf_envio).map((x) => (
                              <option value={x.Nome}>{x.Nome}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              CTe globalizado
                            </Label>
                            <Input
                              type="select"
                              id="indicador_globalizado"
                              name="indicador_globalizado"
                              value={dadosFatura.indicador_globalizado}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                              >
                                <option value=""></option>
                                <option value="1">Sim</option>
                                <option value="0">Não</option>
                              </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              UF Início
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="uf_inicio"
                              name="uf_inicio"
                              value={dadosFatura.uf_inicio}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Município Início
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="municipio_inicio"
                              name="municipio_inicio"
                              value={dadosFatura.municipio_inicio}
                              onChange={(e) => {
                                const cidade = cidades.find(x => x.Nome === e.target.value && x.Uf === dadosFatura.uf_inicio)
                                dadosFatura.municipio_inicio = cidade.Nome
                                dadosFatura.codigo_municipio_inicio = cidade.Codigo?.toString()
                                setDadosFatura({ ...dadosFatura })
                              }}
                            >
                              <option value={''}></option>
                              {cidades.filter(f => f.Uf === dadosFatura.uf_inicio).map((x) => (
                              <option value={x.Nome}>{x.Nome}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              UF Fim
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="uf_fim"
                              name="uf_fim"
                              value={dadosFatura.uf_fim}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Município Fim
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="municipio_fim"
                              name="municipio_fim"
                              value={dadosFatura.municipio_fim}
                              onChange={(e) => {
                                const cidade = cidades.find(x => x.Nome === e.target.value && x.Uf === dadosFatura.uf_fim)
                                dadosFatura.municipio_fim = cidade.Nome
                                dadosFatura.codigo_municipio_fim = cidade.Codigo?.toString()
                                setDadosFatura({ ...dadosFatura })
                              }}
                            >
                              <option value={''}></option>
                              {cidades.filter(f => f.Uf === dadosFatura.uf_fim).map((x) => (
                              <option value={x.Nome}>{x.Nome}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        {/* <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Modal
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="modal"
                              name="modal"
                              value={dadosFatura.modal}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value={''}></option>
                              <option value="01">Rodoviário</option>
                              <option value="02">Aéreo</option>
                              <option value="03">Aquaviário</option>
                              <option value="04">Ferroviário</option>
                              <option value="05">Dutoviário</option>
                              <option value="06">Multimodal</option>
                            </Input>
                          </FormGroup>
                        </Col> */}
                        {/* <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Tipo Serviço
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="tipo_servico"
                              name="tipo_servico"
                              value={dadosFatura.tipo_servico}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value={''}></option>
                              <option value="0">Normal</option>
                              <option value="1">Subcontratação</option>
                              <option value="2">Redespacho</option>
                              <option value="3">Redespacho Intermediário</option>
                              <option value="4">Serviço Vinculado a Multimodal</option>
                            </Input>
                          </FormGroup>
                        </Col> */}
                        {/* <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Retirar Mercadoria
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="retirar_mercadoria"
                              name="retirar_mercadoria"
                              value={dadosFatura.retirar_mercadoria}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value=""></option>
                              <option value="0">Sim</option>
                              <option value="1">Não</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Detalhes Retirar
                            </Label>
                            <Input
                              type="text"
                              id="detalhes_retirar"
                              name="detalhes_retirar"
                              value={dadosFatura.detalhes_retirar}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col> */}
                        <Col md={6}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Indicador do papel do tomador na prestação do serviço
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="indicador_inscricao_estadual_tomador"
                              name="indicador_inscricao_estadual_tomador"
                              value={dadosFatura.indicador_inscricao_estadual_tomador}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value={''}></option>
                              <option value={1}>Contribuinte ICMS</option>
                              <option value={2}>Contribuinte isento de inscrição</option>
                              <option value={9}>Não Contribuinte</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Remetente
                            </Label>
                            <Input
                              type="select"
                              id="remetente"
                              name="remetente"
                              value={dadosFatura.remetente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value={''}></option>
                              <option>Tomador</option>
                              <option>Cliente do Tomador</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Destinatário
                            </Label>
                            <Input
                              type="select"
                              id="destinatario"
                              name="destinatario"
                              value={dadosFatura.destinatario}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value={''}></option>
                              <option>Tomador</option>
                              <option>Cliente do Tomador</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Expedidor
                            </Label>
                            <Input
                              type="select"
                              id="expedidor"
                              name="expedidor"
                              value={dadosFatura.expedidor}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value={''}></option>
                              <option>Tomador</option>
                              <option>Cliente do Tomador</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Recebedor
                            </Label>
                            <Input
                              type="select"
                              id="recebedor"
                              name="recebedor"
                              value={dadosFatura.recebedor}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value={''}></option>
                              <option>Tomador</option>
                              <option>Cliente do Tomador</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Tomador de Serviço
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="tomador"
                              name="tomador"
                              value={dadosFatura.tomador}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value={''}></option>
                              <option value={0}>Remetente</option>
                              <option value={1}>Expedidor</option>
                              <option value={2}>Recebedor</option>
                              <option value={3}>Destinatário</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Valor Total
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="number"
                              id="valor_total"
                              name="valor_total"
                              value={dadosFatura.valor_total}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Valor Receber
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="number"
                              id="valor_receber"
                              name="valor_receber"
                              value={dadosFatura.valor_receber}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Observações
                            </Label>
                            <Input
                              type="textarea"
                              id="observacao"
                              name="observacao"
                              value={dadosFatura.observacao}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                      </Row>}
                      {aba === 2 && <Row className='ml-1 mr-1'>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              CNPJ
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="cnpj_cliente"
                              name="cnpj_cliente"
                              value={dadosFatura.cnpj_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Inscrição Estadual
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="inscricao_estadual_cliente"
                              name="inscricao_estadual_cliente"
                              value={dadosFatura.inscricao_estadual_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              IE Subst. Tributário
                            </Label>
                            <Input
                              type="text"
                              id="inscricao_estadual_st_cliente"
                              name="inscricao_estadual_st_cliente"
                              value={dadosFatura.inscricao_estadual_st_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Razão Social
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="nome_cliente"
                              name="nome_cliente"
                              value={dadosFatura.nome_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Nome Fantasia
                            </Label>
                            <Input
                              type="text"
                              id="nome_fantasia_cliente"
                              name="nome_fantasia_cliente"
                              value={dadosFatura.nome_fantasia_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Logradouro
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="logradouro_cliente"
                              name="logradouro_cliente"
                              value={dadosFatura.logradouro_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Número
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="numero_cliente"
                              name="numero_cliente"
                              value={dadosFatura.numero_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Complemento
                            </Label>
                            <Input
                              type="text"
                              id="complemento_cliente"
                              name="complemento_cliente"
                              value={dadosFatura.complemento_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Bairro
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="bairro_cliente"
                              name="bairro_cliente"
                              value={dadosFatura.bairro_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              CEP
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="cep_cliente"
                              name="cep_cliente"
                              value={dadosFatura.cep_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              UF
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="text"
                              id="uf_cliente"
                              name="uf_cliente"
                              value={dadosFatura.uf_cliente}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Município
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="municipio_cliente"
                              name="municipio_cliente"
                              value={dadosFatura.municipio_cliente}
                              onChange={(e) => {
                                const cidade = cidades.find(x => x.Nome === e.target.value && x.Uf === dadosFatura.uf_cliente)
                                dadosFatura.municipio_cliente = cidade.Nome
                                dadosFatura.codigo_municipio_cliente = cidade.Codigo?.toString()
                                setDadosFatura({ ...dadosFatura })
                              }}
                            >
                              <option value={''}></option>
                              {cidades.filter(f => f.Uf === dadosFatura.uf_cliente).map((x) => (
                              <option value={x.Nome}>{x.Nome}</option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>}
                      {aba === 3 && <Row className='ml-1 mr-1'>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              ICMS Sit. Tributária
                            </Label>
                            <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                              type="select"
                              id="icms_situacao_tributaria"
                              name="icms_situacao_tributaria"
                              value={dadosFatura.icms_situacao_tributaria}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            >
                              <option value={''}></option>
                              <option value={'00'}>Tributada integralmente</option>
                              <option value={'20'}>Tributada com redução de base de cálculo</option>
                              <option value={'30'}>Isenta ou não tributada e com cobrança do ICMS por substituição tributária</option>
                              <option value={'40'}>Isenta</option>
                              <option value={'41'}>Não tributada</option>
                              <option value={'51'}>Diferimento</option>
                              <option value={'60'}>Cobrado anteriormente por substituição tributária</option>
                              <option value={'70'}>Tributada com redução de base de cálculo e com cobrança do ICMS por substituição tributária</option>
                              <option value={'90'}>Outros (Regime Normal)</option>
                              <option value={'90_outra_uf'}>Outros (UF diferente do emitente)</option>
                              <option value={'90_simples_nacional'}>Outros (Regime Simples Nacional)</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              ICMS Red. Base de Cálculo(%)
                            </Label>
                            <Input
                              type="number"
                              id="icms_reducao_base_calculo"
                              name="icms_reducao_base_calculo"
                              value={dadosFatura.icms_reducao_base_calculo}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              ICMS Base de Cálculo
                            </Label>
                            <Input
                              type="number"
                              id="icms_base_calculo"
                              name="icms_base_calculo"
                              value={dadosFatura.icms_base_calculo}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              ICMS Alíquota(%)
                            </Label>
                            <Input
                              type="number"
                              id="icms_aliquota"
                              name="icms_aliquota"
                              value={dadosFatura.icms_aliquota}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              ICMS Valor
                            </Label>
                            <Input
                              type="number"
                              id="icms_valor"
                              name="icms_valor"
                              value={dadosFatura.icms_valor}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              ICMS Créd. Outorgado
                            </Label>
                            <Input
                              type="number"
                              id="icms_valor_credito_presumido"
                              name="icms_valor_credito_presumido"
                              value={dadosFatura.icms_valor_credito_presumido}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Alíquota interna da UF de término
                            </Label>
                            <Input
                              type="number"
                              id="icms_aliquota_interna_uf_fim"
                              name="icms_aliquota_interna_uf_fim"
                              value={dadosFatura.icms_aliquota_interna_uf_fim}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                      </Row>}
                      {aba === 4 && <Row className='ml-1 mr-1'>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Valor Total da Carga
                            </Label>
                            <Input
                              type="number"
                              id="valor_total_carga"
                              name="valor_total_carga"
                              value={dadosFatura.valor_total_carga}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Produto predominante
                            </Label>
                            <Input
                              type="text"
                              id="produto_predominante"
                              name="produto_predominante"
                              value={dadosFatura.produto_predominante}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              Outras características carga
                            </Label>
                            <Input
                              type="text"
                              id="outras_caracteristicas_carga"
                              name="outras_caracteristicas_carga"
                              value={dadosFatura.outras_caracteristicas_carga}
                              onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value })}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              (Quantidade) Unidade Medida
                            </Label>
                            <Input
                              type="select"
                              id="codigo_unidade_medida"
                              name="codigo_unidade_medida"
                              value={dadosFatura.quantidades[0]?.outras_caracteristicas_carga}
                              onChange={(e) => {
                                dadosFatura.quantidades[0][e.target.name] = e.target.value
                                setDadosFatura({ ...dadosFatura, quantidades: dadosFatura.quantidades })
                              }}
                            >
                              <option value={''}></option>
                              <option value='00'>M3</option>
                              <option value='01'>KG</option>
                              <option value='02'>TON</option>
                              <option value='03'>UNIDADE</option>
                              <option value='04'>LITROS</option>
                              <option value='05'>MMBTU</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              (Quantidade) Tipo Medida
                            </Label>
                            <Input
                              type="text"
                              id="tipo_medida"
                              name="tipo_medida"
                              value={dadosFatura.quantidades[0]?.tipo_medida}
                              onChange={(e) => {
                                dadosFatura.quantidades[0][e.target.name] = e.target.value
                                setDadosFatura({ ...dadosFatura, quantidades: dadosFatura.quantidades })
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <Label
                              style={{ fontSize: "12px" }}
                              className="font-weight-bolder" >
                              (Quantidade)
                            </Label>
                            <Input
                              type="number"
                              id="quantidade"
                              name="quantidade"
                              value={dadosFatura.quantidades[0]?.quantidade}
                              onChange={(e) => {
                                dadosFatura.quantidades[0][e.target.name] = e.target.value
                                setDadosFatura({ ...dadosFatura, quantidades: dadosFatura.quantidades })
                              }}
                            />
                          </FormGroup>
                        </Col>

                        {/* documentos */}
                      </Row>}
                      {aba === 5 && <Card className='ml-1 mr-1'>
                        <Row>
                          <Col md={12} sm={12}>
                            <ButtonGroup className="mt-2 mb-2">
                              <Button onClick={() => setAbaDocumento(1)} color='primary' outline={true} active={abaDocumento === 1}>NF-e</Button>
                              <Button onClick={() => setAbaDocumento(2)} color='primary' outline={true} active={abaDocumento === 2}>Outros</Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                        {abaDocumento === 1 && <>
                        {dadosFatura.nfes?.map(
                          (x, i) => (
                            <Row md={12}>
                              <Col md={8}>
                                <FormGroup>
                                  <Label
                                    style={{ fontSize: "12px" }}
                                    className="font-weight-bolder" >
                                    Chave NF-e
                                  </Label>
                                  <Input
                                    type="text"
                                    id={`chave_nfe_${i}`}
                                    name="chave_nfe"
                                    value={x.chave_nfe}
                                    onBlur={(e) => {
                                      dadosFatura.nfes[i].discriminacao = dadosFatura.nfes[i].chave_nfe?.trimEnd()
                                      setDadosFatura({ ...dadosFatura, nfes: dadosFatura.nfes })
                                    }}
                                    onChange={(e) => {
                                      dadosFatura.nfes[i][e.target.name] = e.target.value
                                      setDadosFatura({ ...dadosFatura, nfes: dadosFatura.nfes })
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="1">
                                <FiMinusCircle
                                  title="Excluir"
                                  style={{ marginTop: "20px" }}
                                  size={20}
                                  onClick={() => {
                                    dadosFatura.nfes.splice(i, 1);
                                    setDadosFatura({ ...dadosFatura, nfes: dadosFatura.nfes });
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
                                if (!dadosFatura.nfes) dadosFatura.nfes = []
                                dadosFatura.nfes?.push({});
                                setDadosFatura({ ...dadosFatura, nfes: dadosFatura.nfes });
                              }}
                            >
                              <u>+Adicionar documento</u>
                            </span>
                          </Col>
                        </Row>
                        </>}
                        {abaDocumento === 2 && <>
                        {dadosFatura.outros_documentos?.map(
                          (x, i) => (
                            <Row md={12}>
                              <Col md={3}>
                                <FormGroup>
                                  <Label
                                    style={{ fontSize: "12px" }}
                                    className="font-weight-bolder" >
                                    Tipo
                                  </Label>
                                  <Input
                                    type="select"
                                    id={`tipo_documento_${i}`}
                                    name="tipo_documento"
                                    value={x.tipo_documento}
                                    onChange={(e) => {
                                      dadosFatura.outros_documentos[i][e.target.name] = e.target.value
                                      setDadosFatura({ ...dadosFatura, outros_documentos: dadosFatura.outros_documentos })
                                    }}
                                  >
                                    <option value={''}></option>
                                    <option value='00'>Declaração</option>
                                    <option value='10'>Dutoviário</option>
                                    <option value='69'>CF-e SAT</option>
                                    <option value='65'>NFC-e</option>
                                    <option value='99'>Outros</option>
                                  </Input>
                                </FormGroup>
                              </Col>
                              {x.tipo_documento === '99' && <Col md={5}>
                                <FormGroup>
                                  <Label
                                    style={{ fontSize: "12px" }}
                                    className="font-weight-bolder" >
                                    Descrição
                                  </Label>
                                  <Input
                                    type="text"
                                    id={`descricao_documento_${i}`}
                                    name="descricao_documento"
                                    value={x.descricao_documento}
                                    onChange={(e) => {
                                      dadosFatura.outros_documentos[i][e.target.name] = e.target.value
                                      setDadosFatura({ ...dadosFatura, outros_documentos: dadosFatura.outros_documentos })
                                    }}
                                    onBlur={(e) => {
                                      dadosFatura.outros_documentos[i][e.target.name] = dadosFatura.outros_documentos[i][e.target.name]?.trimEnd()
                                      setDadosFatura({ ...dadosFatura, outros_documentos: dadosFatura.outros_documentos })
                                    }}
                                  />
                                </FormGroup>
                              </Col>}
                              <Col md={3}>
                                <FormGroup>
                                  <Label
                                    style={{ fontSize: "12px" }}
                                    className="font-weight-bolder" >
                                    Número
                                  </Label>
                                  <Input
                                    type="text"
                                    id={`numero_${i}`}
                                    name="numero"
                                    value={x.numero}
                                    onChange={(e) => {
                                      dadosFatura.outros_documentos[i][e.target.name] = e.target.value
                                      setDadosFatura({ ...dadosFatura, outros_documentos: dadosFatura.outros_documentos })
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="1">
                                <FiMinusCircle
                                  title="Excluir"
                                  style={{ marginTop: "20px" }}
                                  size={20}
                                  onClick={() => {
                                    dadosFatura.outros_documentos.splice(i, 1);
                                    setDadosFatura({ ...dadosFatura });
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
                                if (!dadosFatura.outros_documentos) dadosFatura.outros_documentos = []
                                dadosFatura.outros_documentos?.push({});
                                setDadosFatura({ ...dadosFatura });
                              }}
                            >
                              <u>+Adicionar documento</u>
                            </span>
                          </Col>
                        </Row>
                        </>}
                      </Card>}
                    </Card>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label
                          style={{ fontSize: "12px" }}
                          className="font-weight-bolder" >
                          Observação Faturamento
                        </Label>
                        <Input
                          type="textarea"
                          id="Observacoes"
                          name="Observacoes"
                          placeholder="Observação"
                          disabled
                          rows={5}
                          value={model.Observacoes}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </> : model.TipoFatura === 'NF' ? <>
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
                            Optante Simples Nacional
                          </Label>
                          <Input style={isButtonDisabled ? { borderColor: '#cc5050' } : {}}
                            type="select"
                            id="optante_simples_nacional"
                            name="optante_simples_nacional"
                            value={dadosFatura.optante_simples_nacional}
                            onChange={(e) => setDadosFatura({ ...dadosFatura, [e.target.name]: e.target.value === 'true' })}
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
                            PIS(%)
                          </Label>
                          <Input
                            type="number"
                            id="aliquota_pis"
                            name="aliquota_pis"
                            value={dadosFatura.servico.aliquota_pis}
                            onChange={(e) => {
                              dadosFatura.servico.aliquota_pis = e.target.value
                              setDadosFatura({ ...dadosFatura, servico: dadosFatura.servico })
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
                            value={dadosFatura.servico.aliquota_cofins}
                            onChange={(e) => {
                              dadosFatura.servico.aliquota_cofins = e.target.value
                              setDadosFatura({ ...dadosFatura, servico: dadosFatura.servico })
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
                          <Input
                            type="select"
                            id="iss_retido"
                            name="iss_retido"
                            value={dadosFatura.servico.iss_retido}
                            onChange={(e) => {
                              dadosFatura.servico.iss_retido = e.target.value === 'true'
                              setDadosFatura({ ...dadosFatura, servico: dadosFatura.servico })
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
                            value={dadosFatura.servico.aliquota_inss}
                            onChange={(e) => {
                              dadosFatura.servico.aliquota_inss = e.target.value
                              setDadosFatura({ ...dadosFatura, servico: dadosFatura.servico })
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
                            value={dadosFatura.servico.aliquota_ir }
                            onChange={(e) => {
                              dadosFatura.servico.aliquota_ir  = e.target.value
                              setDadosFatura({ ...dadosFatura, servico: dadosFatura.servico })
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
                            value={dadosFatura.servico.aliquota_csll}
                            onChange={(e) => {
                              dadosFatura.servico.aliquota_csll = e.target.value
                              setDadosFatura({ ...dadosFatura, servico: dadosFatura.servico })
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
                            value={dadosFatura.servico.base_calculo}
                            onChange={(e) => {
                              dadosFatura.servico.base_calculo = e.target.value
                              setDadosFatura({ ...dadosFatura, servico: dadosFatura.servico })
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
                            value={dadosFatura.servico.aliquota}
                            onChange={(e) => {
                              dadosFatura.servico.aliquota = e.target.value
                              setDadosFatura({ ...dadosFatura, servico: dadosFatura.servico })
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
                            value={dadosFatura.servico.discriminacao_aux}
                            onChange={(e) => {
                              dadosFatura.servico.discriminacao_aux = e.target.value
                              setDadosFatura({ ...dadosFatura, servico: dadosFatura.servico })
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>}
                    {aba === 2 && <Card className='ml-1 mr-1'>
                      {dadosFatura.itens?.map(
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
                                    dadosFatura.itens[i].discriminacao = dadosFatura.itens[i].discriminacao?.trimEnd()
                                    setDadosFatura({ ...dadosFatura, itens: dadosFatura.itens })
                                  }}
                                  onChange={(e) => {
                                    dadosFatura.itens[i][e.target.name] = e.target.value
                                    setDadosFatura({ ...dadosFatura, itens: dadosFatura.itens })
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
                                    dadosFatura.itens[i][e.target.name] = e.target.value
                                    setDadosFatura({ ...dadosFatura, itens: dadosFatura.itens })
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
                                    dadosFatura.itens[i][e.target.name] = e.target.value
                                    dadosFatura.itens[i].valor_total = (dadosFatura.itens[i].valor_unitario || 0) * (dadosFatura.itens[i].quantidade || 0)
                                    setDadosFatura({ ...dadosFatura, itens: dadosFatura.itens })
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
                                    dadosFatura.itens[i][e.target.name] = e.target.value
                                    setDadosFatura({ ...dadosFatura, itens: dadosFatura.itens })
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
                                    dadosFatura.itens[i][e.target.name] = e.target.value === 'true'
                                    setDadosFatura({ ...dadosFatura, itens: dadosFatura.itens })
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
                                  dadosFatura.itens.splice(i, 1);
                                  setDadosFatura({ ...dadosFatura });
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
                              if (!dadosFatura.itens) dadosFatura.itens = []
                              dadosFatura.itens?.push({});
                              setDadosFatura({ ...dadosFatura });
                            }}
                          >
                            <u>+Adicionar item</u>
                          </span>
                        </Col>
                      </Row>
                    </Card>}
                  </Card>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label
                        style={{ fontSize: "12px" }}
                        className="font-weight-bolder" >
                        Observação Faturamento
                      </Label>
                      <Input
                        type="textarea"
                        id="Observacoes"
                        name="Observacoes"
                        placeholder="Observação"
                        disabled
                        rows={5}
                        value={model.Observacoes}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                </> : <>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label
                          style={{ fontSize: "12px" }}
                          className="font-weight-bolder" >
                          Descrição
                        </Label>
                        <Input
                          type="textarea"
                          id="Descrição"
                          name="Descrição"
                          placeholder="Descrição"
                          rows={5}
                          value={model.Descricao}
                          onChange={(e) => setModel({ ...model, Descricao: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label
                          style={{ fontSize: "12px" }}
                          className="font-weight-bolder" >
                          Dados Complementares
                        </Label>
                        <Input
                          type="textarea"
                          id="DadosComplementares"
                          name="DadosComplementares"
                          placeholder="DadosComplementares"
                          rows={5}
                          value={model.DadosComplementares}
                          onChange={(e) => setModel({ ...model, DadosComplementares: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label
                          style={{ fontSize: "12px" }}
                          className="font-weight-bolder" >
                          Observação
                        </Label>
                        <Input
                          type="textarea"
                          id="Observacoes"
                          name="Observacoes"
                          placeholder="Observação"
                          disabled
                          rows={5}
                          value={model.Observacoes}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label
                          style={{ fontSize: "12px" }}
                          className="font-weight-bolder" >
                          Nº Pedido
                        </Label>
                        <Input
                          type="text"
                          id="NumeroPedido"
                          name="NumeroPedido"
                          placeholder="Nº Pedido"
                          value={model.NumeroPedido}
                          onChange={(e) => setModel({ ...model, NumeroPedido: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </>}
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label className="font-weight-bolder">
                    Data de emissão
                  </Label>
                  <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                    type="date"
                    value={model.DataEmissao}
                    id="DataEmissao"
                    name="DataEmissao"
                    onChange={(e) => setModel({ ...model, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="font-weight-bolder">
                    Data de vencimento
                  </Label>
                  <Input style={isButtonDisabled ? {borderColor: '#cc5050'} : {}}
                    type="date"
                    value={model.DataVencimento}
                    id="DataVencimento"
                    name="DataVencimento"
                    onChange={(e) => setModel({ ...model, [e.target.name]: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="font-weight-bolder">
                    Valor aprovado para faturar
                  </Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.ValorTotal}
                    id="ValorTotal"
                    name="ValorTotal"
                    fixedDecimalScale
                    decimalScale={2}
                    placeholder="Valor aprovado"
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => { }}
                    disabled
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="font-weight-bolder">
                    Valor da Fatura (Valor reateado)
                  </Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.ValorRateado}
                    id="ValorRateado"
                    name="ValorRateado"
                    fixedDecimalScale
                    decimalScale={2}
                    placeholder="Valor rateado"
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => { }}
                    disabled
                  />
                </FormGroup>
                <br />
                <FormGroup>
                  <Label className="font-weight-bolder">
                    Empresa
                  </Label>
                  <Input
                    type="text"
                    id="EmpresaDescricao"
                    name="EmpresaDescricao"
                    placeholder="Empresa"
                    disabled
                    value={model?.Empresa?.Descricao}
                  />
                </FormGroup>
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
                    options={model?.Empresa?.EmpresaBanco}
                    isSearchable
                    getOptionLabel={(option) => `Banco: ${option?.Banco} Ag: ${option.Agencia} C/C: ${option.Conta} `}
                    getOptionValue={(option) => option}
                    value={
                      model?.Empresa?.EmpresaBanco?.filter((option) => option?.id === model?.EmpresaBanco?.id)
                    }
                    onChange={(object) => {
                      setModel({ ...model, EmpresaBanco: object })
                    }}
                  />
                </FormGroup>
                <ModalFooter>
                  <Button.Ripple
                    className="mr-1 mb-1"
                    disabled={isButtonDisabled}
                    onClick={() => {
                      if (model.TipoFatura === 'CTE') salvarCTE(cidades, true)
                      else if (model.TipoFatura === 'NF') salvarNF(true)
                      else save(model)
                    }}>
                    Salvar
                  </Button.Ripple>
                  <Button.Ripple
                    className="mr-1 mb-1"
                    color="primary"
                    disabled={isButtonDisabled}
                    onClick={() => {
                      if (model.TipoFatura === 'CTE') salvarCTE(cidades)
                      else if (model.TipoFatura === 'NF') salvarNF()
                      else gerar(model)
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

export default ModalEdicaoFaturamento;
