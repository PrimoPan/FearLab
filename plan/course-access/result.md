# Course access result

The course gallery and all course-project routes now require the supplied shared
password, verified by the existing Node API. Successful entry preserves direct
project links. Incorrect passwords, forged browser state, expired sessions, and
API outages do not expose course content.

Protected content moved to `server/course-content.json`. The frontend uses a
shared access boundary, a responsive password screen, and an explicit Lock course
action. Existing six-project gallery, merged team routes, project sections, and
floating navigation remain available after authentication.

## Validation

- All 60 API tests passed; after adjusting the shared-IP limit to 60 attempts,
  all four course integration tests passed again.
- TypeScript checks and production build passed using Node 22.23.1.
- The public-build scan passed and rejected a deliberate Unicode-escaped leak.
- Browser checks passed for correct and incorrect passwords, forged storage and
  cookies, direct routes, refresh, internal navigation, logout, API outage, and
  all anonymous course routes.
- Both themes passed layout checks at 1440, 390, and 320 pixels with no horizontal
  overflow or JavaScript page errors. Desktop and mobile screenshots were reviewed.
- Local frontend returns 200; unauthenticated course API returns 401.

See `browser-verification.json` and the password-screen screenshots in this folder.
Build retains the existing advisory about large JavaScript chunks.

## Review

Local entry: http://127.0.0.1:3001/projects/course

The frontend and API remain running. Prepared for the requested commit and push
to hn, alongside the course layout updates. No deployment performed. Setup and
content-editing instructions are in `docs/course-access.md`.
