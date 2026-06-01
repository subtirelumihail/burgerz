# Burgerz

A Next.js app for browsing smash burgers, restaurants, and reviews. Built with the App Router, React 19, TypeScript, Tailwind CSS, and MSW for local API mocking.

## Prerequisites

- **Node.js 22.14.0** (see `.nvmrc` — run `nvm use` after cloning)
- **npm** (ships with Node)

## Getting started

```bash
git clone <repo-url>
cd burgerz
nvm use
npm install
npm run dev:mock
```

Open [http://localhost:3000](http://localhost:3000).

Use **`dev:mock`** for day-to-day development. The backend API is not required — MSW intercepts API calls and serves mock data. See [API mocking (MSW)](#api-mocking-msw) below.

### Without mocks

If you have a real API running, start the app without MSW:

```bash
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to your API origin (see [Environment variables](#environment-variables)).

## Environment variables

| Variable                  | Required | Description                                                                                                           |
| ------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_MOCKING` | No       | Set to `enabled` to turn on MSW. Used by `dev:mock`, E2E, and accessibility tests.                                    |
| `NEXT_PUBLIC_API_URL`     | No       | Base URL for API requests (e.g. `https://api.example.com`). Empty string means same-origin paths like `/api/burgers`. |
| `NEXT_PUBLIC_APP_URL`     | No       | Public app URL for server-side `fetch` origin resolution. Falls back to `VERCEL_URL` or `http://localhost:3000`.      |
| `PORT`                    | No       | Dev/production port (default `3000`).                                                                                 |
| `VERCEL_URL`              | No       | Set automatically on Vercel; used by the API client on the server.                                                    |

Copy `.env.example` to `.env.local` for local overrides.

## npm scripts

| Script         | Command                                                      | Description                                                                                     |
| -------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `dev`          | `next dev`                                                   | Start the dev server without MSW. Requires a real API or same-origin routes.                    |
| `dev:mock`     | `NEXT_PUBLIC_API_MOCKING=enabled next dev`                   | Start the dev server with MSW. **Default for local development.**                               |
| `build`        | `next build`                                                 | Production build (standalone output for Docker).                                                |
| `start`        | `next start`                                                 | Serve the production build. Run `build` first.                                                  |
| `lint`         | `eslint .`                                                   | Run ESLint across the project.                                                                  |
| `lint:fix`     | `eslint . --fix`                                             | Auto-fix ESLint issues where possible.                                                          |
| `format`       | `prettier --write .`                                         | Format all supported files with Prettier.                                                       |
| `format:check` | `prettier --check .`                                         | Check formatting without writing (used in CI).                                                  |
| `test`         | `vitest`                                                     | Run unit tests in watch mode.                                                                   |
| `test:run`     | `vitest run`                                                 | Run unit tests once (used in CI and pre-push hook).                                             |
| `test:e2e`     | `playwright test`                                            | Run Playwright E2E tests. Starts `dev:mock` automatically.                                      |
| `test:e2e:ui`  | `playwright test --ui`                                       | Run E2E tests with the Playwright UI.                                                           |
| `test:a11y`    | `NEXT_PUBLIC_API_MOCKING=enabled node scripts/run-pa11y.mjs` | Run pa11y accessibility checks against key routes. Starts a mock dev server if none is running. |
| `prepare`      | `husky`                                                      | Installs Git hooks after `npm install`.                                                         |

### Git hooks

- **pre-commit** — runs `lint-staged` (ESLint + Prettier on staged files)
- **pre-push** — runs `npm run lint` and `npm run test:run`

## API mocking (MSW)

[MSW](https://mswjs.io/) (Mock Service Worker) intercepts `fetch` calls from app code — in the browser, in React Server Components, and during server rendering. It does **not** intercept arbitrary inbound HTTP to Next.js route handlers.

### When MSW is active

MSW runs when `NEXT_PUBLIC_API_MOCKING=enabled`:

- `npm run dev:mock`
- Playwright E2E (`playwright.config.ts` starts `dev:mock`)
- Accessibility tests (`npm run test:a11y`)

### How it is wired

```
┌─────────────────────────────────────────────────────────────┐
│  NEXT_PUBLIC_API_MOCKING=enabled                            │
├─────────────────────────────────────────────────────────────┤
│  Server (RSC / SSR)                                         │
│    instrumentation.ts → mocks/server.ts (msw/node)          │
│                                                             │
│  Browser (client components)                              │
│    app/layout.tsx → MswWrapper → MswProvider               │
│      → mocks/browser.ts (msw/browser)                       │
│      → public/mockServiceWorker.js                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    mocks/handlers/  (shared handlers)
                              │
                              ▼
                    mocks/data/ + *-store.ts  (in-memory state)
```

1. **`instrumentation.ts`** — on the Node.js runtime, imports `mocks/server.ts` and calls `server.listen()`.
2. **`components/msw-provider.tsx`** — client-side; dynamically imports `mocks/browser.ts` and starts the service worker before rendering children.
3. **`app/msw-wrapper.tsx`** — wraps the app in `MswProvider` only when mocking is enabled.
4. **`mocks/handlers/`** — shared request handlers (used by both server and browser).
5. **`mocks/data/`** and **`*-store.ts`** — seed data and in-memory stores that handlers read/write.

Unhandled requests are passed through (`onUnhandledRequest: "bypass"`), so Next.js assets and third-party requests are unaffected.

### Adding or changing mock APIs

1. Add seed data in `mocks/data/` if needed.
2. Add store logic in `mocks/*-store.ts` for mutable state (e.g. creating reviews).
3. Define handlers in `mocks/handlers/<resource>.ts` using `http.get`, `http.post`, etc.
4. Export them from `mocks/handlers/index.ts`.

Example handler pattern:

```typescript
import { http, HttpResponse } from "msw";
import { getBurgerById } from "@/mocks/burger-store";

export const burgerHandlers = [
  http.get("/api/burgers/:id", ({ params }) => {
    const burger = getBurgerById(params.id as string);
    if (!burger) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(burger);
  }),
];
```

App code calls the API through `lib/api/client.ts`, which resolves URLs from `NEXT_PUBLIC_API_URL` or the current origin. MSW matches those same paths.

### Regenerating the service worker

If you upgrade MSW or change the worker directory, regenerate the worker file:

```bash
npx msw init public/
```

The worker lives at `public/mockServiceWorker.js` (configured in `package.json` under `"msw.workerDirectory"`).

## Unit tests

Unit tests use [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and jsdom.

### What to test

| Layer     | Location                  | Focus                                             |
| --------- | ------------------------- | ------------------------------------------------- |
| Component | `components/**`, `app/**` | Renders, user-visible output, interactions        |
| Hook      | `hooks/use*.ts`           | Return values, loading/error states, side effects |
| Service   | `lib/services/*.ts`       | Success path, error handling, correct API calls   |

### File naming and placement

Colocate tests next to the source file. Use the `.unit.test.ts(x)` suffix:

```
components/Button/Button.tsx           →  components/Button/Button.unit.test.tsx
hooks/useAddReviewForm.ts              →  hooks/useAddReviewForm.unit.test.ts
lib/services/burger.service.ts         →  lib/services/burger.service.unit.test.ts
```

Do not put unit tests in `__tests__/` or `e2e/`. The `.unit.test` suffix distinguishes them from Playwright specs.

### Conventions

- Prefer `screen.getByRole` over test IDs or CSS selectors.
- Next.js APIs are mocked globally in `vitest.setup.tsx` (`next/image`, `next/navigation`, `next/headers`, `next/cache`).
- Mock services in hook tests when testing data-fetching logic.
- Run `npm run test:run` before opening a PR (also enforced on pre-push).

Example:

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Button } from "./Button";

test("renders label", () => {
  render(<Button label="Order" />);
  expect(screen.getByRole("button", { name: "Order" })).toBeInTheDocument();
});
```

### Exceptions

- **Async Server Components** with `await` — cover with Playwright E2E, not Vitest.
- **Layout-only wrappers** with no logic — no test required.
- **Type-only files** (`types.ts`) — skip.

### Configuration

- `vitest.config.mts` — jsdom environment, path aliases, includes `**/*.unit.test.{ts,tsx}`.
- `vitest.setup.tsx` — jest-dom matchers, Next.js mocks, cleanup after each test.

## E2E tests

Playwright specs live in `e2e/` with a `.spec.ts` suffix. Every App Router page should have a matching spec. E2E runs against `dev:mock` automatically.

```bash
npm run test:e2e        # headless
npm run test:e2e:ui     # interactive UI
```

See [docs/agents/e2e-testing.md](docs/agents/e2e-testing.md) for conventions.

## Accessibility

The app targets **WCAG 2.1 Level AA**. Accessibility is enforced through automated checks, lint rules, test conventions, and component guidelines — not as a one-off audit.

### Automated checks

**pa11y** runs in CI on every pull request and locally via:

```bash
npm run test:a11y
```

The script (`scripts/run-pa11y.mjs`):

1. Starts a mock dev server with MSW if none is running on port `3000` (or reuses an existing `dev:mock` server).
2. Runs [pa11y-ci](https://github.com/pa11y/pa11y-ci) once against all routes with [axe](https://www.deque.com/axe/):
   - `/`
   - `/restaurants`
   - `/burgers/burger-1`
   - `/burgers/burger-1/add-review`
   - `/restaurants/restaurant-1`
3. Fails on **error**-level issues only (`pa11y.json` — standard: `WCAG2AA`).

Shared pa11y settings live in `pa11y.json`. Route list lives in `pa11y-ci.config.cjs` — add new paths there when you ship pages that should be covered.

**Troubleshooting `test:a11y`:**

- Port in use without mock data — stop the stale server or run `PORT=3010 npm run test:a11y`.
- Server running without MSW — stop it and use `npm run dev:mock`, or let the script start its own server.
- Puppeteer/Chrome missing locally — CI installs Chrome via `npx puppeteer browsers install chrome`.

**ESLint** — `eslint-plugin-jsx-a11y` recommended rules run as **errors** on `.tsx`/`.jsx` files (via `eslint.config.mjs`). `eslint-config-next` still supplies the plugin and Next.js-specific checks such as `next/image` alt text. Run `npm run lint` to catch common JSX accessibility mistakes.

**Unit and E2E tests** — prefer role-based queries (`getByRole`, `getByLabelText`) over test IDs or CSS selectors. This keeps tests aligned with how assistive tech discovers elements.

### Component guidelines

Full details: [docs/agents/react-accessibility.md](docs/agents/react-accessibility.md). Summary:

| Area                 | Rule                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Semantics**        | Use native elements (`button`, `a`, `nav`, `main`, `label`, `input`). Never `<div onClick>` for actions.                         |
| **Headings**         | Logical order (`h1` → `h2` → …); don't skip levels for styling.                                                                  |
| **Forms**            | Visible labels via `htmlFor`/`id`; errors linked with `aria-invalid` and `aria-describedby`.                                     |
| **Images**           | Meaningful `alt` text; decorative images use `alt=""`.                                                                           |
| **Icon buttons**     | Require `aria-label` (or visually hidden text); mark icons `aria-hidden`.                                                        |
| **Keyboard**         | All controls reachable and operable via Tab, Enter, Space, Escape.                                                               |
| **Focus**            | Visible focus styles — never remove outlines without a replacement.                                                              |
| **Links vs buttons** | Links navigate; buttons act. Use `aria-current="page"` for the current route.                                                    |
| **ARIA**             | Prefer semantic HTML. Add ARIA only when native elements can't express the pattern.                                              |
| **Live regions**     | Use `role="alert"` or `aria-live="polite"` for dynamic status messages.                                                          |
| **Color**            | Don't rely on color alone for meaning or state. Meet **4.5:1** contrast for body text, **3:1** for large text and UI components. |

Modals, menus, and disclosure widgets must trap/restore focus, close on Escape, and expose state with `aria-expanded`, `aria-controls`, and `aria-haspopup` where appropriate.

### Manual checklist

Before shipping UI changes, verify:

- [ ] Tab through all interactive elements in logical order
- [ ] Screen reader announces name, role, and state correctly
- [ ] Color is not the only indicator of meaning or state
- [ ] Text and UI controls meet WCAG AA contrast
- [ ] Touch targets are at least **44×44px** (see [Building components](#building-components))
- [ ] `npm run test:a11y` passes for affected routes

Use browser DevTools (Accessibility tree, Lighthouse) or VoiceOver (macOS) / NVDA (Windows) for spot checks beyond automation.

### Adding a new page

1. Build with semantic HTML and the guidelines above.
2. Add the route to `pa11y-ci.config.cjs` if it should be scanned in CI.
3. Use role-based locators in E2E specs (`getByRole`, `getByLabel`).
4. Run `npm run test:a11y` before opening a PR.

## Building components

Components follow a consistent folder structure, styling approach, and composition rules. Full details live in [docs/agents/react-component-composition.md](docs/agents/react-component-composition.md); the essentials:

### Folder structure

Every component gets its own **PascalCase** folder:

```
components/
  Menu/
    Menu.tsx
    Menu.module.css
    Menu.unit.test.tsx
    types.ts
    components/
      MenuItem/
        MenuItem.tsx
        MenuItem.module.css
        MenuItem.unit.test.tsx
        types.ts
```

Rules:

- One folder per component — no loose `button.tsx` at the root of `components/`.
- **`types.ts` required** in every component folder (props, local state, UI-only interfaces).
- **`ComponentName.module.css` required** — all styles live in the module, not inline in JSX.
- Subcomponents go in `components/<SubComponentName>/` inside the parent folder.
- Shared hooks → `hooks/`; domain types → `types/` at project root.

### Styling

Do **not** put Tailwind utility classes directly on JSX elements. Use CSS Modules with `@apply`:

```tsx
// ✅ styles in the module, semantic classes in JSX
import styles from "./Button.module.css";

function Button({ label }: ButtonProps) {
  return <button className={styles.root}>{label}</button>;
}
```

```css
/* components/Button/Button.module.css */
@reference "../../../app/globals.css";

.root {
  @apply inline-flex items-center justify-center gap-2;
  @apply rounded-md bg-accent px-xl py-md;
}
```

Design tokens live in `app/globals.css` (`@theme`). Responsive styles belong in the CSS module (mobile-first, 320px through desktop).

### Composition

- Keep components focused — split when JSX/logic exceeds ~80 lines or has distinct UI sections.
- **UI sections** → subcomponents in a nested `components/` folder.
- **Reusable logic** → custom hooks (`useOrderSummary`, not inline effects).
- **Orchestrator pattern** — page/parent components compose smaller pieces; pass only the props each child needs.
- Prefer **named exports**; default exports only for App Router pages.

### Responsive design

- Mobile-first CSS in the module; avoid viewport branching in JSX unless the DOM structure must change.
- Minimum **44×44px** touch targets for interactive elements.
- Do not hide core functionality with `display: none` on mobile — adapt layout instead.
- Verify at **320px**, **768px**, and **1280px**.

## Project structure

```
app/                  App Router pages and layouts
components/           React components (one folder per component)
hooks/                Shared custom hooks
lib/
  api/                fetch client
  services/           API service layer
mocks/                MSW handlers, stores, and seed data
e2e/                  Playwright specs
types/                Shared domain TypeScript types
scripts/              CI/deploy helper scripts
public/               Static assets + MSW service worker
```

## Deployment

The app builds as a **standalone** Next.js output (`next.config.ts`) and ships in a multi-stage **Docker** image.

### Build and run locally with Docker

```bash
docker build -t burgerz .
docker run -p 3000:3000 burgerz
```

Open [http://localhost:3000](http://localhost:3000).

For production behind a reverse proxy, set `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_API_URL` at build time if the app must call an external API.

### CI/CD

**Pull requests** (`.github/workflows/ci.yml`):

1. Dependency audit (`npm audit --audit-level=high`), lint, format check, unit tests, production build
2. Accessibility tests (pa11y with MSW)
3. E2E tests (Playwright with MSW)
4. Docker image build
5. Mock deploy preview (dry run)

**Main branch** (`.github/workflows/deploy.yml`):

1. Build Docker image tagged with the commit SHA
2. Run `scripts/mock-deploy.sh` (placeholder — replace with real deploy steps)

Deploy is currently **simulated**. The script logs what would happen (push image, SSH, health check). Replace `scripts/mock-deploy.sh` when a real server is ready.

Manual deploy dispatch is available via GitHub Actions → Deploy → choose `staging` or `production`.

### Production checklist

- [ ] Set `NEXT_PUBLIC_API_URL` to the production API (disable MSW — do not set `NEXT_PUBLIC_API_MOCKING=enabled`)
- [ ] Set `NEXT_PUBLIC_APP_URL` to the public site URL
- [ ] Build with `npm run build` or the Dockerfile
- [ ] Run `npm run test:run` and `npm run test:e2e` before release

## Contributing

1. Create a feature branch from `main`.
2. Use `npm run dev:mock` while developing.
3. Add or update unit tests for components, hooks, and services you change.
4. Add or update E2E specs for pages you change.
5. Run `npm run lint`, `npm run test:run`, `npm run test:a11y`, and `npm run test:e2e` before pushing.
6. Open a PR — CI must pass before merge.
