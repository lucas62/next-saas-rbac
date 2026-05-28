# Next.js SaaS RBAC Monorepo

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Fastify-5.8-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Turborepo-2.0-FF007A?style=for-the-badge&logo=turborepo" alt="Turborepo" />
  <img src="https://img.shields.io/badge/CASL-6.8-red?style=for-the-badge" alt="CASL RBAC" />
</p>

---

## 🚀 Resumo do Projeto & Tecnologias

Este projeto consiste em um **SaaS Multi-tenant completo** com **Controle de Acesso Baseado em Papéis (RBAC)** de altíssima performance, implementado como um monorepo gerenciado pelo [Turborepo](https://turbo.build/repo). Ele foi desenvolvido utilizando tecnologias modernas tanto no Frontend quanto no Backend, permitindo a separação limpa de responsabilidades com o máximo aproveitamento de código.

### 🛠️ Core Tech Stack & Arquitetura

1. **Monorepo (Turborepo)**: Orquestração e cache eficiente de builds, lints e tarefas nos workspaces npm (`apps/*`, `packages/*`, `config/*`).
2. **Frontend (`apps/web`)**: 
   - **Next.js 15 (App Router)** & **React 19** para renderização híbrida de alta performance.
   - **React Server Actions** combinados com o novo hook `useActionState` para gerenciamento robusto de formulários sem complexidade de estados no lado do cliente.
   - **Tailwind CSS v4** & **PostCSS** para estilizações modernas de alto nível.
   - **Base UI** (primitives acessíveis) & **Shadcn** para componentização refinada e responsiva.
   - **Ky Client** para requisições HTTP tipadas e automação de retentativas.
3. **Backend (`apps/api`)**:
   - Servidor HTTP com **Fastify 5**, garantindo latência extremamente baixa.
   - Schemas e validação de ponta a ponta (OpenAPI) usando **Zod** e **fastify-type-provider-zod**.
   - Geração automática e interativa de documentação OpenAPI em `/docs`.
4. **Controle de Acesso (`packages/auth`)**:
   - Políticas flexíveis e centralizadas através do **CASL (Role-Based Access Control)**.
   - Definição rígida de papéis (`ADMIN`, `MEMBER`, `BILLING`) e checagem fina de permissões sobre recursos (`Project`, `User`, `Organization`, etc.).
5. **Persistência & Infraestrutura**:
   - **Prisma 7** como ORM integrado com PostgreSQL e driver adapter moderno.
   - **Docker Compose** para subida rápida e padronizada do banco de dados local.

---

## 📋 Pré-requisitos

| Item    | Versão                           |
| ------- | -------------------------------- |
| Node.js | `>=18` (ver `engines` na raiz)   |
| npm     | `11.11.0` (ver `packageManager`) |
| Docker  | Para subir o PostgreSQL local    |

Recomenda-se habilitar o [Corepack](https://nodejs.org/api/corepack.html) para usar a versão de npm definida no repositório:

```bash
corepack enable
```

Instale as dependências **sempre na raiz** do monorepo. Dependências entre pacotes internos usam `"*"` (por exemplo, `@saas/auth` em `apps/api`), e não o protocolo `workspace:*`, por compatibilidade com o resolver do npm 11.


## Primeiros passos

```bash
git clone <url-do-repositorio>
cd next-saas-rbac
corepack enable   # opcional
npm install
```

### Banco de dados

O PostgreSQL sobe via Docker Compose na raiz do repositório:

```bash
docker compose up -d
```

Crie o arquivo `.env` na **raiz** do repositório (credenciais do banco alinhadas ao [`docker-compose.yml`](docker-compose.yml)). A API carrega esse arquivo via `dotenv-cli` (ver `env:load` em [`apps/api/package.json`](apps/api/package.json)):

```env
SERVER_PORT=3333
DATABASE_URL="postgresql://docker:docker@localhost:5432/next-saas"
JWT_SECRET="sua-chave-secreta-aqui"

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_REDIRECT_URI="http://localhost:3000/api/auth/callback/github"

# Para um app Next.js no monorepo (quando existir)
NEXT_PUBLIC_API_URL="http://localhost:3333"
NEXT_PUBLIC_GITHUB_CLIENT_ID=""
NEXT_PUBLIC_JWT_SECRET="sua-chave-secreta-aqui"
```

Gere o client Prisma e aplique as migrations:

```bash
npm run db:generate
npm run db:migrate
```

Opcionalmente, popule o banco com dados de desenvolvimento (organizações, membros, projetos e usuários de teste):

```bash
npm run db:seed
```

O seed limpa as tabelas e recria o cenário. O usuário principal usa e-mail `john.doe@example.com` e senha `123456` (demais usuários têm e-mails gerados pelo Faker).

Para inspecionar o banco com interface visual:

```bash
npm run db:studio
```

### Desenvolvimento

```bash
npm run dev       # inicia os workspaces com task dev (ex.: @saas/api na porta 3333)
```

Para rodar apenas a API:

```bash
npx turbo run dev --filter=@saas/api
```

A API escuta em `http://localhost:3333` (ver [`apps/api/src/http/server.ts`](apps/api/src/http/server.ts)).

Documentação interativa OpenAPI (Swagger UI): [`http://localhost:3333/docs`](http://localhost:3333/docs).

## Scripts

Comandos disponíveis na raiz ([`package.json`](package.json)):

| Script        | Comando               | Observação                                                                               |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `dev`         | `npm run dev`         | Executa `turbo run dev` nos workspaces que definirem a task `dev`                        |
| `build`       | `npm run build`       | Executa `turbo run build` nos workspaces que definirem `build`                           |
| `lint`        | `npm run lint`        | Executa `turbo run lint` nos workspaces que definirem `lint`                             |
| `check-types` | `npm run check-types` | Executa `turbo run check-types` nos workspaces com essa task                             |
| `db:generate` | `npm run db:generate` | Gera o Prisma Client em `@saas/api`                                                      |
| `db:migrate`  | `npm run db:migrate`  | Executa `prisma migrate dev` em `@saas/api`                                              |
| `db:seed`     | `npm run db:seed`     | Gera o client e executa o seed em [`apps/api/prisma/seeds.ts`](apps/api/prisma/seeds.ts) |
| `db:studio`   | `npm run db:studio`   | Abre o Prisma Studio em `@saas/api`                                                      |

Para filtrar uma task em um pacote específico:

```bash
npx turbo run build --filter=@saas/api
```

Scripts de banco também podem ser executados no workspace da API:

```bash
npm run db:generate --workspace=@saas/api
npm run db:migrate --workspace=@saas/api
npm run db:seed --workspace=@saas/api
npm run db:studio --workspace=@saas/api
```

## 📁 Estrutura do monorepo

O repositório é um **monorepo npm** orquestrado pelo [Turborepo](https://turbo.build/repo). Três globs de workspace na raiz definem onde vive cada pacote:

| Glob | Papel |
| ---- | ----- |
| [`apps/*`](apps/) | Aplicações executáveis (API e frontend) |
| [`packages/*`](packages/) | Bibliotecas compartilhadas de domínio e infraestrutura |
| [`config/*`](config/) | Configurações centralizadas (ESLint, Prettier, TypeScript) |

### Workspaces

| Caminho | Pacote npm | Porta (dev) | Responsabilidade |
| ------- | ---------- | ------------- | ---------------- |
| [`apps/api`](apps/api/) | `@saas/api` | `3333` | API HTTP (Fastify), Prisma, JWT, OpenAPI em `/docs` |
| [`apps/web`](apps/web/) | `web` | `3000` | Interface Next.js 15 (App Router) + React 19 |
| [`packages/auth`](packages/auth/) | `@saas/auth` | — | RBAC com CASL (papéis, subjects, `defineAbilityFor`) |
| [`packages/env`](packages/env/) | `@saas/env` | — | Variáveis de ambiente validadas com Zod |
| [`config/eslint-config`](config/eslint-config/) | `@saas/eslint-config` | — | Presets ESLint (`node`, `next-js`, `library`) |
| [`config/prettier`](config/prettier/) | `@saas/prettier` | — | Formatação compartilhada (incl. Tailwind) |
| [`config/typescript-config`](config/typescript-config/) | `@saas/tsconfig` | — | Bases `node.json`, `library.json`, `nextjs.json` |

Dependências internas usam `"*"` no `package.json` (ex.: `@saas/auth` em `@saas/api`), compatível com o resolver do npm 11.

### Diagrama de dependências

```mermaid
flowchart TB
  subgraph root["Raiz do repositório"]
    turbo["turbo.json"]
    compose["docker-compose.yml"]
    envFile[".env (raiz)"]
  end

  subgraph apps["apps/ — aplicações"]
    api["@saas/api<br/><small>Fastify · Prisma · :3333</small>"]
    web["web<br/><small>Next.js 15 · :3000</small>"]
  end

  subgraph packages["packages/ — bibliotecas"]
    auth["@saas/auth<br/><small>CASL · RBAC</small>"]
    envPkg["@saas/env<br/><small>Zod · env</small>"]
  end

  subgraph config["config/ — tooling"]
    eslint["@saas/eslint-config"]
    prettier["@saas/prettier"]
    tsconfig["@saas/tsconfig"]
  end

  db[("PostgreSQL<br/><small>Docker :5432</small>")]

  api --> auth
  api --> envPkg
  api --> db
  envFile -.-> api
  envFile -.-> web
  web -.->|"HTTP (Ky)"| api

  api -.-> eslint
  api -.-> prettier
  api -.-> tsconfig
  web -.-> eslint
  web -.-> prettier
  web -.-> tsconfig
  auth -.-> eslint
  auth -.-> tsconfig
```

**Fluxo em desenvolvimento:** `docker compose up` sobe o banco → `.env` na raiz alimenta `@saas/api` e apps Next → `npm run dev` dispara as tasks `dev` de cada workspace via Turborepo.

### Árvore de diretórios

<details>
<summary><strong>Ver árvore completa</strong></summary>

```
next-saas-rbac/
│
├── apps/                              # Aplicações
│   ├── api/          (@saas/api)      # Backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Modelos (User, Organization, Project, …)
│   │   │   ├── migrations/            # Histórico de migrations
│   │   │   └── seeds.ts               # Dados de desenvolvimento
│   │   └── src/
│   │       ├── http/
│   │       │   ├── server.ts          # Entrada Fastify, Swagger, JWT, CORS
│   │       │   ├── error-handler.ts
│   │       │   ├── middleware/auth.ts # JWT + membership por slug
│   │       │   └── routes/            # Rotas por domínio (ver tabela abaixo)
│   │       ├── lib/prisma.ts          # Cliente Prisma (adapter pg)
│   │       └── utils/                 # slug, permissões CASL
│   │
│   └── web/          (web)            # Frontend
│       └── src/
│           ├── app/                   # App Router (/, auth/sign-in, auth/sign-up, …)
│           ├── components/ui/         # Primitives (Button, Input, Alert, …)
│           ├── http/                  # Cliente Ky + chamadas à API
│           ├── lib/utils.ts
│           └── assets/
│
├── packages/                          # Código compartilhado
│   ├── auth/         (@saas/auth)
│   │   └── src/
│   │       ├── permissions.ts         # Regras CASL por papel
│   │       ├── roles.ts
│   │       ├── subjects/              # User, Project, Organization, Invite, Billing
│   │       └── models/                # Schemas Zod com __typename
│   └── env/          (@saas/env)
│       └── index.ts                   # Validação de variáveis (.env na raiz)
│
├── config/                            # Tooling compartilhado
│   ├── eslint-config/
│   ├── prettier/
│   └── typescript-config/
│
├── docker-compose.yml                 # PostgreSQL local
├── package.json                       # Workspaces + scripts globais (db:*, dev, build)
└── turbo.json                         # Pipeline Turborepo (build, dev, lint, check-types)
```

</details>

### Domínios da API (`apps/api/src/http/routes/`)

As rotas HTTP ficam agrupadas por contexto de negócio. Cada pasta corresponde a uma tag no OpenAPI (`/docs`):

| Pasta | Tag OpenAPI | Exemplos de responsabilidade |
| ----- | ----------- | --------------------------- |
| `auth/` | `auth` | Conta, sessões (senha/GitHub), perfil, recuperação de senha |
| `orgs/` | `organizations` | CRUD de organizações, membership, transferência de ownership |
| `projects/` | `projects` | Projetos por organização (slug) |
| `members/` | `members` | Listagem, atualização de papel e remoção de membros |
| `invites/` | `invites` | Convites, aceite/rejeição, revogação, pendentes |
| `billing/` | `billing` | Faturamento da organização |
| `_errors/` | — | Classes de erro HTTP reutilizáveis |

Detalhes de endpoints, payloads e exemplos `curl` estão nas seções [Aplicações (`apps/`)](#aplicações-apps) abaixo.

## Aplicações (`apps/`)

### `web` (Frontend Next.js)

Interface visual do SaaS construída com **Next.js 15 (App Router)** e **React 19** em [`apps/web/`](apps/web/). Oferece uma experiência premium com layouts responsivos, suporte nativo a temas (Light/Dark mode) e fluxos robustos de autenticação integrados ao backend via cliente HTTP otimizado.

| Recurso / Componente | Descrição / Tecnologias |
| -------------------- | ----------------------- |
| **Next.js 15 & React 19** | Renderização híbrida (SSR/Client-side) e otimização automatizada utilizando recursos de ponta do React. |
| **Server Actions & Hooks** | Autenticação moderna usando `useActionState` e Server Actions para gerenciar chamadas de API com feedback visual instantâneo (`isPending`). |
| **Tailwind CSS v4** | Utiliza a mais recente especificação do Tailwind com `@tailwindcss/postcss` para estilizações super rápidas e responsivas sem arquivos extensivos de configuração. |
| **Base UI & Shadcn** | Componentes estilizados e acessíveis baseados em primitives robustos da `@base-ui/react` e designs polidos. |
| **Cliente de API Ky** | Comunicação com o backend Fastify feita de forma simplificada e tipada via [Ky](https://github.com/sindresorhus/ky). |

#### Estrutura de Rotas e Telas
- **Página Inicial (`/`)**: Dashboard completo do workspace, apresentando o status geral do sistema, formulários interativos de convite de membros e controle rápido de permissões/estilos.
- **Autenticação (`/auth/`)**:
  - `sign-in/`: Tela de Login por e-mail/senha e login social com o GitHub.
  - `sign-up/`: Criação de conta de novos usuários.
  - `forgot-password/`: Recuperação e redefinição de senha com tokens seguros.

#### Estrutura Interna do Frontend (`apps/web/src/`)
- **`app/`**: Rotas do Next.js App Router, layouts globais e CSS base.
  - `auth/`: Páginas e formulários de login, cadastro e recuperação de senha.
  - `globals.css`: Variáveis CSS, importações do Tailwind v4 e definições de tema Dark/Light.
- **`components/ui/`**: Componentes reutilizáveis atômicos (Button, Input, Alert, Separator, Label) criados com primitives do `@base-ui/react` e estilizados refinadamente.
- **`http/`**: Chamadas HTTP para o backend Fastify centralizadas e encapsuladas.

#### Como Executar o Frontend em Isolamento
Caso deseje rodar especificamente a aplicação cliente:
```bash
npx turbo run dev --filter=web
```
A interface estará disponível em `http://localhost:3000`.

---

### `@saas/api`

API HTTP com [Fastify](https://fastify.dev/), validação e schemas OpenAPI via [fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod), documentação com [@fastify/swagger](https://github.com/fastify/fastify-swagger) + [@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui), autenticação JWT com [@fastify/jwt](https://github.com/fastify/fastify-jwt), [CORS](https://github.com/fastify/fastify-cors) habilitado e persistência com Prisma 7 em [`apps/api/`](apps/api/).

| Caminho                                                                           | Descrição                                                           |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [`src/http/server.ts`](apps/api/src/http/server.ts)                               | Entrada do servidor (porta `3333`, Swagger em `/docs`, JWT, CORS)   |
| [`src/http/error-handler.ts`](apps/api/src/http/error-handler.ts)                 | Tratamento centralizado de erros (Zod, 400, 401, 500)               |
| [`src/http/middleware/auth.ts`](apps/api/src/http/middleware/auth.ts)             | Plugin JWT — expõe `getCurrentUserId()` e `getUserMembership(slug)` |
| [`src/http/routes/`](apps/api/src/http/routes/)                                   | Rotas HTTP agrupadas por domínio (`auth/`, `orgs/`)                 |
| [`src/utils/get-user-permissions.ts`](apps/api/src/utils/get-user-permissions.ts) | Monta `AppAbility` do CASL a partir do usuário e do papel           |
| [`src/lib/prisma.ts`](apps/api/src/lib/prisma.ts)                                 | Cliente Prisma com adapter `@prisma/adapter-pg`                     |
| [`prisma/schema.prisma`](apps/api/prisma/schema.prisma)                           | Modelos do banco                                                    |
| [`prisma/seeds.ts`](apps/api/prisma/seeds.ts)                                     | Seed de desenvolvimento (organizações por papel)                    |
| [`prisma.config.ts`](apps/api/prisma.config.ts)                                   | Configuração do Prisma CLI (`DATABASE_URL`)                         |

O runtime da API usa Prisma 7 com driver adapter PostgreSQL (`pg`). O client é exportado de `src/lib/prisma.ts` e reutilizado nas rotas e no seed. Variáveis de ambiente são validadas pelo pacote `@saas/env` na inicialização. Rotas protegidas exigem o header `Authorization: Bearer <token>` (JWT com validade de 7 dias, emitido em `POST /sessions/password` ou `POST /sessions/github`). Rotas de organização usam `getUserMembership(slug)` para garantir que o usuário é membro; operações sensíveis (ex.: atualizar organização) checam permissões com `getUserPermissions` e o CASL. Com o servidor em execução, a especificação OpenAPI e o Swagger UI ficam disponíveis em `/docs`.

#### Modelos (Prisma)

| Modelo         | Descrição (resumo)                            |
| -------------- | --------------------------------------------- |
| `User`         | Usuário da plataforma                         |
| `Token`        | Tokens (ex.: recuperação de senha)            |
| `Account`      | Contas OAuth (`GITHUB`)                       |
| `Organization` | Organização multi-tenant com `ownerId`        |
| `Member`       | Membro de organização com `Role`              |
| `Invite`       | Convite pendente para organização             |
| `Project`      | Projeto vinculado a organização com `ownerId` |

Papéis no banco (`Role`): `ADMIN`, `MEMBER`, `BILLING` — alinhados ao pacote `@saas/auth`.

#### Seed de desenvolvimento

O comando `npm run db:seed` executa [`prisma/seeds.ts`](apps/api/prisma/seeds.ts), que recria:

- 3 usuários (incluindo `john.doe@example.com`, senha `123456`)
- 3 organizações com papéis distintos para o mesmo usuário em cada cenário:
  - **Acme Inc (Admin)** — `john.doe@example.com` como `ADMIN`
  - **Acme Inc (Member)** — `john.doe@example.com` como `MEMBER`
  - **Acme Inc (Billing)** — `john.doe@example.com` como `BILLING`

Cada organização inclui membros, projetos com `ownerId` variado e metadados gerados com Faker.

#### Rotas HTTP (`auth`)

| Método | Rota                 | Autenticação | Descrição                                      |
| ------ | -------------------- | ------------ | ---------------------------------------------- |
| `POST` | `/users`             | —            | Criação de conta                               |
| `POST` | `/sessions/password` | —            | Login com e-mail e senha (retorna JWT)         |
| `POST` | `/sessions/github`   | —            | Login com código OAuth do GitHub (retorna JWT) |
| `GET`  | `/profile`           | Bearer JWT   | Perfil do usuário autenticado                  |
| `POST` | `/password/recover`  | —            | Solicita recuperação de senha                  |
| `POST` | `/password/reset`    | —            | Redefine a senha com código de recuperação     |

Todas as rotas estão sob a tag OpenAPI `auth`. Detalhes de request/response também em [`http://localhost:3333/docs`](http://localhost:3333/docs).

**`POST /users`** — [`create-account.ts`](apps/api/src/http/routes/auth/create-account.ts)

| Campo      | Regras                      |
| ---------- | --------------------------- |
| `name`     | string, mínimo 1 caractere  |
| `email`    | e-mail válido               |
| `password` | string, mínimo 6 caracteres |

| Status | Corpo                                                  | Quando               |
| ------ | ------------------------------------------------------ | -------------------- |
| `201`  | `{ "message": "User created successfully" }`           | Usuário criado       |
| `400`  | `{ "message": "User with same email already exists" }` | E-mail já cadastrado |

**`POST /sessions/password`** — [`authenticate-with-password.ts`](apps/api/src/http/routes/auth/authenticate-with-password.ts)

| Campo      | Regras                      |
| ---------- | --------------------------- |
| `email`    | e-mail válido               |
| `password` | string, mínimo 6 caracteres |

| Status | Corpo                                                                                      | Quando                |
| ------ | ------------------------------------------------------------------------------------------ | --------------------- |
| `201`  | `{ "token": "<jwt>" }`                                                                     | Credenciais válidas   |
| `400`  | `{ "message": "Invalid credentials" }` ou `{ "message": "User does not have a password" }` | Falha na autenticação |

**`POST /sessions/github`** — [`authenticate-with-github.ts`](apps/api/src/http/routes/auth/authenticate-with-github.ts)

| Campo  | Regras                                      |
| ------ | ------------------------------------------- |
| `code` | string (código retornado pelo GitHub OAuth) |

| Status | Corpo                  | Quando                                                |
| ------ | ---------------------- | ----------------------------------------------------- |
| `201`  | `{ "token": "<jwt>" }` | OAuth válido; cria usuário/conta GitHub se necessário |
| `400`  | `{ "message": "..." }` | Falha no OAuth ou conta GitHub sem e-mail público     |

Requer `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` e `GITHUB_REDIRECT_URI` no `.env` da raiz.

**`GET /profile`** — [`get-profile.ts`](apps/api/src/http/routes/auth/get-profile.ts)

| Header          | Valor            |
| --------------- | ---------------- |
| `Authorization` | `Bearer <token>` |

| Status | Corpo                                                | Quando                    |
| ------ | ---------------------------------------------------- | ------------------------- |
| `200`  | `{ "user": { "id", "name", "email", "avatarUrl" } }` | Perfil encontrado         |
| `401`  | `{ "message": "Unauthorized" }`                      | Token ausente ou inválido |

**`POST /password/recover`** — [`resquest-password-recover.ts`](apps/api/src/http/routes/auth/resquest-password-recover.ts)

| Campo   | Regras        |
| ------- | ------------- |
| `email` | e-mail válido |

Sempre responde `201` (mesmo se o e-mail não existir, para não revelar cadastros). Quando o usuário existe, um token `PASSWORD_RECOVER` é criado e o **código** é impresso no console do servidor (`Recover password token: …`) — em produção, substitua por envio de e-mail.

**`POST /password/reset`** — [`reset-password.ts`](apps/api/src/http/routes/auth/reset-password.ts)

| Campo      | Regras                      |
| ---------- | --------------------------- |
| `code`     | string (id do token)        |
| `password` | string, mínimo 6 caracteres |

| Status | Corpo                           | Quando                                     |
| ------ | ------------------------------- | ------------------------------------------ |
| `204`  | —                               | Senha atualizada e token consumido         |
| `401`  | `{ "message": "Unauthorized" }` | Código inválido ou tipo de token incorreto |

#### Fluxo de autenticação (exemplo)

```bash
# 1. Criar conta
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"secret123"}'

# 2. Login (ou use o seed: john.doe@example.com / 123456)
curl -X POST http://localhost:3333/sessions/password \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'

# 3. Perfil autenticado
curl http://localhost:3333/profile \
  -H "Authorization: Bearer <token>"

# 4. Recuperar senha (veja o código no log da API)
curl -X POST http://localhost:3333/password/recover \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com"}'

# 5. Redefinir senha
curl -X POST http://localhost:3333/password/reset \
  -H "Content-Type: application/json" \
  -d '{"code":"<codigo-do-log>","password":"novaSenha123"}'
```

Alternativa: abra [`http://localhost:3333/docs`](http://localhost:3333/docs) e execute as operações pela interface Swagger.

#### Rotas HTTP (`organizations`)

| Método   | Rota                             | Autenticação | Descrição                                                                             |
| -------- | -------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| `POST`   | `/organization`                  | Bearer JWT   | Cria organização; usuário vira `ADMIN` e `ownerId`                                    |
| `GET`    | `/organizations`                 | Bearer JWT   | Lista organizações em que o usuário é membro (com papel)                              |
| `GET`    | `/organizations/:slug`           | Bearer JWT   | Detalhes da organização (requer membership)                                           |
| `PUT`    | `/organizations/:slug`           | Bearer JWT   | Atualiza organização (exige permissão `update` no CASL)                               |
| `DELETE` | `/organizations/:slug`           | Bearer JWT   | Encerra (deleta) a organização (exige permissão `delete` no CASL)                     |
| `PATCH`  | `/organizations/:slug/owner`     | Bearer JWT   | Transfere a propriedade da organização (exige permissão `transfer_ownership` no CASL) |
| `GET`    | `/organization/:slug/membership` | Bearer JWT   | Membership do usuário na organização                                                  |

Todas as rotas estão sob a tag OpenAPI `organizations`.

**`POST /organization`** — [`create-organization.ts`](apps/api/src/http/routes/orgs/create-organization.ts)

| Campo                       | Regras            |
| --------------------------- | ----------------- |
| `name`                      | string            |
| `domain`                    | string, opcional  |
| `shouldAttachUsersByDomain` | boolean, opcional |

| Status | Corpo                         | Quando             |
| ------ | ----------------------------- | ------------------ |
| `201`  | `{ "organizationId": "..." }` | Organização criada |
| `400`  | `{ "message": "..." }`        | Domínio já em uso  |

**`GET /organizations`** — [`get-organizations.ts`](apps/api/src/http/routes/orgs/get-organizations.ts)

| Status | Corpo                                                                  | Quando               |
| ------ | ---------------------------------------------------------------------- | -------------------- |
| `200`  | `{ "organizations": [{ "id", "name", "slug", "avatarUrl", "role" }] }` | Lista de memberships |

**`GET /organizations/:slug`** — [`get-organization.ts`](apps/api/src/http/routes/orgs/get-organization.ts)

| Status | Corpo                         | Quando                          |
| ------ | ----------------------------- | ------------------------------- |
| `200`  | `{ "organization": { ... } }` | Usuário é membro da organização |
| `401`  | `{ "message": "..." }`        | Token inválido ou não é membro  |

**`PUT /organizations/:slug`** — [`update-organization.ts`](apps/api/src/http/routes/orgs/update-organization.ts)

| Campo                       | Regras           |
| --------------------------- | ---------------- |
| `name`                      | string           |
| `domain`                    | string ou `null` |
| `shouldAttachUsersByDomain` | boolean          |

| Status | Corpo                  | Quando                             |
| ------ | ---------------------- | ---------------------------------- |
| `204`  | —                      | Atualizado com sucesso             |
| `400`  | `{ "message": "..." }` | Domínio já em uso por outra org    |
| `401`  | `{ "message": "..." }` | Sem permissão CASL ou não é membro |

**`GET /organization/:slug/membership`** — [`get-membership.ts`](apps/api/src/http/routes/orgs/get-membership.ts)

| Status | Corpo                                                  | Quando                |
| ------ | ------------------------------------------------------ | --------------------- |
| `200`  | `{ "membership": { "id", "role", "organizationId" } }` | Membership encontrado |

**`DELETE /organizations/:slug`** — [`shutdown-organization.ts`](apps/api/src/http/routes/orgs/shutdown-organization.ts)

| Status | Corpo                  | Quando                             |
| ------ | ---------------------- | ---------------------------------- |
| `204`  | —                      | Organização encerrada com sucesso  |
| `401`  | `{ "message": "..." }` | Sem permissão CASL ou não é membro |

**`PATCH /organizations/:slug/owner`** — [`transfer-organization.ts`](apps/api/src/http/routes/orgs/transfer-organization.ts)

| Campo              | Regras                     |
| ------------------ | -------------------------- |
| `transferToUserId` | string (UUID do novo dono) |

| Status | Corpo                                                               | Quando                                |
| ------ | ------------------------------------------------------------------- | ------------------------------------- |
| `204`  | —                                                                   | Propriedade transferida com sucesso   |
| `400`  | `{ "message": "Target user is not a member of this organization" }` | Novo dono não é membro da organização |
| `401`  | `{ "message": "..." }`                                              | Sem permissão CASL ou não é membro    |

#### Fluxo de organizações (exemplo)

```bash
# Após obter o token (login ou seed)
TOKEN="<jwt>"

# Criar organização
curl -X POST http://localhost:3333/organization \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Minha Empresa","domain":"minhaempresa.com"}'

# Listar organizações do usuário
curl http://localhost:3333/organizations \
  -H "Authorization: Bearer $TOKEN"

# Detalhes por slug (ex.: do seed: acme-admin)
curl http://localhost:3333/organizations/acme-admin \
  -H "Authorization: Bearer $TOKEN"
```

#### Rotas HTTP (`projects`)

| Método   | Rota                                            | Autenticação | Descrição                                                                               |
| -------- | ----------------------------------------------- | ------------ | --------------------------------------------------------------------------------------- |
| `POST`   | `/organizations/:slug/projects`                 | Bearer JWT   | Cria um projeto na organização (exige permissão `create` em `Project` no CASL)          |
| `GET`    | `/organizations/:slug/projects`                 | Bearer JWT   | Lista todos os projetos da organização (exige permissão `get` em `Project` no CASL)     |
| `GET`    | `/organizations/:orgSlug/projects/:projectSlug` | Bearer JWT   | Detalhes de um projeto específico por slug (exige permissão `get` em `Project` no CASL) |
| `PUT`    | `/organizations/:slug/projects/:projectId`      | Bearer JWT   | Atualiza um projeto específico (exige permissão `update` no CASL para o projeto)        |
| `DELETE` | `/organizations/:slug/projects/:projectId`      | Bearer JWT   | Remove um projeto específico (exige permissão `delete` no CASL para o projeto)          |

Todas as rotas estão sob a tag OpenAPI `projects`.

**`POST /organizations/:slug/projects`** — [`create-project.ts`](apps/api/src/http/routes/projects/create-project.ts)

| Campo         | Regras |
| ------------- | ------ |
| `name`        | string |
| `description` | string |

| Status | Corpo                    | Quando                             |
| ------ | ------------------------ | ---------------------------------- |
| `201`  | `{ "projectId": "..." }` | Projeto criado com sucesso         |
| `401`  | `{ "message": "..." }`   | Sem permissão CASL ou não é membro |

**`GET /organizations/:slug/projects`** — [`get-projects.ts`](apps/api/src/http/routes/projects/get-projects.ts)

| Status | Corpo                                                                                                                                                                   | Quando                                     |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `200`  | `{ "projects": [{ "id", "name", "slug", "ownerId", "organizationId", "description", "avatarUrl", "createdAt", "updatedAt", "owner": { "id", "name", "avatarUrl" } }] }` | Lista de projetos da organização retornada |
| `401`  | `{ "message": "..." }`                                                                                                                                                  | Sem permissão CASL ou não é membro         |

**`GET /organizations/:orgSlug/projects/:projectSlug`** — [`get-project.ts`](apps/api/src/http/routes/projects/get-project.ts)

| Status | Corpo                                                                                                                                                                | Quando                                     |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `200`  | `{ "project": { "id", "name", "slug", "ownerId", "organizationId", "description", "avatarUrl", "createdAt", "updatedAt", "owner": { "id", "name", "avatarUrl" } } }` | Detalhes do projeto retornados com sucesso |
| `400`  | `{ "message": "Project not found" }`                                                                                                                                 | Projeto não encontrado                     |
| `401`  | `{ "message": "..." }`                                                                                                                                               | Sem permissão CASL ou não é membro         |

**`PUT /organizations/:slug/projects/:projectId`** — [`update-project.ts`](apps/api/src/http/routes/projects/update-project.ts)

| Campo         | Regras                                 |
| ------------- | -------------------------------------- |
| `name`        | string                                 |
| `description` | string ou `null`                       |
| `avatarUrl`   | string ou `null` (deve ser URL válida) |

| Status | Corpo                                | Quando                                             |
| ------ | ------------------------------------ | -------------------------------------------------- |
| `204`  | —                                    | Projeto atualizado com sucesso                     |
| `400`  | `{ "message": "Project not found" }` | Projeto não encontrado                             |
| `401`  | `{ "message": "..." }`               | Sem permissão CASL ou não é membro/dono do projeto |

**`DELETE /organizations/:slug/projects/:projectId`** — [`delete-project.ts`](apps/api/src/http/routes/projects/delete-project.ts)

| Status | Corpo                                | Quando                                             |
| ------ | ------------------------------------ | -------------------------------------------------- |
| `204`  | —                                    | Projeto removido com sucesso                       |
| `400`  | `{ "message": "Project not found" }` | Projeto não encontrado                             |
| `401`  | `{ "message": "..." }`               | Sem permissão CASL ou não é membro/dono do projeto |

#### Rotas HTTP (`members`)

| Método   | Rota                                     | Autenticação | Descrição                                                                       |
| -------- | ---------------------------------------- | ------------ | ------------------------------------------------------------------------------- |
| `GET`    | `/organizations/:slug/members`           | Bearer JWT   | Lista todos os membros da organização (exige permissão `get` em `User` no CASL) |
| `PUT`    | `/organizations/:slug/members/:memberId` | Bearer JWT   | Atualiza o papel de um membro (exige permissão `update` em `User` no CASL)      |
| `DELETE` | `/organizations/:slug/members/:memberId` | Bearer JWT   | Remove um membro da organização (exige permissão `delete` em `User` no CASL)    |

Todas as rotas estão sob a tag OpenAPI `members`.

**`GET /organizations/:slug/members`** — [`get-members.ts`](apps/api/src/http/routes/members/get-members.ts)

| Status | Corpo                                                                       | Quando                                    |
| ------ | --------------------------------------------------------------------------- | ----------------------------------------- |
| `200`  | `{ "members": [{ "id", "userId", "name", "email", "avatarUrl", "role" }] }` | Lista de membros da organização retornada |
| `401`  | `{ "message": "..." }`                                                      | Sem permissão CASL ou não é membro        |

**`PUT /organizations/:slug/members/:memberId`** — [`update-member.ts`](apps/api/src/http/routes/members/update-member.ts)

| Campo  | Regras                           |
| ------ | -------------------------------- |
| `role` | `ADMIN` ou `MEMBER` ou `BILLING` |

| Status | Corpo                               | Quando                                 |
| ------ | ----------------------------------- | -------------------------------------- |
| `204`  | —                                   | Papel do membro atualizado com sucesso |
| `400`  | `{ "message": "Member not found" }` | Membro não encontrado                  |
| `401`  | `{ "message": "..." }`              | Sem permissão CASL ou não é membro     |

**`DELETE /organizations/:slug/members/:memberId`** — [`remove-member.ts`](apps/api/src/http/routes/members/remove-member.ts)

| Status | Corpo                  | Quando                                     |
| ------ | ---------------------- | ------------------------------------------ |
| `204`  | —                      | Membro removido da organização com sucesso |
| `401`  | `{ "message": "..." }` | Sem permissão CASL ou não é membro         |

#### Rotas HTTP (`invites`)

| Método | Rota                           | Autenticação | Descrição                                                                          |
| ------ | ------------------------------ | ------------ | ---------------------------------------------------------------------------------- |
| `POST` | `/organizations/:slug/invites` | Bearer JWT   | Cria um novo convite (exige permissão `create` em `Invite` no CASL)                |
| `GET`  | `/organizations/:slug/invites` | Bearer JWT   | Lista todos os convites da organização (exige permissão `get` em `Invite` no CASL) |
| `GET`  | `/invites/:inviteId`           | —            | Busca detalhes de um convite específico por ID (livre)                             |

Todas as rotas estão sob a tag OpenAPI `invites`.

**`POST /organizations/:slug/invites`** — [`create-invite.ts`](apps/api/src/http/routes/invites/create-invite.ts)

| Campo   | Regras                           |
| ------- | -------------------------------- |
| `email` | e-mail válido                    |
| `role`  | `ADMIN` ou `MEMBER` ou `BILLING` |

| Status | Corpo                                                                        | Quando                                                                         |
| ------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `201`  | `{ "inviteId": "..." }`                                                      | Convite criado com sucesso                                                     |
| `400`  | `{ "message": "Another invite with this e-mail already exists" }` ou similar | Convite duplicado ou membro já pertencente à org ou domínio automático ativado |
| `401`  | `{ "message": "..." }`                                                       | Sem permissão CASL ou não é membro                                             |

**`GET /organizations/:slug/invites`** — [`get-invites.ts`](apps/api/src/http/routes/invites/get-invites.ts)

| Status | Corpo                                                                                 | Quando                                     |
| ------ | ------------------------------------------------------------------------------------- | ------------------------------------------ |
| `200`  | `{ "invites": [{ "id", "email", "role", "createdAt", "author": { "id", "name" } }] }` | Lista de convites da organização retornada |
| `401`  | `{ "message": "..." }`                                                                | Sem permissão CASL ou não é membro         |

**`GET /invites/:inviteId`** — [`get-invite.ts`](apps/api/src/http/routes/invites/get-invite.ts)

| Status | Corpo                                                                                                                       | Quando                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `200`  | `{ "invite": { "id", "email", "role", "createdAt", "author": { "id", "name", "avatarUrl" }, "organization": { "name" } } }` | Detalhes do convite retornados com sucesso |
| `400`  | `{ "message": "Invite not found" }`                                                                                         | Convite não encontrado                     |

## Pacotes (`packages/`)

### `@saas/auth`

Biblioteca de autorização com [CASL](https://casl.js.org/) e tipagem com [Zod](https://zod.dev/) em [`packages/auth/`](packages/auth/).

#### API principal

- **`defineAbilityFor(user)`** — monta a `AppAbility` a partir do `id` e do `role` do usuário.
- **Schemas exportados** — `userSchema`, `projectSchema`, `organizationSchema` (modelos com `__typename` para checagens em instâncias).

#### Papéis

| Papel     | Permissões (resumo)                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ADMIN`   | `manage` em `all`, exceto `transfer_ownership` e `update` em `Organization` (permitidos apenas quando `ownerId` é o próprio usuário) |
| `MEMBER`  | `get` em `User`; `create` e `get` em `Project`; `update` e `delete` em `Project` quando `ownerId` é o próprio usuário                |
| `BILLING` | `manage` em `Billing`                                                                                                                |

Regras completas em [`permissions.ts`](packages/auth/src/permissions.ts). Papéis válidos em [`roles.ts`](packages/auth/src/roles.ts).

#### Subjects e ações

| Subject        | Ações                                              |
| -------------- | -------------------------------------------------- |
| `User`         | `manage`, `get`, `update`, `delete`                |
| `Project`      | `manage`, `get`, `create`, `update`, `delete`      |
| `Organization` | `manage`, `update`, `delete`, `transfer_ownership` |
| `Invite`       | `manage`, `get`, `create`, `delete`                |
| `Billing`      | `manage`, `get`, `export`                          |
| `all`          | `manage` (apenas `ADMIN`)                          |

Subjects tipados em [`packages/auth/src/subjects/`](packages/auth/src/subjects/). Modelos com condições de campo (ex.: `ownerId`) em [`packages/auth/src/models/`](packages/auth/src/models/).

Para checar permissão sobre um recurso específico, passe a instância parseada pelo schema (o `detectSubjectType` usa `__typename`):

```ts
import { defineAbilityFor, projectSchema } from '@saas/auth'

const ability = defineAbilityFor({ id: 'user-1', role: 'MEMBER' })

const project = projectSchema.parse({
  id: 'project-1',
  ownerId: 'user-1',
})

ability.can('get', 'User') // true
ability.can('delete', 'User') // false
ability.can('get', project) // true
ability.can('delete', project) // true (owner)
```

Implementação de referência em [`packages/auth/src/index.ts`](packages/auth/src/index.ts).

### `@saas/env`

Validação tipada de variáveis de ambiente com [`@t3-oss/env-nextjs`](https://env.t3.gg/) e Zod em [`packages/env/`](packages/env/). Exporta o objeto `env` usado pela API e por apps frontend do monorepo.

Variáveis de servidor: `SERVER_PORT`, `DATABASE_URL`, `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_REDIRECT_URI`.

Variáveis de cliente (Next.js): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GITHUB_CLIENT_ID`, `NEXT_PUBLIC_JWT_SECRET`.

Compartilhada: `NODE_ENV` (`development` | `production` | `test`).

## Pacotes compartilhados (`config/`)

### `@saas/prettier`

Configuração central do Prettier em [`config/prettier/index.mjs`](config/prettier/index.mjs), com Prettier 3 e `prettier-plugin-tailwindcss`.

A raiz do repositório referencia esse pacote com `"prettier": "@saas/prettier"` no [`package.json`](package.json).

Para verificar a formatação após `npm install`:

```bash
npx prettier --check .
```

### `@saas/eslint-config`

Configurações ESLint compartilhadas em [`config/eslint-config/`](config/eslint-config/). Exports do pacote:

| Export    | Arquivo      | Uso                                                                 |
| --------- | ------------ | ------------------------------------------------------------------- |
| `next-js` | `next.js`    | Apps Next.js (base Rocketseat + `eslint-plugin-simple-import-sort`) |
| `node`    | `node.js`    | Pacotes Node (ex.: `@saas/api`)                                     |
| `library` | `library.js` | Bibliotecas compartilhadas (ex.: `@saas/auth`)                      |

Detalhes de uso em [`config/eslint-config/README.md`](config/eslint-config/README.md).

### `@saas/tsconfig`

Configs TypeScript base em [`config/typescript-config/`](config/typescript-config/):

| Arquivo        | Uso                                            |
| -------------- | ---------------------------------------------- |
| `node.json`    | Apps e pacotes Node (ex.: `@saas/api`)         |
| `library.json` | Bibliotecas compartilhadas (ex.: `@saas/auth`) |

Nos workspaces, estenda com `"extends": "@saas/tsconfig/node.json"` ou `"@saas/tsconfig/library.json"`.

## Turborepo

O arquivo [`turbo.json`](turbo.json) define as tasks:

- **`build`** — depende de `^build` nos pacotes upstream; saída em `.next/**` (exceto cache).
- **`dev`** — persistente, sem cache.
- **`lint`** e **`check-types`** — dependem das mesmas tasks nos pacotes upstream.

## Variáveis de ambiente

Arquivos `.env` não são versionados (ver [`.gitignore`](.gitignore)). Use um único `.env` na **raiz** do monorepo; a API e o Prisma CLI leem esse arquivo via `dotenv -e ../../.env` no workspace `@saas/api`.

Definição e validação em [`packages/env/index.ts`](packages/env/index.ts).

| Variável                       | Obrigatória                | Descrição                                   |
| ------------------------------ | -------------------------- | ------------------------------------------- |
| `SERVER_PORT`                  | Não (padrão `3333`)        | Porta HTTP da API                           |
| `DATABASE_URL`                 | Sim                        | URL PostgreSQL (Prisma)                     |
| `JWT_SECRET`                   | Sim                        | Chave para assinar/validar JWT              |
| `GITHUB_CLIENT_ID`             | Sim\*                      | Client ID do app OAuth GitHub               |
| `GITHUB_CLIENT_SECRET`         | Sim\*                      | Client secret do app OAuth GitHub           |
| `GITHUB_REDIRECT_URI`          | Sim\*                      | URI de callback registrada no GitHub        |
| `NEXT_PUBLIC_API_URL`          | Sim\*\*                    | URL base da API (apps Next.js)              |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | Sim\*\*                    | Client ID exposto ao browser                |
| `NEXT_PUBLIC_JWT_SECRET`       | Sim\*\*                    | Mesmo segredo JWT no cliente (se aplicável) |
| `NODE_ENV`                     | Não (padrão `development`) | Ambiente de execução                        |

\* Necessárias para `POST /sessions/github`.  
\*\* Usadas quando houver app Next.js no monorepo; podem ser preenchidas com valores de desenvolvimento mesmo rodando só a API.

Exemplo mínimo para desenvolvimento local (API + banco Docker):

```env
SERVER_PORT=3333
DATABASE_URL="postgresql://docker:docker@localhost:5432/next-saas"
JWT_SECRET="dev-secret-change-in-production"
GITHUB_CLIENT_ID="seu-client-id"
GITHUB_CLIENT_SECRET="seu-client-secret"
GITHUB_REDIRECT_URI="http://localhost:3000/api/auth/callback/github"
NEXT_PUBLIC_API_URL="http://localhost:3333"
NEXT_PUBLIC_GITHUB_CLIENT_ID="seu-client-id"
NEXT_PUBLIC_JWT_SECRET="dev-secret-change-in-production"
```

## Licença

Licença a definir.
