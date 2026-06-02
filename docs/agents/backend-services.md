# Backend Services

**Applies when editing:** `lib/services/`, `hooks/`

Services talk to the backend. **All API calls are triggered from the UI** — hooks call services; components render loading/error/data states. Never call `fetch` directly in UI code.

## Data-Fetching Policy

- **Initial data and user-triggered actions** (search, submit, refetch) all go through the same path: hook → service → backend
- **Do not prefetch API data in Server Components** or pass `initialData` from the server to skip the first client fetch
- **Every fetch must have a visible loading state in the UI** — skeleton, spinner, disabled controls, `aria-busy`, etc.
- Pages stay static shells; a client component + hook owns the data lifecycle

## Layer Responsibilities

| Layer            | Location            | Does                                                  | Does not                                                 |
| ---------------- | ------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| HTTP client      | `lib/api/client.ts` | Base URL, headers, JSON parse, error mapping          | Domain logic                                             |
| Service          | `lib/services/*.ts` | One resource/domain, typed request/response           | React state, JSX, `useEffect`                            |
| Hook             | `hooks/use*.ts`     | Loading/error/data state, mount fetch, refetch/search | Raw `fetch`, URL strings                                 |
| Client component | `components/**`     | Render loading UI, call hook, handle interactions     | Raw `fetch`, service imports for one-off calls           |
| Server Component | `app/**/page.tsx`   | Static layout, headings, compose client leaves        | API calls, `await getX()`, passing fetched data as props |

## Service Rules

- **One domain per file** — `order.service.ts`, not `api.ts` with everything
- **Named async functions** — `getOrder`, `createOrder`; no classes, no singletons
- **Typed I/O** — import request/response interfaces from `@/types/*` (see [Global Types](./global-types.md)), not inline in the service file
- **Throw on failure** — return data on success; let hooks/components decide how to show errors
- **Same paths as API routes** — service URLs must match handlers in `app/api/`

```typescript
// lib/services/burger.service.ts
import { apiClient } from "@/lib/api/client";
import type { GetBurgersResponse } from "@/types/burger";

export async function getBurgers(params?: {
  q?: string;
}): Promise<GetBurgersResponse> {
  return apiClient.get<GetBurgersResponse>(buildBurgersPath(params));
}
```

```typescript
// ❌ BAD — React in a service
export function useHealth() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch("/api/health")... }, []);
}

// ❌ BAD — fetch scattered in a hook
export function useOrder(id: string) {
  useEffect(() => {
    fetch(`/api/orders/${id}`).then((r) => r.json()).then(setOrder);
  }, [id]);
}

// ❌ BAD — server page prefetches API data
export default async function Home() {
  const { burgers } = await getBurgers();
  return <HomeBurgers initialBurgers={burgers} />;
}

// ✅ GOOD — hook delegates to service, loads on mount + on user action
import { getBurgers } from "@/lib/services/burger.service";

export function useBurgers() {
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBurgers = useCallback(async (q?: string, isCancelled = () => false) => {
    try {
      const response = await getBurgers({ q });
      if (!isCancelled()) setBurgers(response.burgers);
    } catch (err) {
      if (!isCancelled()) setError(toError(err));
    } finally {
      if (!isCancelled()) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    fetchBurgers(undefined, () => isCancelled);
    return () => { isCancelled = true; };
  }, [fetchBurgers]);

  const search = useCallback(() => {
    setIsLoading(true);
    fetchBurgers(query.trim() || undefined);
  }, [fetchBurgers, query]);

  return { burgers, isLoading, error, search };
}
```

## Loading States in UI

Hooks expose `isLoading` (and `error`). Client components must reflect them:

- Disable inputs/buttons or show button `isLoading` while fetching
- Show skeleton/placeholder for empty initial load
- Dim or `aria-busy` existing content during refetch/search
- Use `role="status"` for loading messages; `role="alert"` for errors

```tsx
// ✅ GOOD — UI reflects hook loading state
<BurgerSearch isLoading={isLoading} onSearch={search} />
<BurgersList burgers={burgers} isLoading={isLoading} />
```

## Keep It Simple

- No premature abstractions — a plain function per endpoint beats a generic CRUD factory
- No caching in services — cache at the hook level if needed later
- Extract a shared client only when the second service appears; until then, one small helper is fine
- One hook per screen/feature data need (`useBurgers`, `useOrder`) — mount fetch + actions live together
