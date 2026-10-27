/*
 * PRÉ-VISUALIZAÇÃO DA NOTA (27/10/2026, Andréa): "visualizar a nota antes de gerar",
 * para quem está começando no faturamento conferir os dados antes de faturar.
 * O servidor roda as mesmas regras do "Gerar Fatura" (local da prestação pelo CEP do
 * imóvel, ISS truncado, retenção obrigatória) sem gravar nada nem enviar à prefeitura,
 * e esta tela mostra o que seria enviado.
 */
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from "reactstrap";
import moment from "moment";
import { cidades } from "../../../../../utility/cidades_ibge";

const reais = (valor) => Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const documento = (valor) => {
  const d = String(valor || "").replace(/\D/g, "");
  if (d.length === 14) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  if (d.length === 11) return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  return d || "-";
};

const municipio = (codigo) => {
  const c = cidades.find((x) => String(x.Codigo) === String(codigo || "").replace(/\D/g, ""));
  return c ? `${c.Nome}/${c.Uf}` : (codigo || "-");
};

const juntar = (...partes) => partes.filter((p) => p && String(p).trim()).join(", ");

const data = (valor) => (valor ? moment.utc(valor).format("DD/MM/YYYY") : "-");

/** Mesmo formato para o padrão nacional (DPS) e o emissor antigo de Campinas. */
const camposDaPrevia = (r) => {
  const { dps = {}, dados = {} } = r;
  const tomador = dados.tomador || {};
  const end = tomador.endereco || {};
  const servico = dados.servico || {};
  if (r.padrao === "nacional") {
    return {
      tomador: dps.razao_social_tomador,
      documentoTomador: dps.cnpj_tomador || dps.cpf_tomador,
      enderecoTomador: juntar(dps.logradouro_tomador, dps.numero_tomador, dps.complemento_tomador, dps.bairro_tomador),
      cepTomador: dps.cep_tomador,
      municipioTomador: dps.codigo_municipio_tomador,
      email: dps.email_tomador,
      local: dps.codigo_municipio_prestacao,
      imovel: juntar(dps.logradouro_imovel, dps.numero_imovel, dps.complemento_imovel, dps.bairro_imovel) + (dps.cep_imovel ? ` - CEP ${dps.cep_imovel}` : ""),
      codigo: dps.codigo_tributacao_nacional_iss,
      descricao: dps.descricao_servico,
      valorServico: dps.valor_servico,
    };
  }
  return {
    tomador: tomador.razao_social,
    documentoTomador: tomador.cnpj || tomador.cpf,
    enderecoTomador: juntar(end.logradouro, end.numero, end.complemento, end.bairro),
    cepTomador: end.cep,
    municipioTomador: end.codigo_municipio,
    email: tomador.email,
    local: servico.codigo_municipio,
    imovel: "",
    codigo: servico.item_lista_servico,
    descricao: servico.discriminacao,
    valorServico: servico.valor_servicos,
  };
};

const Rotulo = ({ children }) => <div style={{ fontSize: 11, color: "#6e6b7b", textTransform: "uppercase" }}>{children}</div>;
const Valor = ({ children, destaque }) => <div style={{ fontWeight: destaque ? 700 : 500, marginBottom: 8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{children || "-"}</div>;
const Secao = ({ titulo, children }) => (
  <div style={{ border: "1px solid #d8d6de", borderRadius: 6, padding: "10px 12px", marginBottom: 10 }}>
    <div style={{ fontWeight: 700, color: "#2f4b74", marginBottom: 8 }}>{titulo}</div>
    {children}
  </div>
);

const PreviaNotaFiscal = ({ previa, empresa, banco, onFechar, onSalvar, onGerar }) => {
  const aberta = Boolean(previa);
  const r = previa?.resposta;
  const ok = r?.success;
  const c = ok ? camposDaPrevia(r) : {};
  const v = r?.valores || {};
  const aliquota = r?.dados?.servico?.aliquota;
  const valorDiferente = ok && Math.abs(Number(c.valorServico || 0) - Number(v.ValorRateado || 0)) >= 0.01;

  return (
    <Modal isOpen={aberta} toggle={onFechar} className="modal-dialog-centered modal-lg" backdrop="static">
      <ModalHeader toggle={onFechar}>Pré-visualização da nota fiscal</ModalHeader>
      <ModalBody style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {previa?.carregando && <p>Montando a prévia com as regras da prefeitura...</p>}

        {r && !ok &&
          <div className="alert alert-danger" style={{ padding: 12 }}>
            <strong>Esta nota não pode ser gerada ainda.</strong>
            <div style={{ marginTop: 6 }}>{r.erro || "Não foi possível montar a prévia."}</div>
          </div>
        }

        {ok && <>
          <div className="alert alert-warning" style={{ padding: 10 }}>
            Prévia sem valor fiscal: nada foi enviado à prefeitura. Confira os dados e, se estiver tudo certo, clique em <strong>Gerar Fatura</strong>.
            {" "}Padrão: <strong>{r.padrao === "nacional" ? "NFS-e Nacional" : "NFS-e Campinas (emissor antigo)"}</strong>.
          </div>

          <Secao titulo="Prestador">
            <Row>
              <Col md="8"><Rotulo>Empresa</Rotulo><Valor>{empresa?.Descricao}</Valor></Col>
              <Col md="4"><Rotulo>CNPJ</Rotulo><Valor>{documento(r.dados?.prestador?.cnpj || empresa?.CNPJ)}</Valor></Col>
            </Row>
          </Secao>

          <Secao titulo="Tomador (cliente)">
            <Row>
              <Col md="8"><Rotulo>Razão social</Rotulo><Valor destaque>{c.tomador}</Valor></Col>
              <Col md="4"><Rotulo>CNPJ / CPF</Rotulo><Valor>{documento(c.documentoTomador)}</Valor></Col>
              <Col md="8"><Rotulo>Endereço</Rotulo><Valor>{c.enderecoTomador}{c.cepTomador ? ` - CEP ${c.cepTomador}` : ""}</Valor></Col>
              <Col md="4"><Rotulo>Município</Rotulo><Valor>{municipio(c.municipioTomador)}</Valor></Col>
              <Col md="12"><Rotulo>E-mail na nota</Rotulo><Valor>{c.email}</Valor></Col>
            </Row>
          </Secao>

          <Secao titulo="Serviço">
            <Row>
              <Col md="4"><Rotulo>Local da prestação</Rotulo><Valor destaque>{municipio(c.local)}</Valor></Col>
              <Col md="8"><Rotulo>Local do serviço (imóvel)</Rotulo><Valor>{c.imovel}</Valor></Col>
              <Col md="4"><Rotulo>Código do serviço</Rotulo><Valor>{c.codigo}</Valor></Col>
              <Col md="4"><Rotulo>Data de emissão</Rotulo><Valor>{data(v.DataEmissao)}</Valor></Col>
              <Col md="4"><Rotulo>Vencimento</Rotulo><Valor>{data(v.DataVencimento)}</Valor></Col>
              <Col md="12"><Rotulo>Descrição que vai na nota</Rotulo><Valor>{c.descricao}</Valor></Col>
            </Row>
          </Secao>

          <Secao titulo="Valores">
            <Row>
              <Col md="4"><Rotulo>Valor do serviço</Rotulo><Valor destaque>{reais(c.valorServico)}</Valor></Col>
              <Col md="4"><Rotulo>Alíquota do ISS</Rotulo><Valor>{aliquota ? `${aliquota}%` : "-"}</Valor></Col>
              <Col md="4"><Rotulo>ISS</Rotulo><Valor>{reais(v.ValorIss)} {r.issRetido ? "(retido pelo tomador)" : "(não retido)"}</Valor></Col>
              <Col md="2"><Rotulo>PIS</Rotulo><Valor>{reais(v.ValorPis)}</Valor></Col>
              <Col md="2"><Rotulo>COFINS</Rotulo><Valor>{reais(v.ValorCofins)}</Valor></Col>
              <Col md="2"><Rotulo>CSLL</Rotulo><Valor>{reais(v.ValorCsll)}</Valor></Col>
              <Col md="3"><Rotulo>IR</Rotulo><Valor>{reais(v.ValorIr)}</Valor></Col>
              <Col md="3"><Rotulo>INSS</Rotulo><Valor>{reais(v.ValorInss)}</Valor></Col>
              <Col md="6"><Rotulo>Valor líquido (a receber)</Rotulo><Valor destaque>{reais(v.ValorLiquido)}</Valor></Col>
              <Col md="6"><Rotulo>Banco para depósito</Rotulo><Valor>{banco?.Banco ? `${banco.Banco} Ag: ${banco.Agencia} C/C: ${banco.Conta}` : "-"}</Valor></Col>
            </Row>
            {valorDiferente &&
              <div className="alert alert-danger" style={{ padding: 8, marginBottom: 0 }}>
                O valor do serviço ({reais(c.valorServico)}) é diferente do valor da fatura ({reais(v.ValorRateado)}). Confira os itens.
              </div>
            }
          </Secao>
        </>}
      </ModalBody>
      <ModalFooter>
        <Button.Ripple outline color="secondary" onClick={onFechar}>Voltar e corrigir</Button.Ripple>
        {ok && <Button.Ripple onClick={onSalvar}>Salvar</Button.Ripple>}
        {ok && <Button.Ripple color="primary" onClick={onGerar}>Gerar Fatura</Button.Ripple>}
      </ModalFooter>
    </Modal>
  );
};

export default PreviaNotaFiscal;
