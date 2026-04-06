#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE_HOST="${1:-fearlab}"
REMOTE_ARCHIVE_PATH="${REMOTE_ARCHIVE_PATH:-/home/ubuntu/fearlab-site-src.tar.gz}"
REMOTE_SCRIPT_PATH="${REMOTE_SCRIPT_PATH:-/home/ubuntu/fearlab-remote-build.sh}"

"$ROOT_DIR/scripts/upload_source.sh" "$REMOTE_HOST" "$REMOTE_ARCHIVE_PATH"
scp "$ROOT_DIR/scripts/remote_build.sh" "${REMOTE_HOST}:${REMOTE_SCRIPT_PATH}"
ssh "$REMOTE_HOST" "chmod +x ${REMOTE_SCRIPT_PATH} && ARCHIVE_PATH=${REMOTE_ARCHIVE_PATH} ${REMOTE_SCRIPT_PATH}"
