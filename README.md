# FearLab Website

FearLab Website is a React + TypeScript + Vite single-page under-construction site for FearLab at The Hong Kong University of Science and Technology (Guangzhou).

## Stack

- React 19
- TypeScript
- Vite
- Framer Motion

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run a type check:

```bash
npm run check
```

Create a production build:

```bash
npm run build
```

The production output is written to `dist/`.

## Important files

- `src/App.tsx`: page content and animation structure
- `src/styles.css`: visual system, responsive layout, and illustration styling
- `scripts/upload_source.sh`: uploads the source archive to the server
- `scripts/run_remote_build.sh`: uploads source and triggers the remote build
- `scripts/remote_build.sh`: installs dependencies, builds, publishes static assets, and reloads Nginx

## Deployment

The current deployment flow is script-based:

```bash
./scripts/run_remote_build.sh
```

This uploads the source archive, runs the build on the server, publishes `dist/`, and reloads Nginx.

## Notes

- This repo is static for now.
- Playwright artifacts should stay under `output/playwright/`.
- CI/CD should be improved later; the current scripts are a temporary deployment path.
