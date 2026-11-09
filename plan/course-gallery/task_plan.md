# Course gallery polish

## Goal
Polish the course list with a full-height background image placeholder, the supplied course title and exact description, and six project cards in two rows of three.

## Phases
- [x] Inspect current routes, data, and design conventions.
- [x] Confirm six cards rather than nine slots.
- [x] Implement hero, introduction, gallery, and merged 06/07 data.
- [x] Verify build, responsive visuals, themes, and legacy project links.

## Decisions
- Use the existing Space Grotesk / IBM Plex Mono fonts and semantic palette in an editorial grid.
- Keep the title and full supplied description together over the hero background: side by side on desktop, stacked on smaller screens.
- Keep the individual project-page layout; only adjust shared data and link resolution for the merged project.
- Use clearly identified media placeholders until real course and teaser images are supplied.
- Preserve all six students and resolve both original project routes.

## Errors encountered
- Initial visual assertion checked offscreen lazy images before loading; made the capture helper load/decode images before asserting.
- Playwright helper named inspect.py shadowed the Python standard library; renamed to visual_check.py.
- Initial patch attempted delete/add of one file in a single patch; rejected without changes, then applied as a normal rewrite.
- Initial inspection referenced a nonexistent projectStyles.ts; actual shared layout constants are in ProjectReveal.tsx.

## Status
Complete. Title and About the course now share one hero, verified at five widths in both themes. TypeScript, build, and diff checks passed.
