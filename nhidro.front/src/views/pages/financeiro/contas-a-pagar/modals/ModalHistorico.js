import React, { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, Card, CardBody, Media, CardHeader, CardTitle, Label, CardFooter } from "reactstrap"
import Timeline from '@components/timeline'
import moment from "moment"
moment.locale("pt-br")

const ModalHistorico = (props) => {
    const { modal, handleClose, conta } = props
    const [data, setData] = useState([])

    useEffect(() => {
        if (conta.id) {
            const data = []
            data.push({
                title: 'Entrou no sistema',
                meta: moment(conta.DataCriacao).utc().format("DD/MM/YYYY"),
                color: 'secondary'
            })

            conta.Pagamentos.forEach(element => {
                data.push({
                    title: `Efetuou a baixa - ${element.UsuarioBaixa ?? ''}`,
                    content:
                    `Foi pago um valor de R$ ${element.Valor}, utilizando os seguintes dados bancários de saída: ${element.EmpresaBanco?.Banco} - Ag: ${element.EmpresaBanco?.Agencia} - CC: ${element.EmpresaBanco?.Conta}. \n\n ${element.Observacao ? `Obs.: ${element.Observacao}` : ''}`,
                    meta: moment(element.DataPagamento).utc().format("DD/MM/YYYY"),
                    color: 'primary'
                })
            })
            setData(data)
        }
    }, [conta])

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
                    style={{background: '#2F4B7433'}}
                    cssModule={{close: 'close button-close'}}
                >
                    <h4 className="mt-1 mb-1"><b>Histórico</b></h4>
                </ModalHeader>
                <ModalBody>
                    <Card>
                    <CardHeader>
                        <CardTitle>Fornecedor: {conta.Fornecedor?.Nome}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <CardTitle>Pagamento referente à conta {conta.NumeroNF ? `Nº NF: ${conta.NumeroNF}` : `ID: ${conta.id}`}</CardTitle>
                        {conta && data.length > 0 && <Timeline data={data} />}
                    </CardBody>
                    <CardFooter>
                        <Label>Observações: {conta?.Observacoes}</Label>
                    </CardFooter>
                    </Card>
                </ModalBody>
                </Modal>
            </span>
        </div>
    )
}

export default ModalHistorico
  
