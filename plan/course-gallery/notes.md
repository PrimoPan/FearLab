# Implementation notes

- Source: src/pages/CoursePage.tsx and src/content/courseProjects.ts.
- Detail page currently resolves team IDs directly; merging needs alias support.
- Current projects 06 and 07 concern teacher knowledge, robot facilitation, and classroom orchestration.
- No project media exists yet; original project pages already use teaser placeholders.
- User confirmed six entries in two rows of three; one-column mobile and two-column tablet layouts.
- Required checks from docs/development.md: npm run check, npm run build, git diff --check, responsive route smoke checks.
- This is a website repository with no Obsidian binding; no research-vault bootstrap is applicable.

## Merge and follow-up
- Combined entry uses the working title “Learning from Teachers: Embodied AI for Classroom Facilitation”.
- Previous 06 title: “Learning Teachers' Experiential Knowledge for Robot Facilitation in Autism Education”.
- Previous 07 title: “What Can Teachers Teach an Embodied AI about Classroom Orchestration? A Feasibility Study of Training Embodied AI with Embodied and Tacit Teacher Knowledge”.
- Both /projects/course/team-06 and /projects/course/team-07 resolve to the combined entry with all six students.
- Individual project-page structure was subsequently updated; see ../course-project-pages/result.md.
- Main Projects page count now derives from courseProjects.length.

## Title and description follow-up
- User requested merging About the course into the title section.
- Moved both exact paragraphs into CourseHero; removed the separate About block.
- Desktop uses two columns at 1000px and above, with stacked content below that breakpoint. The background fills the combined section and the hero can grow to fit mobile text.
- Verified at 320, 390, 768, 1024, and 1440px in both themes. Gallery anchor, six cards, TypeScript, production build, and diff checks passed.
