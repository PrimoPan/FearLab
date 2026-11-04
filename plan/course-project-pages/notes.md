# Notes

- Current navigation begins at 01 (Title), then 02 (Context), 03 (Problem), 04 (Research Question), followed by other research prompts.
- User requests retaining 0–2, then Literature Review as 3; clarification requested.
- Source page: src/pages/CourseProjectPage.tsx. Source prompts: src/content/courseResearchTemplate.ts.
- Board URL: https://www.figma.com/board/cXUsHo5cg16SaAaTCv1l16/CMAA6019-Workshop?node-id=2104-2451&t=C3v2CYUAmFWoj5St-1
- Board key: cXUsHo5cg16SaAaTCv1l16. Selected node: 2104:2451.

## Confirmed structure
- User confirmed 00 = Title/teaser/team, 01 = Context, 02 = Research Problem.
- Added 03 Literature Review, 04 Design Process, 05 Implementation & Development, 06 Final Prototype Showcase.
- Existing Context and Research Problem prompts preserved verbatim.
- Literature gallery has three explicit reference placeholders and auto-fit columns. No papers or findings were invented.
- Development uses a Build → Test → Refine flow and a repeat-cycle caption.

## Embed verification
- Official format: https://developers.figma.com/docs/embeds/embed-figma-file/
- Embed uses embed.figma.com/board, embed-host=fearlab, and node-id=2104-2451.
- Figma connector create_session is unavailable in this runtime. Web reader cannot access the board.
- Live Chromium request reaches Figma's embed interstitial (200), then redirects to its board viewer and receives a CloudFront 403 Request blocked. This is an observed external loading limitation, not proof that sharing settings are wrong.
- Original direct board URL remains available in the Design Process toolbar.

## Floating navigation follow-up
- Removed the left navigation column; each project section now spans the full existing page-container width.
- Added a collapsed bottom-right On this page control that opens a floating, scrollable section list.
- Selecting a section closes the panel and moves keyboard focus to its destination. Escape and the close button return focus to the trigger; clicking outside dismisses the panel.
- Validated 12 viewport/theme combinations, including short landscape screens, all eight section targets, and every course-project route.
- TypeScript, production build, and diff checks passed.
