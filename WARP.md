# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development commands

### Setup

- Install dependencies (preferred): `bun install`

### Running the dev server

- Start the Vite dev server (TanStack Start app on port 3000):
  - `bun --bun run dev`

### Building and previewing

- Build for production:
  - `bun --bun run build`
- Preview the production build locally:
  - `bun --bun run preview`

### Testing (Vitest)

- Run the full test suite (Vitest):
  - `bun --bun run test`
- Run a single test file (Vitest):
  - `bun --bun run test path/to/file.test.tsx`
  - You can pass any standard Vitest CLI filters/patterns after `test`, for example a specific file path or pattern.

### Linting & formatting

- Lint the project (ESLint via `@tanstack/eslint-config`):
  - `bun --bun run lint`
- Check formatting (Prettier):
  - `bun --bun run format`
- Auto-fix formatting and lint issues across the repo:
  - `bun --bun run check`  
    (This runs `prettier --write .` followed by `eslint --fix`.)

## Architecture overview

### Framework and tooling

- This is a full-stack React application built with **TanStack Start** on top of **Vite**.
- Routing is handled by **TanStack Router** using file-based routes under `src/routes`.
- **Nitro** (via `nitro/vite`) is used to enable server-side rendering and server functions.
- Styling is powered by **Tailwind CSS v4** via the `@tailwindcss/vite` plugin; styles are defined in `src/styles.css` and applied globally.
- The project is written in **TypeScript** with strict compiler options configured in `tsconfig.json`.

### Vite / TanStack Start integration

- `vite.config.ts` wires together the core tooling via plugins:
  - `tanstackStart()` enables TanStack Start (SSR, file-based routing, route generation, server functions).
  - `nitro()` integrates Nitro for server-side execution and deployment.
  - `@vitejs/plugin-react` provides React-specific Vite behavior.
  - `@tanstack/devtools-vite` enables TanStack Devtools.
  - `vite-tsconfig-paths` reads `tsconfig.json` and enables the `@/*` path alias (e.g. `@/components/...`).
  - `@tailwindcss/vite` enables Tailwind v4 (no separate Tailwind config file).

### Routing and layout

- File-based routing is defined under `src/routes`:
  - `src/routes/__root.tsx` defines the **root route and HTML shell** using `createRootRoute`.
    - Sets up document `<head>` metadata and links to `src/styles.css` via `HeadContent`.
    - Wraps the application body with a shared `<Header />` component and renders route content via the `shellComponent`.
    - Mounts `TanStackDevtools` with the `TanStackRouterDevtoolsPanel` plugin and includes `<Scripts />` for client-side hydration.
  - `src/routes/index.tsx` defines the **home page** using `createFileRoute('/')`.
    - Renders the main marketing-style landing section highlighting TanStack Start features using Tailwind utility classes.
    - This file is the suggested starting point for customization (`/src/routes/index.tsx`).
- `src/router.tsx` constructs the application router via `createRouter`:
  - Imports a generated `routeTree` from `./routeTree.gen` (produced by TanStack Start based on the `src/routes` file structure).
  - Exposes `getRouter()` to create a configured router instance with scroll restoration and preload settings.

### Shared UI and navigation

- `src/components/Header.tsx` implements the **global navigation header and sidebar**:
  - Uses `Link` from `@tanstack/react-router` for SPA navigation.
  - Provides a mobile-friendly slide-in sidebar menu controlled by local React state (`isOpen`, `groupedExpanded`).
  - Contains links to the home page and several demo routes (e.g. `/demo/start/server-funcs`, `/demo/start/api-request`, `/demo/start/ssr/...`). These demo routes are part of the TanStack Start starter template.

### Server functions and data layer

- `src/data/demo.punk-songs.ts` demonstrates a **server function** using `createServerFn` from `@tanstack/react-start`:
  - Exposes `getPunkSongs`, a GET handler that returns an in-memory list of song objects.
  - This is a template/example and can be adapted or removed as needed.
- Additional server functions can be created alongside other data modules using `createServerFn`, which will be wired into the Nitro/TanStack Start server pipeline.

### Styling

- `src/styles.css` is the main global stylesheet:
  - Imports Tailwind via `@import "tailwindcss";` and uses `@apply` for basic body/reset styles.
  - Typographic and layout styles for the app largely come from Tailwind utility classes used directly in JSX.

### Configuration

- `tsconfig.json`:
  - Enables modern ECMAScript targets and DOM libs, `moduleResolution: "bundler"`, and strict type checking.
  - Defines the path alias `@/*` pointing to `./src/*` for cleaner imports.
- `eslint.config.js`:
  - Uses the shared `tanstackConfig` from `@tanstack/eslint-config` for lint rules tailored to TanStack projects.
- `prettier.config.js`:
  - Configures Prettier with no semicolons, single quotes, and trailing commas.

### Template/demo files

- The starter includes demo files meant as examples rather than production code:
  - Files and routes prefixed with `demo` (including `src/data/demo.punk-songs.ts` and demo routes referenced in `Header.tsx`) can be removed once you no longer need them.
- The `README.md` documents the TanStack Start template and is a good reference for routing, data loading, TanStack Query integration, and state management patterns used in this stack.
