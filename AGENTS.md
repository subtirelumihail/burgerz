# Project Agent Guidelines

Single source of truth for AI coding agents across all IDEs and providers (Cursor, Claude Code, GitHub Copilot, Windsurf, etc.).

**Before writing code:** read the [always-apply rules](#always-apply), then open every scoped guide that matches the files you will touch.

---

## How to use these instructions

1. **Start here** — this file lists all rules and when each applies.
2. **Read scoped guides** — detailed instructions live in [`docs/agents/`](./docs/agents/). Open the files relevant to your task before editing.
3. **Follow cross-links** — scoped guides reference each other (e.g. services → types → composition).

If your tool supports file includes, point it at this file:

| Tool           | Entry point                                     |
| -------------- | ----------------------------------------------- |
| Any agent      | `AGENTS.md` (this file)                         |
| Claude Code    | `CLAUDE.md` → `@AGENTS.md`                      |
| GitHub Copilot | `.github/copilot-instructions.md` → `AGENTS.md` |
| Cursor         | `.cursor/rules/*.mdc` (mirrors `docs/agents/`)  |

---

## Always apply

Read these on every task:

| Guide                  | Path                                                                         |
| ---------------------- | ---------------------------------------------------------------------------- |
| Next.js version notice | [docs/agents/nextjs.md](./docs/agents/nextjs.md)                             |
| Package dependencies   | [docs/agents/package-dependencies.md](./docs/agents/package-dependencies.md) |

---

## Scoped guides

Read the guides that match the paths you are editing:

| Scope                 | Paths                                            | Guide                                                                                      |
| --------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| API mocking           | `mocks/`, services, local dev                    | [docs/agents/api-mocking.md](./docs/agents/api-mocking.md)                                 |
| Global types          | `types/`, `hooks/`, `lib/`                       | [docs/agents/global-types.md](./docs/agents/global-types.md)                               |
| Backend services      | `lib/services/`, `hooks/`                        | [docs/agents/backend-services.md](./docs/agents/backend-services.md)                       |
| React hooks           | `hooks/use*.ts`                                  | [docs/agents/react-hooks.md](./docs/agents/react-hooks.md)                                 |
| Hybrid rendering      | `**/*.{tsx,jsx}`                                 | [docs/agents/nextjs-hybrid-rendering.md](./docs/agents/nextjs-hybrid-rendering.md)         |
| Component composition | `**/*.{tsx,jsx,css}`                             | [docs/agents/react-component-composition.md](./docs/agents/react-component-composition.md) |
| Accessibility         | `**/*.{tsx,jsx}`                                 | [docs/agents/react-accessibility.md](./docs/agents/react-accessibility.md)                 |
| Unit testing          | `components/`, `hooks/`, `lib/services/`, `app/` | [docs/agents/unit-testing.md](./docs/agents/unit-testing.md)                               |
| E2E testing           | `app/**/page.tsx`                                | [docs/agents/e2e-testing.md](./docs/agents/e2e-testing.md)                                 |

---

## Quick reference by task

| Task                | Read                                                                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add an npm package  | [package-dependencies](./docs/agents/package-dependencies.md)                                                                                                                                                          |
| Add a page route    | [nextjs-hybrid-rendering](./docs/agents/nextjs-hybrid-rendering.md), [e2e-testing](./docs/agents/e2e-testing.md)                                                                                                       |
| Add a component     | [react-component-composition](./docs/agents/react-component-composition.md), [react-accessibility](./docs/agents/react-accessibility.md), [unit-testing](./docs/agents/unit-testing.md)                                |
| Add API integration | [global-types](./docs/agents/global-types.md), [backend-services](./docs/agents/backend-services.md), [api-mocking](./docs/agents/api-mocking.md), [nextjs-hybrid-rendering](./docs/agents/nextjs-hybrid-rendering.md) |
| Add a hook          | [react-hooks](./docs/agents/react-hooks.md), [backend-services](./docs/agents/backend-services.md), [global-types](./docs/agents/global-types.md), [unit-testing](./docs/agents/unit-testing.md)                       |

---

## Architecture docs

- [Application C4 diagram](./docs/architecture/application-c4-diagram.md)
