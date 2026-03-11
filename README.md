# Biomed Tech Hub

[cloudflarebutton]

A modern full-stack web application powered by Cloudflare Workers for the backend API and React with shadcn/ui for a stunning, responsive frontend. Built with TypeScript, Tailwind CSS, and best-in-class tools for rapid development and deployment.

## Features

- **Full-Stack Ready**: Hono-based API routes in Cloudflare Workers with seamless integration to React frontend.
- **Modern UI**: shadcn/ui components, Tailwind CSS with custom design system, dark/light theme support.
- **State Management**: TanStack Query for data fetching, Zustand for client state.
- **Developer Experience**: Hot reload, TypeScript, Vite bundling, ESLint, error reporting.
- **Responsive Design**: Mobile-first, sidebar layout, animations, and glassmorphism effects.
- **Deployment Optimized**: One-command deploy to Cloudflare with Workers Sites for static assets.
- **Production Ready**: CORS, logging, error boundaries, client error reporting, health checks.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons, Framer Motion, React Router, TanStack Query, Sonner (toasts)
- **Backend**: Cloudflare Workers, Hono, TypeScript
- **Utilities**: clsx, tailwind-merge, Zod, Immer, UUID
- **Dev Tools**: Bun, ESLint, Wrangler, Cloudflare Vite plugin

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed (≥1.0)
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) (`npm i -g wrangler`)
- Cloudflare account and API token configured (`wrangler auth login`)

### Installation

1. Clone the repository.
2. Install dependencies:

   ```bash
   bun install
   ```

3. Generate Worker types (if needed):

   ```bash
   bun run cf-typegen
   ```

### Development

- Start the development server (frontend + Worker proxy):

  ```bash
  bun dev
  ```

  Opens at `http://localhost:3000` (or `$PORT`).

- Lint code:

  ```bash
  bun lint
  ```

- Build for production:

  ```bash
  bun build
  ```

## Usage

- **Frontend**: Edit `src/pages/HomePage.tsx` and components in `src/components/`.
- **Backend API**: Add routes in `worker/userRoutes.ts` (e.g., `app.get('/api/test', ...)`). Auto-reloads in dev.
- **API Calls**: Use relative paths like `fetch('/api/your-route')` – proxied to Worker.
- **Theme Toggle**: Built-in dark/light mode with persistence.
- **Error Reporting**: Client errors auto-reported to `/api/client-errors`.
- **Sidebar Layout**: Use `AppLayout` from `src/components/layout/AppLayout.tsx` for pages needing sidebar.

Example API route in `worker/userRoutes.ts`:

```ts
app.get('/api/users', (c) => c.json({ users: ['Alice', 'Bob'] }));
```

## Deployment

1. Build the project:

   ```bash
   bun build
   ```

2. Deploy to Cloudflare Workers (frontend assets + Worker):

   ```bash
   bun deploy
   ```

   This uploads static assets and deploys the Worker. Your app will be live at `https://${wrangler.jsonc:name}.${your-subdomain}.workers.dev`.

3. Customize domain in `wrangler.toml` or Cloudflare dashboard.

[cloudflarebutton]

## Project Structure

```
├── src/              # React frontend (pages, components, hooks, lib)
├── worker/           # Cloudflare Worker (API routes in userRoutes.ts)
├── tailwind.config.js # Design system
├── vite.config.ts    # Vite + Cloudflare plugin
├── wrangler.jsonc    # Worker config
└── package.json      # Bun scripts
```

## Environment Variables

Defined in `wrangler.jsonc`. Add bindings via Wrangler dashboard:
- `ASSETS`: Static asset fetcher (auto-configured).

## Contributing

1. Fork and clone.
2. Install: `bun install`.
3. Create feature branch: `bun dev`.
4. Commit changes: `git commit -m "feat: add X"`.
5. Push and PR.

## License

MIT License. See [LICENSE](LICENSE) for details.