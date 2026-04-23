# AMU AcadNet

**AMU AcadNet** is a Full-Stack academic networking and collaboration platform built for Aligarh Muslim University (AMU). It connects researchers, faculty, and students by enabling project discovery, collaboration requests, academic networking, and an AI-powered recommendation engine (powered by Google Gemini).

---

## Project Structure

```text
amu_acadnet/
├── app/                    # Next.js App Router
│   ├── (public)/           # Unauthenticated routes
│   ├── (app)/              # Authenticated routes (protected layout)
│   ├── api/                # Backend API route handlers
│   ├── globals.css         # Global styles
│   ├── layout.js           # Root layout
│   └── not-found.js        # Custom 404 page
├── components/             # Reusable React UI components
├── lib/                    # Shared server-side utilities
│   ├── recommendations/    # AI recommendation engine
│   └── utils/              # Auth middleware helpers
├── prisma/                 # Database schema, migrations, and seed
├── scripts/                # Database admin/maintenance scripts
└── public/                 # Static assets
```

---

## Pages (`app/`)

### Public Routes — `app/(public)/`

Accessible without authentication. Share a minimal layout with no sidebar.

| File                        | Route       | Purpose                                                    |
| --------------------------- | ----------- | ---------------------------------------------------------- |
| `(public)/layout.js`        | —           | Minimal layout wrapper for public-facing pages             |
| `(public)/page.js`          | `/`         | Landing page that redirects authenticated users to `/home` |
| `(public)/login/page.js`    | `/login`    | Login page — renders the `LoginForm` component             |
| `(public)/register/page.js` | `/register` | Registration page — renders the `RegisterForm` component   |

### Authenticated Routes — `app/(app)/`

All routes here require an active session. Wrapped in a shared layout with Sidebar and AppNavbar.

| File                            | Route              | Purpose                                                                           |
| ------------------------------- | ------------------ | --------------------------------------------------------------------------------- |
| `(app)/layout.js`               | —                  | Authenticated layout: session check, Sidebar, AppNavbar                           |
| `(app)/home/page.js`            | `/home`            | Main feed — shows a curated activity feed (`Feed` component)                      |
| `(app)/explore/page.js`         | `/explore`         | Explore page — browse and filter all projects and researcher profiles             |
| `(app)/network/page.js`         | `/network`         | Networking page — manage follow relationships and collaboration requests          |
| `(app)/profile/page.js`         | `/profile`         | Authenticated user's own profile page (view/edit)                                 |
| `(app)/projects/page.js`        | `/projects`        | Lists all projects the current user owns or collaborates on                       |
| `(app)/projects/create/page.js` | `/projects/create` | Form to create a new research project                                             |
| `(app)/projects/[id]/page.js`   | `/projects/:id`    | Individual project detail view — info, collaborators, status, and recommendations |

### Admin Routes — `app/(app)/admin/`

Restricted to users with the `Admin` role.

| File                          | Route                  | Purpose                                                                         |
| ----------------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| `admin/dashboard/page.js`     | `/admin/dashboard`     | Admin dashboard — institutional analytics, user stats, role breakdowns          |
| `admin/moderation/page.js`    | `/admin/moderation`    | User moderation — view, suspend, or manage all registered users                 |
| `admin/verifications/page.js` | `/admin/verifications` | Faculty/researcher verification queue — approve or reject pending verifications |
| `admin/projects/`             | `/admin/projects`      | (Reserved) Admin-level project management (currently empty)                     |

---

## API Routes (`app/api/`)

### Auth — `/api/auth/`

| Route                | Method | Purpose                                                             |
| -------------------- | ------ | ------------------------------------------------------------------- |
| `/api/auth/register` | `POST` | Register a new user account; hashes password, creates Prisma record |
| `/api/auth/login`    | `POST` | Authenticate credentials, create an iron-session cookie             |
| `/api/auth/logout`   | `POST` | Destroy the active session cookie                                   |
| `/api/auth/me`       | `GET`  | Return the currently authenticated user's session data              |

### Projects — `/api/projects/`

| Route                              | Method   | Purpose                                                   |
| ---------------------------------- | -------- | --------------------------------------------------------- |
| `/api/projects`                    | `GET`    | List all projects (with filters: status, domain, search)  |
| `/api/projects`                    | `POST`   | Create a new project (authenticated)                      |
| `/api/projects/[projectID]`        | `GET`    | Fetch a single project by ID                              |
| `/api/projects/[projectID]`        | `PUT`    | Update project details (owner only)                       |
| `/api/projects/[projectID]`        | `DELETE` | Delete a project (owner only)                             |
| `/api/projects/[projectID]/status` | `PATCH`  | Update the status of a project (e.g., Active → Completed) |

### Network — `/api/network/`

| Route                        | Method        | Purpose                                                              |
| ---------------------------- | ------------- | -------------------------------------------------------------------- |
| `/api/network`               | `GET`         | Fetch network data: followers, following, and collaboration partners |
| `/api/network/follow`        | `POST/DELETE` | Follow or unfollow another user                                      |
| `/api/network/collaboration` | `POST`        | Send a collaboration request to another user                         |
| `/api/network/collaboration` | `PATCH`       | Accept or reject an incoming collaboration request                   |
| `/api/network/collaboration` | `GET`         | List all collaboration requests (incoming and outgoing)              |

### Recommendations — `/api/recommendations/`

| Route                                | Method | Purpose                                                                                          |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------ |
| `/api/recommendations/collaborators` | `GET`  | Returns AI-generated collaborator recommendations for the logged-in user using the Gemini engine |

### Users — `/api/users/`

| Route                         | Method | Purpose                                                       |
| ----------------------------- | ------ | ------------------------------------------------------------- |
| `/api/users`                  | `GET`  | Search and list all users (with optional query params)        |
| `/api/profile/[universityID]` | `GET`  | Fetch public profile data for any user by their university ID |

### Admin — `/api/admin/`

| Route                                    | Method  | Purpose                                                                            |
| ---------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `/api/admin/stats`                       | `GET`   | Aggregate institutional statistics: total users, role distribution, project counts |
| `/api/admin/users`                       | `GET`   | List all users for admin moderation view                                           |
| `/api/admin/users/[universityID]/verify` | `PATCH` | Approve or reject a faculty/researcher verification request                        |
| `/api/admin/users/pending`               | `GET`   | List users with pending verification status                                        |

---

## Components (`components/`)

| File                    | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `Navbar.jsx`            | Public-facing top navigation bar with session-aware login/logout links    |
| `AppNavbar.jsx`         | Authenticated in-app top nav bar (shown inside the app layout)            |
| `Sidebar.jsx`           | Left sidebar with navigation links for authenticated pages                |
| `Hero.jsx`              | Landing page hero section with CTA and animated visuals                   |
| `Features.jsx`          | Landing page section showcasing platform features                         |
| `About.jsx`             | Landing page "About" section describing AMU AcadNet's mission             |
| `Comparison.jsx`        | Landing page comparison table (AcadNet vs. traditional networking)        |
| `Footer.jsx`            | Shared site footer with links and copyright                               |
| `LoginForm.jsx`         | Login form with validation, error states, and session handling            |
| `RegisterForm.jsx`      | Multi-step registration form: credentials, academic role, profile details |
| `ProfileView.jsx`       | Displays a user's full public profile: bio, projects, skills, connections |
| `ProfileEditForm.jsx`   | Inline form to edit the current user's profile details                    |
| `Feed.jsx`              | Main activity feed — fetches and renders recent platform events           |
| `FeedItem.jsx`          | Single activity feed card (project created, collaboration, follow etc.)   |
| `ConfirmationModal.jsx` | Reusable modal dialog for destructive action confirmations                |
| `LoadingSpinner.jsx`    | Reusable animated loading spinner component                               |

---

## Library / Utilities (`lib/`)

| File                            | Purpose                                                                                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/prisma.js`                 | Singleton Prisma Client instance — prevents connection pool exhaustion in dev                                                                   |
| `lib/session.js`                | Iron-session configuration (cookie name, password, TTL)                                                                                         |
| `lib/gemini.js`                 | Initialises the Google Generative AI client (`gemini-2.0-flash` model)                                                                          |
| `lib/utils.js`                  | Shared helpers: password hashing, session retrieval, response formatting                                                                        |
| `lib/dummyData.js`              | Static mock data used during development and UI prototyping (legacy)                                                                            |
| `lib/recommendations/engine.js` | AI recommendation engine — builds a structured prompt from user profile & network, calls Gemini, parses and caches collaborator recommendations |
| `lib/utils/auth.js`             | Server-side auth middleware helper — validates session and returns user or throws 401                                                           |

---

## Database (`prisma/`)

| File                   | Purpose                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| `prisma/schema.prisma` | Full Prisma schema — defines `User`, `Project`, `Collaboration`, `Follow`, `FeedEvent` models and all relations |
| `prisma/seed.mjs`      | Database seed script — creates default admin user, sample researchers, and demo projects                        |
| `prisma/migrations/`   | Auto-generated SQL migration history managed by Prisma Migrate                                                  |

---

## Scripts (`scripts/`)

| File                      | Purpose                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `scripts/cleanup-db.js`   | Utility script to wipe non-admin users and all projects from the database (for dev resets) |
| `scripts/ensure-admin.js` | Ensures the default admin account exists in the database; safe to run multiple times       |

---

## Root-Level Files

| File                    | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `.env`                  | Environment variables: `DATABASE_URL`, `GEMINI_API_KEY`, `SESSION_SECRET` |
| `next.config.mjs`       | Next.js config — image domains, env variable passthrough                  |
| `package.json`          | Project dependencies and npm scripts                                      |
| `jsconfig.json`         | JS path aliases (`@/` → project root)                                     |
| `eslint.config.mjs`     | ESLint configuration for Next.js + core-web-vitals rules                  |
| `postcss.config.mjs`    | PostCSS config for Tailwind CSS                                           |
| `prisma.config.ts`      | Prisma client configuration file                                          |
| `proxy.js`              | Local development proxy configuration                                     |
| `check_collabs.mjs`     | Dev utility — logs all collaboration records in the database              |
| `check_projects.mjs`    | Dev utility — logs all project records in the database                    |
| `create_test_users.mjs` | Dev utility — seeds a set of test user accounts for manual QA             |
| `error.html`            | Static HTML fallback error page                                           |
| `build_error.log`       | Build error log (generated by Next.js, not committed to production)       |

---
