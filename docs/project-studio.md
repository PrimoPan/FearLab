# Project studio

The local project studio at `/test` lets members prepare project pages and lets
Dongyijie Primo Pan or Mirjana Prpa review them before publication. It uses a separate Node HTTP
API and SQLite database; the public website remains a Vite application.

Production releases use the repository's GitHub Actions workflow to publish the
frontend and manage the API on the same host. Database records and uploads live
in a private persistent directory outside either code release.

## Run locally

Use the repository's pinned Node.js **22.23.1** (`nvm use`). The API imports the
built-in `node:sqlite` module, so the older Node versions that can build the
static site are not sufficient for this workflow. Node 22 may print an
experimental SQLite warning; this is expected.

Install dependencies once with `npm ci`. Then run two terminals from the
repository root:

```bash
# Terminal 1: persisted API, http://127.0.0.1:3002
nvm use
npm run start:api
```

```bash
# Terminal 2: website, http://127.0.0.1:3001
nvm use
npm run dev
```

Open [the local studio](http://127.0.0.1:3001/test). Vite proxies `/api` to port
3002, so the browser uses the website's origin for both the UI and API. The same
proxy is configured for `npm run preview`.

`npm run dev:api` enables Node's file watcher. If a machine reports `EMFILE` or
cannot allocate additional watchers, use `npm run start:api` instead and restart
that process after changing a server file.

Validation commands:

```bash
npm run check
npm run build
npm run test:api
```

API tests bind an ephemeral localhost port, create their own temporary database
and remove it afterward. They do not modify the normal `.local-data` workspace.

## Accounts and onboarding

Accounts use given-name usernames, without case sensitivity. `Primo` also accepts
`Dongyijie`. Dongyijie Primo Pan and Mirjana Prpa have administrator permissions;
other approved members can manage their own projects.

A newly provisioned account can use its initial password to access its workspace,
upload images, save drafts and submit projects. Changing that password is optional
and available from My Profile under Change password. Replacement passwords must be 10–128
characters and differ from the current password. A voluntary password change
rotates the current session and signs out the account's other sessions. Existing
passwords are retained across API restarts. The session field
`usingInitialPassword` records whether the initial credential is still in use;
it does not restrict access or grant additional permissions.

Distribute the initial credential privately. The local onboarding handoff is
kept in `output/project-studio-onboarding.md`, which is ignored by Git and is not
part of the built website. The public sign-in screen does not display it.

The previously provisioned Mandi seed account has been cancelled and disabled,
with its sessions revoked and its records preserved. Mandi is no longer in the
seed roster. The one-time `server/revoke-mandi-seed.mjs` script performs that
cancellation; it is not a startup migration and refuses to disable an already
approved registration. Mandi can apply through the registration form and use
the chosen password once approved.

There is no role editor or password-recovery email flow. Existing roster
accounts and administrator roles come from `server/store.mjs`; new applications
are handled by `server/registrations.mjs` and can only become member accounts.

## Member registration and profile approval

Open `/test/reigister` to register; `/test/register` is an equivalent alias.
The intentionally supported `reigister` spelling is the link used by the sign-in
page. The form is available before sign-in and collects:

- A given-name username, password and password confirmation. Usernames must be
  3–40 ASCII letters, numbers, underscores or hyphens, start with a letter and
  are stored in lowercase. Passwords must be 10–128 characters. Active accounts,
  pending usernames and administrator aliases cannot be claimed.
- A full name (up to 120 characters), a position (**PhD**, **MPhil** or **RA**),
  one to three distinct public email addresses (up to 254 characters each),
  research interests (up to 1,000 characters) and a biography (one to twelve
  paragraphs, up to 8,000 characters in total).
- An optional HTTP/HTTPS website (up to 2,000 characters), a portrait, a life
  photo and a required life-photo description (up to 300 characters). Both
  photos must be JPEG, PNG or WebP, up to 8 MiB each.

**Submit for approval** stores a pending application and shows its reference.
It does not create an active account, sign the applicant in, create a project,
or publish a People entry. Pending photos are available only to administrators.
There is no applicant status dashboard or automatic notification email in this
version. Unsaved registration input is not autosaved; navigation offers
**Keep editing** or **Discard & leave**. Failed submission keeps the entered
details and selected photos available for retry.

After signing in, administrators use **Profile approvals** at
`/test/admin/profiles`. The **Pending** and **Reviewed** views are separate;
**Refresh** reloads the queue. **Review profile** opens the profile and both
photos. **Approve & add to People** creates or reactivates a member account
using the applicant's chosen password and publishes the approved People
profile. **Reject application** requires a review note and leaves the applicant
without a new account or public profile. A rejected username may be used for a
new application. Decisions carry a version number to prevent duplicate or stale
approval; review notes are private.

Approved profiles are served by `/api/public/people` and merged into the public
People directory. The curated roster and its ordering remain intact; new PhD,
MPhil and RA profiles appear in their corresponding groups. The existing
`directoryOrder` keeps Dongyijie Primo Pan last among PhD students. Profile links
use `/people?member=member-<username>`. If the member service is unavailable,
the curated directory remains usable.

## Author and review workflow

The top-right **My Profile** link appears only on `/test` routes after sign-in.
At `/test/profile`, members can change their password and view or edit their own
proposals. The normal studio and My Profile show only the signed-in person's
projects, including for administrators. Signing out removes the profile entry.

Administrators additionally see a private **Admin** bar within the signed-in
workspace, with **Profile approvals** (`/test/admin/profiles`) and **Project
approvals** (`/test/admin/projects`). Only the project-approval route shows all
members' proposals, **Review & edit** and **Approve** for submitted versions.
Approved rows link to their public pages. The public Projects footer has no
Member sign-in link, and public pages expose no registration, profile-management
or approval controls; workspace entry is through `/test`.

1. Sign in and create a project from the studio or My Profile. A blank or incomplete draft can be saved.
2. Fill in authors, title, subtitle, project leader and supervisor. Upload the
   hero image and write a useful image description.
3. Preview a Research story, Prototype & experience or Study & findings template
   on desktop or phone, then add its empty editable sections. Existing material
   is kept. Alternatively add sections using text, image-left, image-right or
   gallery layouts. Write
   formatted body text, add images/captions and optional HTTP/HTTPS result links.
   Drag section or gallery-image handles to reorder them; keyboard users can
   press Space, move with arrows and press Space again to drop. Up/Down buttons
   remain available. Collapse sections for a compact outline and inspect
   **Preview page** before submitting.
4. Save the draft before submitting. Submission requires a title, subtitle,
   authors, a hero, and at least one headed section containing text or images.
5. A member can continue editing a submitted project. Saving withdraws it from
   review and returns it to a draft; save and submit it again when ready. Its
   version advances, so an administrator cannot approve the earlier submission
   from a stale page. An administrator may edit submitted material, save it while
   retaining its submitted status, then approve it or request changes with feedback.
6. Approval publishes that saved version. Authors can edit an approved project
   again; the last approved version stays public until another submission is
   approved. Requests for changes also leave the prior approved version intact.

Through **Project approvals**, both Dongyijie Primo Pan and Mirjana Prpa can
inspect all projects, adjust their order in the queue, and approve submissions.
Members can list, open and mutate only their own projects.
Every save/review carries a version number. A stale write or duplicate approval
returns a conflict instead of silently overwriting another person's work.
Reopening a proposal fetches its latest saved version. Leaving unsaved project
edits opens an English confirmation with **Save & leave**, **Discard & leave**
and **Keep editing**. This also covers browser Back/Forward, returning to the
proposal list and signing out. A failed save keeps the dialog and edits open.
Navigation requested during an upload or save waits for that operation to finish;
any remaining unsaved material then requires a choice. Reloading or closing the
tab uses the browser's native unsaved-changes warning. Password settings remain
available while editing and are disabled only during an active operation.

The existing curated project content is separate from portal-created records.
Publishing a studio record adds it to the dynamic public collection; it does not
rewrite the hand-authored PhD sample files.

## Uploads and publication boundaries

Uploads accept JPEG, PNG and WebP files up to 8 MiB. The server checks image
signatures and dimensions rather than trusting a filename or browser MIME type.
SVG and HTML are rejected. Project image URLs must refer to uploaded media;
project text does not accept raw HTML.

An uploaded project image is private until referenced by an approved snapshot. Its owner
and administrators can read it. An author can also access images an administrator
has placed in that author's draft. Public endpoints read approved snapshots,
never the current mutable draft or private review feedback. Adding an image to a
revision does not make it public before approval. Registration photos become
public when their People profile is approved; before approval they are restricted
to administrators. Rejected application photos also remain private.

Sessions use HttpOnly, SameSite=Strict cookies. Mutation endpoints check the
browser Origin, and authenticated mutations also check `X-CSRF-Token`.
Registration is an unauthenticated, Origin-checked submission. Passwords use
salted scrypt hashes and only hashes of session tokens are persisted. Registration
lists never return the chosen password or its hash. The application rate-limits
login and registration attempts; registration allows up to 12 attempts per IP
per 15-minute window. Authorization and workflow checks run on the server.

## Persistent data and backups

By default, the API keeps `portal.sqlite`, SQLite WAL files, and uploaded image
files under `.local-data/`. This directory is ignored by Git and must be excluded
from source archives, deployment uploads and public static directories.

Set `PORTAL_DATA_DIR` to an absolute directory to choose another location.
Database records and the accompanying `uploads/` directory form one backup set.
For a simple consistent local backup, stop the API and copy the entire data
directory. Do not copy only `portal.sqlite` while a running process may have
uncheckpointed WAL data. A restore should likewise happen with the API stopped.
Keep backups private because they contain drafts, registration applications,
private photos, account hashes and session records.

Configuration:

| Variable | Default | Purpose |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | API bind address |
| `PORT` | `3002` | API port |
| `PORTAL_DATA_DIR` | `.local-data` relative to the working directory | SQLite and private upload storage |
| `PORTAL_ORIGINS` | Localhost/127.0.0.1 origins on ports 3001 and 3002 | Comma-separated allowed browser origins, with schemes and no trailing slash |
| `NODE_ENV` | unset locally | Set `production` to issue Secure cookies over HTTPS |
| `PORTAL_TRUST_PROXY` | unset locally | Set `loopback` only with the managed local Nginx proxy, which overwrites `X-Real-IP` |

## Production configuration

The deployment publishes static `dist/` assets through Nginx and installs a
separately managed Node service with a same-origin `/api/` proxy. Data is kept
outside `/var/www/fearlab/releases/` and outside the static document root.

The examples below assume a dedicated `fearlab-portal` service account, reviewed
API code under `/opt/fearlab-api/current/server/`, and a Node 22.23.1 installation
at `/opt/node-v22.23.1/bin/node`. Substitute the verified runtime path on the
host. The service account must be able to read the API files. The canonical
workflow in `.github/workflows/deploy.yml` installs the matching configuration.

`/etc/systemd/system/fearlab-portal.service`:

```ini
[Unit]
Description=FEAR Lab project studio API
After=network.target

[Service]
Type=simple
User=fearlab-portal
Group=fearlab-portal
WorkingDirectory=/opt/fearlab-api/current
ExecStart=/opt/node-v22.23.1/bin/node server/server.mjs
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=3002
Environment=PORTAL_DATA_DIR=/var/lib/fearlab-portal
Environment=PORTAL_ORIGINS=https://fearlab.space
Environment=PORTAL_TRUST_PROXY=loopback
StateDirectory=fearlab-portal
StateDirectoryMode=0700
UMask=0077
Restart=on-failure
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/var/lib/fearlab-portal

[Install]
WantedBy=multi-user.target
```

List every actual production browser origin in `PORTAL_ORIGINS`, separated by
commas. For example, add `https://www.fearlab.space` only if that hostname serves
the application rather than redirecting to the canonical host. Keep HTTPS at
the browser boundary; Secure cookies are intentionally unavailable over plain
HTTP in production.

Add this location inside the existing HTTPS server block, before relying on the
SPA fallback for other routes:

```nginx
location ^~ /api/ {
    client_max_body_size 24m;
    proxy_pass http://127.0.0.1:3002;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_connect_timeout 5s;
    proxy_read_timeout 35s;
    proxy_send_timeout 35s;
    proxy_buffering off;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

The registration endpoint accepts a JSON body up to 24 MiB to accommodate two
base64-encoded images of up to 8 MiB each; the proxy limit must accommodate that
request as well as ordinary project uploads.

The `proxy_pass` intentionally has no trailing URI, preserving `/api/...` for
the backend. Forward the browser's Origin unchanged; no permissive CORS header
is needed. Do not expose `/var/lib/fearlab-portal` through an Nginx alias. The API
accepts `X-Real-IP` only when loopback trust is explicitly enabled and the socket
peer is loopback. The workflow validates Cloudflare's official proxy ranges and
configures Nginx to recover the visitor address only from those trusted proxies.
Nginx then overwrites `X-Real-IP`, keeping each visitor's login and registration
limits separate. Arbitrary forwarded headers are ignored by default.

A deployment should privately provision existing account credentials, make the
optional password-change flow available, run `npm run test:api`, validate the
service and `nginx -t`, and verify both registration → profile approval → sign-in
and project draft → review → public snapshot flows through the HTTPS origin.
Publishing the static frontend and starting the backend are coordinated release
steps. See [Deployment and rollback](deployment.md) for release gates, backup
locations and rollback behavior.

For a conservative production backup, stop `fearlab-portal`, archive all of
`/var/lib/fearlab-portal` to a private backup destination, and restart the service.
Keep the matching API code version with the backup. Do not point a code rollback
at an incompatible database schema; this initial version has no destructive
schema migrations.
