# Course project-page update

Preview: http://127.0.0.1:3001/projects/course/team-01

## Structure
- 00: existing title, teaser, and team information.
- 01: existing project context and storyboard placeholder, with original prompts.
- 02: existing research problem, with original prompts.
- 03: Literature Review, with three image-and-description reference placeholders and flexible columns.
- 04: Design Process, with the supplied FigJam board and node embedded in an iframe, fullscreen support, and a direct board link.
- 05: Implementation & Development, with a Build → Test → Refine cycle that stacks on narrow screens.
- 06: Final Prototype Showcase, with a large media placeholder, walkthrough, and prototype-details prompts.

## Implementation
CourseProjectPage composes focused components in src/components/projects/. Section metadata, numbering, the board URL, and development-stage copy now live in server/course-content.json behind the course password boundary; src/content/courseResearchTemplate.ts contains their types. All project routes use this shared layout. Sections span the full page-container width; a collapsible bottom-right On this page menu replaces the left sidebar. Actual literature and prototype media remain clearly marked placeholders.

## Validation
TypeScript, production build, and diff checks passed. Browser checks passed at 320, 390, 768, 1024, and 1440 pixels in both themes, including section anchors, gallery and flow columns, and no horizontal overflow. All seven original project URLs render the new structure. The merged 06/07 routes retain six students, and the other projects retain three each. Original context/problem prompts were compared with the source backup and match exactly.

## FigJam limitation
The iframe uses Figma's documented URL format, exact supplied board key, and node-id=2104-2451. The external viewer returned a CloudFront 403 Request blocked in live Chromium after a successful embed-interstitial response, so the board content itself could not be verified. This does not establish that sharing permissions are wrong. The original board URL is available via Open in FigJam.

Documentation: https://developers.figma.com/docs/embeds/embed-figma-file/

## Status
Prepared for the requested commit and push to hn, alongside the gallery and password-access updates. No deployment performed. Temporary checks and backups were removed after archiving evidence.

## Navigation follow-up validation
The floating menu was verified at 1440×1000, 1024×768, 768×1024, 390×844, 320×740, and 844×390 in both themes. Full article width, persistent floating position, panel bounds, Escape/outside-click/close dismissal, keyboard navigation and focus, every section link, and all project routes passed.
