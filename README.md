# Developer Assessment Platform: Client

A role-based web app where **companies** create timed coding, written and MCQ assessments, invite developers by email, and evaluate their answers, while **candidates** take the tests in a distraction-aware exam screen and see their results. An **admin** oversees users, company approvals, payments and audit logs.

This repository is the **Next.js frontend**. It talks to a separate Express + Prisma + PostgreSQL backend.

> Fill in the links and demo credentials in the [Live links](#live-links) and [Demo accounts](#demo-accounts) sections before submitting.

---

## Table of contents

1. [Live links](#live-links)
2. [Demo accounts](#demo-accounts)
3. [Features](#features)
4. [Tech stack](#tech-stack)
5. [How it works](#how-it-works)
6. [Architecture notes](#architecture-notes)
7. [Pages](#pages)
8. [Getting started](#getting-started)
9. [Environment variables](#environment-variables)
10. [Scripts](#scripts)
11. [Project structure](#project-structure)
12. [Payment flow](#payment-flow)
13. [Deployment](#deployment)
14. [Commit convention](#commit-convention)
15. [Submission details](#submission-details)

---

## Live links

| Item | URL |
|---|---|
| Frontend (live) | `https://<your-frontend>.vercel.app` |
| Backend API (live) | `https://<your-backend>.onrender.com` |
| Backend repository | `https://github.com/<your-username>/<backend-repo>` |
| Frontend repository | `https://github.com/<your-username>/<frontend-repo>` |
| API documentation | `<Postman documentation link>` |
| Demo video | `<Loom or Google Drive link>` |

---

## Demo accounts

The login page has **one-click Demo Login buttons** for all three roles, so no typing is needed. The same accounts can be used manually:

| Role | Email | Password |
|---|---|---|
| Admin | `<demo admin email>` | `<demo admin password>` |
| Company (approved) | `<demo company email>` | `<demo company password>` |
| Candidate | `<demo candidate email>` | `<demo candidate password>` |

These are throwaway accounts created only for evaluation. Do not reuse real passwords.

---

## Features

### Everyone
- Public landing pages with live data: home, about, features, pricing, contact
- Browse published assessments (search, filter and pagination stored in the URL)
- Email and password login, **Google sign-in**, one-click demo login
- Registration with **OTP email verification**, password reset by OTP

### Candidate
- Dashboard of invitations (accept, decline, start, resume)
- **Timed exam screen**: server-based countdown, autosave of every answer, tab-switch tracking, auto-submit at zero, confirm-before-submit
- Attempt history and detailed results (score, percentage, pass or fail, per-question feedback)
- Profile with skills, links and avatar upload

### Company
- Application flow with OTP verification and admin approval banner
- **Problem bank** with MCQ (option editor), written and coding (test-case editor) questions
- **3-step wizard** to create an assessment (basic info, pick and order problems, review)
- Assessment management: add or remove problems, pay, publish, close, invite candidates
- **bKash payment** with success, cancel and failed result pages
- Submission evaluation with score and feedback
- Dashboard with charts

### Admin
- Dashboard with charts (users, companies, assessments, attempts, revenue)
- User management with search, role and status filters, block and unblock
- Company approval queue
- Payments overview and **audit log** viewer with filters

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, React Compiler |
| Language | TypeScript (strict, no `any`) |
| Styling and UI | Tailwind CSS v4, shadcn/ui (Base UI), `tw-animate-css`, Lucide icons |
| Forms and validation | `@tanstack/react-form` + Zod 4 |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| HTTP | `ofetch` |
| Auth | Backend JWT in httpOnly cookies, Google sign-in via `@react-oauth/google` |
| OTP input | `input-otp` |
| Charts | Recharts |
| Notifications | Sonner |
| Lint and format | Biome |
| Package manager | bun |
| Deployment | Vercel |

---

## How it works

```
Company applies -> verifies email (OTP) -> Admin approves
        |
Company builds problems -> creates assessment (DRAFT) -> adds problems
        |
Company pays via bKash (PAID) -> publishes -> invites candidates by email
        |
Candidate accepts invitation -> starts attempt (server sets the deadline)
        |
Answers autosave -> candidate submits -> MCQs are graded automatically
        |
Company evaluates the rest -> candidate sees the result
```

Status lifecycles:

- **Assessment:** `DRAFT -> PUBLISHED -> CLOSED` (only `DRAFT` is editable and payable)
- **Payment:** `PENDING -> PAID | FAILED | CANCELLED`
- **Invitation:** `PENDING -> ACCEPTED | DECLINED` (or `EXPIRED`)
- **Attempt:** `IN_PROGRESS -> SUBMITTED -> EVALUATED`

---

## Architecture notes

### Server Components vs Client Components

Every `page.tsx` is a **Server Component** by default. It reads `searchParams`, fetches data on the server, and hands the result to small Client Components. `"use client"` is used only where it is required.

| Server Components | Client Components |
|---|---|
| All `page.tsx` and `layout.tsx` files | Forms (TanStack Form) |
| Public marketing sections | Search input, filters, pagination (they write to the URL) |
| `StatCard`, `PageHeader`, `EmptyState` | Exam runner, countdown timer, autosave |
| Role layouts that check the session | Assessment wizard |
| | Charts, dialogs, sidebar active state |
| | Providers and `error.tsx` |

### Authentication and route protection

- The backend sets `accessToken` and `refreshToken` as httpOnly cookies.
- `next.config.ts` **rewrites** `/api/v1/*` to the backend, so the browser only talks to its own domain. Cookies therefore work across Vercel and Render without CORS trouble.
- `proxy.ts` (Next.js 16 name for middleware) reads the role from the JWT and redirects:
  - `/admin/**` for admins, `/company/**` for companies, `/candidate/**` for candidates
  - logged-in users are kept away from `/login` and `/register`
- Role-based UI rendering hides menus and actions that do not belong to the current role. The backend remains the real authority.
- Browser requests use an `ofetch` client that retries once after refreshing the token on a 401. Server Components send the token as a Bearer header and use a refresh route handler (`/api/session/refresh`) on expiry.

### Data fetching and state

- **Server:** `lib/server-api.ts` for initial page data.
- **Client:** TanStack Query for mutations, cache invalidation and optimistic updates (for example responding to an invitation).
- **URL as state:** all search, filter, sort and pagination values live in the URL through a shared `useUrlState` hook, so any view can be bookmarked or shared.
- **Zustand:** auth user snapshot and the wizard draft.

### UX standards followed

- Skeleton `loading.tsx` on every data route, meaningful empty states on every list
- `error.tsx` boundaries and Sonner toasts for API failures
- Mobile-first responsive layouts, keyboard accessible dialogs, labelled controls
- `next/image` for all images, dynamic imports for chart code
- Metadata (title, description, Open Graph) on every public page

---

## Pages

**Public:** `/`, `/about`, `/features`, `/pricing`, `/contact`, `/assessments`, `/invitations/[token]`

**Auth:** `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`

**Admin:** `/admin`, `/admin/users`, `/admin/companies`, `/admin/payments`, `/admin/audit-logs`

**Company:** `/company`, `/company/problems`, `/company/assessments`, `/company/assessments/new`, `/company/assessments/[id]`, `/company/submissions`, `/company/payments`, `/company/profile`

**Candidate:** `/candidate`, `/candidate/attempts`, `/candidate/attempts/[id]` (exam), `/candidate/results/[id]`, `/candidate/profile`

**Payment:** `/payment/success`, `/payment/cancel`, `/payment/failed`

**Utility:** custom `not-found.tsx` and global `error.tsx`

---

## Getting started

### Prerequisites

- [bun](https://bun.sh) 1.x
- A running backend (local or deployed) with seeded demo data
- A Google OAuth Web Client ID (for Google sign-in)

### Install and run

```bash
git clone https://github.com/<your-username>/<frontend-repo>.git
cd <frontend-repo>

bun install

cp .env.example .env.local
# fill in the values (see below)

bun dev
```

Open `http://localhost:3000`.

### Run the backend locally

Follow the backend README. Make sure its `FRONTEND_URL` is `http://localhost:3000` and its `BKASH_CALLBACK_URL` points at its own `/api/v1` base so that payment redirects land on this app.

---

## Environment variables

Create `.env.local` from `.env.example`.

| Variable | Scope | Description |
|---|---|---|
| `BACKEND_URL` | server | Base URL of the backend, without a trailing slash (used by rewrites and server fetches) |
| `NEXT_PUBLIC_APP_URL` | public | Public URL of this app (used for metadata) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | public | Google OAuth Web Client ID |
| `NEXT_PUBLIC_DEMO_ADMIN_EMAIL` | public | Demo admin email for one-click login |
| `NEXT_PUBLIC_DEMO_ADMIN_PASSWORD` | public | Demo admin password |
| `NEXT_PUBLIC_DEMO_COMPANY_EMAIL` | public | Demo company email |
| `NEXT_PUBLIC_DEMO_COMPANY_PASSWORD` | public | Demo company password |
| `NEXT_PUBLIC_DEMO_CANDIDATE_EMAIL` | public | Demo candidate email |
| `NEXT_PUBLIC_DEMO_CANDIDATE_PASSWORD` | public | Demo candidate password |

`NEXT_PUBLIC_*` values are visible in the browser. Only throwaway demo credentials belong there.

---

## Scripts

| Command | What it does |
|---|---|
| `bun dev` | Start the development server |
| `bun run build` | Production build |
| `bun start` | Run the production build |
| `bun run lint` | Check code with Biome |
| `bun run format` | Format code with Biome |

---

## Project structure

```
src/
├── proxy.ts              # role-based route protection
├── app/
│   ├── (public)/         # navbar + footer pages
│   ├── (auth)/           # login, register, OTP, password reset
│   ├── admin/            # admin dashboard and tools
│   ├── company/          # company workspace
│   ├── candidate/        # candidate area (exam has its own full-screen layout)
│   ├── payment/          # success, cancel, failed
│   └── api/session/      # token refresh route handler
├── components/
│   ├── ui/               # shadcn components
│   ├── providers/        # Query, Google, auth providers
│   ├── layout/           # navbar, footer, dashboard shell, sidebar
│   ├── shared/           # DataTable, StatCard, StatusBadge, SearchInput, Pagination ...
│   ├── auth/ home/ admin/ company/ candidate/ charts/
├── hooks/                # useAuth, useDebounce, useUrlState, useCountdown, useAutosave ...
├── lib/                  # api clients, auth helpers, formatters, constants
├── services/             # one file per backend module
├── schemas/              # Zod schemas mirroring backend validation
├── store/                # Zustand stores
└── types/                # API and domain types
```

---

## Payment flow

1. A company opens a `DRAFT` assessment and clicks **Pay with bKash**.
2. The client calls `POST /payments/initiate` and receives a `paymentUrl`.
3. The browser is redirected to the bKash hosted page.
4. After paying or cancelling, bKash sends the browser to the backend callback, which verifies the result with bKash and redirects to `/payment/success`, `/payment/cancel` or `/payment/failed`.
5. The result page **asks the backend for the real payment status** instead of trusting the URL, and offers **Publish** once the status is `PAID`.

Payments are real bKash sandbox transactions. Nothing is simulated on the client.

---

## Deployment

The frontend is deployed on **Vercel**.

1. Import the repository in Vercel.
2. Add every variable from [Environment variables](#environment-variables).
3. On the backend set `FRONTEND_URL` to the Vercel URL, `BKASH_CALLBACK_URL` to the backend `/api/v1` base, and `NODE_ENV=production`.
4. Add the Vercel domain to the Google OAuth client's **Authorized JavaScript origins**.
5. Redeploy, then verify demo login for all three roles and one full payment.

---

## Commit convention

Conventional commits are used throughout:

```
feat: add role-based sidebar
fix: resolve hydration mismatch in exam timer
refactor: extract url state hook
docs: update readme
chore: bootstrap project
```

---

## Submission details

```text
Project Name            : Developer Assessment Platform
Backend Repo            : <backend repository URL>
Frontend Repo           : <frontend repository URL>
Live Backend URL        : <backend live URL>
Live Frontend URL       : <frontend live URL>
API Documentation       : <Postman documentation URL>
Demo Video              : <video URL>
Demo Admin Email        : <demo admin email>
Demo Admin Password     : <demo admin password>
```