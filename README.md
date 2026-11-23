# Developer Assessment Platform â€” Frontend

Next.js 16 (App Router) frontend for the Developer Assessment Platform. It consumes the Express + Prisma backend at `/api/v1`.

## Commands

- `npm run dev` â€” dev server
- `npm run build` â€” production build
- `npm run lint` â€” Biome check
- `npm run lint:fix` â€” Biome check with fixes
- `npm run typecheck` â€” `tsc --noEmit`

## Environment

Copy `.env.example` to `.env.local`. Key variables: `BACKEND_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_DEMO_*`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_PLATFORM_FEE`.

## Architecture

- `src/app` â€” routes. `page.tsx` files are **Server Components** by default: they read `searchParams`/cookies and fetch through `lib/server-api.ts` with the `accessToken` cookie, then pass plain data to small Client Components.
- `src/components` â€” UI. Only files needing state, effects, event handlers or browser APIs start with `"use client"`.
- `src/api` â€” one module per backend resource. Every function is a named export that calls the default `apiClient` from `lib/apiClient.ts` and returns `ApiResponse<T>`.
- `src/lib` â€” infrastructure: `apiClient` (browser, 401 refresh), `server-api` (server-side fetch), `api-helpers` (`unwrapList`), `auth`/`session` (JWT + cookies), `format`, `query-keys`.
- `src/schemas` â€” Zod schemas reused by forms.
- `src/store` â€” Zustand stores (auth snapshot, wizard draft).
- `src/proxy.ts` â€” Next 16 route protection by JWT role.

### Why these files are Client Components

- `components/auth/*-form.tsx`, `components/company/problem-form-dialog.tsx`, wizard steps â€” TanStack Form + Zod need local state and submit handlers.
- `components/shared/search-input.tsx`, `filter-select.tsx`, `pagination.tsx`, `data-table.tsx` â€” read/write URL state and handle clicks.
- `components/candidate/exam-runner.tsx`, `countdown-timer.tsx`, `question-navigator.tsx` â€” timers, autosave, tab events, beforeunload.
- `components/charts/*` and `components/{admin,company}/dashboard-charts.tsx` â€” Recharts needs the DOM; loaded with `next/dynamic`.
- `components/ui/*` (dialog, sheet, dropdown) and `components/shared/route-error.tsx` â€” focus trapping and keyboard events.
- `components/providers/*` â€” QueryClient, Google OAuth, auth hydration and toasts.

Everything else (layouts, list pages, detail pages, static public pages) stays on the server.