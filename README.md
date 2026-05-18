# next-saas-rbac

Monorepo [Turborepo](https://turbo.build/repo) com workspaces npm para um SaaS com controle de acesso baseado em papéis (RBAC). O pacote `@saas/auth` centraliza permissões com [CASL](https://casl.js.org/); a API em `apps/api` consome esse pacote, expõe rotas HTTP com documentação OpenAPI em `/docs` e persiste dados com [Prisma](https://www.prisma.io/) e PostgreSQL.

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

Crie o arquivo `apps/api/.env` com a URL de conexão (credenciais alinhadas ao [`docker-compose.yml`](docker-compose.yml)):

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/next-saas"
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
  api --> auth
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
│           ├── http/        # servidor, rotas (ex.: auth/) e Swagger UI
│           └── lib/         # cliente Prisma compartilhado
├── packages/
│   └── auth/                # @saas/auth — RBAC com CASL
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

API HTTP com [Fastify](https://fastify.dev/), validação e schemas OpenAPI via [fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod), documentação com [@fastify/swagger](https://github.com/fastify/fastify-swagger) + [@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui), [CORS](https://github.com/fastify/fastify-cors) habilitado e persistência com Prisma 7 em [`apps/api/`](apps/api/).

| Caminho | Descrição |
| ------- | --------- |
| [`src/http/server.ts`](apps/api/src/http/server.ts) | Entrada do servidor (porta `3333`, Swagger em `/docs`, CORS) |
| [`src/http/routes/`](apps/api/src/http/routes/) | Rotas HTTP agrupadas por domínio |
| [`src/lib/prisma.ts`](apps/api/src/lib/prisma.ts) | Cliente Prisma com adapter `@prisma/adapter-pg` |
| [`prisma/schema.prisma`](apps/api/prisma/schema.prisma) | Modelos do banco |
| [`prisma/seeds.ts`](apps/api/prisma/seeds.ts) | Seed de desenvolvimento (organizações por papel) |
| [`prisma.config.ts`](apps/api/prisma.config.ts) | Configuração do Prisma CLI (`DATABASE_URL`) |

O runtime da API usa Prisma 7 com driver adapter PostgreSQL (`pg`). O client é exportado de `src/lib/prisma.ts` e reutilizado nas rotas e no seed. Com o servidor em execução, a especificação OpenAPI e o Swagger UI ficam disponíveis em `/docs`.

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

#### Rotas HTTP (inicial)

| Método | Rota     | Tag OpenAPI | Descrição |
| ------ | -------- | ----------- | --------- |
| `POST` | `/users` | `auth`      | Criação de conta (nome, e-mail, senha com bcrypt) |

**`POST /users`** — corpo validado com Zod:

| Campo      | Regras                          |
| ---------- | ------------------------------- |
| `name`     | string, mínimo 1 caractere      |
| `email`    | e-mail válido                   |
| `password` | string, mínimo 6 caracteres     |

Respostas:

| Status | Corpo (exemplo)                              | Quando |
| ------ | -------------------------------------------- | ------ |
| `201`  | `{ "message": "User created successfully" }` | Usuário criado |
| `400`  | `{ "message": "User with same email already exists" }` | E-mail já cadastrado |

Implementação em [`src/http/routes/auth/create-account.ts`](apps/api/src/http/routes/auth/create-account.ts).

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"secret123"}'
```

Alternativa: abra [`http://localhost:3333/docs`](http://localhost:3333/docs) e execute a operação pela interface Swagger.

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

Arquivos `.env` não são versionados (ver [`.gitignore`](.gitignore)).

### `@saas/api`

| Variável        | Obrigatória | Descrição |
| --------------- | ----------- | --------- |
| `DATABASE_URL`  | Sim         | URL PostgreSQL usada pelo Prisma (`prisma.config.ts`) |

Exemplo para desenvolvimento local com o `docker-compose.yml` do repositório:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/next-saas"
```

## Licença

Licença a definir.
