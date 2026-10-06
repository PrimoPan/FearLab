# FEAR Lab Website

FEAR Lab's React single-page website for HKUST(GZ). The site includes Home, News,
Publications, People profiles, project pages, and a local member project studio.

## Technology

- React 19 and TypeScript 5.9
- Vite 8 with `@vitejs/plugin-react` 6
- Tailwind CSS 4 through the first-party Vite plugin
- `tailwind-merge` for deterministic conditional utility composition
- Framer Motion 12
- React Router 6

## Requirements

- Node.js `22.23.1` is the project default in `.nvmrc`.
- The project studio API requires Node.js `22.23.1` because it uses built-in SQLite.
- The standalone static build supports the Node versions listed in `package.json`.
- npm `10.8.2+`

```bash
nvm install
nvm use
npm ci
```

## Commands

```bash
npm run dev      # http://localhost:3001
npm run check    # TypeScript checks
npm run build    # production output in dist/
npm run preview  # preview dist/ on port 3001
npm run start:api # project studio API on 127.0.0.1:3002
npm run dev:api   # API with file watching (start:api if EMFILE occurs)
npm run test:api  # isolated API integration tests
```

For the [local project studio](http://127.0.0.1:3001/test), run `npm run start:api`
and `npm run dev` in separate terminals. See the [studio guide](docs/project-studio.md)
for onboarding, author/reviewer workflow, private data storage and production setup.
Members can enter the studio with their initial password; changing it under
My Profile is optional.

## Project map

```text
src/
├── app/                    # route shell and theme lifecycle
├── components/
│   ├── construction/       # construction illustration
│   ├── home/               # homepage modules
│   ├── layout/             # shared navigation
│   ├── news/               # conference news modules
│   ├── people/             # directory and profile modules
│   ├── publications/       # archive and publication modules
│   └── ui/                 # small reusable presentation primitives
├── content/                # navigation and page copy
├── data/
│   ├── people/             # one member per module
│   └── publications/       # records split by publication year
├── hooks/                  # responsive and header behavior
├── lib/                    # shared helpers and motion definitions
├── pages/                  # route-level composition only
└── styles.css              # Tailwind entry, tokens, base rules, keyframes
```

## Documentation

- [Development and component rules](docs/development.md)
- [Vite 8 and Tailwind migration](docs/vite8-tailwind-migration.md)
- [Deployment and rollback](docs/deployment.md)
- [Content intake forms](docs/fearlab-content-intake-forms.md)
- [Project studio: local setup, review and API hosting](docs/project-studio.md)

## Deployment

Production deployment is handled by `.github/workflows/deploy.yml`. A push to
`main` checks TypeScript, tests the API, builds the frontend, and deploys both
through the configured SSH connection. An explicitly requested manual release
uses that workflow's same inline remote script and verification gates.

The website is served at `https://fearlab.space`; the private member workspace
is at `/test`, and registration is at `/test/reigister` (also `/test/register`).
Nginx proxies `/api/` over HTTPS to a dedicated systemd service on
`127.0.0.1:3002`. The service uses an isolated Node 22.23.1 installation and keeps
SQLite plus uploaded photos in `/var/lib/fearlab-portal`, outside all static and
code releases. Local databases and QA accounts are excluded from deployment.

Deployments back up the current site, source, configuration, API and existing
private data before activation; failures restore code/configuration while
preserving persistent data. See [deployment and rollback](docs/deployment.md)
for the server layout, required secrets, public verification and recovery steps.
