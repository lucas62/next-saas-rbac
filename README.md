# Next.js SaaS RBAC Monorepo 🚀

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Fastify-5.8-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Turborepo-2.0-FF007A?style=for-the-badge&logo=turborepo" alt="Turborepo" />
</p>

> SaaS Multi-tenant completo com controle de acesso baseado em papéis (RBAC), implementado em um monorepo de alta performance orquestrado por Turborepo e npm workspaces.

---

## ✨ Funcionalidades Principais

- 👥 **Multi-tenant SaaS:** Organizações isoladas com convites, membros e projetos.
- 🔒 **RBAC Centralizado (CASL):** Permissões rígidas (`ADMIN`, `MEMBER`, `BILLING`) aplicadas ponta a ponta.
- ⚡ **Backend Ultrarrápido:** API HTTP com Fastify 5, Zod e documentação OpenAPI interativa (`/docs`).
- 🎨 **Frontend Premium:** Next.js 15 (App Router), React 19, Server Actions e Tailwind CSS v4.
- 🐳 **Prisma & Docker:** Persistência no PostgreSQL configurada via Docker Compose e Prisma ORM v7.

---

## 📁 Estrutura do Monorepo

```mermaid
flowchart TD
  subgraph apps["apps/ — Aplicações"]
    api["@saas/api<br/><small>Fastify · Prisma · :3333</small>"]
    web["web<br/><small>Next.js 15 · :3000</small>"]
  end

  subgraph packages["packages/ — Bibliotecas"]
    auth["@saas/auth<br/><small>CASL · RBAC</small>"]
    env["@saas/env<br/><small>Zod · env</small>"]
  end

  subgraph config["config/ — Tooling"]
    eslint["@saas/eslint-config"]
    prettier["@saas/prettier"]
    tsconfig["@saas/tsconfig"]
  end

  db[("PostgreSQL<br/><small>Docker :5432</small>")]

  api --> auth
  api --> env
  api --> db
  web -.->|"HTTP (Ky)"| api
  
  api & web & auth -.-> eslint & prettier & tsconfig
```

### Workspaces e Portas
* **`apps/web`** (`web`): Frontend Next.js na porta `3000`
* **`apps/api`** (`@saas/api`): Backend Fastify na porta `3333`
* **`packages/auth`** (`@saas/auth`): Biblioteca de regras de controle de acesso (CASL)
* **`packages/env`** (`@saas/env`): Validação de variáveis de ambiente com Zod
* **`config/*`**: Configurações compartilhadas de ESLint, Prettier e TypeScript

---

## 🚀 Como Começar

### Pré-requisitos
* Node.js `>=18` (npm `11.11.0`)
* Docker e Docker Compose instalados

### Passo a Passo Rápido

1. **Clone o repositório & Instale dependências:**
   ```bash
   git clone <url-do-repositorio>
   cd next-saas-rbac
   corepack enable # opcional, ativa npm recomendado
   npm install
   ```

2. **Suba o banco de dados local:**
   ```bash
   docker compose up -d
   ```

3. **Configure as variáveis de ambiente:**
   Crie o arquivo `.env` na raiz do repositório:
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

4. **Prepare o banco e popule dados:**
   ```bash
   npm run db:generate  # Gera o Prisma Client
   npm run db:migrate   # Roda as migrations
   npm run db:seed      # Popula banco (john.doe@example.com / 123456)
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   * Frontend: `http://localhost:3000`
   * API: `http://localhost:3333` (Docs interativas em `/docs`)

---

## 🛠️ Scripts Principais (na Raiz)

| Script | Comando | Descrição |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Inicia todos os serviços em modo de desenvolvimento |
| `build` | `npm run build` | Compila todos os pacotes e aplicações |
| `lint` | `npm run lint` | Executa o linter ESLint em todos os workspaces |
| `db:migrate` | `npm run db:migrate` | Aplica as migrations do Prisma |
| `db:seed` | `npm run db:seed` | Executa o seed de desenvolvimento |
| `db:studio` | `npm run db:studio` | Abre o painel visual do Prisma Studio |

---

## 📄 Licença

Este projeto é de uso privado. Licença a definir.
