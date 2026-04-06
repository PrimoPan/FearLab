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
- `.github/workflows/deploy.yml`: deploys automatically when `main` is updated

## Deployment

Deployment is handled by GitHub Actions only. Any push to `main` will install dependencies, run the type check, build the site, upload the deploy archive to the server, and execute the remote publish routine over SSH.

Required GitHub repository secrets:

- `FEARLAB_HOST`: deployment host
- `FEARLAB_USER`: SSH user for deployment
- `FEARLAB_SSH_KEY`: private SSH key used by GitHub Actions
- `FEARLAB_PORT`: optional SSH port if not `22`

The deploy user must support passwordless `sudo`, because the remote deployment routine updates packages, publishes files, and reloads Nginx.

## Notes

- This repo is static for now.
- Playwright artifacts should stay under `output/playwright/`.
