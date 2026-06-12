# Nacional Hidro — Análise Completa do Sistema Antigo (NacionalHidro_entrega)

> Documento gerado em 10/06/2026 para servir de referência na comparação com o sistema novo.
> Cobre: arquitetura, todas as rotas, schemas, lógica de negócio do fluxo completo
> (Cliente → Proposta → OS → Escala → Fechamento → Precificação → Medição → Faturamento → Contas a Receber → Baixa)
> e os **formatos de dados** críticos para a migração.

---

## 1. Arquitetura

| Camada | Tecnologia |
|---|---|
| Backend | Strapi 4.7.0 (Node 12–16), pasta `nhidro.strapi/` |
| Banco principal | **MySQL 8** (charset `utf8mb4_unicode_ci`) — Strapi gerencia o schema |
| Banco legado | SQL Server (Azure) — módulo `sql-server` apenas p/ consulta de clientes antigos |
| Frontend | React 18 SPA (template Vuexy), CRA + react-app-rewired, pasta `nhidro.front/` |
| Estado | Redux (actions em `src/redux/actions/**`) — toda chamada de API passa por lá |
| Auth | JWT do Strapi (`users-permissions`). `REACT_APP_JWT_SECRET` (front) **= `JWT_SECRET`** (back) |
| Storage | Azure Blob (PDFs de proposta, medição, recibos, imagens de aprovação) |
| E-mail | AWS SES (prod) / Gmail SMTP (dev) — `src/services/email/index.js` |
| NF | Focus NFe (NFS-e e CT-e) — token por empresa (`empresas.FocusToken`), URL da API na tabela `configuracoes` (descricao=`Focus_Api`) |
| Relatórios PDF | `src/services/files/index.js` (puppeteer/handlebars) → upload Azure |

### Perfis (roles) usados nas rotas do front
`Gerencial`, `Comercial`, `Comercial 2`, `Comercial 3`, `Faturamento`, `Logistica`,
`Contas Pagar`, `Recursos Humanos`, `Recursos Humanos 2`, `Manutencao`, `Seguranca Trabalho`,
`Controle Adm`, `Compras`, `Integracao`.

### Rotas do frontend (React Router)
| Rota | Tela | Roles principais |
|---|---|---|
| `/proposta` | Comercial → Proposta | Gerencial, Comercial 1/2/3, Faturamento |
| `/historico-contato` | CRM simples | Comercial |
| `/ordem-servico` | Logística → OS (4 abas: Abrir, Em Aberto, Executadas, Canceladas) | Gerencial, Logistica, Faturamento, Comercial 2 |
| `/escala` | Logística → Escala (Abertas, Executadas, Canceladas) | idem |
| `/agenda` | Logística → Agenda (agendamento-servicos por veículo) | Gerencial, Logistica, Comercial 2/3 |
| `/medicao` | Financeiro → Medição (abas: Precificar, Status da Medição, Finalizadas, Canceladas) | Gerencial, Faturamento |
| `/faturamento` | Financeiro → Faturamento | Gerencial, Faturamento |
| `/contas-a-receber` | Financeiro → Contas a Receber (Cadastro, Receber, Recebidos, Cancelados) | Gerencial, Faturamento |
| `/contas-a-pagar` | Financeiro → Contas a Pagar | vários |
| `/administracao-*` | Cadastros (clientes, fornecedores, empresas, centro-custo, naturezas, equipamentos, responsabilidades, acessórios, usuários, cargos, veículos, funcionários) | por cadastro |
| `/relatorio-*` | Relatórios (proposta, ordem, escala, medição, faturamento, contas a receber/pagar, gestão) | por área |

---

## 2. Enums — máquina de estados completa (`nhidro.strapi/utils/enums.js`)

**Todos os status são INTEGER no banco.** Cópia idêntica no front em `src/utility/enum/Enums.js`.

```
TipoFaturamento (cliente): 1=OrçamentoFechado 2=Semanal 3=Quinzenal 4=Mensal 5=CadaExecução 6=PagamentoAntecipado
StatusPropostas:   0=Cancelado 1=Aberta 2=Aprovada 3=Reprovada 4=Revisada
StatusOrdens (OS): 0=Cancelado 1=Aberta 2=Executada        ← (schema tem default 4, herança do enum antigo Enum_StatusOS; front sempre grava 1 explicitamente)
StatusEscalas:     0=Cancelado 1=Aberta 2=Executada
StatusOperacional (escala-funcionario): 0=Nenhum 1=Férias 2=Atestado 3=Pátio 4=BancoHoras
StatusAgendamentos: 1=Agendado 2=Confirmado 3=Viagem 4=Manutenção
StatusPrecificacao (na OS): 0=EmAberto 1=Precificada 2=EmMedicao 3=Cancelado 4=Todos(filtro)
StatusMedicao:     0=Cancelado 1=EmAberto 2=Conferencia 3=Validada 4=EmAprovacao 5=Aprovada 6=AprovadaParcialmente 7=Reprovada
StatusFaturamento: 0=Cancelado 1=EmAberto 2=Emitido 3=Processando 4=Falha 5=Enviado
StatusContasReceber: 0=Cancelado 1=EmAberto 2=Pendente(=Aguardando Receb.) 3=RecebidoParcial 4=Recebido 5=EmCorrecao
StatusParcelaReceber: 0=Pendente 1=Parcial 2=Recebido
TiposCobranca: 1=Hora 2=Diária 3=Frete
TipoResponsabilidade/Responsavel: 1=Contratado 2=Contratante 3=Ambos
```

⚠️ **Inconsistência interna do sistema antigo:** `Enum_DiasBaseSemanal` define Domingo=1…Sábado=7,
mas o SQL de `buscar_precificacao` interpreta `dia_base_semanal` com CASE 0=Domingo…6=Sábado
(padrão JS `Date.getDay()`). Os dados gravados seguem o padrão **0–6** (front usa `moment().day()`).

---

## 3. Fluxo completo — comportamento por etapa

### 3.1 Cliente (`/administracao-clientes`)
- **Endpoints custom:** `GET /api/cliente/buscar-clientes`, `POST /api/cliente/cadastrarCliente`,
  `POST /api/cliente/atualizarCliente`, `GET /api/cliente/get-role/:userId`, `POST /api/cliente/enviar-email`.
- Schema `clientes` (campos *PascalCase* no Strapi, *snake_case* nas tabelas):
  - Identificação: `RazaoSocial`, `NomeFantasia`, `TipoPessoa` (int), `Cnpj`, `Cpf`, `Ie`, `Rg`,
    `InscricaoMunicipal`, `CodigoMunicipio`, `Segmento`, `ClienteCodigo` (código do sistema legado SQL Server).
  - Endereço: `Endereco/Numero/Complemento/Bairro/Cep/EstadoSigla/Cidade/PontoReferencia` (todos string).
  - **Faturamento (controla o ciclo de medição!):** `TipoFaturamento` (enum 1–6),
    `DiaBaseSemanal` (0–6), `DiaBaseQuinzenalInicio/Final`, `DiaBaseMensal`, `DiasVencimento`,
    `PorcentagemRL` (decimal **fração 0–1**, ex.: 0.3 = 30%), `CTE` (bool), `AniversarioReajuste` (date).
  - Cobrança/portal: `LinkPortal`, `UsuarioPortal`, `SenhaPortal` (texto puro!), `ObservacaoCobranca`.
  - Relações: `Empresa` (1:1), `Contatos` (1:N → tabela `contatos`), `Vendedor` (user N:1),
    `Integracoes` (1:N cliente-integracao), `HistoricosContato`, `ClienteDocumentos`.
  - `Bloqueado` (bool) + `DataDesbloqueio`.
- **Comportamento do cadastro:** service cria o cliente, depois cria cada Contato e
  Integração separadamente e re-`update` o cliente com os arrays. Na alteração,
  contatos com `id>0` são atualizados; integrações são **deletadas e recriadas** (IDs mudam).

### 3.2 Proposta (`/proposta`)
- **Endpoints:** `POST /api/propostas/cadastrar`, `/alterar`, `/enviar` + core CRUD (`GET /api/propostas`, `PUT /api/propostas/:id`).
- **Numeração:** `Codigo` = `MAX(Codigo)+1` (não é autoincrement do banco!). `Revisao` começa em 0/1.
- **Revisão:** `cadastrar` com `ehRevisao=true` → busca última revisão pelo `Codigo`,
  marca-a como `Status=4 (Revisada)` e cria nova linha com `Revisao+1`. (Histórico = várias linhas com mesmo Codigo.)
- Relacionados (`Acessorios`, `PropostaEquipes` [Cargo+Quantidade+Equipamento],
  `PropostaResponsabilidades` [Responsabilidade+Responsavel 1/2/3],
  `PropostaEquipamentos` [Equipamento, TipoCobranca 1/2/3, ValorCobranca, HorasDiaria,
  HoraAdicional, UsoPrevisto, ValorMobilizacao, ValorTotal, Area, Quantidade]) —
  todos salvos com padrão **delete + recreate** a cada save.
- Ao salvar gera PDF da proposta (`gerarRelatorioProposta`) e grava `UrlArquivo`/`NomeArquivo` (Azure).
- **Envio:** e-mail para `Contato.Email` (lower case) com cópia para `EmailCopia` (split por `;`),
  **sempre + `bruno@nacionalhidro.com.br`** (hardcoded) e o e-mail do usuário logado;
  se `NaoEnviarEmail=true` envia só para o próprio usuário. Sucesso → `Enviada=true`.
- Aprovação/Reprovação/Cancelamento: feitos pelo front via `PUT /api/propostas/:id` core,
  gravando `Status` + `DataStatus`/`DataCancelamento`/`MotivoCancelamento`/`MotivoReprovacao`.
- Campos de auditoria: `CriadoPor`/`DataCriacao`, `AlteradoPor`/`DataAlteracao` — gravados pelo FRONT (new Date()).

### 3.3 Ordem de Serviço (`/ordem-servico`)
- **Endpoints:** `POST /api/ordem-servicos/cadastrar`, `/alterar`, `/buscar`, `/buscar-propostas`,
  `/imprimir`, `/visualizar`, `/precificar`, `/verificar-pendencias` + core `PUT /api/ordem-servicos/:id`.
- **Abertura:** aba "Abrir" lista **propostas Aprovadas e não inativas** (`buscar_propostas`,
  range por `data_proposta`). Ao abrir OS:
  - `Codigo` = `Proposta.Codigo` (OS herda o código da proposta);
  - `Numero` = último Numero da proposta + 1 (sequencial por proposta → identidade "Codigo/Numero");
  - `Status` = 1 (Aberta), copia Empresa/Cliente/Contato da proposta.
- **Replicação em lote (front, `cadastrarOrdemEmLote`):** intervalo `DataInicial[0..1]` →
  itera dia a dia; se `DiasSemana` informado, só cria nos dias marcados (`value` = `moment().day()` 0–6);
  `QuantidadeDia` > 1 replica N vezes por dia. Cada réplica = um `POST /cadastrar` separado, `Numero` incrementando.
- **Escala embutida no save da OS (service `salvarDados`):**
  - OS cancelada → escala vinculada vira `Status=0 (Cancelado)`;
  - Escala existente → **deleta todos os agendamento-servicos da escala**, deleta+recria
    `EscalaVeiculos`/`EscalaFuncionarios`, recria 1 `agendamento-servico` POR VEÍCULO
    (Status = 4 Manutenção se `veiculo.Manutencao`, senão 2 Confirmado), update na escala;
  - Escala nova (tem funcionários ou veículos) → cria escala `Status=1 Aberta` herdando
    Cliente/Empresa/Data(=DataInicial)/Hora(=HoraInicial) da OS + agendamentos por veículo.
- `Servicos` da OS (tabela `servicos`: Discriminacao, TipoPrecificacao, ValorUnitario, Quantidade,
  ValorHora, ValorExtraHora, ValorTotal, ServicosHorasAdicionais) → delete + recreate a cada save.
- **Fechamento ("baixa") da OS:** front grava `Status=2 (Executada)`, `DataBaixa=new Date()`,
  `BaixadoPor=user` + campos de hora. Cálculo no front (ModalBaixarOrdem/ModalCadastroOrdem):
  `HoraTotal/HoraAdicional` derivados de `HoraEntrada, HoraSaida, HoraAlmoco, HoraTolerancia, HoraPadrao`:
  `total = (saida-entrada) - (almoco+tolerancia)`; se `total <= padrao` → HoraTotal=padrao, adicional=0;
  senão HoraTotal=padrao e HoraAdicional=total-padrao. **Todas as horas são `time` enviadas como
  string `"HH:mm:ss.SSS"`** (`moment(x,"HH:mm").format("HH:mm:ss.SSS")`).
  - Baixa individual → `POST /alterar` (passa pelo service e mexe na escala).
  - **Baixa em lote → `PUT /api/ordem-servicos/:id` (rota core)** com só os campos de hora/status —
    NÃO passa pelo service (escala/agendamentos não são tocados).
  - Após baixar, o service responde com lista de OSs da mesma proposta ainda Abertas no
    período (DataMin/DataMax) → front mostra alerta "ordens pendentes: Codigo/Numero; …".
- Cancelamento → `Status=0`, `MotivoCancelamento`, `DataCancelamento` (via `/alterar`, cancela a escala junto).

### 3.4 Escala (`/escala`) e Agenda (`/agenda`)
- **Endpoints:** `POST /api/escalas/cadastrar`, `/alterar` + core GET; agendamentos:
  `POST /api/agendamento-servicos/cadastrar`, `/alterar`, `/deletar` + core GET.
- Escala pode ser criada avulsa (sem OS) pela tela de Escala, ou junto da OS (1:1 `OrdemServico`).
- `EscalaFuncionarios`: Funcionario + `StatusOperacao` (0–4) + `Ausente` (bool).
- `EscalaVeiculos`: Veiculo + `Manutencao` (bool).
- Em toda alteração: filhos deletados e recriados; agendamentos da escala são apagados e
  recriados a partir dos veículos (1 agendamento por veículo, Data/Hora da escala).
  Escala cancelada não recria agendamentos.
- Agenda mostra os `agendamento-servicos` (por veículo/dia) — é uma projeção da escala.

### 3.5 Precificação (aba "Precificar" em `/medicao`)
- `POST /api/medicoes/buscar-precificacao` → lista **OSs Executadas** (status=2) no intervalo,
  com **filtro fixo `data_inicial >= '2023-07-10'`** (hardcoded), calculando o "período de medição"
  pelo `tipo_faturamento` do cliente (Semanal/Quinzenal/Mensal/Cada Execução).
- Precificar (ModalPrecificacao) → `POST /api/ordem-servicos/precificar` grava na própria OS:
  `PrecificacaoTotalServico`, `PrecificacaoTotalHora`, `PrecificacaoValorExtra`,
  `PrecificacaoDesconto`, `PrecificacaoValorTotal`, `PrecificacaoObservacao`, `DataPrecificacao`,
  `StatusPrecificacao = 1 (Precificada)` — e salva ServicosHorasAdicionais (delete+recreate).
- Se a OS já estava `EmMedicao (2)`, o service **recalcula a medição vinculada**: soma das OSs →
  `TotalServico, TotalHora, Adicional, Desconto`; `ValorRL = totalCobranca * (PorcentagemRL/100)`;
  `ValorServico = totalCobranca - ValorRL`; `ValorCte = ValorTotal = totalCobranca`.
- "Corrigir" (seta ←) volta a OS para precificação (PUT core).

### 3.6 Medição (`/medicao`)
- **Endpoints:** `POST /api/medicoes/cadastrar`, `/alterar`, `/cancelar`, `/enviar`, `/reprovar`,
  `/aprovar`, `/imprimir`, `/buscar`, `/buscar-precificacao`, `/buscar-por-cliente`,
  `/buscar-relatorio` + core `PUT /api/medicoes/:id`.
- **Criação (ModalNovaMedicao):** seleciona OSs Precificadas de UM cliente. `Codigo` = MAX+1
  (**começa em 1000**), `Revisao` inicial, `Status=1 EmAberto`.
  `PorcentagemRL` default = `Cliente.PorcentagemRL * 100` (cliente guarda fração, medição guarda **percentual 0–100**).
  Totais = soma das precificações das OSs (igual 3.5). OSs viram `StatusPrecificacao=2 (EmMedicao)`.
- **Máquina de estados (quem grava o quê):**
  1. `EmAberto (1)` → botão envia p/ conferência: `Status=2`, `DataConferencia=now` (via `/alterar`).
     Se tem `Vendedor`, **e-mail automático ao vendedor** com PDF da medição (cópia financeiro@ e bruno@ hardcoded).
  2. `Conferencia (2)` → validar: `Status=3 (Validada)`, `DataAprovacaoInterna=now`.
     Ou "solicitar correção" → volta `Status=1`.
  3. `Validada (3)` → **enviar ao cliente** (`/enviar`): e-mail ao `Contato.Email` + `EmailCopia`
     (split `;`) + financeiro@; PDF anexo; depois grava `Status=4 (EmAprovacao)` e `DataCobranca=now`.
  4. `EmAprovacao (4)` → **aprovar cobrança** (`/aprovar`, ModalAprovarCobranca):
     usuário cola a IMAGEM da aprovação do cliente (print de e-mail) num campo Quill;
     front extrai o base64, manda `Imagem{Buffer,FileName(uuid),Type}`;
     `SaldoDevedor` default = `valor_total - valor_aprovado`; pode aprovar parcial.
     `ValorAprovado += SaldoDevedor`; se `ValorAprovado >= ValorTotal` → `Status=5 (Aprovada)` +
     `DataAprovacao=now`, senão `Status=6 (AprovadaParcialmente)`.
     **Backend cria os FATURAMENTOS** (ver 3.7).
  5. Reprovar cobrança (`/reprovar`): `Status=7 (Reprovada)` + `DataAprovacao`, e cria
     **nova medição** com os mesmos dados, `Status=1`, `Revisao+1`, datas de
     conferência/aprovação/cobrança zeradas (mesmo `Codigo`).
  6. Cancelar (`/cancelar`): `Status=0` + motivo; OSs voltam para `StatusPrecificacao=1 (Precificada)`.
  - `alterar` também aceita `OrdensRemovidas` (array de IDs) → essas OSs voltam a Precificada.
- **Cron de cobrança (prod, seg–sex 08:30 BRT):** medições `EmAprovacao` ou `AprovadaParcialmente`
  com `DataCobranca < hoje-3d` → reenvia e-mail de cobrança com PDF ao contato (até 50 por rodada,
  1,5s entre envios) e atualiza `DataCobranca=now`.

### 3.7 Faturamento (`/faturamento`)
- **Criado automaticamente pela aprovação da medição:**
  - `Cte=true` → 1 faturamento `TipoFatura='CTE'`, `ValorTotal=ValorRateado=ValorLiquido=SaldoDevedor`;
  - senão → até 2 faturamentos: `'NF'` com `ValorRateado=ValorServicoFatura` e/ou
    `'RL'` com `ValorRateado=ValorRLFatura` (ValorTotal de ambos = SaldoDevedor).
  - Todos `Status=1 (EmAberto)`, com `UrlImagemAprovacao` (imagem salva no Azure), Cliente, Empresa, Medicao.
- **Endpoints:** `POST /api/faturamentos/gerar`, `/enviar`, `/cancelar`, `/clonar`, `/buscar`,
  `/buscar-por-cliente`, `/buscar-relatorio`, `/emitir-nfs`, `/consultar-nfse`,
  webhooks `POST /api/faturamentos/focus-webhook-nfse` e `/focus-webhook-cte`.
- **Gerar:**
  - Salva campos editáveis (`DadosFaturamento` JSON com o payload da nota, datas, impostos
    ValorIss/Inss/Ir/Pis/Cofins/Csll, ValorLiquido, EmpresaBanco…), saneando decimais vazios → null.
  - `NF` → POST Focus `/v2/nfse?ref=fat_{id}_{timestamp}` (auth = FocusToken da empresa);
    regras: `natureza_operacao` 1/2 conforme município tomador × prestador, `iss_retido`, soma itens.
    → `Status=3 (Processando)`; webhook NFS-e atualiza p/ `2 Emitido` (autorizado) ou `4 Falha`,
    gravando `Nota=data.numero`, `UrlArquivoNota=data.url`, `DadosWebHook`.
  - `CTE` → POST Focus `/v2/cte?ref=…` (remove campos de cliente do payload, anexa dados bancários
    na observação) → Processando; webhook CT-e idem (com retry de 8s se ref ainda não achada),
    `UrlArquivoNota=caminho_dacte`.
  - `RL` (recibo de locação) → **numeração própria**: `Nota = MAX(nota de RL da empresa)+1`,
    formatada `padStart(4,'0')`; gera PDF interno (`gerarRelatorioLocacao`) → `Status=2 (Emitido)` direto.
  - `consultar-nfse` permite re-sincronizar status na Focus manualmente (fallback do webhook).
- **Enviar:** e-mail ao contato (+EmailCopia+financeiro@) com PDF da nota e XML (NF/CTE) →
  `Status=5 (Enviado)`, `DataEnvio=now`.
- **Cancelar:** DELETE na Focus (justificativa fixa "Servico Nao Prestado"); se falhar,
  e-mail de alerta ao financeiro pedindo cancelamento manual. RL/EmAberto cancela só localmente.

### 3.8 Contas a Receber (`/contas-a-receber`) — a "baixa" final
- **Endpoints:** `POST /api/contas-receber/adicionar`, `/alterar`, `/receber`, `/buscar`,
  `/buscar-parcelas`, `/buscar-por-cliente`, `/buscar-relatorio`,
  `GET /api/contas-receber/validar-nota/:nota/:empresa/:tipo` + core PUT (cancelar/corrigir/enviar)
  e `PUT /api/conta-recebimento-parcelas/:id` (editar parcela).
- **Cadastro:** tela lista **faturamentos `Enviado (5)`** sem conta cadastrada (alerta).
  `adicionar` cria a conta `Status=1 (EmAberto)` com `Nota`, `TipoFatura`, `DataEmissao`,
  `ValorTotal`, `ValorBruto`, impostos, rateios `ContaCentrosCustos` e `ContaNaturezasContabeis`
  (com valor por centro/natureza) e o plano de parcelas:
  `ContaRecebimento {QuantidadeParcela, ValorParcela}` → N `ContaRecebimentoParcela
  {NumeroParcela, ValorParcela, DataVencimento, StatusRecebimento=0 Pendente, DataVencimentoReal}`.
  - **`DataVencimentoReal`**: vencimento caindo em sábado → +2 dias; domingo → +1 dia (cálculo UTC).
  - Vincula `Faturamento` e marca no faturamento `StatusRecebimento='Cadastrado'` (campo STRING).
  - `validar-nota` impede duplicar Nota+Empresa+Tipo em faturamentos/contas não cancelados.
- **Enviar p/ recebimento:** front faz PUT core com `Status=2 (Pendente)` + `DataEnvio=now`.
- **Receber parcela (baixa) — `POST /api/contas-receber/receber`:**
  - Front monta `ParcelaRecebimento {EmpresaBanco, FormaPagamento(int), Valor, TaxaJuros,
    ValorOperacao, Antecipar(bool), DataRecebimento, Observacao, UsuarioBaixa=email do usuário}`;
    atualiza a parcela: `ValorAReceber = (ValorAReceber + ValorAcrescimo - ValorDecrescimo) - Valor`
    (se `Antecipar` → 0), `DataVencimentoReal = DataRecebimento`.
  - Backend: cria o `parcela-recebimento`, soma `ValorRecebido += Valor`,
    `StatusRecebimento = ValorAReceber==0 ? 2 Recebido : 1 Parcial`.
  - Se a parcela ficou Recebida **e** `NumeroParcela == QuantidadeParcela` →
    conta `Status=4 (Recebido)` + `DataRecebimento=now`. (Observação: a regra olha a ÚLTIMA
    parcela, não "todas recebidas".)
- Correção: `Status=5 (EmCorrecao)` volta a aparecer na aba de cadastro p/ editar.
- Relatórios: simplificado, recebidas (com dias em aberto), competência, por centro de custo,
  por natureza, atraso (`DATEDIFF(CURDATE(), data_vencimento_real)`), antecipado (juros),
  **ciclo operacional** (`DATEDIFF(data_recebimento, created_at da medição)` — mede o ciclo
  medição→recebimento).

### 3.9 Cron jobs (produção — `config/env/production/cron-tasks.js`)
| Job | Quando | O que faz |
|---|---|---|
| `cobrancaAutomatica` | Seg–Sex 08:30 BRT | `medicao.cobranca_automatica()` (ver 3.6) |
| `dailyBackup` | Seg–Sex 07:00 BRT | plugin `strapi-plugin-akatecnologia` → dump gzip → S3 |

---

## 4. Formatos de dados — CHECKLIST para a migração (MySQL/Strapi → novo banco)

Estes são os pontos onde dado migrado "fora de formatação" costuma quebrar o sistema novo:

1. **Horas como string `"HH:mm:ss.SSS"`** — todos os campos `time` da OS
   (`HoraInicial, HoraEntrada, HoraSaida, HoraAlmoco, HoraTolerancia, HoraPadrao, HoraTotal, HoraAdicional`),
   da escala (`Hora`) e `servico_hora_adicionals.Horas`. O front SEMPRE envia com
   `.format("HH:mm:ss.SSS")` — no MySQL ficam como TIME `HH:MM:SS.000`.
2. **`date` vs `datetime` misturados** — `DataInicial/DataProposta/DataValidade/DataVencimento/
   DataVencimentoReal/Data` são DATE puro; `DataCriacao/DataAlteracao/DataBaixa/DataCobranca/
   DataAprovacao/DataConferencia/DataRecebimento/DataEnvio/DataEmissao` são DATETIME (gravados
   pelo front com `new Date()` → UTC). Cuidado com shift de timezone (-3h) ao migrar p/ timestamptz.
   ⚠️ `proposta.DataStatus` e `proposta.DataCancelamento` são DATE; `ordem.DataCancelamento` é DATETIME;
   `escala.DataCancelamento` é DATE. Inconsistente entre módulos.
3. **`PorcentagemRL` tem DUAS semânticas:** `clientes.porcentagem_rl` = **fração (0–1)**;
   `medicoes.porcentagem_rl` e `propostas.porcentagem_rl` = **percentual (0–100)**.
   O front converte na criação da medição (`Cliente.PorcentagemRL * 100`).
4. **Numerações por MAX+1 (não autoincrement):** `propostas.Codigo`, `medicoes.Codigo`
   (base 1000), `ordem.Numero` (sequencial POR proposta; `ordem.Codigo` = código da proposta),
   `faturamentos.Nota` p/ RL (MAX por empresa, `padStart(4,'0')` → STRING com zeros à esquerda).
   Migração precisa preservar esses contadores ou o próximo registro colide.
5. **Identidade composta visual:** OS = `Codigo/Numero`; Medição = `Codigo | Revisao`;
   Proposta = `Codigo` + `Revisao` (revisões antigas ficam com Status=4).
6. **Status = INTEGER** com os mapas da seção 2 — migrar para enums/strings exige tabela de-para exata.
7. **`faturamentos.StatusRecebimento` é STRING** (`'Cadastrado'` ou null) — não confundir com os ints.
8. **`TipoFatura` é STRING:** `'NF' | 'RL' | 'CTE'`.
9. **JSONs:** `faturamentos.DadosFaturamento` (payload completo da Focus) e `DadosWebHook`
   (retorno) são colunas JSON — contêm snake_case da API Focus.
10. **Relacionamentos via tabelas `_links` do Strapi** (`ordem_servicos_proposta_links`,
    `medicoes_cliente_links`, `contas_receber_conta_recebimento_links`, etc.). Migrar para FK
    direta exige join nessas tabelas — registro sem linha no `_links` = relação NULL.
11. **Filhos recriados a cada save (delete+recreate):** IDs de `contatos`, `acessorios`,
    `proposta_*`, `escala_*`, `servicos`, `conta_centros_custos`, `conta_naturezas_contabeis`
    NÃO são estáveis no tempo — não usar como chave de migração incremental.
12. **Strings monetárias:** valores são DECIMAL no MySQL; front usa NumberFormat pt-BR.
    `null` vs `0` importam (o service de faturamento converte `"" → null` explicitamente).
13. **CNPJ/CPF/CEP/telefones são VARCHAR sem máscara padronizada** (alguns com pontuação, outros sem).
14. **E-mails:** `Contato.Email` é usado `.toLowerCase()` no envio; `EmailCopia` é string única
    separada por `;`.
15. **`DiaBaseSemanal` segue 0=Domingo…6=Sábado** (padrão JS), apesar do enum dizer o contrário.
16. **Charset:** banco `utf8mb4_unicode_ci`. (Dados vindos do SQL Server legado podem ter
    resquícios CP1252 — ver memória `wp-cp1252-double-encoding` para gotcha análogo.)
17. **Filtro hardcoded:** precificação só considera OS com `data_inicial >= 2023-07-10`.
18. **Default `Status=4` no schema da OS** — qualquer insert que não informe Status ganha 4
    (valor sem significado no enum atual). Registros antigos podem ter status 3/4 do enum legado
    (`Enum_StatusOS`: 1=Baixar 2=Cancelado 3=Cobrar 4=Aprovar).

---

## 5. Fragilidades conhecidas do sistema antigo (úteis p/ validar o que o novo deve corrigir)

- **SQL injection**: todas as buscas raw interpolam `params` direto na string (datas, status, ids).
- **Baixa em lote da OS via PUT core** pula o service (escala/agendamentos não acompanham).
- **Sem transações**: criação de proposta/OS/medição faz N inserts sequenciais — falha no meio
  deixa órfãos (ex.: proposta sem PDF, escala sem agendamento).
- **Cálculo de horas no front** (não no back) — duas telas implementam a mesma fórmula.
- E-mails hardcoded (`bruno@nacionalhidro.com.br`, `financeiro@nacionalhidro.com.br`).
- `SenhaPortal` do cliente em texto puro.
- Permissões de rota por array de roles no front; rotas custom do Strapi sem policies
  (`policies: []`) — segurança efetiva só no plugin users-permissions.
- Regra de conclusão da conta a receber olha a última parcela, não todas.
- Webhook CT-e com `sleep(8s)` para race condition (gambiarra conhecida).

---

## 6. Resumo do fluxo (visão de uma linha)

```
Cliente (TipoFaturamento, PorcentagemRL, CTE, dias-base)
  → Proposta (Codigo MAX+1, Revisao, equipamentos/equipe/responsabilidades, PDF, e-mail)
    → [Status 2 Aprovada]
      → OS (Codigo=proposta, Numero seq., replicação por dias, Escala+Agendamentos embutidos)
        → Baixa da OS (Status 2 Executada + horas → HoraTotal/HoraAdicional)
          → Precificação (valores na própria OS, StatusPrecificacao 1)
            → Medição (agrupa OSs do cliente, Codigo≥1000, EmAberto→Conferência→Validada→
               enviar→EmAprovacao→Aprovada/Parcial; reprovação = nova revisão)
              → Faturamento (CTE 100% | NF+RL conforme rateio; Focus NFe; RL interno;
                 webhooks → Emitido → enviar → Enviado)
                → Conta a Receber (EmAberto→Pendente; parcelas com DataVencimentoReal)
                  → Baixa da parcela (ParcelaRecebimento; Recebido/Parcial; última parcela
                     → conta Recebido + DataRecebimento)
```
