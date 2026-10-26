import React, { useState } from 'react'
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { Enum_TipoFaturamento } from '@src/utility/enum/Enums'

// Bloco de notas do faturamento (26/10/2026, pedido da Andréa antes das
// férias): as regras de cada cliente ficam no cadastro e aparecem na medição
// e no faturamento, para quem estiver cobrindo não depender de perguntar.

export const OPCOES_PEDIDO_COMPRA = [
  { value: 'OBRIGATORIO', label: 'Obrigatório' },
  { value: 'DISPENSADO', label: 'Dispensado' },
  { value: 'A_CONFIRMAR', label: 'Pendente de confirmação' }
]

export const CAMPOS_NOTAS_FATURAMENTO = [
  { campo: 'FatFechamento', titulo: 'Fechamento e faturamento', dica: 'Ex.: medição fecha dia 15 e no último dia do mês; faturar até o dia 5.', linhas: 2 },
  { campo: 'FatEnvioMedicao', titulo: 'Envio da medição', dica: 'Para quem vai, e-mails e como o cliente aprova (portal, e-mail, assinatura).', linhas: 3 },
  { campo: 'FatEnvioFaturas', titulo: 'Envio das faturas', dica: 'Destinatários e e-mails de RL, NFS-e, CT-e e boleto.', linhas: 3 },
  { campo: 'FatDocumentos', titulo: 'Tipo de faturamento', dica: 'Ex.: RL de locação + NFS-e de serviço, conforme a proposta.', linhas: 2 },
  { campo: 'FatParticularidades', titulo: 'Particularidades', dica: 'Prorrogações, retenções, exigências de portal, documentos extras e regras próprias.', linhas: 4 },
  { campo: 'FatResponsaveis', titulo: 'Contatos responsáveis', dica: 'Cliente, aprovador e responsáveis internos.', linhas: 2 }
]

const CAMPOS_COMPARADOS = ['FatPedidoCompra', ...CAMPOS_NOTAS_FATURAMENTO.map(item => item.campo)]

export const notasFaturamentoMudaram = (antes, depois) => CAMPOS_COMPARADOS
  .some(campo => (antes?.[campo] || '') !== (depois?.[campo] || ''))

export const temNotasFaturamento = (cliente) => Boolean(cliente?.ObservacaoCobranca)
  || CAMPOS_COMPARADOS.some(campo => cliente?.[campo])

const rotuloPedidoCompra = (valor) => OPCOES_PEDIDO_COMPRA.find(item => item.value === valor)?.label

const periodicidade = (cliente) => {
  if (cliente?.TipoFaturamento === Enum_TipoFaturamento.Quinzenal) {
    return `Quinzenal${cliente.DiaBaseQuinzenalInicio ? ` (dias ${cliente.DiaBaseQuinzenalInicio} e ${cliente.DiaBaseQuinzenalFinal})` : ''}`
  }
  if (cliente?.TipoFaturamento === Enum_TipoFaturamento.Mensal) return `Mensal${cliente.DiaBaseMensal ? ` (dia ${cliente.DiaBaseMensal})` : ''}`
  if (cliente?.TipoFaturamento === Enum_TipoFaturamento.Semanal) return 'Semanal'
  if (cliente?.TipoFaturamento === Enum_TipoFaturamento.CadaExecucao) return 'A cada execução'
  return null
}

export function NotasFaturamentoForm({ cliente, onChange }) {
  return (
    <>
      <Row style={{ background: '#D5DBE3', padding: '2px', margin: '0 10px 0 10px' }}>
        <Col md="12" className="mt-1">
          <span style={{ fontWeight: 'bold', fontSize: '17px' }}>Bloco de notas do faturamento</span>
          <span className="ml-1" style={{ fontSize: '0.75rem' }}>aparece na medição e no faturamento deste cliente</span>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col md="4">
          <FormGroup>
            <Label style={{ fontSize: '0.7rem' }} className="font-weight-bolder" for="FatPedidoCompra">Pedido de compras</Label>
            <Input type="select" id="FatPedidoCompra" name="FatPedidoCompra" value={cliente?.FatPedidoCompra || ''}
              onChange={(e) => onChange('FatPedidoCompra', e.target.value || null)}>
              <option value="">Não informado</option>
              {OPCOES_PEDIDO_COMPRA.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Input>
          </FormGroup>
        </Col>
        <Col md="8" className="d-flex align-items-end">
          {cliente?.FatNotasAtualizadasEm ? (
            <small className="text-muted mb-1">
              Atualizado por {cliente.FatNotasAtualizadasPor || '—'} em {new Date(cliente.FatNotasAtualizadasEm).toLocaleString('pt-BR')}
            </small>
          ) : null}
        </Col>
        {CAMPOS_NOTAS_FATURAMENTO.map(item => (
          <Col md="6" key={item.campo}>
            <FormGroup>
              <Label style={{ fontSize: '0.7rem' }} className="font-weight-bolder" for={item.campo}>{item.titulo}</Label>
              <Input type="textarea" rows={item.linhas} id={item.campo} name={item.campo} placeholder={item.dica}
                value={cliente?.[item.campo] || ''} onChange={(e) => onChange(item.campo, e.target.value)} />
            </FormGroup>
          </Col>
        ))}
      </Row>
    </>
  )
}

// Painel de consulta na medição e no faturamento
export function NotasFaturamentoPainel({ cliente }) {
  const [aberto, setAberto] = useState(true)
  if (!cliente || !temNotasFaturamento(cliente)) return null
  const pedido = rotuloPedidoCompra(cliente.FatPedidoCompra)
  const linhas = [
    ['Periodicidade', periodicidade(cliente)],
    ['Vencimento', cliente.DiasVencimento ? `${cliente.DiasVencimento} dias` : null],
    ['Pedido de compras', pedido],
    ...CAMPOS_NOTAS_FATURAMENTO.map(item => [item.titulo, cliente[item.campo]]),
    ['Orientações de fatura', cliente.ObservacaoCobranca]
  ].filter(([, valor]) => valor)
  return (
    <Card className="mb-1" style={{ border: '1px solid #f0c36d', background: '#fffaf0' }}>
      <CardBody className="p-1">
        <div className="d-flex justify-content-between align-items-center" style={{ cursor: 'pointer' }} onClick={() => setAberto(!aberto)}>
          <strong>Notas de faturamento — {cliente.NomeFantasia || cliente.RazaoSocial}</strong>
          <small>{aberto ? 'ocultar' : 'mostrar'}</small>
        </div>
        {pedido === 'Obrigatório' ? <div className="mt-1" style={{ color: '#b45309', fontWeight: 'bold' }}>Atenção: este cliente exige pedido de compras.</div> : null}
        {aberto ? (
          <div className="mt-1" style={{ fontSize: '0.85rem' }}>
            {linhas.map(([titulo, valor]) => (
              <div key={titulo} className="mb-50"><strong>{titulo}:</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{valor}</span></div>
            ))}
            {cliente.FatNotasAtualizadasEm ? <small className="text-muted">Atualizado por {cliente.FatNotasAtualizadasPor || '—'} em {new Date(cliente.FatNotasAtualizadasEm).toLocaleDateString('pt-BR')}</small> : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}
