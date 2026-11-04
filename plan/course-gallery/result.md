# Course gallery delivery

Updated the local course page at http://127.0.0.1:3001/projects/course.

- Full-height, full-width background image placeholder and course title.
- Supplied two-paragraph description preserved verbatim within the title hero, beside the heading on desktop and below it on smaller screens.
- Six cards in two desktop rows of three; two tablet columns and one mobile column.
- Each card has a replaceable teaser placeholder, full project title, and a summary limited to three lines.
- Projects 06/07 combined, retaining every student and both old detail routes.
- Main Projects page links to the gallery; its public label now reads Student projects.

## Validation
TypeScript, production build, and diff checks passed on Node 22.23.1. Browser checks passed at 320, 390, 768, 1024, and 1440 pixels in both themes, with no horizontal overflow, broken assets, or page errors. All seven original detail URLs and keyboard card navigation passed. All 21 student records are preserved. Home, News, Publications, People, Projects, and Contact were checked on desktop and mobile, including opening and closing a People profile.

The optional local API was not running during unrelated route smoke checks; existing static fallbacks rendered. The production build reports its large-chunk advisory.

## Current state
Prepared for the requested commit and push to branch hn, alongside the project-page and password-access updates. No deployment performed. Source baseline is preserved in Git at dbdf460; temporary test files were removed after archiving the verification report and previews here.
