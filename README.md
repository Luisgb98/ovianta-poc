# Ovianta POC

A Next.js 16 healthcare management application built for a technical interview. It features OTP-based authentication and patient management, following hexagonal (ports & adapters) architecture.

## Live Demo

The app is deployed on Vercel — no setup required.

**[https://ovianta-poc.vercel.app](https://ovianta-poc.vercel.app)**

To log in, enter any email address (e.g. `test@example.com`) — you will not receive any real email. Use the demo OTP code **`482019`** when prompted.

---

## Tech Stack

| Layer           | Technology                                        |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                           |
| Language        | TypeScript 6 (strict)                             |
| Styling         | Tailwind CSS 4                                    |
| UI Library      | shadcn (base-vega style, CSS variables)           |
| Database        | MongoDB Atlas                                     |
| Testing         | Vitest + React Testing Library + Playwright (E2E) |
| Package manager | pnpm                                              |

## Prerequisites

- **Node.js** 20+
- **pnpm** — install with `npm i -g pnpm`
- **MongoDB Atlas** cluster (free tier works fine)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

| Variable               | Description                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `MONGODB_URI`          | MongoDB Atlas connection string (`mongodb+srv://...`)                              |
| `AUTH_SECRET`          | Random secret for signing session tokens — generate with `openssl rand -base64 32` |
| `RESEND_API_KEY`       | API key from [resend.com](https://resend.com) for sending OTP emails               |
| `EMAIL_FROM`           | Sender address for OTP emails (e.g. `noreply@yourdomain.com`)                      |
| `NEXT_PUBLIC_APP_URL`  | App base URL — leave as `http://localhost:3000` for local development              |
| `NEXT_PUBLIC_DEMO_OTP` | (Optional) Hard-coded OTP code that bypasses email for local testing               |

> **Tip:** Set `NEXT_PUBLIC_DEMO_OTP=123456` to skip real email delivery during development. Remove this variable in production.

### 3. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
pnpm dev              # Start dev server with hot reload
pnpm build            # Production build
pnpm start            # Run the production build
pnpm lint             # ESLint
pnpm format           # Prettier (write)
pnpm test             # Run all tests
pnpm test:watch       # Tests in watch mode
pnpm test:ui          # Vitest UI
pnpm test:coverage    # Tests with coverage report (70% minimum)
```

## Project Structure

```
app/                        # Next.js App Router
├── (auth)/                 # Login flow (OTP authentication)
├── (app)/                  # Protected app routes
│   ├── agenda/
│   ├── consultas/
│   ├── pacientes/
│   └── ajustes/
└── globals.css             # Tailwind + design tokens

src/
├── modules/
│   └── patients/           # Example feature module
│       ├── domain/         # Entities, value objects
│       ├── application/    # Use cases + port interfaces
│       └── infrastructure/ # MongoDB adapters
└── shared/                 # Shared utilities and infrastructure

components/
├── ui/                     # shadcn primitives (do not edit manually)
├── atoms/                  # Smallest custom building blocks
├── molecules/              # Compositions of atoms
└── organisms/              # Self-contained UI sections
```

The codebase follows **hexagonal architecture**: domain → application → infrastructure. Inner layers never import from outer layers. Port interfaces (TypeScript) live in `application/ports/`; concrete adapters implement them in `infrastructure/`.

## Authentication Flow

1. User enters their email address on the login page.
2. A one-time passcode (OTP) is sent to that email via Resend.
3. User enters the OTP to complete sign-in.
4. A signed session token is issued and stored in a cookie.

For local development, set `NEXT_PUBLIC_DEMO_OTP` in `.env` to use a fixed code without sending real emails.

## Running Tests

```bash
pnpm test             # single run
pnpm test:watch       # watch mode
pnpm test:coverage    # with coverage report (must meet 70% threshold)
```

Unit tests are co-located with source files (`*.test.ts`). Integration tests live in `src/__tests__/integration/`. E2E tests (Playwright) live in `e2e/`.
