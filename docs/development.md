# Development and component rules

## Runtime

Always enter the repository with the pinned Node runtime before installing or
building:

```bash
nvm use
npm ci
```

The supported Node range is also declared in `package.json`. Do not bypass the
engine warning: Vite 8 is ESM-only and does not run on Node 18.

## React boundaries

- Route files compose features; they should not contain long repeated markup.
- Repeated visual patterns belong in `src/components/ui` or a feature component.
- Keep a React component near 150 lines or fewer. Split independent visual or
  behavioral responsibilities before a file grows beyond that size.
- Keep static data separate from rendering. People are split by member and
  publications by year so content updates do not create a monolithic module.
- Prefer typed maps and small helpers over nested conditionals in JSX.
- Preserve semantic HTML, accessible names, keyboard focus, and reduced-motion
  behavior whenever a component is refactored.

## Tailwind rules

Tailwind CSS 4 is integrated through `@tailwindcss/vite`. This project uses a
CSS-first theme and React utility classes.

- Use the shared theme utilities such as `text-ink`, `text-ink-soft`,
  `bg-panel`, `border-line`, `text-accent`, `font-sans`, and `font-mono`.
- Use Tailwind responsive, state, `data-*`, and `aria-*` variants in components.
- Compose conditional class lists with the shared `cn()` helper. It uses
  `tailwind-merge`, so later state classes deterministically replace conflicting
  base utilities.
- Exact one-off values may use arbitrary utilities when they preserve the
  established composition, for example `text-[clamp(...)]`.
- Do not add a second styling system, CSS-in-JS library, inline style object for
  static styling, or another large BEM stylesheet.
- Inline styles are reserved for runtime values such as measured header height
  and per-person image crop variables.
- Custom CSS is limited to design tokens, document base rules, keyframes, and
  browser features that utilities cannot express cleanly.

The light and dark themes share semantic tokens. Components must never hardcode
a different palette merely to make one theme pass.

## Required checks

Before handing off a change:

```bash
npm run check
npm run build
git diff --check
```

Visual changes must also be checked on desktop and mobile for Home, News,
Publications, People (including an open profile), Project, and Contact. Verify
both themes when changing tokens, transparency, photography, or contrast.
