import React, { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, Card, CardBody, CardHeader, CardTitle } from "reactstrap"
import Timeline from '@components/timeline'
import moment from "moment"
import { DiffDatesInDays } from "../../../../../utility/date/date"
moment.locale("pt-br")

const ModalHistoricoMedicao = (props) => {
  const { modal, handleClose, model } = props
  const [data, setData] = useState([])
  const diasParaVencimento = 2

  useEffect(() => {
    if (modal) {
      const data = []
      data.push({
        title: 'Criação',
        content: 'Em aberto',
        meta: moment(model.created_at).utc().format("DD/MM/YYYY"),
        color: 'warning'
      })
      if (model.revisao > 0) {
        data.push({
          title: 'Revisão iniciada',
          content: 'Cliente reprovou medição anterior',
          meta: moment(model.data_criacao).utc().format("DD/MM/YYYY"),
          color: 'danger'
        })
      }
      if (model.data_conferencia) {
        data.push({
          title: 'Enviado para conferência',
          content: 'Em conferência',
          meta: moment(model.data_conferencia).utc().format("DD/MM/YYYY"),
          bgColor: '#D66BFC'
        })
      }
      if (model.data_aprovacao_interna) {
        data.push({
          title: 'Conferência finalizada',
          content: 'Validado',
          meta: moment(model.data_aprovacao_interna).utc().format("DD/MM/YYYY"),
          color: 'success'
        })
      }
      if (model.data_cobranca) {
        data.push({
          title: 'Cobrança enviada para o cliente',
          content: 'Aguardando aprovação do cliente',
          meta: moment(model.data_cobranca).utc().format("DD/MM/YYYY"),
          color: 'info'
        })
      }
      if (model.data_aprovacao) {
        const noPrazo = DiffDatesInDays(moment(model.data_aprovacao), moment(model.data_cobranca)) <= diasParaVencimento;
        data.push({
          title: noPrazo ? 'Cobrança aprovada (Dentro do prazo)' : 'Cobrança aprovada (Com atraso)',
          content: 'Medição finalizada',
          meta: moment(model.data_aprovacao).utc().format("DD/MM/YYYY"),
          color: noPrazo ? 'success' : 'warning'
        })
      }
      if (model.data_cancelamento) {
        data.push({
          title: 'Medição cancelada',
          content: `Motivo: ${model.motivo_cancelamento}`,
          meta: moment(model.data_cancelamento).utc().format("DD/MM/YYYY"),
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
                <CardTitle>Medição: {model.codigo} | Revisão {model.revisao}</CardTitle>
              </CardHeader>
              <CardBody>
                {model && data.length > 0 && <Timeline data={data} />}
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>
      </span>
    </div>
  )
};

export default ModalHistoricoMedicao;