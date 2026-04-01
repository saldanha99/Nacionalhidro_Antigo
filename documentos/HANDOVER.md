# Nacional Hidro — Documentação de Handover

Guia completo para configuração e manutenção do sistema após a transferência de responsabilidade.

---

## Sumário

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Requisitos de Infraestrutura](#2-requisitos-de-infraestrutura)
3. [Variáveis de Ambiente — Backend](#3-variáveis-de-ambiente--backend)
4. [Variáveis de Ambiente — Frontend](#4-variáveis-de-ambiente--frontend)
5. [Banco de Dados](#5-banco-de-dados)
6. [Serviços Externos](#6-serviços-externos)
7. [Deploy](#7-deploy)
8. [Comandos Essenciais](#8-comandos-essenciais)
9. [Rotinas Automáticas (Cron Jobs)](#9-rotinas-automáticas-cron-jobs)
10. [Checklist de Primeiro Acesso](#10-checklist-de-primeiro-acesso)

---

## 1. Visão Geral da Arquitetura

O sistema é composto por dois projetos independentes:

| Componente | Tecnologia | Diretório |
|---|---|---|
| **Frontend** | React 18 SPA (Vuexy template) | `nhidro.front/` |
| **Backend** | Strapi 4.7.0 (Headless CMS) | `nhidro.strapi/` |
| **Banco Principal** | MySQL | Servidor de produção |
| **Banco Legado** | SQL Server (Azure) | Integração com sistema antigo |
| **Armazenamento** | Azure Blob Storage | Documentos e relatórios |
| **E-mail** | AWS SES (produção) / Gmail SMTP (dev) | Envio de medições, cobranças |
| **Backup** | AWS S3 | Backup automático diário |
| **Notas Fiscais** | Focus NFe (API externa) | Emissão de NFS-e e CT-e |

---

## 2. Requisitos de Infraestrutura

### Backend (VM/Servidor)
- **Node.js** 12–16 (recomendado: 16 LTS)
- **MySQL** 5.7+ ou 8.0
- **PM2** (gerenciador de processos Node.js)
- Porta padrão: **1337**

### Frontend
- **Node.js** 14+ (para build)
- Servido como site estático (Azure Blob Storage `$web` container ou outro CDN/hosting)

---

## 3. Variáveis de Ambiente — Backend

O backend utiliza variáveis de ambiente em dois formatos:
- `env('NOME')` — Helper do Strapi nos arquivos de `config/`
- `process.env.NOME` — Referência direta no código de `src/`

As variáveis devem ser configuradas no arquivo `.env` na raiz de `nhidro.strapi/` ou diretamente no ambiente do servidor.

### Strapi Core

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `JWT_SECRET` | Sim | Chave secreta para assinatura de tokens JWT dos usuários | `b3f8a2c1-9d4e-4f6a-8b2c-1a3e5f7d9b0c` |
| `API_TOKEN_SALT` | Sim | Salt para geração de API tokens do Strapi | `a1b2c3d4e5f6a7b8c9d0e1f2` |
| `TRANSFER_TOKEN_SALT` | Sim | Salt para tokens de transferência do Strapi | `randomStringAqui==` |
| `ADMIN_JWT_SECRET` | Sim | Chave secreta para autenticação do painel admin | `outraChaveSecretaAqui123` |
| `URL` | Não | URL pública do backend | `https://api.seudominio.com.br` |
| `HOST` | Não | Host de bind do servidor (default: `0.0.0.0`) | `0.0.0.0` |
| `PORT` | Não | Porta do servidor (default: `1337`) | `1337` |

> Para gerar secrets seguros, use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Banco de Dados MySQL (Principal)

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `DATABASE_HOST` | Sim | Host do MySQL | `localhost` ou `db.seudominio.com.br` |
| `DATABASE_PORT` | Não | Porta (default: `3306`) | `3306` |
| `DATABASE_NAME` | Não | Nome do banco (default: `nhidro`) | `nhidro` |
| `DATABASE_USERNAME` | Sim | Usuário do MySQL | `nhidro` |
| `DATABASE_PASSWORD` | Sim | Senha do MySQL | `suaSenhaSegura` |
| `DATABASE_SSL` | Não | SSL habilitado (default: `true`) | `true` |

### Banco de Dados SQL Server (Integração Legado)

Utilizado para integração com o sistema antigo. Se não for necessário, pode ser desativado.

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `SQLSERVER_HOST` | Condicional | Host do SQL Server | `servidor.database.windows.net` |
| `SQLSERVER_DATABASE` | Condicional | Nome do banco | `NacionalHidro` |
| `SQLSERVER_USER` | Condicional | Usuário | `usuario` |
| `SQLSERVER_PASSWORD` | Condicional | Senha | `senhaSegura` |

### AWS — E-mail (SES)

O envio de e-mails em produção utiliza Amazon SES.

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `AWS_SES_ACCESS_KEY_ID` | Sim (prod) | Access Key do IAM com permissão SES | `AKIA...` |
| `AWS_SES_SECRET_ACCESS_KEY` | Sim (prod) | Secret Access Key correspondente | `abc123...` |

> O remetente (`sistema@nacionalhidro.com.br`) precisa estar verificado no SES.

### AWS — Backup (S3)

O plugin de backup automático envia arquivos para o S3.

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `AWS_ACCESS_KEY_ID` | Sim | Access Key do IAM com permissão S3 | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Sim | Secret Access Key correspondente | `xyz789...` |

> Pode ser o mesmo par de chaves do SES se o IAM tiver ambas permissões.

### Azure Blob Storage

Armazenamento de documentos, relatórios e arquivos do sistema.

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `AZURE_STORAGE_CONNECTION_STRING` | Sim | Connection string completa da Storage Account | `DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net` |

> Obtido no Portal Azure: Storage Account > Access keys.

### E-mail SMTP (Desenvolvimento)

Usado no Strapi email plugin (alternativa ao SES para dev/staging).

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `SMTP_USER` | Não (dev) | Usuário SMTP (ex: Gmail) | `email@gmail.com` |
| `SMTP_PASS` | Não (dev) | Senha de app SMTP | `abcdefghijklmnop` |
| `EMAIL_FROM` | Não | Remetente padrão | `Sistema <noreply@nacionalhidro.com.br>` |

> Para Gmail, gere uma "Senha de App" em myaccount.google.com > Segurança > Senhas de app.

---

## 4. Variáveis de Ambiente — Frontend

Configuradas nos arquivos `.env`, `.env.staging` e `.env.production` na raiz de `nhidro.front/`.

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `REACT_APP_BACKEND_URL` | Sim | URL base do backend (com `/` no final) | `https://api.seudominio.com.br/` |
| `REACT_APP_JWT_SECRET` | Sim | Mesma chave `JWT_SECRET` do backend | `b3f8a2c1-9d4e-4f6a-8b2c-1a3e5f7d9b0c` |
| `REACT_APP_PUBLIC_PATH` | Não | Path público da aplicação | `""` |
| `REACT_APP_BASENAME` | Não | Base path para o React Router | `""` |
| `SKIP_PREFLIGHT_CHECK` | Não | Pular verificação do Webpack (manter `true`) | `true` |

> **IMPORTANTE:** `REACT_APP_JWT_SECRET` deve ser **idêntica** ao `JWT_SECRET` do backend, pois ambos compartilham a mesma chave para verificação de tokens.

---

## 5. Banco de Dados

### MySQL (Banco Principal)

O Strapi gerencia o schema automaticamente. Ao conectar a um banco vazio pela primeira vez, ele cria todas as tabelas necessárias.

**Para restaurar a partir de um backup:**

```bash
mysql -u usuario -p nome_do_banco < backup.sql
```

**Entidades principais (50+ módulos):**

| Entidade | Tabela | Descrição |
|---|---|---|
| Cliente | `clientes` | Cadastro de clientes |
| Equipamento | `equipamentos` | Equipamentos |
| Ordem de Serviço | `orden_servicos` | Ordens de serviço |
| Conta | `contas` | Contas a pagar/receber |
| Faturamento | `faturamentos` | Notas fiscais e CT-e |
| Funcionário | `funcionarios` | Equipe |
| Serviço | `servicos` | Catálogo de serviços |
| Proposta | `propostas` | Propostas comerciais |
| Medição | `medicoes` | Medições de serviço |
| Escala | `escalas` | Escalas de trabalho |
| Empresa | `empresas` | Empresas do grupo |
| Veículo | `veiculos` | Frota |

### Backup do Banco de Dados

Junto com este documento é entregue o arquivo `nhidro_prod_20260331.sql.gz` — backup completo do banco de produção gerado em 31/03/2026 (compactado com gzip, ~23 MB).

**Para restaurar o backup em um novo servidor MySQL:**

```bash
# 1. Criar o banco (se ainda não existir)
mysql -u usuario -p -e "CREATE DATABASE nhidro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Restaurar o backup
gunzip < nhidro_prod_20260331.sql.gz | mysql -u usuario -p nhidro
```

**Para gerar um novo backup manualmente:**

```bash
# Via SSH no servidor de produção
mysqldump -u root -p --single-transaction --routines --triggers nhidro | gzip > nhidro_backup_$(date +%Y%m%d).sql.gz
```

> O sistema já possui backup automático diário via cron job (seção 9), enviado para AWS S3. Este backup manual é fornecido para a transição.

### SQL Server (Legado)

Conexão opcional com o sistema antigo para migração de dados. Configurado em `src/api/sql-server/`.

---

## 6. Serviços Externos

### Focus NFe — Emissão de Notas Fiscais

O sistema integra com a plataforma Focus NFe para emissão de NFS-e e CT-e.

- **Portal:** https://app-v2.focusnfe.com.br
- **Documentação API:** https://focusnfe.com.br/doc/
- **Webhook de retorno (NFS-e):** `POST /api/faturamentos/focus-webhook-nfse`
- **Webhook de retorno (CT-e):** `POST /api/faturamentos/focus-webhook-cte`

> Os webhooks devem ser configurados no painel da Focus NFe apontando para a URL pública do backend.

A chave da API Focus está armazenada no banco na tabela `configuracoes` (entidade `configuracao`, descrição `Focus_Api`).

### AWS SES — Envio de E-mails

- **Região:** `us-east-1`
- **Remetente verificado:** `sistema@nacionalhidro.com.br`
- O domínio `nacionalhidro.com.br` precisa estar verificado no SES com registros DNS (DKIM, SPF)

### Azure Blob Storage — Armazenamento de Arquivos

- Documentos, relatórios em PDF e anexos do sistema
- Organizado em containers por tipo de documento
- A connection string contém o AccountName e AccountKey necessários

---

## 7. Deploy

### Frontend

**Build:**
```bash
cd nhidro.front
npm install
npm run build              # produção
npm run build-staging      # homologação
```

O build gera a pasta `build/` com arquivos estáticos que devem ser servidos por qualquer web server ou CDN.

**Fluxo atual:** GitHub Actions on push to `main` → Build com Node 14 → Upload para Azure Blob Storage (`$web` container).

### Backend

**Build e start:**
```bash
cd nhidro.strapi
npm install
npm run build              # compila o painel admin do Strapi
npm run start-prod         # inicia em modo produção (NODE_ENV=production)
```

**Com PM2 (recomendado para produção):**
```bash
pm2 start npm --name "nhidro-strapi" -- run start-prod
pm2 save
pm2 startup                # configura para iniciar no boot
```

**Fluxo atual:** GitHub Actions on push to `homologacao` → Docker build → Azure Container Registry → Azure Web App.

---

## 8. Comandos Essenciais

### Backend (`nhidro.strapi/`)

| Comando | Descrição |
|---|---|
| `npm install` | Instalar dependências |
| `npm run dev` | Servidor de desenvolvimento com auto-reload |
| `npm run build` | Compilar painel admin do Strapi |
| `npm run start-prod` | Iniciar em produção (NODE_ENV=production) |
| `npm run start-dev` | Iniciar em homologação (NODE_ENV=staging) |
| `npm run start` | Iniciar via PM2 (produção) |
| `npm run stop` | Parar processos PM2 |

### Frontend (`nhidro.front/`)

| Comando | Descrição |
|---|---|
| `npm install` | Instalar dependências |
| `npm start` | Dev server local (usa `.env` → localhost:1337) |
| `npm run start-dev` | Dev server com `.env.development.local` |
| `npm run start-staging` | Dev server com `.env.staging` |
| `npm run build` | Build de produção |
| `npm run build-staging` | Build de homologação |
| `npm run test` | Executar testes |

### PM2 (Servidor de Produção)

| Comando | Descrição |
|---|---|
| `pm2 status` | Ver processos rodando |
| `pm2 logs` | Ver logs em tempo real |
| `pm2 logs --lines 500` | Ver últimas 500 linhas |
| `pm2 restart nhidro-strapi` | Reiniciar o backend |
| `pm2 monit` | Monitor de CPU/memória |

---

## 9. Rotinas Automáticas (Cron Jobs)

Configuradas em `config/env/production/cron-tasks.js`:

| Job | Horário | Descrição |
|---|---|---|
| **Medições em aberto** | Seg-Sex, 10h BRT | Envia e-mail automático de cobrança para clientes com medições pendentes |
| **Backup diário** | Seg-Sex, 7h BRT | Backup automático do banco com compressão, enviado para AWS S3 |

---

## 10. Checklist de Primeiro Acesso

Ao assumir o sistema, execute os passos abaixo na ordem:

### Segurança (URGENTE)

- [ ] **Rotacionar todas as credenciais** — As senhas, chaves AWS, connection strings e JWT secrets anteriores devem ser considerados comprometidos. Gere novos valores para todas as variáveis listadas neste documento.
- [ ] **Alterar senha do banco MySQL** — Tanto no servidor MySQL quanto na variável `DATABASE_PASSWORD`
- [ ] **Gerar novas chaves AWS** — Criar novo IAM user ou rotacionar as access keys existentes
- [ ] **Regenerar Azure Storage keys** — Portal Azure > Storage Account > Regenerar chaves
- [ ] **Gerar novos JWT secrets** — Usar `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] **Alterar senha do SQL Server** (se aplicável)

### Configuração

- [ ] Configurar todas as variáveis de ambiente do backend (`.env`)
- [ ] Configurar todas as variáveis de ambiente do frontend (`.env.production`)
- [ ] Garantir que `REACT_APP_JWT_SECRET` (front) = `JWT_SECRET` (back)
- [ ] Verificar se o domínio de e-mail está verificado no AWS SES
- [ ] Configurar os webhooks da Focus NFe apontando para o novo backend
- [ ] Testar envio de e-mail (medição, faturamento)
- [ ] Testar emissão de nota fiscal (NFS-e e CT-e)
- [ ] Verificar se os cron jobs de backup e medição estão funcionando

### Acesso ao Servidor

- [ ] Alterar a chave SSH de acesso à VM (se mantiver a mesma)
- [ ] Verificar se o PM2 está configurado para iniciar no boot (`pm2 startup`)
- [ ] Verificar logs: `pm2 logs --lines 100`

### DNS e Domínios

- [ ] Apontar o domínio do frontend para o novo hosting (se mudar)
- [ ] Apontar o domínio do backend/API para o novo servidor (se mudar)
- [ ] Atualizar `REACT_APP_BACKEND_URL` no frontend se a URL da API mudar

---

*Documento gerado em 30/03/2026 durante o processo de handover do sistema Nacional Hidro.*
