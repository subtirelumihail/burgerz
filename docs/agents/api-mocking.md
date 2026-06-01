# API Mocking (MSW)

**Applies when editing:** `mocks/`, API-related services, or local dev setup.

- Handlers: `mocks/handlers/` (shared by browser + Node).
- Enable locally: `npm run dev:mock` (`NEXT_PUBLIC_API_MOCKING=enabled`).
- Server init: `instrumentation.ts` → `mocks/server.ts`. Client: `components/msw-provider.tsx` → `mocks/browser.ts`.
- MSW intercepts `fetch` from app code (client and RSC/server), not arbitrary inbound HTTP to Next routes.
