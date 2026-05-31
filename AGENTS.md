<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## API mocking (MSW)

- Handlers: `mocks/handlers/` (shared by browser + Node).
- Enable locally: `npm run dev:mock` (`NEXT_PUBLIC_API_MOCKING=enabled`).
- Server init: `instrumentation.ts` → `mocks/server.ts`. Client: `components/msw-provider.tsx` → `mocks/browser.ts`.
- MSW intercepts `fetch` from app code (client and RSC/server), not arbitrary inbound HTTP to Next routes.
