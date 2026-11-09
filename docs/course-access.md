# Course access

The course gallery (`/projects/course`) and every project route below it require
the shared course password. Direct project links show the password form and open
the requested project after successful entry. Course access is separate from
member accounts and does not grant project-studio permissions.

## Local use

Use the pinned Node version and run these commands in separate terminals:

```bash
npm run start:api
npm run dev
```

Open `http://127.0.0.1:3001/projects/course`. Access remains locked when the API is
unavailable, including a static-only preview without an API proxy.

The server issues an HttpOnly, SameSite=Strict browser-session cookie. Production
cookies also require HTTPS. Access lasts at most eight hours; the **Lock course**
button revokes it immediately. Restarting the API invalidates existing sessions.
Browsers that restore sessions may also restore session cookies, so use **Lock
course** to explicitly end access on a shared device.

## Content and password configuration

- Edit `server/course-content.json` for course copy, project titles, student
  rosters, section configuration, the FigJam URL, and development stages. Restart
  the API after editing this file, or use `npm run dev:api` for file watching.
- Files in `src/content/course*.ts` contain types only. Keep protected copy and
  student data out of frontend source and `public/` assets.
- `server/course-password.mjs` contains a salted scrypt verifier for the configured
  shared password. The plaintext password is not stored in frontend code or the
  repository. An optional server-only `COURSE_PASSWORD_HASH` environment variable
  can override the default verifier; use the existing `hashPassword` helper in
  `server/security.mjs` to create it, and restart the API after changing it.
- Login requests allow up to 60 attempts per IP per 15 minutes, including successful
  entries, to accommodate the class using a shared network.

Course responses use `Cache-Control: no-store`. Content is returned only after
server-side authentication and held in frontend memory. Browser storage flags do
not grant access. Development source requests for server files, private local
data, plans, and temporary files are denied by Vite.

## Verification and deployment

`npm run test:api` covers anonymous access, incorrect passwords, cookie security,
session rotation, logout, expiry, origin checks, and throttling. `npm run build`
also runs `scripts/check-course-build.mjs`, which rejects protected course markers
and the password verifier in public output. Existing public lab-profile emails
are excluded from the private-roster marker check.

Deploy both the frontend and Node API using the existing deployment workflow.
Its HTTPS `/api/` proxy serves the course endpoints; the server content and
verifier stay with the API release, outside the static document root. This
implementation does not publish or deploy changes automatically.
