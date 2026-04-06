#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="$ROOT_DIR/.deploy"
ARCHIVE_NAME="fearlab-site-src.tar.gz"
ARCHIVE_PATH="$DEPLOY_DIR/$ARCHIVE_NAME"

mkdir -p "$DEPLOY_DIR"

COPYFILE_DISABLE=1 tar \
  --exclude=".git" \
  --exclude="node_modules" \
  --exclude="dist" \
  --exclude=".deploy" \
  -czf "$ARCHIVE_PATH" \
  -C "$ROOT_DIR" \
  .

echo "$ARCHIVE_PATH"
