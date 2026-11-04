# Course access notes

- Existing server/app.mjs has JSON parsing, no-store responses, same-origin mutation checks, password hashing, and per-IP throttling helpers.
- Existing HTTPS deployment proxies /api/ to the Node backend; no Nginx route changes are needed.
- The static preview port has no API, so it must remain locked.
- Development server currently serves repo sources; deny server, plan, temp, and private data paths.
- Original route and student data must survive the move to server content unchanged.

## Verification notes
- All 60 API tests passed.
- The browser check initially waited for global network-idle and timed out; changed it to wait for the relevant gate/project UI so unrelated background requests do not block validation.
- Course sign-in allows 60 attempts per IP per 15 minutes, accommodating the class behind a shared network while bounding repeated guesses.

- Build guard initially flagged two emails already published in public lab profiles. It now exempts existing public-profile emails while rejecting all course titles, the board key, password verifier, description, and private roster emails.
- A deliberately Unicode-escaped leak fixture exposed a scanner gap; the guard now normalizes Unicode/hex escapes and correctly rejects that fixture.
