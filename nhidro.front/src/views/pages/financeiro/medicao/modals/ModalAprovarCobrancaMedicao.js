import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import "@styles/base/pages/modal.scss";
import "flatpickr/dist/themes/light.css";
import "@styles/base/plugins/forms/pickers/form-flat-pickr.scss";
import { buscarPropostasMedicaoPorCliente } from "@src/redux/actions/comercial/proposta/buscarPropostasActions";
import { connect } from "react-redux";
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import NumberFormat from "react-number-format";
import moment from "moment";

const ModalAprovarCobrancaMedicao = (props) => {
  const { handleClose, modalAprovar, aprovar } = props;

  const [model, setModel] = useState({});
  const [textImagem, setTextImagem] = useState('')

  useEffect(() => {
    if (modalAprovar) {
      setTextImagem('')
      props.medicao.SaldoDevedor = props.medicao.valor_total - (props.medicao.valor_aprovado || 0)
      props.medicao.ValorCteFatura = props.medicao.SaldoDevedor
      props.medicao.ValorRLFatura = props.medicao.porcentagem_rl ? props.medicao.SaldoDevedor * (props.medicao.porcentagem_rl / 100) : 0
      props.medicao.ValorServicoFatura = props.medicao.SaldoDevedor - props.medicao.ValorRLFatura

      setModel(props.medicao)
    }
  }, [modalAprovar]);

  const handleChange = (value)=>{
    if (!value.includes('<img src="data:') || value === '<p><br></p>') return setTextImagem('')
    const array = value.split('<img src="data:')
    const countImages = array.length
    if (countImages > 2) {
      return setTextImagem(`<p><img src="data:${array[2]}`)
    }
    setTextImagem(value)
  }

  return (
    <div>
      <span>
        <Modal
          isOpen={modalAprovar}
          size="xl"
          toggle={() => handleClose()}
          className="modal-dialog-centered"
          backdrop={false}>
          <ModalHeader
            toggle={() => handleClose()}
            style={{ background: "#2F4B7433" }}
            cssModule={{ close: "close button-close" }}>
            <h4 className="mt-1 mb-1">
              <b>Aprovar cobrança</b>
            </h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Código Medição</Label>
                  <Input
                    type="text"
                    id="codigo"
                    name="codigo"
                    disabled
                    value={model.codigo}
                  />
                </FormGroup>
              </Col>
              <Col md="3" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Empresa</Label>
                  <Input
                    type="text"
                    id="empresa"
                    name="empresa"
                    disabled
                    value={model?.empresa}
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
                    value={model?.cliente}
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
                    value={model?.contato}                   
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Data Cobrança</Label>
                  <Input
                    type="text"
                    id="DataCobrança"
                    name="DataCobrança"
                    disabled
                    value={moment(model?.data_cobranca).format('DD/MM/YYYY hh:mm:ss')}
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor por serviço</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.total_servico}
                    id="ValorPorServiço"
                    name="ValorPorServiço"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor por hora</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.total_hora}
                    id="ValorPorHora"
                    name="ValorPorHora"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor adicional</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.adicional}
                    id="Adicional"
                    name="Adicional"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor descontado</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.desconto}
                    id="Desconto"
                    name="Desconto"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor Total</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.valor_total}
                    id="ValorTotal"
                    name="ValorTotal"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>
              {!model.cte && <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Porcentagem RL</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.porcentagem_rl}
                    id="PorcentagemRL"
                    name="PorcentagemRL"
                    fixedDecimalScale
                    decimalScale={2}
                    suffix="%"
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>}
            </Row>
            <Row>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Aprovado Parcial</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.valor_aprovado || 0}
                    id="ValorAprovado"
                    name="ValorAprovado"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor Restante</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.valor_total - (model.valor_aprovado || 0)}
                    id="ValorRestante"
                    name="ValorRestante"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor Aprovado</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.SaldoDevedor}
                    id="SaldoDevedor"
                    name="SaldoDevedor"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {
                      const devedor = e.floatValue || 0
                      const valorRL = devedor * (model.porcentagem_rl / 100)
                      const valorNF = devedor - valorRL
                      setModel({...model, SaldoDevedor: devedor, ValorRLFatura: valorRL, ValorServicoFatura: valorNF})
                    }}
                  />
                </FormGroup>
              </Col>
              {!model.cte && <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor em RL</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.ValorRLFatura}
                    id="ValorRL"
                    name="ValorRL"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>}
              {!model.cte && <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor em NF</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.ValorServicoFatura}
                    id="ValorServico"
                    name="ValorServico"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>}
              {model.cte && <Col md="2" className="mt-1">
                <FormGroup>
                  <Label className="font-weight-bolder">Valor em CTe</Label>
                  <NumberFormat
                    className="mb-90 form-control"
                    displayType="number"
                    value={model.ValorCteFatura}
                    id="ValorCteFatura"
                    name="ValorCteFatura"
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    decimalSeparator=","
                    thousandSeparator="."
                    onValueChange={(e) => {}}
                    disabled
                  />
                </FormGroup>
              </Col>}
              <Col md="12" className="mt-1">
                <FormGroup>
                  <Label style={{fontSize:"0.7rem"}} className="font-weight-bolder">Imagem</Label>
                  <ReactQuill value={textImagem || ''}
                    id="img"
                    placeholder='Cole ou carregue aqui sua imagem...'
                    modules={{
                      toolbar: [['image']]
                    }}
                    onChange={e => handleChange(e)} 
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button.Ripple
              className="mr-1 mb-1"
              onClick={() => handleClose()}
            >
              Fechar
            </Button.Ripple>
            <Button.Ripple
              color="primary"
              className="mr-1 mb-1"
              disabled={!model.SaldoDevedor || model.SaldoDevedor > (model.valor_total - (model.valor_aprovado || 0)) || !textImagem}
              onClick={() => aprovar(model, textImagem)}
            >
              Aprovar
            </Button.Ripple>
          </ModalFooter>
        </Modal>
      </span>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    propostas: state?.proposta?.propostasMedicao,
  };
};

export default connect(mapStateToProps, {
  buscarPropostasMedicaoPorCliente,
})(ModalAprovarCobrancaMedicao);
