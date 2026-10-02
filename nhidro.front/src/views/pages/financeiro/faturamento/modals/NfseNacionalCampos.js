import { Col, FormGroup, Label, Input } from "reactstrap";

// Códigos do padrão nacional da NFS-e, conforme a simulação feita pelo contador no
// emissor novo de Campinas em 02/10/2026 (obrigatório desde 01/10/2026).
export const PADROES_NFSE_NACIONAL = {
  codigo_tributacao_nacional_iss: "071001",
  codigo_tributacao_municipal_iss: "004",
  codigo_nbs: "124069000",
  codigo_indicador_operacao: "020201",
};

export const isVerdadeiro = (valor) => [true, 1, "1", "true"].includes(valor);

export const enderecoImovelDoTomador = (tomador) => ({
  cep: tomador?.endereco?.cep || "",
  logradouro: tomador?.endereco?.logradouro || "",
  numero: tomador?.endereco?.numero || "",
  complemento: tomador?.endereco?.complemento || "",
  bairro: tomador?.endereco?.bairro || "",
});

export const imovelIncompleto = (imovel) =>
  !imovel?.cep || !imovel?.logradouro || !imovel?.numero || !imovel?.bairro;

// Preenche os códigos padrão que estiverem vazios.
export const aplicarPadroesNacionais = (servico) => {
  Object.entries(PADROES_NFSE_NACIONAL).forEach(([campo, valor]) => {
    if (!servico[campo]) servico[campo] = valor;
  });
  return servico;
};

// Ao trocar o local da prestação: se o imóvel ainda era o endereço do tomador (ou
// estava vazio), acompanha a troca; endereço digitado à mão é mantido.
export const imovelAoTrocarLocal = (dados, novoLocal) => {
  const tomadorMun = String(dados?.tomador?.endereco?.codigo_municipio || "").replace(/\D/g, "");
  const imovelEraDoTomador =
    !dados?.imovel?.cep || dados.imovel.cep === dados?.tomador?.endereco?.cep;
  if (!imovelEraDoTomador) return dados.imovel;
  return novoLocal === tomadorMun ? enderecoImovelDoTomador(dados.tomador) : {};
};

const CAMPOS_IMOVEL = [
  { campo: "cep", rotulo: "CEP do local do serviço", md: 3, obrigatorio: true },
  { campo: "logradouro", rotulo: "Logradouro", md: 5, obrigatorio: true },
  { campo: "numero", rotulo: "Número", md: 2, obrigatorio: true },
  { campo: "complemento", rotulo: "Complemento", md: 2 },
  { campo: "bairro", rotulo: "Bairro", md: 3, obrigatorio: true },
];

const CAMPOS_CODIGOS = [
  { campo: "codigo_tributacao_nacional_iss", rotulo: "Cód. tributação nacional" },
  { campo: "codigo_tributacao_municipal_iss", rotulo: "Cód. complementar municipal" },
  { campo: "codigo_nbs", rotulo: "Código NBS" },
  { campo: "codigo_indicador_operacao", rotulo: "Indicador da operação" },
];

/**
 * Campos que o emissor no padrão nacional exige além do formato antigo: o endereço
 * do imóvel onde o serviço foi executado e os códigos de tributação/NBS.
 */
const NfseNacionalCampos = ({ dados, onChange }) => {
  const imovel = dados?.imovel || {};
  const servico = dados?.servico || {};
  const faltaImovel = imovelIncompleto(imovel);

  const alterarImovel = (campo, valor) => {
    onChange({ ...dados, imovel: { ...imovel, [campo]: valor } });
  };

  const alterarServico = (campo, valor) => {
    onChange({ ...dados, servico: { ...servico, [campo]: valor } });
  };

  return (
    <>
      <Col md={12}>
        <hr />
        <span className="font-weight-bolder" style={{ fontSize: "13px" }}>
          NFS-e padrão nacional — endereço onde o serviço foi executado
        </span>
        <p style={{ fontSize: "11px", marginBottom: "8px" }}>
          A prefeitura usa este endereço para definir onde o ISS, o IBS e a CBS são devidos.
          Ele precisa ficar no município escolhido em "Local da Prestação".
        </p>
      </Col>
      {CAMPOS_IMOVEL.map(({ campo, rotulo, md, obrigatorio }) => (
        <Col md={md} key={campo}>
          <FormGroup>
            <Label style={{ fontSize: "12px" }} className="font-weight-bolder">
              {rotulo}
            </Label>
            <Input
              style={obrigatorio && faltaImovel && !imovel[campo] ? { borderColor: "#cc5050" } : {}}
              type="text"
              id={`imovel_${campo}`}
              name={`imovel_${campo}`}
              value={imovel[campo] || ""}
              onChange={(e) =>
                alterarImovel(campo, campo === "cep" ? e.target.value.replace(/\D/g, "").slice(0, 8) : e.target.value)
              }
            />
          </FormGroup>
        </Col>
      ))}
      {CAMPOS_CODIGOS.map(({ campo, rotulo }) => (
        <Col md={3} key={campo}>
          <FormGroup>
            <Label style={{ fontSize: "12px" }} className="font-weight-bolder">
              {rotulo}
            </Label>
            <Input
              type="text"
              id={campo}
              name={campo}
              placeholder={PADROES_NFSE_NACIONAL[campo]}
              value={servico[campo] || ""}
              onChange={(e) => alterarServico(campo, e.target.value.replace(/\D/g, ""))}
            />
          </FormGroup>
        </Col>
      ))}
    </>
  );
};

export default NfseNacionalCampos;
