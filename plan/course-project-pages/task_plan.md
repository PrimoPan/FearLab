# Course project-page structure

## Goal
Preserve the opening sections and replace the remaining template with Literature Review (03), Design Process (04), Implementation & Development (05), and Final Prototype Showcase (06).

## Phases
- [x] Inspect current page and shared data.
- [x] Resolve numbering and verify FigJam embed support.
- [x] Implement reusable content sections and updated navigation.
- [x] Verify all routes, responsive rendering, embed URL/fallback, and build.

## Decisions
- Apply the shared structure to all course projects, including merged 06/07.
- Keep existing colour tokens, fonts, and title/teaser/team content.
- Literature Review uses three image-and-description placeholders in an adaptive gallery.
- Use the supplied FigJam board and selected node in an iframe, with a direct board link.
- Implementation is an iterative flow with clearly marked content prompts; no invented research findings.
- Final showcase has a large media placeholder and concise prototype details.

## Status
Implementation complete and locally verified. Live FigJam board content remains unverified because its external viewer returned CloudFront 403 in the test browser; the iframe and direct board link are in place.

## Validation notes
- Initial column-count assertion included the CSS auto-fit collapsed 0px track. Updated the check to count visible tracks; rendered gallery correctly contains three cards.

## Floating navigation follow-up
- [x] Remove the sidebar grid and give the article the full page-container width.
- [x] Add a bottom-right floating On this page toggle with a scrollable section menu.
- [x] Verify toggle, outside click, Escape, keyboard focus, section navigation, responsive width, and build.
- Initial patch included an incorrect intro-heading context and was rejected without source changes; reapplied with the actual markup.
