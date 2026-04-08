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

## Project structure

```text
.
├── assets/
│   └── People/
│       ├── id/                 # directory-card portraits
│       └── photos/life/        # full-screen people detail photography
├── src/
│   ├── app/
│   │   ├── AppShell.tsx        # route shell, title policy, theme persistence
│   │   └── theme.ts            # theme detection and toggling helpers
│   ├── components/
│   │   ├── construction/       # under-construction illustration pieces
│   │   ├── home/               # homepage banner components
│   │   ├── layout/             # shared site header/navigation
│   │   ├── news/               # CHI'26 news hero, cards, and sections
│   │   └── people/             # people directory and profile-detail building blocks
│   ├── content/
│   │   └── siteContent.ts      # nav items and page copy/config
│   ├── data/
│   │   └── people.ts           # people records, photos, crop/brightness settings
│   ├── hooks/
│   │   └── useMediaQuery.ts    # responsive behavior helper
│   ├── lib/
│   │   └── animations.ts       # shared motion variants and easing
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── NewsPage.tsx
│   │   ├── PeoplePage.tsx
│   │   ├── ConstructionPage.tsx
│   │   └── PersonRedirectPage.tsx
│   ├── App.tsx                 # BrowserRouter entry only
│   ├── main.tsx                # React mount
│   └── styles.css              # global visual system and responsive layout rules
├── .github/workflows/deploy.yml
└── README.md
```

## Shared project rules

### Commit convention

- Commit format: `YYYY-MM-DD HH:MM HKT <summary>`.
- Use Hong Kong time, not local machine time from another timezone.
- Keep the summary concise and specific to the user-facing change.
- Run `npm run build` before commit/push whenever practical.

### Current site behavior

- Browser tab title stays fixed as `FEAR Lab | HKUST(GZ)` on every route.
- The site defaults to dark mode; light mode is opt-in only after a user click.
- `News` is the featured navigation item and currently highlights CHI'26.
- On mobile, the active top-nav tab must stay visible when horizontally scrolled.
- In the people directory, mobile portrait cards should render at consistent sizes.
- In people detail pages on desktop, the top `People` badge and bottom back button should fit within the same viewport whenever possible.
- Lifestyle photos use per-person crop/brightness tuning from `src/data/people.ts`.
- The CHI'26 page should follow the site’s current visual language rather than reproducing poster artwork literally.
- Introduction-card scrollbars should remain inset and visually integrated with the glass panel.

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
