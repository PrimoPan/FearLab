# FEAR Lab Website

FEAR Lab's React single-page website for HKUST(GZ). The site includes Home, News,
Publications, People profiles, and shared under-construction pages.

## Technology

- React 19 and TypeScript 5.9
- Vite 8 with `@vitejs/plugin-react` 6
- Tailwind CSS 4 through the first-party Vite plugin
- `tailwind-merge` for deterministic conditional utility composition
- Framer Motion 12
- React Router 6

## Requirements

- Node.js `22.23.1` is the project default in `.nvmrc`.
- Vite 8 requires Node.js `20.19+` or `22.12+`.
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
```

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

## Deployment

Production deployment is handled by `.github/workflows/deploy.yml`. A push to
`main` installs with the Node version from `.nvmrc`, checks TypeScript, builds the
site, creates a source archive, and publishes through the configured SSH secrets.
