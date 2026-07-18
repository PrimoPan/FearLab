# Deployment and rollback

## Production layout

The deployment workflow connects using repository secrets; the production host
is not hardcoded in source control.

- Source staging: `/home/ubuntu/fearlab-site-src`
- Generated archive: `/home/ubuntu/fearlab-site-src.tar.gz`
- Versioned releases: `/var/www/fearlab/releases/<timestamp>`
- Published static root: `/var/www/fearlab/current` (an atomic symlink)
- Timestamped backups: `/home/ubuntu/fearlab-backups/<timestamp>`
- Nginx site: `/etc/nginx/sites-available/fearlab.conf`

## Automated deployment

`.github/workflows/deploy.yml` performs these gates:

1. use the exact Node version from `.nvmrc`;
2. `npm ci`;
3. `npm run check`;
4. `npm run build`;
5. upload a source archive;
6. verify the remote Node runtime satisfies Vite 8;
7. create timestamped source and published-site backups;
8. install, check, and build again on the server;
9. publish to a version directory and atomically switch the `current` symlink;
10. validate Nginx and reload it without interrupting active requests.

Required secrets are `FEARLAB_HOST`, `FEARLAB_USER`, `FEARLAB_SSH_KEY`, and the
optional `FEARLAB_PORT`.

## Manual synchronization policy

Manual synchronization is for an explicitly requested release or recovery only.
Before replacing the source or published site:

1. create a timestamped archive of both remote directories;
2. upload a source archive that excludes `.git`, `node_modules`, and `dist`;
3. extract into a clean staging directory;
4. run the same install, check, and build gates as CI;
5. publish only after every gate succeeds;
6. verify the local Nginx endpoint and public route.

## Rollback

The automated workflow keeps the 10 newest backup sets and five newest release
directories. Keep the matching source and site archives until the new release
is verified.

For a normal rollback, point `/var/www/fearlab/current.next` at the previous
release, replace the `current` symlink with `mv -Tf`, run `sudo nginx -t`, and
reload Nginx. If no versioned release remains, extract `site.tar.gz` into a new
release directory and switch to it the same way. Restore the matching source
archive when the server-side working copy must also match the published build.
