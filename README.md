# Alma Natura Frontend

Frontend application for Alma Natura, built with React 19, TypeScript, Vite, Tailwind CSS v4, and shadcn-based UI primitives.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 + shadcn styles
- Zustand (global client state)
- Axios (HTTP client + interceptors)
- TanStack Query (server state)
- React Router

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

### Environment variables

- `VITE_API_BASE_URL`: backend base URL used by the frontend API client.
- Local development file: `.env.local` (ignored by git).
- Template file tracked in repo: `.env.example`.

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
│   │   └── almanatura-logo.svg      # Brand logo
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx            # Shared UI primitive (variant-based button)
│   ├── layouts/
│   │   ├── AdminLayout.tsx           # Shell for internal admin pages (sidebar nav)
│   │   └── PublicLayout.tsx          # Shell for public pages (header + footer)
│   ├── lib/
│   │   └── utils.ts                  # Shared utilities (`cn` helper)
│   ├── pages/
│   │   ├── AdminActorsPage.tsx       # Admin actors directory (placeholder)
│   │   ├── AdminApplicationsPage.tsx # Admin applications management (placeholder)
│   │   ├── AdminLoginPage.tsx        # Admin login page + submit flow
│   │   ├── AdminProjectsPage.tsx     # Admin projects management (placeholder)
│   │   ├── AdminReportsPage.tsx      # Admin reports dashboard (placeholder)
│   │   ├── AdminUsersPage.tsx        # Admin user management (placeholder)
│   │   └── PublicHomePage.tsx         # Public home (projects list entry point)
│   ├── routes/
│   │   ├── ProtectedRoute.tsx        # Route guard for authenticated admin routes
│   │   └── router.tsx                # Central route definitions
│   ├── services/
│   │   ├── api.client.ts             # Axios base client + interceptors
│   │   └── auth.service.ts           # Auth API calls (`/auth/login`)
│   ├── stores/
│   │   ├── accessibility.store.ts    # Global accessibility state (font scale)
│   │   └── auth.store.ts             # Global auth/session state
│   ├── App.tsx                       # App composition (providers + router + font sync)
│   ├── index.css                     # Global styles, tokens, typography, Tailwind layers
│   └── main.tsx                      # React entry point
├── components.json                   # shadcn/base-ui component config
├── eslint.config.js                  # ESLint flat config
├── package.json                      # Dependencies and npm scripts
├── tsconfig.json                     # Root TypeScript project references
├── tsconfig.app.json                 # TS config for browser app code
├── tsconfig.node.json                # TS config for Node/Vite tooling files
└── vite.config.ts                    # Vite config (React compiler, Tailwind plugin, aliases)
```

## Core Architecture: Folder and File Responsibilities

### App bootstrap

- `src/main.tsx`: React entry point, mounts `App` inside `StrictMode`.
  - `src/App.tsx`: application shell wiring:
    - `QueryClientProvider` for server-state operations.
    - global `RouterProvider`.
- `src/index.css`: global styles, Tailwind imports, design tokens, and brand typography setup.

### Routing

- `src/routes/router.tsx`: central route table for public and admin areas.
- `src/routes/ProtectedRoute.tsx`: admin route guard that validates auth session and redirects to `/admin/login` when unauthorized or expired.

Admin routes (all under `/admin`, protected):

| Path                  | Page                    | Backend resource      |
| --------------------- | ----------------------- | --------------------- |
| `/admin/projects`     | `AdminProjectsPage`     | `/admin/projects`     |
| `/admin/applications` | `AdminApplicationsPage` | `/admin/applications` |
| `/admin/actors`       | `AdminActorsPage`       | `/admin/actors`       |
| `/admin/reports`      | `AdminReportsPage`      | `/admin/reports/*`    |
| `/admin/users`        | `AdminUsersPage`        | `/admin/users`        |

Public routes:

| Path | Page             | Backend resource |
| ---- | ---------------- | ---------------- |
| `/`  | `PublicHomePage` | `GET /projects`  |

### Global state

- `src/stores/accessibility.store.ts`: accessibility state (`fontSizeScale`) with persisted value in `localStorage`.
- `src/stores/auth.store.ts`: auth session state (`accessToken`, `tokenType`, `expiresAt`, `user`) persisted in `sessionStorage`.

### API layer

- `src/services/api.client.ts`: shared Axios instance:
  - reads `VITE_API_BASE_URL`.
  - injects JWT from auth store in request interceptor.
  - handles global `401` by clearing session and redirecting to login.
- `src/services/auth.service.ts`: auth-specific API calls (`/auth/login`).

### Layouts and pages

- `src/layouts/PublicLayout.tsx`: public shell (header/main/footer).
- `src/layouts/AdminLayout.tsx`: internal admin shell with sidebar navigation.
- `src/pages/PublicHomePage.tsx`: public home placeholder for published projects list.
- `src/pages/AdminLoginPage.tsx`: admin login UI and API integration.
- `src/pages/AdminProjectsPage.tsx`: project management (placeholder).
- `src/pages/AdminApplicationsPage.tsx`: applications management (placeholder).
- `src/pages/AdminActorsPage.tsx`: actors directory (placeholder).
- `src/pages/AdminReportsPage.tsx`: reports dashboard (placeholder).
- `src/pages/AdminUsersPage.tsx`: internal user management (placeholder).

### Shared utilities and UI primitives

- `src/lib/utils.ts`: shared utility helpers (`cn` class merging helper).
- `src/components/ui/button.tsx`: reusable button primitive and variants.

## Data Flows

### Authentication/session flow

1. `AdminLoginPage` submits credentials via `auth.service`.
2. `auth.service` calls `/auth/login` using `api.client`.
3. Login response is saved in `auth.store` (`sessionStorage` persistence).
4. `api.client` attaches `Authorization` header automatically to next requests.
5. `ProtectedRoute` validates session before rendering admin area.
6. On `401`, session is cleared and the user is redirected to `/admin/login`.

### Accessibility font-size flow

1. `accessibility.store` stores `fontSizeScale` and persists it in `localStorage`.
2. `App.tsx` subscribes to `fontSizeScale`.
3. App updates `document.documentElement.style.fontSize` so the whole UI scales consistently.

## How to Extend the Project

- Add a new public/admin page:
  1. Create component in `src/pages/`.
  2. If needed, mount it inside `PublicLayout` or `AdminLayout`.
  3. Register route in `src/routes/router.tsx`.
- Add a new API integration:
  1. Create service module in `src/services/`.
  2. Use `api.client` (do not create ad-hoc fetch clients).
  3. Add React Query hooks near the consuming feature when appropriate.
- Add new global state:
  1. Create focused store in `src/stores/`.
  2. Persist only when needed (`localStorage`/`sessionStorage`).
  3. Keep stores small and feature-oriented.

## CI and Code Quality

- CI workflow (`.github/workflows/ci.yml`) runs on pushes/PRs to `main` and `dev`.
- CI checks: formatting, lint, typecheck, and build.
- Husky + lint-staged run formatting/linting over staged files during commit.

## Contribution Checklist

- Branch created from `dev`.
- Conventional Commit message used.
- `npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- PR targets `dev` and includes clear scope + test notes.
