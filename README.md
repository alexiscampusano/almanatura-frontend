# Alma Natura Frontend

[![CI](https://github.com/alexiscampusano/almanatura-frontend/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/alexiscampusano/almanatura-frontend/actions/workflows/ci.yml?query=branch%3Amain)

Frontend application for Alma Natura, built with React 19, TypeScript, Vite 8, Tailwind CSS v4, and shadcn-based UI primitives. Serves as the public-facing Vitrina de Proyectos and the internal admin Dashboard for Fundación AlmaNatura.

## Tech Stack

| Category       | Technology                                  |
| -------------- | ------------------------------------------- |
| Language       | React 19 + TypeScript                       |
| Bundler        | Vite 8                                      |
| Styling        | Tailwind CSS v4 + shadcn/base-ui primitives |
| Client state   | Zustand                                     |
| Server state   | TanStack Query                              |
| Routing        | React Router v7                             |
| HTTP           | Axios + axios-retry                         |
| Forms          | React Hook Form + Zod                       |
| Notifications  | Sonner                                      |
| Carousel       | Embla Carousel                              |
| Error tracking | Sentry                                      |

## Requirements

- Node.js >= 22 (see `.nvmrc`)
- npm
- Git

Recommended:

```bash
nvm install
nvm use
```

## Setup

```bash
# 1. Clonar el repositorio
git clone https://github.com/alexiscampusano/almanatura-frontend
cd almanatura-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Levantar servidor de desarrollo
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment variables

| Variable            | Description          | Default                        |
| ------------------- | -------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api/v1` |

Local development file: `.env.local` (ignored by git). Template: `.env.example` (tracked).

## Scripts

| Script                 | Command                | Purpose                       |
| ---------------------- | ---------------------- | ----------------------------- |
| `npm run dev`          | `vite`                 | Run local dev server with HMR |
| `npm run build`        | `tsc -b && vite build` | Type check + production build |
| `npm run preview`      | `vite preview`         | Preview built app locally     |
| `npm run lint`         | `eslint .`             | Run lint checks               |
| `npm run lint:fix`     | `eslint . --fix`       | Fix lint issues when possible |
| `npm run format`       | `prettier --write .`   | Format repository files       |
| `npm run format:check` | `prettier --check .`   | Validate formatting (CI)      |
| `npm run typecheck`    | `tsc -b --noEmit`      | Run TypeScript checks only    |

Useful combinations:

- Before opening PR: `npm run format:check && npm run lint && npm run typecheck && npm run build`
- Local auto-fix pass: `npm run format && npm run lint:fix`

## Git Workflow

### Main branches

| Branch | Purpose                                    |
| ------ | ------------------------------------------ |
| `main` | Production-ready branch                    |
| `dev`  | Integration branch (base for feature work) |

### Working branch naming

Create working branches from `dev`:

| Prefix      | Usage                     | Example                         |
| ----------- | ------------------------- | ------------------------------- |
| `feat/`     | New features              | `feat/frontend-event-form`      |
| `fix/`      | Bug fixes                 | `fix/auth-token-expiration`     |
| `refactor/` | Internal restructuring    | `refactor/service-layer`        |
| `docs/`     | Documentation changes     | `docs/readme-core-architecture` |
| `chore/`    | Tooling/maintenance tasks | `chore/frontend-router-state`   |

### Commit convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
type(scope): short description
```

Examples:

```text
feat(frontend): add reports dashboard filters
fix(auth): clear stale session after token expiration
chore(frontend): configure base api service and jwt interceptors
docs(readme): document core frontend architecture
```

### Daily flow

```bash
# 1) Sync integration branch
git checkout dev
git pull origin dev

# 2) Create task branch
git checkout -b feat/your-task-name

# 3) Work and commit
git add .
git commit -m "feat(frontend): your change"

# 4) Push and open PR to dev
git push -u origin feat/your-task-name
```

After merge:

```bash
git checkout dev
git pull origin dev
git branch -d feat/your-task-name
```

## Current Project Structure

```text
almanatura-frontend/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI pipeline: format, lint, typecheck, build
├── .husky/                           # Git hooks (pre-commit checks through lint-staged)
├── .vscode/                          # Shared editor settings and recommended extensions
├── public/                           # Static public assets served as-is
├── src/
│   ├── assets/
│   │   ├── almanatura-logo.svg       # Brand logo
│   │   └── hero.png                  # Hero section image
│   ├── components/
│   │   ├── accessibility/
│   │   │   ├── AccessibilityBar.tsx  # Font scale control bar
│   │   │   └── ResetAccessibility.tsx # Reset accessibility defaults
│   │   ├── admin/
│   │   │   ├── admin-page.tsx        # Reusable admin page shell
│   │   │   ├── ApplicationHistoryDialog.tsx  # Application status history
│   │   │   ├── mobile-filter-sheet.tsx       # Mobile filter bottom sheet
│   │   │   ├── NotificationDialog.tsx        # Send notification dialog
│   │   │   └── ProjectImpactSection.tsx      # Impact metrics section
│   │   ├── ui/                       # Shared UI primitives (shadcn/base-ui)
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── table.tsx
│   │   │   └── textarea.tsx
│   │   ├── error-boundary.tsx        # Global error boundary
│   │   ├── navigation-progress.tsx   # Route transition progress bar
│   │   └── PublicApplicationForm.tsx # Public project application form + dialog
│   ├── hooks/
│   │   ├── use-actors.ts             # TanStack Query: admin actor CRUD
│   │   ├── use-admin-applications.ts # Admin applications list/filter
│   │   ├── use-admin-project.ts      # Single admin project
│   │   ├── use-admin-projects.ts     # Admin projects list
│   │   ├── use-admin-reports.ts      # Reports dashboard data
│   │   ├── use-admin-users.ts        # Admin user management
│   │   ├── use-auth-hydrated.ts      # Auth state hydration check
│   │   ├── use-auth-me.ts            # Current user query
│   │   ├── use-confirm-dialog.ts     # Confirmation dialog state
│   │   ├── use-debounce.ts           # Debounce utility hook
│   │   ├── use-local-storage.ts      # localStorage binding hook
│   │   ├── use-project-impact.ts     # Project impact entries
│   │   ├── use-public-project.ts     # Public single project detail
│   │   ├── use-public-projects.ts    # Public projects list (infinite)
│   │   └── use-send-notification.ts  # Send outbound notification
│   ├── layouts/
│   │   ├── AdminLayout.tsx           # Admin shell (sidebar nav + header)
│   │   └── PublicLayout.tsx          # Public shell (header + footer)
│   ├── lib/
│   │   ├── application-status.ts     # Status labels and variants
│   │   ├── avatar.ts                 # Avatar color/initial helpers
│   │   ├── datetime.ts               # Date formatting
│   │   ├── error-handler.ts          # API error classification
│   │   ├── feature-flags.ts          # Feature flag definitions
│   │   ├── project.ts                # Project pillar config and labels
│   │   ├── schemas/                  # Zod validation schemas
│   │   │   ├── application.schema.ts
│   │   │   ├── auth.schema.ts
│   │   │   ├── index.ts
│   │   │   ├── notification.schema.ts
│   │   │   ├── project.schema.ts
│   │   │   └── user.schema.ts
│   │   ├── sentry.ts                 # Sentry client configuration
│   │   └── utils.ts                  # Shared utilities (`cn` helper)
│   ├── pages/                        # Page components (one per route)
│   │   ├── PublicHomePage.tsx        # Public Vitrina de Proyectos
│   │   ├── PublicProjectDetailPage.tsx # Public project detail view
│   │   ├── AdminLoginPage.tsx        # Admin login form
│   │   ├── AdminProjectsPage.tsx     # Admin project CRUD list
│   │   ├── AdminProjectDetailPage.tsx # Admin single project management
│   │   ├── AdminApplicationsPage.tsx # Applications management
│   │   ├── AdminActorsPage.tsx       # Actors directory list
│   │   ├── AdminActorDetailPage.tsx  # Actor detail + applications
│   │   ├── AdminNotificationsPage.tsx # Outbound notification history
│   │   ├── AdminReportsPage.tsx      # Reports and metrics dashboard
│   │   ├── AdminMePage.tsx           # Current user profile
│   │   └── AdminUsersPage.tsx        # User management (SUPER_USER only)
│   ├── routes/
│   │   ├── ProtectedRoute.tsx        # Auth route guard
│   │   └── router.tsx                # Central route definitions
│   ├── services/                     # API service modules
│   │   ├── api.client.ts             # Axios base client + interceptors
│   │   ├── auth.service.ts           # Auth API calls (/auth/login)
│   │   ├── projects.service.ts       # Public projects API
│   │   ├── applications.service.ts   # Public applications API
│   │   ├── admin-projects.service.ts # Admin projects CRUD
│   │   ├── admin-applications.service.ts # Admin applications
│   │   ├── admin-project-impact.service.ts # Impact entries
│   │   ├── actors.service.ts         # Admin actors
│   │   ├── admin-users.service.ts    # Admin user management
│   │   ├── admin-reports.service.ts  # Reports data
│   │   └── admin-notifications.service.ts # Notifications
│   ├── stores/
│   │   ├── accessibility.store.ts    # Font scale state (localStorage)
│   │   └── auth.store.ts             # Auth session state (sessionStorage)
│   ├── types/                        # TypeScript type definitions
│   │   ├── actor.ts
│   │   ├── application.ts
│   │   ├── common.ts
│   │   ├── impact.ts
│   │   ├── notification.ts
│   │   ├── project.ts
│   │   ├── reports.ts
│   │   └── user.ts
│   ├── App.tsx                       # App composition (providers + router + font sync)
│   ├── App.css
│   ├── index.css                     # Global styles, tokens, Tailwind layers
│   └── main.tsx                      # React entry point
├── components.json                   # shadcn/base-ui component config
├── eslint.config.js                  # ESLint flat config
├── package.json
├── tsconfig.json                     # Root TypeScript project references
├── tsconfig.app.json                 # TS config for browser app code
├── tsconfig.node.json                # TS config for Node/Vite tooling
└── vite.config.ts                    # Vite config (React compiler, Tailwind, aliases)
```

## Core Architecture

### Routing

Admin routes (all under `/admin`, protected by `ProtectedRoute`):

| Path                   | Page                     | Backend resource       |
| ---------------------- | ------------------------ | ---------------------- |
| `/admin/projects`      | `AdminProjectsPage`      | `/admin/projects`      |
| `/admin/projects/:id`  | `AdminProjectDetailPage` | `/admin/projects/{id}` |
| `/admin/applications`  | `AdminApplicationsPage`  | `/admin/applications`  |
| `/admin/actors`        | `AdminActorsPage`        | `/admin/actors`        |
| `/admin/actors/:id`    | `AdminActorDetailPage`   | `/admin/actors/{id}`   |
| `/admin/notifications` | `AdminNotificationsPage` | `/admin/notifications` |
| `/admin/reports`       | `AdminReportsPage`       | `/admin/reports/*`     |
| `/admin/users`         | `AdminUsersPage`         | `/admin/users`         |
| `/admin/me`            | `AdminMePage`            | `/auth/me`             |

Public routes:

| Path            | Page                      | Backend resource                                  |
| --------------- | ------------------------- | ------------------------------------------------- |
| `/`             | `PublicHomePage`          | `GET /projects` (paginated, filterable by pillar) |
| `/projects/:id` | `PublicProjectDetailPage` | `GET /projects/{id}`                              |

### Global state

- `accessibility.store.ts`: `fontSizeScale` persisted in `localStorage`.
- `auth.store.ts`: `accessToken`, `tokenType`, `expiresAt`, `user` persisted in `sessionStorage`.

### API layer

- `services/api.client.ts`: shared Axios instance — reads `VITE_API_BASE_URL`, injects JWT from auth store, handles global `401` by clearing session and redirecting to login.
- All other `services/*.ts` modules expose typed functions that use `api.client`.

### Data flows

**Authentication:**

1. `AdminLoginPage` submits credentials via `auth.service`.
2. `auth.service` calls `/auth/login` using `api.client`.
3. Response is saved in `auth.store` (sessionStorage).
4. `api.client` attaches `Authorization: Bearer <token>` to subsequent requests.
5. `ProtectedRoute` validates session before rendering admin routes.
6. On `401`, session is cleared and user is redirected to `/admin/login`.

**Public projects:**

1. `PublicHomePage` calls `usePublicProjects(pillar?`).
2. Hook calls `projects.service` with pagination and optional pillar filter.
3. Service uses `api.client` (no auth required for public endpoints).
4. Result is displayed in a responsive card grid with infinite scroll.

**Application submission:**

1. User opens `PublicApplicationDialog` from a project card.
2. Fills form (name, email, DNI, phone) validated with Zod.
3. `applications.service` POSTs to `/applications`.
4. Rate-limited by backend (429 possible).

## Accessibility policy (font scaling)

- Root font-size is controlled by CSS (`html { font-size: 100% }`).
- The app exposes a limited user font-scale range (0.9–1.3) to improve readability without breaking layout. The persisted preference key is `alma-natura-accessibility` in `localStorage`.
- A visible "Reset accessibility" control exists in the admin header to restore defaults and clear the saved preference.

## How to Extend the Project

- Add a new page: create component in `src/pages/`, wrap in `AdminLayout` or `PublicLayout`, register route in `src/routes/router.tsx`.
- Add a new API integration: create service module in `src/services/`, use `api.client`, add TanStack Query hook in `src/hooks/` when appropriate.
- Add global state: create focused store in `src/stores/`, persist only when needed.

## CI and Code Quality

- CI workflow (`.github/workflows/ci.yml`) runs on pushes/PRs to `main` and `dev`.
- CI checks: formatting, lint, typecheck, and build.
- Husky + lint-staged run formatting/linting over staged files during commit.

## Deploy

The frontend is deployed on **Vercel** (Edge Network). The production build command is:

```bash
npm run build
```

Required environment variables on Vercel:

| Variable            | Value                               |
| ------------------- | ----------------------------------- |
| `VITE_API_BASE_URL` | `https://api.almanatura.org/api/v1` |
| `SENTRY_AUTH_TOKEN` | _(optional, for source maps)_       |

Deployment is automatic via GitHub integration on the `main` branch.

## Contribution Checklist

- Branch created from `dev`.
- Conventional Commit message used.
- `npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- PR targets `dev` and includes clear scope + test notes.

## License

Private — Fundación AlmaNatura.
