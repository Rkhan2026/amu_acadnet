# AMU AcadNet

**AMU AcadNet** is a academic networking and collaboration platform specifically designed for Aligarh Muslim University (AMU). It facilitates project discovery, fosters academic synergy, and streamlines collaboration between students, researchers, and faculty.

---

## Tech Stack

| Category          | Technologies                                                                                                                          |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**      | [Next.js 16](https://nextjs.org/), [React 19](https://reactjs.org/), [Tailwind CSS 4](https://tailwindcss.com/)                       |
| **Styling/UI**    | [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [React Hot Toast](https://react-hot-toast.com/) |
| **Backend**       | [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)                                    |
| **Database**      | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)                                                       |
| **AI/ML**         | [Google Gemini AI](https://ai.google.dev/) (Embeddings & Cosine Similarity)                                                           |
| **Storage**       | [Cloudinary](https://cloudinary.com/) (Media & Document Hosting)                                                                      |
| **Communication** | [EmailJS](https://www.emailjs.com/) (Email Notifications)                                                                             |

---

## Project Structure

```bash
├── app/                      # Next.js App Router (Public & Private Segments)
├── docker/                   # Docker configuration and orchestration
│   ├── (public)/             # Unauthenticated routes (Login, Register, Password Recovery)
│   ├── (app)/                # Core authenticated application segments
│   │   ├── admin/            # Admin Dashboards for moderation and verifications
│   │   ├── explore/          # Project discovery and search interface
│   │   ├── home/             # User dashboard and activity overview
│   │   ├── network/          # Academic networking and follows management
│   │   ├── profile/          # User profiles and academic history
│   │   └── projects/         # Project management and collaboration hub
│   └── api/                  # Server-side Route Handlers
│       ├── admin/            # Admin-only API endpoints for moderation
│       ├── auth/             # Session management and authentication logic
│       ├── network/          # Networking and collaboration request APIs
│       ├── projects/         # Project CRUD and status management APIs
│       └── recommendations/  # AI-powered matching engine endpoints
├── components/               # Modular React Components
│   ├── admin/                # Moderation and verification UI modules
│   ├── auth/                 # Authentication forms and multi-step logic
│   ├── explore/              # Discovery modules and advanced filters
│   ├── feed/                 # Dynamic activity feed and suggestion cards
│   ├── home/                 # Dashboard summary and welcome components
│   ├── layout/               # Structural UI (Sidebar, Navbar, Layout wrappers)
│   ├── network/              # Connection cards and network management UI
│   ├── profile/              # User profile views and editing forms
│   ├── project/              # Project modals, creation forms, and detail views
│   └── ui/                   # Shared design primitives (Buttons, Inputs, Badges)
├── hooks/                    # Custom React Hooks for state and API orchestration
├── lib/                      # Shared core logic and configurations
│   ├── recommendations/      # AI engine (Gemini) matching logic
│   ├── services/             # Abstracted database service layer
│   ├── utils/                # Shared utilities, auth helpers, and constants
│   └── prisma.js             # Prisma client initialization
├── prisma/                   # Database Architecture
│   ├── migrations/           # Version-controlled database schema changes
│   └── schema.prisma         # Main database models and enums
├── scripts/                  # Administrative and maintenance utility scripts
└── public/                   # Static Assets (Images, Icons, Avatars)
```

---

## Getting Started

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/amu_acadnet.git
   cd amu_acadnet
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL="your-postgresql-url"
   GEMINI_API_KEY="your-gemini-api-key"
   JWT_SECRET="your-jwt-secret"

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_URL="your-cloudinary-url"
   NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   NEXT_PUBLIC_EMAILJS_SERVICE_ID="your-service-id"
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_RESET_PASSWORD="your-template-id"
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your-public-key"
   ```

4. **Initialize Database**

   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Run the Application**
   ```bash
   npm run dev
   ```

---

### Docker Setup

For a containerized environment, you can use Docker Compose:

1. **Configure Environment Variables**
   Ensure your `.env` file contains the necessary API keys (`GEMINI_API_KEY`, etc.) and your `DATABASE_URL`. Docker will automatically load these variables.

2. **Build and Run**
   You can use the built-in npm scripts to manage Docker:
   ```bash
   npm run docker:build
   ```
   _Alternatively, use the direct command:_ `docker-compose -f docker/docker-compose.yml up --build`

This will:

- Set up a PostgreSQL 15 database container.
- Build the Next.js application image.
- Automatically run Prisma migrations.
- Start the application at `http://localhost:3000`.

> [!TIP]
>
> - Use `npm run docker:up` for daily use (starts in seconds).
> - Use `npm run docker:build` only when you change the code, dependencies, or database schema.

---

## Testing & Development

### Temporary Email Accounts

For testing account registration and email notifications without using personal addresses, you can use [SharkLasers](https://www.sharklasers.com/) (Guerilla Mail). This is particularly useful for verifying the multi-step registration flow and password recovery features.
