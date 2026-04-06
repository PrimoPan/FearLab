#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARCHIVE_PATH="$("$ROOT_DIR/scripts/create_source_archive.sh")"
REMOTE_HOST="${1:-fearlab}"
REMOTE_ARCHIVE_PATH="${2:-/home/ubuntu/fearlab-site-src.tar.gz}"

scp "$ARCHIVE_PATH" "${REMOTE_HOST}:${REMOTE_ARCHIVE_PATH}"
echo "Uploaded source archive to ${REMOTE_HOST}:${REMOTE_ARCHIVE_PATH}"
