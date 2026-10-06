# Deployment and rollback

## Production layout

The workflow connects through repository SSH secrets. The server is shared with
other sites; this deployment changes only FEAR Lab's code, service and Nginx
virtual host. It leaves the host's global Node installation unchanged.

| Component | Location |
| --- | --- |
| Public website | `https://fearlab.space` |
| Member sign-in | `https://fearlab.space/test` |
| Registration | `https://fearlab.space/test/reigister` (`/test/register` is an alias) |
| Member profile | `https://fearlab.space/test/profile` |
| Administrator profile approvals | `https://fearlab.space/test/admin/profiles` |
| Administrator project approvals | `https://fearlab.space/test/admin/projects` |
| Source working copy | `/home/ubuntu/fearlab-site-src` |
| Uploaded source archive | `/home/ubuntu/fearlab-site-src.tar.gz` |
| Static releases | `/var/www/fearlab/releases/<release-id>` |
| Published static root | `/var/www/fearlab/current` (atomic symlink) |
| API releases | `/opt/fearlab-api/releases/<release-id>/server` |
| Active API root | `/opt/fearlab-api/current` (atomic symlink) |
| Dedicated Node runtime | `/opt/node-v22.23.1/bin/node` |
| API service | `fearlab-portal.service`, bound to `127.0.0.1:3002` |
| Private SQLite database and uploads | `/var/lib/fearlab-portal` |
| Timestamped backups | `/home/ubuntu/fearlab-backups/<release-id>` |
| Nginx virtual host | `/etc/nginx/sites-available/fearlab.conf` |

The database, WAL files and upload directory are a single persistent data set.
They are owned by the `fearlab-portal` system user and never placed in a static
release or copied from local development during deployment. A fresh production
database is initialized from the current member roster. Subsequent deployments
preserve existing accounts, passwords, submissions and media.

## Automated deployment

`.github/workflows/deploy.yml` is the canonical deployment procedure. A push to
`main` or a manual workflow dispatch runs these steps:

1. Install the exact `.nvmrc` Node version, then run `npm ci`, `npm run check`,
   `npm run test:api` and `npm run build` on the CI runner.
2. Upload a source archive excluding Git internals, `.env` files, local private
   data, build output, local tooling, temporary files and generated QA artifacts.
3. Acquire an exclusive deployment lock. Require the existing Nginx installation,
   its real-IP module, passwordless sudo and the FEAR Lab origin certificate.
4. If needed, install Node 22.23.1 under `/opt/node-v22.23.1` from the official
   Node distribution, validating the archive against its published SHA-256 sum.
   The global Node binary and packages used by other sites are not replaced.
5. Extract into an isolated staging directory and repeat all four build/test
   gates on the server before changing the active application.
6. Fetch and validate both official Cloudflare IP-range lists. Generate trusted
   real-IP directives only inside the FEAR Lab HTTPS server block.
7. Back up existing source, static assets, API code, Nginx configuration and
   service definition. Record the previous symlink targets and service state.
8. Stop the existing portal service, if present, and privately archive the whole
   database/WAL/uploads directory. Install the new API release and restart the
   dedicated systemd service. Keep persistent data in place.
9. Require `/api/public/people` to return a valid JSON array from the new local
   service before publishing the frontend. Install and validate the FEAR Lab
   Nginx configuration, switch the static symlink, then reload Nginx.
10. Verify the HTTPS origin API, registration route and the absence of an API on
    static port 3001. Promote the source working copy and print the release and
    backup paths. Perform public-domain verification separately after this step.

The API uses production Secure cookies and permits browser mutations only from
`https://fearlab.space`. Nginx redirects HTTP and `www` to the canonical HTTPS
origin. Only its HTTPS virtual host proxies `/api/`; static port 3001 returns
404 for those paths. Requests support up to 24 MiB for the registration form's
two base64-encoded photos. API responses are not cached.

`PORTAL_TRUST_PROXY=loopback` lets the API accept the client IP from a validated
`X-Real-IP` header only when the direct connection is local. Nginx overwrites
that header from its resolved client address. It trusts `CF-Connecting-IP` only
from the downloaded, validated Cloudflare ranges, so clients cannot supply an
arbitrary identity to evade per-IP limits. Other virtual hosts are unaffected.

Required repository secrets are `FEARLAB_HOST`, `FEARLAB_USER`,
`FEARLAB_SSH_KEY`, and optional `FEARLAB_PORT`. The shared host must already have
Nginx, curl, tar/xz, SHA-256 tooling, Python 3, flock and systemd. This workflow
does not install OS packages or remove unrelated Nginx sites.

## Explicit manual release or recovery

A manual release is allowed when explicitly requested. Use the same archive
exclusions and the exact inline `SCRIPT` from the workflow's **Prepare remote
deploy script** step; do not maintain a second deployment implementation.
Run it through the verified SSH connection with `ARCHIVE_PATH` set to the
uploaded archive. The legacy `SOURCE_DIR`, `SITE_ROOT`, `RELEASE_ROOT`,
`BACKUP_ROOT`, `NGINX_SITE`, `DOMAIN` and `WWW_DOMAIN` environment overrides
remain supported. Do not run a manual release concurrently with a CI release.

After either release path, verify through `https://fearlab.space` with normal
TLS validation: registration renders, the session endpoint returns JSON,
unauthenticated project access is denied, and authenticated sign-in uses a
Secure cookie. Check that public pages expose neither member controls nor
private submissions. A successful build or loopback origin check alone is not
proof that the public domain is working; CDN/proxy rules can still interfere.

The script's loopback HTTPS check uses the configured origin certificate and
therefore skips public-PKI validation for that loopback check only. Public-domain
checks must not disable certificate verification.

## Rollback and data recovery

During activation, an error or termination signal restores the previous static
and API symlinks, Nginx configuration, service definition, enabled/running state,
and source directory if promotion had started. The current private data is
preserved. Existing schema migrations are additive; do not automatically restore
an older database during a code rollback and lose newly submitted material.

This workflow does not prune releases or backups. Each backup directory is
private and contains a `manifest.txt` with the previous code targets; a
`portal-data.tar.gz` backup is created only when a data directory already
exists. Backups may contain credentials, session records and private photos.
They are not public downloads and must not be committed.

For a later manual rollback, stop `fearlab-portal.service`, select the matching
previous frontend/API releases and configuration from the manifest/backup set,
restore their symlinks and service file, run `systemctl daemon-reload`, restart
the service, verify `/api/public/people`, then run `nginx -t` and reload Nginx.
Verify the public domain again. Keep the database and upload directory intact.

Restoring private data is a separate recovery operation: stop the API, preserve
a new backup of the current complete data directory, restore the chosen complete
backup (including uploads and any WAL files), restore ownership to
`fearlab-portal:fearlab-portal`, and only then start the service. Never copy just
`portal.sqlite` from a live directory, merge mismatched uploads, or restore local
QA accounts into production.
