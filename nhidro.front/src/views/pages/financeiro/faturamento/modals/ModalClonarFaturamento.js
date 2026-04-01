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
  Button
} from "reactstrap";
import Select from "react-select";
import "@styles/base/pages/modal.scss";

const ModalClonarFaturamento = (props) => {
  const {
    modal,
    faturamento,
    handleClose,
    save, faturamentos
  } = props;

  const [model, setModel] = useState({});

  useEffect(() => {
    if (modal) {
      setModel({from: faturamento.id});
    }
  }, [modal]);

  const isButtonDisabled = !model?.to || !model.from;

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
               Clonar Fatura: Medição {faturamento?.medicao} | Revisão{" "} {faturamento?.medicao_revisao}
              </b>
            </h4>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="12">
                <Col>
                <FormGroup>
                  <Label className="font-weight-bolder">Clonar para Fatura:</Label>
                  <Select
                    placeholder="Selecione..."
                    className="React"
                    classNamePrefix="select"
                    name="Fatura"
                    noOptionsMessage={() => 'Sem registro!'}
                    options={faturamentos.filter(c => c.tipo_fatura === 'CTE' && c.id !== faturamento.id) || []}
                    isSearchable
                    getOptionLabel={(option) => `${option?.medicao} - ${option.cliente}`}
                    getOptionValue={(option) => option}
                    value={faturamentos?.filter((option) => option?.id === model?.to?.id)}
                    onChange={(object) => {setModel({...model, to: object})}}
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
                      Clonar Fatura
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

export default ModalClonarFaturamento;
