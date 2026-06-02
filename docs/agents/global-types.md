# Global Types

**Applies when editing:** `types/`, `hooks/`, `lib/`

Domain and API shapes live in `types/` at the project root. Hooks, services, and API route handlers import from here — not from component folders.

## Folder Layout

Split types by scope — one file per domain, not one mega file:

```
types/
  api.ts        # generic API shapes (errors, pagination, envelopes)
  user.ts
  restaurant.ts
  order.ts
  ...
```

Rules:

- **One scope per file** — `user.ts` holds user-related interfaces only; add `menu.ts`, `health.ts`, etc. as domains appear
- **Prefer interfaces** over type aliases for object shapes
- **Import by file** — `import type { User } from "@/types/user"`; avoid a barrel `index.ts` until many files make paths noisy
- **No React/UI types** — props, variant unions, and component-only helpers belong in the component's `types.ts` (see [React Component Composition](./react-component-composition.md))

## What Belongs Here vs Component `types.ts`

| Location                  | Use for                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `types/*.ts`              | API responses, entities, hook return shapes tied to backend data, shared enums/maps |
| `components/.../types.ts` | Props, local UI state, slots, styling variants                                      |

If a type is used by more than one component **and** a hook or service, define it in `types/` and import it in components.

## Services and Hooks

```typescript
// types/health.ts
export interface HealthResponse {
  status: string;
  mocked?: boolean;
}

// lib/services/health.service.ts
import type { HealthResponse } from "@/types/health";

export async function getHealth(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>("/api/health");
}

// hooks/useHealth.ts
import type { HealthResponse } from "@/types/health";
```

```typescript
// ❌ BAD — domain type defined inline in a service
interface HealthResponse {
  status: string;
}

// ❌ BAD — importing component props type into a service
import type { MenuProps } from "@/components/Menu/types";

// ✅ GOOD — shared entity in types/, service and hook both import it
```

## Naming

- Files: lowercase domain (`user.ts`, `restaurant.ts`)
- Exports: PascalCase interfaces (`User`, `Restaurant`, `OrderSummary`)
- Request/response pairs: `CreateOrderRequest`, `OrderResponse` when both exist
