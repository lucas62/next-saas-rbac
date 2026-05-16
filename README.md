# next-saas-rbac

Monorepo [Turborepo](https://turbo.build/repo) com workspaces npm. Este repositório centraliza configurações compartilhadas de ESLint, Prettier e TypeScript em `config/`. As pastas `apps/` e `packages/` estão reservadas para aplicações e bibliotecas que serão adicionadas ao projeto.

**Requisitos:** Node.js `>=18` · npm `11.11.0`

## Pré-requisitos

| Item    | Versão                           |
| ------- | -------------------------------- |
| Node.js | `>=18` (ver `engines` na raiz)   |
| npm     | `11.11.0` (ver `packageManager`) |

Recomenda-se habilitar o [Corepack](https://nodejs.org/api/corepack.html) para usar a versão de npm definida no repositório:

```bash
corepack enable
```

Instale as dependências **sempre na raiz** do monorepo. Dependências entre pacotes internos usam `"*"` (por exemplo, `@saas/prettier` em `config/eslint-config`), e não o protocolo `workspace:*`, por compatibilidade com o resolver do npm 11.

## Primeiros passos

```bash
git clone <url-do-repositorio>
cd next-saas-rbac
corepack enable   # opcional
npm install
```

As pastas `apps/` e `packages/` ainda estão vazias. Por isso, `npm run dev` e os demais scripts do Turborepo só passarão a executar tarefas quando existirem workspaces com os scripts correspondentes.

## Scripts

Comandos disponíveis na raiz ([`package.json`](package.json)):

| Script        | Comando               | Observação                                                        |
| ------------- | --------------------- | ----------------------------------------------------------------- |
| `dev`         | `npm run dev`         | Executa `turbo run dev` nos workspaces que definirem a task `dev` |
| `build`       | `npm run build`       | Executa `turbo run build` nos workspaces que definirem `build`    |
| `lint`        | `npm run lint`        | Executa `turbo run lint` nos workspaces que definirem `lint`      |
| `check-types` | `npm run check-types` | Executa `turbo run check-types` nos workspaces com essa task      |

Quando houver vários pacotes, é possível filtrar uma task com o Turborepo:

```bash
npx turbo run build --filter=<nome-do-pacote>
```

## Estrutura do monorepo

```mermaid
flowchart TB
  root[next-saas-rbac]
  root --> apps[apps/*]
  root --> packages[packages/*]
  root --> config[config/*]
  config --> eslint["@saas/eslint-config"]
  config --> prettier["@saas/prettier"]
  config --> tsconfig["@saas/tsconfig"]
```

```
.
├── apps/                    # reservado para aplicações (vazio)
├── packages/                # reservado para bibliotecas (vazio)
├── config/
│   ├── eslint-config/       # @saas/eslint-config
│   ├── prettier/            # @saas/prettier
│   └── typescript-config/   # @saas/tsconfig
├── package.json
└── turbo.json
```

Workspaces npm definidos na raiz: `apps/*`, `packages/*`, `config/*`.

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
| `node`      | `node.js`    | Pacotes Node                                                        |
| `library/*` | `library.js` | Bibliotecas compartilhadas                                          |

Detalhes de uso em [`config/eslint-config/README.md`](config/eslint-config/README.md).

### `@saas/tsconfig`

Pacote reservado para `tsconfig` base do monorepo ([`config/typescript-config/package.json`](config/typescript-config/package.json)). Os arquivos de configuração TypeScript serão adicionados aqui quando existirem apps e packages no repositório.

## Turborepo

O arquivo [`turbo.json`](turbo.json) define as tasks:

- **`build`** — depende de `^build` nos pacotes upstream; saída em `.next/**` (exceto cache).
- **`dev`** — persistente, sem cache.
- **`lint`** e **`check-types`** — dependem das mesmas tasks nos pacotes upstream.

## Variáveis de ambiente

Arquivos `.env` e variantes (`.env.local`, etc.) estão no [`.gitignore`](.gitignore) e não devem ser commitados. Quando aplicações forem adicionadas em `apps/`, documente as variáveis necessárias no README de cada app.

## Licença

Licença a definir.
