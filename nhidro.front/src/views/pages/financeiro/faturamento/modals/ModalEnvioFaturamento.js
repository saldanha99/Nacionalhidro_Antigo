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
  Button,
  Input
} from "reactstrap";
import Select from "react-select";
import "@styles/base/pages/modal.scss";

const ModalEnvioFaturamento = (props) => {
  const {
    modal,
    faturamento,
    handleClose,
    save, contatos
  } = props;

  const [model, setModel] = useState({});

  useEffect(() => {
    if (modal) {
      setModel({id: faturamento.id, TipoFatura: faturamento.tipo_fatura, UrlArquivoNota: faturamento.url_arquivo_nota});
    }
  }, [modal]);

  const isButtonDisabled = !model?.Contato;

  return (
    <div>
      <span>
        <Modal
          isOpen={modal}
          size="lg"
          toggle={() => handleClose()}
          className="modal-dialog-centered"
          backdrop={false}>
          <ModalHeader
            toggle={() => handleClose()}
            style={{ background: "#2F4B7433" }}
            cssModule={{ close: "close button-close" }}>
            <h4 className="mt-1 mb-1">
              <b>
               Fatura: Medição {faturamento?.medicao} | Revisão{" "} {faturamento?.medicao_revisao}
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
                    Tem certeza que deseja enviar uma Fatura para o cliente?
                  </strong>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Col>
                <FormGroup>
                  <Label className="font-weight-bolder">Contato</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    name="Banco"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={contatos.filter(c => c.Email) || []}
                    isSearchable
                    getOptionLabel={(option) => `${option?.Nome} - ${option?.Email || ''}`}
                    getOptionValue={(option) => option}
                    value={contatos?.filter((option) => option?.id === model?.Contato?.id)}
                    onChange={(object) => {setModel({ ...model, Contato: object})}}
                  />
                </FormGroup>
                </Col>
                <Col>
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
                        onChange={(e) => setModel({...model, [e.target.name]: e.target.value, })}
                    />
                    </FormGroup>
                </Col>
                <ModalFooter>
                  <Button.Ripple
                    className="mr-1 mb-1"
                    onClick={() => {
                        handleClose()
                    }}>
                      Cancelar
                  </Button.Ripple>
                  <Button.Ripple
                    className="mr-1 mb-1"
                    color="primary"
                    disabled={isButtonDisabled}
                    onClick={() => {
                        save(model)
                    }}>
                      Enviar Fatura
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

export default ModalEnvioFaturamento;
