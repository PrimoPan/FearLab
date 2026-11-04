# Course password access

## Goal
Require the supplied shared password for the course gallery and every course-project route, with server-side verification and protected course data.

## Phases
- [x] Inspect hosting, API security utilities, and course data dependencies.
- [x] Add server authentication, guarded content, and meaningful API tests.
- [x] Add the password entry screen, session boundary, and lock action.
- [x] Remove protected data from public bundles and protect development source paths.
- [x] Verify unauthorized access, correct/wrong password, session expiry, direct links, mobile UI, and build.

## Decisions
- Reuse the existing Node API and origin checks; keep course sessions independent from member accounts.
- Store only a scrypt hash of the supplied password server-side.
- Use an HttpOnly, SameSite=Strict browser-session cookie, Secure in production, with an eight-hour server expiry.
- Move the course copy, roster, section configuration, and FigJam URL into a server-only content file.
- Fail closed if the API is unavailable. No browser-storage unlock flags.
- Local implementation only; no deployment requested.

## Status
Implementation and verification complete. Prepared for the requested commit and push to hn. API and frontend are running for review; no deployment performed.
