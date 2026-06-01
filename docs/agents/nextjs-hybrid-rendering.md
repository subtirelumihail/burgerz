# Next.js Hybrid Rendering

**Applies when editing:** `**/*.{tsx,jsx}`

Components default to **Server Components**. Add `'use client'` only at the smallest interactive leaf — never on pages or layouts by default.

## API Data: Always From the UI

**All backend API calls are made from client components via hooks** — including the initial page load. Do not fetch API data in Server Components or pass server-prefetched lists as props.

Every fetch must show a **loading state in the UI** (skeleton, disabled controls, status text, `aria-busy`).

| Concern                                     | Where it lives                       |
| ------------------------------------------- | ------------------------------------ |
| Static page shell (title, layout)           | Server Component (`app/**/page.tsx`) |
| API fetch (initial + search/submit/refetch) | Hook (`hooks/use*.ts`) → service     |
| Loading/error/data rendering                | Client component leaf                |

## Server vs Client

**Server Component (default)** — use for:

- Static structure, headings, metadata
- Composing client leaves (no fetched API props)
- Secrets and server-only logic unrelated to client API calls

**Client Component (`'use client'`)** — use for:

- Hooks that call services (`useBurgers`, `useOrder`)
- State, event handlers, `useEffect` for mount fetch
- Loading and error UI tied to API calls
- Browser APIs (`window`, `localStorage`)

```tsx
// ✅ GOOD — server shell, client leaf owns all API data + loading
// app/page.tsx (Server Component)
import { HomeBurgers } from "@/components/HomeBurgers/HomeBurgers";

export default function Home() {
  return (
    <div>
      <h1>Find your next burger</h1>
      <HomeBurgers />
    </div>
  );
}

// components/HomeBurgers/HomeBurgers.tsx
("use client");
export function HomeBurgers() {
  const { burgers, isLoading, error, search, query, setQuery } = useBurgers();
  return (
    <>
      <BurgerSearch
        query={query}
        onQueryChange={setQuery}
        onSearch={search}
        isLoading={isLoading}
      />
      {error ? <p role="alert">{error.message}</p> : null}
      <BurgersList burgers={burgers} isLoading={isLoading} />
    </>
  );
}
```

```tsx
// ❌ BAD — server page prefetches API data
export default async function Home() {
  const { burgers } = await getBurgers();
  return <HomeBurgers initialBurgers={burgers} />;
}

// ❌ BAD — fetch in page without loading UI boundary
("use client");
export default function Home() {
  useEffect(() => {
    getBurgers().then(setBurgers);
  }, []);
  return <BurgersList burgers={burgers} />; // no isLoading
}

// ❌ BAD — full-page client when only data + search need interactivity
("use client");
export default function Home() {
  // entire page client just to fetch — extract HomeBurgers instead
}
```

## Composition Patterns

- **Push the client boundary down** — keep `page.tsx` as a static Server Component; extract `HomeBurgers`-style client orchestrators
- **One hook per feature screen** — mount fetch and user actions (search, submit) share the same hook and loading flag
- **Pass serializable props** from server → client only for static config, never for API response bodies
- **Children slot pattern** — Client wrapper renders `{children}`; server passes server-rendered static content as children
- **Extract thin client wrappers** for third-party components that need browser APIs

## Loading States

Required for **initial load** and **every refetch/search/submit**:

- Start with `isLoading: true` on mount (or show skeleton until first response)
- Disable search inputs/buttons or pass `isLoading` to `Button` during fetch
- Show skeleton when `isLoading && items.length === 0`
- Dim existing list + `aria-busy` when refetching with stale data visible
- Announce errors with `role="alert"`

## File Placement

| Location                              | Default                         |
| ------------------------------------- | ------------------------------- |
| `app/**/page.tsx`, `layout.tsx`       | Server Component (static shell) |
| `hooks/use*.ts`                       | Client-side data orchestration  |
| `components/*` with API/state         | Client Component                |
| `components/basic/*` (presentational) | Server or Client as needed      |

Mark server-only modules with `import 'server-only'` to prevent accidental client imports.

## Related

- [Backend Services](./backend-services.md) — hook → service data flow
- [React Component Composition](./react-component-composition.md) — folder structure and client orchestrators
