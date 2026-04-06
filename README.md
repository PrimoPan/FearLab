# FearLab Website

FearLab Website is a React + TypeScript + Vite single-page under-construction site for FearLab at The Hong Kong University of Science and Technology (Guangzhou).

The current version ships:

- an English landing page for `fearlab.space`
- a responsive construction scene with a cat-and-blueprint illustration
- a subtle dark/day theme toggle
- a local-to-server deployment workflow using `scp`, SSH, and a remote Nginx build script

## Stack

- React 19
- TypeScript
- Vite
- Framer Motion
- Nginx on the remote server
- Cloudflare for DNS and HTTPS proxying

## URLs

- Production: `https://fearlab.space`
- Redirect: `https://www.fearlab.space`
- Direct preview on server: `http://150.109.64.159:3001`
- Local dev: `http://localhost:3001`

## Local development

Install dependencies:

```bash
npm install
```

Start the local dev server:

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

## Project structure

- `src/App.tsx`: page content and motion structure
- `src/styles.css`: visual system, cat illustration styling, and responsive layout
- `scripts/upload_source.sh`: creates and uploads the source archive
- `scripts/run_remote_build.sh`: uploads source and triggers the remote build
- `scripts/remote_build.sh`: installs runtime dependencies, builds the site, publishes static assets, and updates Nginx
- `deploy/nginx/fearlab.conf.template`: reference Nginx template

## Deployment workflow

The deployment flow is intentionally simple:

1. Build and iterate locally in this repo.
2. Package the source code on the local machine.
3. Upload the archive to the `fearlab` SSH target with `scp`.
4. Build on the server.
5. Publish the generated static files through Nginx.

### Upload source only

```bash
./scripts/upload_source.sh
```

This uploads a source archive to:

```text
/home/ubuntu/fearlab-site-src.tar.gz
```

### Full remote build and publish

```bash
./scripts/run_remote_build.sh
```

This command:

- uploads the source archive
- uploads the standalone remote build script
- installs Node.js 22 and Nginx on the server when needed
- extracts the source into `/home/ubuntu/fearlab-site-src`
- runs `npm install` and `npm run build`
- publishes `dist/` into `/var/www/fearlab/current`
- reloads Nginx

## HTTPS and Cloudflare

Cloudflare should be configured with:

1. `A` record: `fearlab.space -> 150.109.64.159` with proxy enabled
2. `CNAME` record: `www -> fearlab.space` with proxy enabled
3. SSL/TLS mode set to `Full (strict)`
4. An Origin Certificate covering `fearlab.space` and `*.fearlab.space`

Place the origin certificate and key on the server at:

```text
/etc/ssl/fearlab/origin.crt
/etc/ssl/fearlab/origin.key
```

The remote deploy script automatically reuses those files if they are already present.

## Git workflow

Suggested first-time setup for GitHub:

```bash
git remote add origin https://github.com/PrimoPan/FearLab.git
git branch -M main
git push -u origin main
```

## Notes

- This repo intentionally keeps the site static for now.
- `output/` and `.playwright-cli/` are local QA artifact folders and are ignored by Git.
- The remote server remains the source of truth for the production Nginx runtime configuration.
