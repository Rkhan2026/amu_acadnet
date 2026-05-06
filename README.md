# AMU AcadNet

**AMU AcadNet** is a Full-Stack academic networking and collaboration platform built for Aligarh Muslim University (AMU). It connects researchers, faculty, and students by enabling project discovery, collaboration requests, academic networking, and an AI-powered recommendation engine (powered by Google Gemini).

---

## Folder Overview

### `app/`

Contains the Next.js App Router structure.

- **`(public)/`**: Unauthenticated routes.
  - `login/`, `register/`, `forget-password/`, `reset-password/`
  - `resubmit-profile/`: Correction flow for rejected profiles.
- **`(app)/`**: Core authenticated segments.
  - `home/`, `explore/`, `network/`, `profile/`, `projects/`
  - **`admin/`**: Dashboards for analytics, moderation, and verifications.
- **`api/`**: Backend service layer.
  - `auth/`, `projects/`, `network/`, `recommendations/`, `admin/`

### `components/`

Modular React components organized by functional nesting.

- **`auth/`**: Entry forms.
  - `register/`: Multi-step signup logic.
- **`project/`** & **`profile/`**: Core feature displays.
  - `modal/`: Pop-up views for detailed information.
- **`layout/`**: Structural components (Sidebar, AppNavbar).
- **`ui/`**: Reusable design primitives (Buttons, Inputs, Badges).
- **`explore/`, `feed/`, `network/`**: Feature-specific discovery modules.

### `lib/`

Shared core logic and configurations.

- **`recommendations/`**: AI matching engine logic.
- **`utils/`**: Shared auth middleware and session helpers.
- **Core Files**: Configurations for Prisma, Cloudinary, and Gemini AI.

### `prisma/`

Database architecture.

- **`schema.prisma`**: Database models and relationships.
- **`migrations/`**: Version-controlled schema changes.
- **`seed.mjs`**: Initial data population scripts.

### `hooks/`

Custom React hooks used for managing global state, data fetching, and interacting with the backend APIs efficiently.

### `scripts/`

Maintenance and administrative utility scripts for database cleanup, admin account management, and development data validation.

### `public/`

Static assets used across the application, such as images, brand icons, and default avatars.

---

## Setup & Development

1.  **Dependencies**: Install with `npm install`.
2.  **Environment**: Configure `.env` with database url and all other keys and secrets.
3.  **Database**: Initialize with `npx prisma db push` and `npm run seed`.
4.  **Run**: Start development server with `npm run dev`.
