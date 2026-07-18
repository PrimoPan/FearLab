# Vite 8 and Tailwind 4 migration

## Version baseline

| Tool | Project version | Runtime requirement |
| --- | --- | --- |
| Node.js | 22.23.1 | Vite supports 20.19+ or 22.12+ |
| npm | 10.9.8 | 10.8.2+ |
| Vite | 8.1.5 | Node range above |
| `@vitejs/plugin-react` | 6.0.3 | Vite 8 |
| Tailwind CSS | 4.3.3 | First-party Vite integration |

## What changed

- Vite moved from 5 to 8 and now builds with Rolldown and Oxc.
- The React plugin moved from 4 to 6 and uses the Vite 8-compatible transform.
- Node 18 was replaced by the pinned Node 22 LTS runtime.
- Tailwind 4 was added through `@tailwindcss/vite`.
- The site palette is exposed as semantic Tailwind theme variables while the
  existing CSS variables continue to switch dark and light themes.
- Feature markup uses Tailwind utilities; large global BEM styling is no longer
  the implementation surface.
- Publication records are split by year and people records by member.

## Compatibility decisions

The original Vite configuration did not use custom Rollup options, esbuild
transforms, SSR, Sass, or custom build plugins. No Rolldown compatibility shim is
needed. The project keeps its current browser behavior and accepts Vite 8's
modern default target (Chrome/Edge 111, Firefox 114, Safari 16.4).

Tailwind's theme and utility layers are used with the project's own base rules.
This avoids introducing a reset that could silently alter existing typography,
buttons, or media while the visual system is migrated.

## Visual preservation gate

During migration, every route was compared at desktop (`1440 × 1000`) and
mobile (`430 × 932`) sizes in a local browser QA run. Those transient review
screenshots are not production assets; repeat this checklist for visual changes.
Acceptance requires:

1. the same layout hierarchy and breakpoints;
2. unchanged semantic colors, gradients, shadows, fonts, and image crop values;
3. unchanged header auto-hide, profile detail, publication navigation, and link
   behavior;
4. no runtime console errors;
5. successful type check and production build with Node 22.

## References

- [Vite 8 announcement](https://vite.dev/blog/announcing-vite8)
- [Vite migration guide](https://vite.dev/guide/migration)
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind theme variables](https://tailwindcss.com/docs/theme)
