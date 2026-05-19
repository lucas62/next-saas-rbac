# next-saas-rbac

Monorepo [Turborepo](https://turbo.build/repo) com workspaces npm para um SaaS com controle de acesso baseado em papéis (RBAC). O pacote `@saas/auth` centraliza permissões com [CASL](https://casl.js.org/); a API em `apps/api` consome esse pacote, valida variáveis de ambiente via `@saas/env`, expõe rotas de autenticação (cadastro, login com senha ou GitHub, perfil e recuperação de senha), rotas de organizações com checagem de permissões, documentação OpenAPI em `/docs` e persiste dados com [Prisma](https://www.prisma.io/) e PostgreSQL.

**Requisitos:** Node.js `>=18` · npm `11.11.0` · [Docker](https://www.docker.com/) (para o banco local)

## Pré-requisitos

| Item       | Versão                           |
| ---------- | -------------------------------- |
| Node.js    | `>=18` (ver `engines` na raiz)   |
| npm        | `11.11.0` (ver `packageManager`) |
| Docker     | Para subir o PostgreSQL local    |

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

| Script          | Comando                 | Observação                                                        |
| --------------- | ----------------------- | ----------------------------------------------------------------- |
| `dev`           | `npm run dev`           | Executa `turbo run dev` nos workspaces que definirem a task `dev` |
| `build`         | `npm run build`         | Executa `turbo run build` nos workspaces que definirem `build`    |
| `lint`          | `npm run lint`          | Executa `turbo run lint` nos workspaces que definirem `lint`      |
| `check-types`   | `npm run check-types`   | Executa `turbo run check-types` nos workspaces com essa task      |
| `db:generate`   | `npm run db:generate`   | Gera o Prisma Client em `@saas/api`                               |
| `db:migrate`    | `npm run db:migrate`    | Executa `prisma migrate dev` em `@saas/api`                       |
| `db:seed`       | `npm run db:seed`       | Gera o client e executa o seed em [`apps/api/prisma/seeds.ts`](apps/api/prisma/seeds.ts) |
| `db:studio`     | `npm run db:studio`     | Abre o Prisma Studio em `@saas/api`                               |

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

## Estrutura do monorepo

```mermaid
flowchart TB
  root[next-saas-rbac]
  root --> apps[apps/*]
  root --> packages[packages/*]
  root --> config[config/*]
  apps --> api["@saas/api"]
  packages --> auth["@saas/auth"]
  packages --> envPkg["@saas/env"]
  api --> auth
  api --> envPkg
  api --> db[(PostgreSQL)]
  config --> eslint["@saas/eslint-config"]
  config --> prettier["@saas/prettier"]
  config --> tsconfig["@saas/tsconfig"]
```

```
.
├── apps/
│   └── api/                 # @saas/api — API Fastify + Prisma
│       ├── prisma/          # schema, migrations e seeds
│       └── src/
│           ├── http/        # servidor, middleware JWT, rotas (auth/, orgs/) e Swagger UI
│           ├── lib/         # cliente Prisma compartilhado
│           └── utils/       # helpers (slug, permissões CASL)
├── packages/
│   ├── auth/                # @saas/auth — RBAC com CASL
│   └── env/                 # @saas/env — variáveis de ambiente tipadas (Zod)
├── config/
│   ├── eslint-config/       # @saas/eslint-config
│   ├── prettier/            # @saas/prettier
│   └── typescript-config/   # @saas/tsconfig
├── docker-compose.yml       # PostgreSQL local
├── package.json
└── turbo.json
```

Workspaces npm definidos na raiz: `apps/*`, `packages/*`, `config/*`.

## Aplicações (`apps/`)

### `@saas/api`

API HTTP com [Fastify](https://fastify.dev/), validação e schemas OpenAPI via [fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod), documentação com [@fastify/swagger](https://github.com/fastify/fastify-swagger) + [@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui), autenticação JWT com [@fastify/jwt](https://github.com/fastify/fastify-jwt), [CORS](https://github.com/fastify/fastify-cors) habilitado e persistência com Prisma 7 em [`apps/api/`](apps/api/).

| Caminho | Descrição |
| ------- | --------- |
| [`src/http/server.ts`](apps/api/src/http/server.ts) | Entrada do servidor (porta `3333`, Swagger em `/docs`, JWT, CORS) |
| [`src/http/error-handler.ts`](apps/api/src/http/error-handler.ts) | Tratamento centralizado de erros (Zod, 400, 401, 500) |
| [`src/http/middleware/auth.ts`](apps/api/src/http/middleware/auth.ts) | Plugin JWT — expõe `getCurrentUserId()` e `getUserMembership(slug)` |
| [`src/http/routes/`](apps/api/src/http/routes/) | Rotas HTTP agrupadas por domínio (`auth/`, `orgs/`) |
| [`src/utils/get-user-permissions.ts`](apps/api/src/utils/get-user-permissions.ts) | Monta `AppAbility` do CASL a partir do usuário e do papel |
| [`src/lib/prisma.ts`](apps/api/src/lib/prisma.ts) | Cliente Prisma com adapter `@prisma/adapter-pg` |
| [`prisma/schema.prisma`](apps/api/prisma/schema.prisma) | Modelos do banco |
| [`prisma/seeds.ts`](apps/api/prisma/seeds.ts) | Seed de desenvolvimento (organizações por papel) |
| [`prisma.config.ts`](apps/api/prisma.config.ts) | Configuração do Prisma CLI (`DATABASE_URL`) |

O runtime da API usa Prisma 7 com driver adapter PostgreSQL (`pg`). O client é exportado de `src/lib/prisma.ts` e reutilizado nas rotas e no seed. Variáveis de ambiente são validadas pelo pacote `@saas/env` na inicialização. Rotas protegidas exigem o header `Authorization: Bearer <token>` (JWT com validade de 7 dias, emitido em `POST /sessions/password` ou `POST /sessions/github`). Rotas de organização usam `getUserMembership(slug)` para garantir que o usuário é membro; operações sensíveis (ex.: atualizar organização) checam permissões com `getUserPermissions` e o CASL. Com o servidor em execução, a especificação OpenAPI e o Swagger UI ficam disponíveis em `/docs`.

#### Modelos (Prisma)

| Modelo           | Descrição (resumo)                                      |
| ---------------- | ------------------------------------------------------- |
| `User`           | Usuário da plataforma                                   |
| `Token`          | Tokens (ex.: recuperação de senha)                      |
| `Account`        | Contas OAuth (`GITHUB`)                                 |
| `Organization`   | Organização multi-tenant com `ownerId`                  |
| `Member`         | Membro de organização com `Role`                        |
| `Invite`         | Convite pendente para organização                       |
| `Project`        | Projeto vinculado a organização com `ownerId`           |

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

| Método | Rota                  | Autenticação | Descrição |
| ------ | --------------------- | ------------ | --------- |
| `POST` | `/users`              | —            | Criação de conta |
| `POST` | `/sessions/password`  | —            | Login com e-mail e senha (retorna JWT) |
| `POST` | `/sessions/github`    | —            | Login com código OAuth do GitHub (retorna JWT) |
| `GET`  | `/profile`            | Bearer JWT   | Perfil do usuário autenticado |
| `POST` | `/password/recover`   | —            | Solicita recuperação de senha |
| `POST` | `/password/reset`     | —            | Redefine a senha com código de recuperação |

Todas as rotas estão sob a tag OpenAPI `auth`. Detalhes de request/response também em [`http://localhost:3333/docs`](http://localhost:3333/docs).

**`POST /users`** — [`create-account.ts`](apps/api/src/http/routes/auth/create-account.ts)

| Campo      | Regras                      |
| ---------- | --------------------------- |
| `name`     | string, mínimo 1 caractere  |
| `email`    | e-mail válido               |
| `password` | string, mínimo 6 caracteres |

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `201`  | `{ "message": "User created successfully" }` | Usuário criado |
| `400`  | `{ "message": "User with same email already exists" }` | E-mail já cadastrado |

**`POST /sessions/password`** — [`authenticate-with-password.ts`](apps/api/src/http/routes/auth/authenticate-with-password.ts)

| Campo      | Regras                      |
| ---------- | --------------------------- |
| `email`    | e-mail válido               |
| `password` | string, mínimo 6 caracteres |

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `201`  | `{ "token": "<jwt>" }` | Credenciais válidas |
| `400`  | `{ "message": "Invalid credentials" }` ou `{ "message": "User does not have a password" }` | Falha na autenticação |

**`POST /sessions/github`** — [`authenticate-with-github.ts`](apps/api/src/http/routes/auth/authenticate-with-github.ts)

| Campo  | Regras |
| ------ | ------ |
| `code` | string (código retornado pelo GitHub OAuth) |

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `201`  | `{ "token": "<jwt>" }` | OAuth válido; cria usuário/conta GitHub se necessário |
| `400`  | `{ "message": "..." }` | Falha no OAuth ou conta GitHub sem e-mail público |

Requer `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` e `GITHUB_REDIRECT_URI` no `.env` da raiz.

**`GET /profile`** — [`get-profile.ts`](apps/api/src/http/routes/auth/get-profile.ts)

| Header           | Valor                    |
| ---------------- | ------------------------ |
| `Authorization`  | `Bearer <token>`         |

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `200`  | `{ "user": { "id", "name", "email", "avatarUrl" } }` | Perfil encontrado |
| `401`  | `{ "message": "Unauthorized" }` | Token ausente ou inválido |

**`POST /password/recover`** — [`resquest-password-recover.ts`](apps/api/src/http/routes/auth/resquest-password-recover.ts)

| Campo   | Regras      |
| ------- | ----------- |
| `email` | e-mail válido |

Sempre responde `201` (mesmo se o e-mail não existir, para não revelar cadastros). Quando o usuário existe, um token `PASSWORD_RECOVER` é criado e o **código** é impresso no console do servidor (`Recover password token: …`) — em produção, substitua por envio de e-mail.

**`POST /password/reset`** — [`reset-password.ts`](apps/api/src/http/routes/auth/reset-password.ts)

| Campo      | Regras                      |
| ---------- | --------------------------- |
| `code`     | string (id do token)        |
| `password` | string, mínimo 6 caracteres |

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `204`  | —     | Senha atualizada e token consumido |
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

| Método | Rota | Autenticação | Descrição |
| ------ | ---- | ------------ | --------- |
| `POST` | `/organization` | Bearer JWT | Cria organização; usuário vira `ADMIN` e `ownerId` |
| `GET` | `/organizations` | Bearer JWT | Lista organizações em que o usuário é membro (com papel) |
| `GET` | `/organizations/:slug` | Bearer JWT | Detalhes da organização (requer membership) |
| `PUT` | `/organizations/:slug` | Bearer JWT | Atualiza organização (exige permissão `update` no CASL) |
| `GET` | `/organization/:slug/membership` | Bearer JWT | Membership do usuário na organização |

Todas as rotas estão sob a tag OpenAPI `organizations`.

**`POST /organization`** — [`create-organization.ts`](apps/api/src/http/routes/orgs/create-organization.ts)

| Campo | Regras |
| ----- | ------ |
| `name` | string |
| `domain` | string, opcional |
| `shouldAttachUsersByDomain` | boolean, opcional |

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `201` | `{ "organizationId": "..." }` | Organização criada |
| `400` | `{ "message": "..." }` | Domínio já em uso |

**`GET /organizations`** — [`get-organizations.ts`](apps/api/src/http/routes/orgs/get-organizations.ts)

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `200` | `{ "organizations": [{ "id", "name", "slug", "avatarUrl", "role" }] }` | Lista de memberships |

**`GET /organizations/:slug`** — [`get-organization.ts`](apps/api/src/http/routes/orgs/get-organization.ts)

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `200` | `{ "organization": { ... } }` | Usuário é membro da organização |
| `401` | `{ "message": "..." }` | Token inválido ou não é membro |

**`PUT /organizations/:slug`** — [`update-organization.ts`](apps/api/src/http/routes/orgs/update-organization.ts)

| Campo | Regras |
| ----- | ------ |
| `name` | string |
| `domain` | string ou `null` |
| `shouldAttachUsersByDomain` | boolean |

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `204` | — | Atualizado com sucesso |
| `400` | `{ "message": "..." }` | Domínio já em uso por outra org |
| `401` | `{ "message": "..." }` | Sem permissão CASL ou não é membro |

**`GET /organization/:slug/membership`** — [`get-membership.ts`](apps/api/src/http/routes/orgs/get-membership.ts)

| Status | Corpo | Quando |
| ------ | ----- | ------ |
| `200` | `{ "membership": { "id", "role", "organizationId" } }` | Membership encontrado |

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

## Pacotes (`packages/`)

### `@saas/auth`

Biblioteca de autorização com [CASL](https://casl.js.org/) e tipagem com [Zod](https://zod.dev/) em [`packages/auth/`](packages/auth/).

#### API principal

- **`defineAbilityFor(user)`** — monta a `AppAbility` a partir do `id` e do `role` do usuário.
- **Schemas exportados** — `userSchema`, `projectSchema`, `organizationSchema` (modelos com `__typename` para checagens em instâncias).

#### Papéis

| Papel     | Permissões (resumo) |
| --------- | ------------------- |
| `ADMIN`   | `manage` em `all`, exceto `transfer_ownership` e `update` em `Organization` (permitidos apenas quando `ownerId` é o próprio usuário) |
| `MEMBER`  | `get` em `User`; `create` e `get` em `Project`; `update` e `delete` em `Project` quando `ownerId` é o próprio usuário |
| `BILLING` | `manage` em `Billing` |

Regras completas em [`permissions.ts`](packages/auth/src/permissions.ts). Papéis válidos em [`roles.ts`](packages/auth/src/roles.ts).

#### Subjects e ações

| Subject        | Ações |
| -------------- | ----- |
| `User`         | `manage`, `get`, `update`, `delete` |
| `Project`      | `manage`, `get`, `create`, `update`, `delete` |
| `Organization` | `manage`, `update`, `delete`, `transfer_ownership` |
| `Invite`       | `manage`, `get`, `create`, `delete` |
| `Billing`      | `manage`, `get`, `export` |
| `all`          | `manage` (apenas `ADMIN`) |

Subjects tipados em [`packages/auth/src/subjects/`](packages/auth/src/subjects/). Modelos com condições de campo (ex.: `ownerId`) em [`packages/auth/src/models/`](packages/auth/src/models/).

Para checar permissão sobre um recurso específico, passe a instância parseada pelo schema (o `detectSubjectType` usa `__typename`):

```ts
import { defineAbilityFor, projectSchema } from '@saas/auth';

const ability = defineAbilityFor({ id: 'user-1', role: 'MEMBER' });

const project = projectSchema.parse({
  id: 'project-1',
  ownerId: 'user-1',
});

ability.can('get', 'User');        // true
ability.can('delete', 'User');     // false
ability.can('get', project);       // true
ability.can('delete', project);    // true (owner)
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

| Export      | Arquivo      | Uso                                                                 |
| ----------- | ------------ | ------------------------------------------------------------------- |
| `next-js`   | `next.js`    | Apps Next.js (base Rocketseat + `eslint-plugin-simple-import-sort`) |
| `node`      | `node.js`    | Pacotes Node (ex.: `@saas/api`)                                     |
| `library`   | `library.js` | Bibliotecas compartilhadas (ex.: `@saas/auth`)                      |

Detalhes de uso em [`config/eslint-config/README.md`](config/eslint-config/README.md).

### `@saas/tsconfig`

Configs TypeScript base em [`config/typescript-config/`](config/typescript-config/):

| Arquivo         | Uso                                      |
| --------------- | ---------------------------------------- |
| `node.json`     | Apps e pacotes Node (ex.: `@saas/api`)   |
| `library.json`  | Bibliotecas compartilhadas (ex.: `@saas/auth`) |

Nos workspaces, estenda com `"extends": "@saas/tsconfig/node.json"` ou `"@saas/tsconfig/library.json"`.

## Turborepo

O arquivo [`turbo.json`](turbo.json) define as tasks:

- **`build`** — depende de `^build` nos pacotes upstream; saída em `.next/**` (exceto cache).
- **`dev`** — persistente, sem cache.
- **`lint`** e **`check-types`** — dependem das mesmas tasks nos pacotes upstream.

## Variáveis de ambiente

Arquivos `.env` não são versionados (ver [`.gitignore`](.gitignore)). Use um único `.env` na **raiz** do monorepo; a API e o Prisma CLI leem esse arquivo via `dotenv -e ../../.env` no workspace `@saas/api`.

Definição e validação em [`packages/env/index.ts`](packages/env/index.ts).

| Variável | Obrigatória | Descrição |
| -------- | ----------- | --------- |
| `SERVER_PORT` | Não (padrão `3333`) | Porta HTTP da API |
| `DATABASE_URL` | Sim | URL PostgreSQL (Prisma) |
| `JWT_SECRET` | Sim | Chave para assinar/validar JWT |
| `GITHUB_CLIENT_ID` | Sim* | Client ID do app OAuth GitHub |
| `GITHUB_CLIENT_SECRET` | Sim* | Client secret do app OAuth GitHub |
| `GITHUB_REDIRECT_URI` | Sim* | URI de callback registrada no GitHub |
| `NEXT_PUBLIC_API_URL` | Sim** | URL base da API (apps Next.js) |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | Sim** | Client ID exposto ao browser |
| `NEXT_PUBLIC_JWT_SECRET` | Sim** | Mesmo segredo JWT no cliente (se aplicável) |
| `NODE_ENV` | Não (padrão `development`) | Ambiente de execução |

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
