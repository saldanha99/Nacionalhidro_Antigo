import React, { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, Card, CardBody, CardHeader, CardTitle, CardFooter, Label } from "reactstrap"
import Timeline from '@components/timeline'
import moment from "moment"
moment.locale("pt-br")

const ModalHistoricoMedicao = (props) => {
  const { modal, handleClose, model } = props
  const [data, setData] = useState([])

  useEffect(() => {
    if (modal) {
      const data = []
      data.push({
        title: 'Cadastro',
        content: 'Conta cadastrada',
        meta: moment(model.Conta?.created_at).utc().format("DD/MM/YYYY"),
        color: 'secondary'
      })

      model.Parcela?.ParcelasRecebimento?.forEach(element => {
          data.push({
            title: element.Antecipar ? `Efetuou a baixa - Antecipação de recebíveis - ${element.UsuarioBaixa ?? ''}` : `Efetuou a baixa - ${element.UsuarioBaixa ?? ''}`,
            content:
            `Foi recebido um valor de R$ ${element.Valor} referente a parcela ${model.Parcela.NumeroParcela}, para os seguintes dados bancários: ${element.EmpresaBanco?.Banco} - Ag: ${element.EmpresaBanco?.Agencia} - CC: ${element.EmpresaBanco?.Conta}. \n\n ${element.Observacao ? `Obs.: ${element.Observacao}` : ''}`,
            meta: moment(element.DataRecebimento).utc().format("DD/MM/YYYY"),
            color: 'primary'
          })
      })

      if (model.Conta?.data_cancelamento) {
        data.push({
          title: 'Conta cancelada',
          content: `Motivo: ${model.Conta?.motivo_cancelamento}`,
          meta: moment(model.Conta?.data_cancelamento).utc().format("DD/MM/YYYY"),
          color: 'danger'
        })
      }
      setData(data)
    }
  }, [modal])

  return (
    <div>
      <span>
        <Modal
          isOpen={modal}
          size="lg"
          toggle={() => handleClose()}
          className="modal-dialog-centered"
        >
          <ModalHeader
            toggle={() => handleClose()}
            style={{ background: '#2F4B7433' }}
            cssModule={{ close: 'close button-close' }}
          >
            <h4 className="mt-1 mb-1"><b>Histórico</b></h4>
          </ModalHeader>
          <ModalBody>
            <Card>
              <CardHeader>
                <CardTitle>Conta a receber: Nota N° {model.Conta?.nota} - Histórico</CardTitle>
              </CardHeader>
              <CardBody>
                {model && data.length > 0 && <Timeline data={data} />}
              </CardBody>
              <CardFooter>
                <Label>Observações: {model.Conta?.observacoes}</Label>
              </CardFooter>
            </Card>
          </ModalBody>
        </Modal>
      </span>
    </div>
  )
};

export default ModalHistoricoMedicao;