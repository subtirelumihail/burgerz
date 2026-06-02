# Mock API (Next.js Route Handlers)

**Applies when editing:** `app/api/`, `mocks/`, services, local dev

- Default local dev: `npm run dev` — no separate backend required.
- Real external API: `npm run dev:backend` with `NEXT_PUBLIC_API_URL` set in `.env.local`.
- Mock endpoints live in `app/api/*` and delegate to `mocks/*-store.ts` and `mocks/data/`.
- App code calls the API through `lib/api/client.ts`, which resolves URLs from `NEXT_PUBLIC_API_URL` or the current origin.

## How it is wired

```
┌─────────────────────────────────────────────────────────────┐
│  lib/services/*.ts → lib/api/client.ts → fetch              │
├─────────────────────────────────────────────────────────────┤
│  NEXT_PUBLIC_API_URL unset (default)                      │
│    → same-origin paths like /api/burgers                    │
│    → app/api/* route handlers → mocks/*-store.ts            │
│                                                             │
│  NEXT_PUBLIC_API_URL set (dev:backend / production)         │
│    → external API origin + path                             │
└─────────────────────────────────────────────────────────────┘
```

## Adding or changing mock APIs

1. Add seed data in `mocks/data/` if needed.
2. Add store logic in `mocks/*-store.ts` for mutable state (e.g. creating reviews).
3. Add or update a route handler in `app/api/<resource>/route.ts`.
4. Keep service paths in `lib/services/*.ts` aligned with the route paths.

Example route handler:

```typescript
import { getBurgerById } from "@/mocks/burger-store";

interface BurgerRouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: BurgerRouteParams) {
  const { id } = await params;
  const burger = getBurgerById(id);

  if (!burger) {
    return new Response(null, { status: 404 });
  }

  return Response.json(burger);
}
```

## Production

- With no `NEXT_PUBLIC_API_URL`, production serves mock data via the same `app/api/*` routes.
- For a real backend, set `NEXT_PUBLIC_API_URL` at build time and replace or remove mock route handlers.
