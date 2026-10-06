import React, { useState, useEffect } from "react";
import { Col, FormGroup, Label, Input, Spinner } from "reactstrap";
import { cidades } from "../../../../../utility/cidades_ibge";

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
  codigo_municipio: tomador?.endereco?.codigo_municipio || "",
});

export const imovelIncompleto = (imovel) =>
  !imovel?.cep || !imovel?.logradouro || !imovel?.numero || !imovel?.bairro;

export const imovelCidadeIncompativel = (imovel, localPrestacao) => {
  const munImovel = String(imovel?.codigo_municipio || "").replace(/\D/g, "");
  const munPrestacao = String(localPrestacao || "").replace(/\D/g, "");
  if (!munImovel || !munPrestacao) return false;
  return munImovel !== munPrestacao;
};

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

  const [loadingCep, setLoadingCep] = useState(false);
  const [cepFeedback, setCepFeedback] = useState(null);

  // Consulta automática no ViaCEP
  const consultarViaCep = async (cepInput) => {
    const cepLimpo = String(cepInput || "").replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setCepFeedback(null);
      return;
    }
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepFeedback({ tipo: "erro", texto: "CEP não encontrado no ViaCEP / Correios." });
        setLoadingCep(false);
        return;
      }

      const ibge = String(data.ibge || "").replace(/\D/g, "");
      const cidObj = cidades.find((c) => String(c.Codigo) === ibge);
      const nomeMun = cidObj ? `${cidObj.Nome} - ${cidObj.Uf} (${cidObj.Codigo})` : `${data.localidade} - ${data.uf} (${ibge})`;

      const novoImovel = {
        ...imovel,
        cep: cepLimpo,
        logradouro: imovel.logradouro && imovel.logradouro !== data.logradouro ? imovel.logradouro : (data.logradouro || ""),
        bairro: imovel.bairro && imovel.bairro !== data.bairro ? imovel.bairro : (data.bairro || ""),
        complemento: imovel.complemento || data.complemento || "",
        codigo_municipio: ibge,
        municipio_nome: nomeMun,
      };

      const prestMun = String(dados?.prestador?.codigo_municipio || "3509502").replace(/\D/g, "");
      const fora = ibge !== prestMun;
      const novoServico = {
        ...servico,
        codigo_municipio: ibge,
        local_prestacao_manual: true,
        iss_retido: fora,
        natureza_operacao: fora ? "2" : "1",
        tributacao_rps: fora ? "E" : "T",
      };

      setCepFeedback({
        tipo: "sucesso",
        texto: `✓ ${data.localidade} - ${data.uf} (IBGE: ${ibge}) — Local da prestação alinhado!`,
      });

      onChange({
        ...dados,
        imovel: novoImovel,
        servico: novoServico,
      });
    } catch (err) {
      setCepFeedback({ tipo: "aviso", texto: "Não foi possível validar o CEP online." });
    } finally {
      setLoadingCep(false);
    }
  };

  // Se já abrir com CEP preenchido de 8 dígitos e sem código de município, valida
  useEffect(() => {
    const cepLimpo = String(imovel?.cep || "").replace(/\D/g, "");
    if (cepLimpo.length === 8 && !imovel.codigo_municipio && !loadingCep) {
      consultarViaCep(cepLimpo);
    }
  }, []);

  const alterarImovel = (campo, valor) => {
    if (campo === "cep") {
      const cepLimpo = String(valor || "").replace(/\D/g, "").slice(0, 8);
      const novoImovel = { ...imovel, [campo]: cepLimpo };
      onChange({ ...dados, imovel: novoImovel });
      if (cepLimpo.length === 8) {
        consultarViaCep(cepLimpo);
      } else {
        setCepFeedback(null);
      }
    } else {
      onChange({ ...dados, imovel: { ...imovel, [campo]: valor } });
    }
  };

  const alterarServico = (campo, valor) => {
    onChange({ ...dados, servico: { ...servico, [campo]: valor } });
  };

  const localPrestacao = String(servico?.codigo_municipio || "").replace(/\D/g, "");
  const imovelMun = String(imovel?.codigo_municipio || "").replace(/\D/g, "");
  const munIncompativel = Boolean(imovelMun && localPrestacao && imovelMun !== localPrestacao);

  const sincronizarLocalComImovel = () => {
    if (!imovelMun) return;
    const prestMun = String(dados?.prestador?.codigo_municipio || "3509502").replace(/\D/g, "");
    const fora = imovelMun !== prestMun;
    onChange({
      ...dados,
      servico: {
        ...servico,
        codigo_municipio: imovelMun,
        local_prestacao_manual: true,
        iss_retido: fora,
        natureza_operacao: fora ? "2" : "1",
        tributacao_rps: fora ? "E" : "T",
      },
    });
  };

  return (
    <>
      <Col md={12}>
        <hr />
        <span className="font-weight-bolder" style={{ fontSize: "13px" }}>
          NFS-e padrão nacional — endereço onde o serviço foi executado
        </span>
        <p style={{ fontSize: "11px", marginBottom: "8px" }}>
          A prefeitura exige este endereço para definir o local devido de ISS, IBS e CBS.
          Ele precisa pertencer ao mesmo município selecionado em "Local da Prestação" (erro L9999).
        </p>
      </Col>

      {munIncompativel && (
        <Col md={12} className="mb-2">
          <div
            className="alert alert-danger p-2 d-flex align-items-center justify-content-between"
            style={{ fontSize: "12px", borderRadius: "6px", backgroundColor: "#ffebee", borderColor: "#ffcdd2" }}
          >
            <div>
              <strong style={{ color: "#b71c1c" }}>⚠️ Incompatibilidade detectada:</strong> O CEP{" "}
              <b>{imovel.cep}</b> pertence a <b>{imovel.municipio_nome || `IBGE ${imovelMun}`}</b>, mas o{" "}
              <i>Local da Prestação</i> está selecionado com outro município (<b>IBGE {localPrestacao}</b>).
              <br />
              <span style={{ fontSize: "11px" }}>
                A prefeitura recusa a nota com o erro <b>L9999</b> se o CEP não for do mesmo município da prestação.
              </span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-danger text-nowrap ml-2"
              onClick={sincronizarLocalComImovel}
            >
              Ajustar Local da Prestação
            </button>
          </div>
        </Col>
      )}

      {CAMPOS_IMOVEL.map(({ campo, rotulo, md, obrigatorio }) => (
        <Col md={md} key={campo}>
          <FormGroup>
            <Label style={{ fontSize: "12px" }} className="font-weight-bolder">
              {rotulo}
              {campo === "cep" && loadingCep && (
                <Spinner size="sm" color="primary" className="ml-1" style={{ width: "12px", height: "12px" }} />
              )}
            </Label>
            <Input
              style={obrigatorio && faltaImovel && !imovel[campo] ? { borderColor: "#cc5050" } : {}}
              type="text"
              id={`imovel_${campo}`}
              name={`imovel_${campo}`}
              value={imovel[campo] || ""}
              onChange={(e) => alterarImovel(campo, e.target.value)}
            />
            {campo === "cep" && cepFeedback && (
              <small
                style={{
                  display: "block",
                  fontSize: "11px",
                  marginTop: "4px",
                  color: cepFeedback.tipo === "sucesso" ? "#2e7d32" : cepFeedback.tipo === "erro" ? "#c62828" : "#e65100",
                }}
              >
                {cepFeedback.texto}
              </small>
            )}
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

