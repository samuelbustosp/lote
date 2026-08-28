<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# LOTE — Architecture, Code Quality & Engineering Standards

## 1. Language & Naming Conventions
- **All code identifiers, routes, file names, components, functions, interfaces, types, and variables MUST be in English.**
  - Examples: `useFarmStore`, `FieldCard`, `NewActivityModal`, `financialTransactions`, `/fields`, `/activities`, `/finances`, `/machinery`, `/settings`.
- **Comments and documentation**: Code comments may be written in Spanish when explaining domain-specific agronomic logic, or in English.
- **UI User-Facing Labels**: Agricultural terminology displayed to producers remains natural in Spanish where appropriate (e.g., "Maíz", "Soja", "Margen Bruto", "Hectáreas").

## 2. Architectural Principles: High Cohesion & Low Coupling
- **Feature/Domain-Driven Directory Structure**:
  - `app/`: Next.js App Router route handlers and page wrappers.
  - `components/[feature]/`: Self-contained, highly cohesive components grouped by domain (`fields/`, `activities/`, `finances/`, `machinery/`, `weather/`, `reports/`, `assistant/`, `auth/`, `dashboard/`, `layout/`, `ui/`).
  - `components/ui/`: Atomic, reusable design primitives (`Button`, `Card`, `Modal`, `Badge`, `Logo`).
  - `lib/`: Decoupled services, Supabase database client, utility functions, and centralized TypeScript interfaces.
- **Component Independence**:
  - Components should receive clear typed props and avoid rigid dependencies on external DOM structures.
  - Keep business logic decoupled from presentation.

## 3. Dedicated Authentication & Protected Dashboard
- **Standalone Auth Routes**:
  - Dedicated pages at `/login` and `/register` for full-page authentication workflows.
  - Reusable `LoginForm` and `RegisterForm` components.
- **Private Dashboard Security**:
  - The agricultural dashboard (`/`, `/fields`, `/activities`, etc.) is strictly private and guarded.
  - Unauthenticated visitors on the root route `/` see the public animated `LandingPage`.
  - Unauthenticated visitors on protected routes see the access restriction barrier with direct redirect to login.
  - Supabase Row-Level Security (RLS) enforces data isolation strictly by `user_id = auth.uid()`.

## 4. Clean Code & JSDoc Standards
- **Single Responsibility Principle (SRP)**: Each function and component has one clear purpose.
- **Strict Typing**: No `any` whenever specific TypeScript types or interfaces can be declared.
- **JSDoc Documentation**: Provide JSDoc blocks for key exports, interfaces, store methods, and utility helpers describing their purpose, parameters, and return values.
