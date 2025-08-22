# Army Common Operational Picture (COP)

A Next.js 15 + TypeScript frontend for a military Common Operational Picture with optional Java Spring Boot microservices under `backend/`. The frontend can run in demo mode (mock auth + simulated realtime) without the backend, and integrates with a backend when available.

### What’s here
- **Frontend**: Next.js App Router, Tailwind CSS, shadcn/ui, Zustand state
- **Realtime**: SSE for position updates (with simulators in dev), WebSocket client
- **Backend (optional)**: Spring Boot microservices in `backend/` for auth, ops, tasks, reports, messaging, replay
- **Containerization**: Production-ready frontend `Dockerfile`, `nginx.conf` reverse proxy, `docker-compose.production.yml`

### Repository layout
```
app/                     # Next.js routes and layout
components/              # UI and feature components
services/                # api-service, realtime, sync, IndexedDB
store/                   # Zustand stores (auth, map, ops, tasks, etc.)
backend/                 # Spring Boot microservices + local docker-compose
Dockerfile               # Multi-stage build for Next.js standalone server
nginx.conf               # Reverse proxy: / -> frontend, /api and /ws -> backend
docker-compose.production.yml
```

## Quick start

### Frontend only (demo mode)
This runs without the backend: auth is mocked and realtime position updates are simulated in dev.

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Frontend + backend (local integration)
Use the backend compose to start infra (Postgres, Keycloak), then run services.

```bash
# Infra + services
cd backend
docker compose up -d postgres keycloak
./build-all.sh
./run-dev.sh      # starts services on 8081-8087

# In another shell, run frontend
cd ..
export NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
npm run dev
```
Notes:
- The frontend calls a unified REST base at `/api` (see `services/api-service.ts`). For local integration, ensure your backend exposes a gateway or an API surface at `http://localhost:8080/api`.
- WebSocket client points to `ws://localhost:8080/ws/ops/{operationId}` (see `services/realtime-service.ts`). If you have a gateway, route `/ws` accordingly.
- Without a gateway the app will still run, but certain features requiring real endpoints won’t function.

## Configuration

### Frontend env vars
- `NEXT_PUBLIC_API_BASE_URL` (optional): Absolute base URL for REST calls.
  - If not set, defaults to `http://localhost:8080/api` in development and `https://api.army-cop.mil` in production. See `services/api-service.ts`.
- No env var is currently read for WebSocket; the URL is constructed as `ws://localhost:8080/ws/...` for local dev. Behind a reverse proxy, prefer relative paths (`/ws/...`) via NGINX.

Example for local integration:
```bash
export NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
npm run dev
```

### Backend (optional)
See `backend/` for microservices, scripts, and its own README. Local compose starts Postgres and Keycloak. Services are expected on 8081–8087. A thin API gateway (not included here) should expose consolidated `/api` and `/ws` endpoints for the frontend.

## Production build & run

### Frontend image
Builds a standalone Next.js server.
```bash
# Build image
docker build -t army-cop-frontend .

# Run container
docker run -p 3000:3000 --name army-cop-frontend army-cop-frontend
```

### Reverse proxy (NGINX)
`nginx.conf` proxies:
- `/` → frontend `army-cop-frontend:3000`
- `/api/*` → backend `army-cop-backend:8080/api/*`
- `/ws/*` → backend `army-cop-backend:8080/ws/*`

Adjust upstream names/hosts to match your deployment.

### Full-stack compose (prod-like)
`docker-compose.production.yml` includes services for frontend, backend, Postgres, Keycloak, Redis, and NGINX. You may need to align the backend image/build context with your actual backend build output.
```bash
# Review and adjust env, secrets, and image/build contexts first
docker compose -f docker-compose.production.yml up -d --build
```

## Scripts
```bash
npm run dev      # Start Next.js in development
npm run build    # Build production bundle
npm run start    # Start production server (after build)
```

## Tech highlights
- Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui
- Zustand for state; IndexedDB-based offline storage and background sync
- SSE and WebSocket clients for realtime (with simulated updates in dev)

## Troubleshooting
- API requests fail locally: set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api` and ensure your backend (or gateway) is up.
- WebSocket not connecting: verify the gateway exposes `/ws` and that CORS/upgrade headers are correctly proxied by NGINX.
- Frontend builds but images don’t load: this repo sets `images.unoptimized=true` in `next.config.mjs`. Configure a proper image loader/CDN for production.

## Contributing
- Small changes: open a PR with a clear description.
- Larger work: discuss issues first and keep the README in sync with any new envs or scripts.