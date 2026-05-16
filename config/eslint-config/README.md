# `@saas/eslint-config`

Configurações ESLint compartilhadas do monorepo **next-saas-rbac**.

## Exports

| Import                          | Arquivo      | Descrição                                        |
| ------------------------------- | ------------ | ------------------------------------------------ |
| `@saas/eslint-config/next-js`   | `next.js`    | Apps Next.js (Rocketseat + ordenação de imports) |
| `@saas/eslint-config/node`      | `node.js`    | Pacotes Node                                     |
| `@saas/eslint-config/library/*` | `library.js` | Bibliotecas internas                             |

Cada export aponta para um arquivo de configuração em CommonJS (`module.exports`) pronto para ser estendido pelo ESLint do workspace que o consumir.
