# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # start dev server (http://localhost:3000)
pnpm build        # production build
pnpm start        # run production build
pnpm lint         # eslint
pnpm test         # run all tests
pnpm test:watch   # tests in watch mode
pnpm test:ui      # vitest UI
pnpm test:coverage # run tests with coverage report (70% minimum)
pnpm test <path>  # run a single test file, e.g. pnpm test src/core/user/user.service.test.ts
```

Install dependencies with `pnpm` only — never `npm` or `yarn`.

Add shadcn components with:

```bash
pnpm dlx shadcn@latest add <component>
```

## Tech Stack

| Layer           | Technology                                            |
| --------------- | ----------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                               |
| Language        | TypeScript 6 (strict)                                 |
| Styling         | Tailwind CSS 4                                        |
| UI Library      | shadcn (base-vega style, CSS variables, lucide icons) |
| Database        | MongoDB Atlas (via Mongoose or MongoDB driver)        |
| Testing         | Vitest + React Testing Library + Playwright (E2E)     |
| Package manager | pnpm                                                  |

Always use the latest stable versions of all dependencies.

## Architecture: Hexagonal (Ports & Adapters)

The codebase follows hexagonal architecture with clean separation of concerns. Feature code lives in `src/modules/<feature>/`:

```
src/
├── modules/
│   └── <feature>/
│       ├── domain/           # entities, value objects, domain errors
│       │   └── <Feature>.ts
│       ├── application/      # use cases (pure business logic, no I/O)
│       │   ├── ports/        # interfaces (input/output ports)
│       │   │   ├── <Feature>Repository.ts
│       │   │   └── <Feature>Service.ts
│       │   └── use-cases/
│       │       └── Create<Feature>UseCase.ts
│       ├── infrastructure/   # adapters: MongoDB repos, external APIs
│       │   └── Mongo<Feature>Repository.ts
│       └── presentation/     # React components specific to this feature
│           └── <Feature>Page.tsx
├── shared/
│   ├── domain/               # shared value objects, base entity
│   ├── infrastructure/       # MongoDB connection, shared adapters
│   └── lib/                  # utilities (cn, etc.)
app/                          # Next.js App Router pages and API routes
components/
└── ui/                       # shadcn primitives (auto-generated, do not edit manually)
```

**Dependency rule:** domain → application → infrastructure/presentation. Inner layers must never import from outer layers.

**Ports** are TypeScript interfaces defined in `application/ports/`. Infrastructure adapters implement them; use cases depend only on the interfaces.

## Component Design

Follow atomic design within `components/`:

- `components/ui/` — shadcn primitives (atoms, managed by CLI)
- `components/atoms/` — smallest custom building blocks (Button variants, Badge, Icon wrappers)
- `components/molecules/` — compositions of atoms (SearchInput, FormField)
- `components/organisms/` — self-contained UI sections (Header, Sidebar, DataTable)
- `components/templates/` — page-level layout shells

Feature-specific components live in `src/modules/<feature>/presentation/` instead.

## Styling

Tailwind CSS 4 is configured via `app/globals.css` using `@import "tailwindcss"` (no `tailwind.config.*` file needed). Design tokens are CSS custom properties under `@theme inline {}`.

- Use CSS variables for all color/spacing tokens — never hardcode hex values.
- Dark mode is toggled via `data-theme="dark"` on `<html>`, defined with `@custom-variant dark` in `globals.css`.
- Avoid arbitrary Tailwind values; extend the theme in `globals.css` instead.

### globals.css is for tokens only — NEVER add component styles

`app/globals.css` must contain only:

1. `@import` statements
2. `@custom-variant` definitions
3. `@theme inline {}` — Tailwind token mappings
4. `:root` / `[data-theme]` — CSS custom property values
5. `@layer base {}` — bare HTML element resets only

**Forbidden in globals.css:**

- `@layer components {}` blocks with named classes (`.sidebar`, `.navitem`, `.card`, etc.)
- Any CSS class applied via `className="..."` in JSX
- Responsive overrides for custom classes

**Instead, always:**

- Compose Tailwind utilities directly in `className` props
- Use `cn()` from `@/lib/utils` for conditional classes
- Use shadcn components (`<Card>`, `<Dialog>`, `<Table>`) for UI primitives
- Create a reusable React component when the same Tailwind pattern appears in 3+ places

## Database

MongoDB Atlas is the database. Connection config comes from `MONGODB_URI` in environment variables. Validate its presence at startup.

- Repositories in `src/modules/<feature>/infrastructure/` implement the port interface.
- Define schemas and models in the infrastructure layer only — domain entities are plain TypeScript classes/objects.
- Use indexes for all frequently-queried fields; define them in the schema.

## Testing

Minimum **70% coverage** enforced on every run. Configure Vitest in `vitest.config.ts`.

- **Unit tests** — co-located with source (`*.test.ts` / `*.test.tsx`)
- **Integration tests** — `src/__tests__/integration/`
- **E2E tests** — `e2e/` using Playwright

Use cases and domain logic must be tested without mocking the framework. Mock only infrastructure adapters (repositories) when testing use cases.

## API Routes

All API routes live under `app/api/`. They must:

1. Validate input with Zod before passing to use cases.
2. Return the standard envelope:
   ```typescript
   { success: boolean; data?: T; error?: string; meta?: { total: number; page: number; limit: number } }
   ```
3. Never contain business logic — delegate to use cases.

## Changelog

Maintain `CHANGELOG.md` at the project root following [Keep a Changelog](https://keepachangelog.com) format. Add an entry under `[Unreleased]` for every user-facing change before closing a PR.
