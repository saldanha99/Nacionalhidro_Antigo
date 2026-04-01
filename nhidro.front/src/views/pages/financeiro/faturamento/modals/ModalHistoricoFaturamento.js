import React, { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, Card, CardBody, CardHeader, CardTitle } from "reactstrap"
import Timeline from '@components/timeline'
import moment from "moment"
moment.locale("pt-br")

const ModalHistoricoFaturamento = (props) => {
  const { modal, handleClose, model } = props
  const [data, setData] = useState([])

  useEffect(() => {
    if (modal) {
      const data = []
      data.push({
        title: 'Em aberto',
        content: 'Cobrança aprovada',
        meta: moment(model.created_at).utc().format("DD/MM/YYYY"),
        color: 'warning'
      })
      if (model.data_emissao) {
        data.push({
          title: 'Emitido',
          content: `Fatura emitida`,
          meta: moment(model.data_emissao).utc().format("DD/MM/YYYY"),
          color: 'primary'
        })
      }
      if (model.data_envio) {
        data.push({
          title: 'Enviado',
          content: `Fatura enviada para o cliente`,
          meta: moment(model.data_envio).utc().format("DD/MM/YYYY"),
          color: 'success'
        })
      }
      if (model.data_cancelamento) {
        data.push({
          title: 'Faturamento Cancelado',
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
                <CardTitle>Fatura: Medição: {model?.medicao} | Revisão {model?.medicao_revisao}</CardTitle>
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

export default ModalHistoricoFaturamento;