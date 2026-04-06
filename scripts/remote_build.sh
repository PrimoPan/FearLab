#!/usr/bin/env bash

set -euo pipefail

ARCHIVE_PATH="${ARCHIVE_PATH:-/home/ubuntu/fearlab-site-src.tar.gz}"
SOURCE_DIR="${SOURCE_DIR:-/home/ubuntu/fearlab-site-src}"
SITE_ROOT="${SITE_ROOT:-/var/www/fearlab/current}"
NGINX_SITE="${NGINX_SITE:-/etc/nginx/sites-available/fearlab.conf}"
DOMAIN="${DOMAIN:-fearlab.space}"
WWW_DOMAIN="${WWW_DOMAIN:-www.fearlab.space}"
SSL_CERT_PATH="${SSL_CERT_PATH:-}"
SSL_KEY_PATH="${SSL_KEY_PATH:-}"
DEFAULT_SSL_CERT_PATH="/etc/ssl/fearlab/origin.crt"
DEFAULT_SSL_KEY_PATH="/etc/ssl/fearlab/origin.key"

if [[ -z "$SSL_CERT_PATH" && -f "$DEFAULT_SSL_CERT_PATH" ]]; then
  SSL_CERT_PATH="$DEFAULT_SSL_CERT_PATH"
fi

if [[ -z "$SSL_KEY_PATH" && -f "$DEFAULT_SSL_KEY_PATH" ]]; then
  SSL_KEY_PATH="$DEFAULT_SSL_KEY_PATH"
fi

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    return 1
  fi
}

install_node() {
  if require_command node && [[ "$(node -v)" == v22.* ]]; then
    return
  fi

  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg
  sudo mkdir -p /etc/apt/keyrings
  sudo rm -f /etc/apt/keyrings/nodesource.gpg
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
    | sudo tee /etc/apt/sources.list.d/nodesource.list >/dev/null
  sudo apt-get update
  sudo apt-get install -y nodejs
}

install_nginx() {
  if require_command nginx; then
    return
  fi

  sudo apt-get update
  sudo apt-get install -y nginx
}

prepare_source() {
  rm -rf "$SOURCE_DIR"
  mkdir -p "$SOURCE_DIR"
  tar -xzf "$ARCHIVE_PATH" -C "$SOURCE_DIR"
}

build_site() {
  cd "$SOURCE_DIR"
  if [[ -f package-lock.json ]]; then
    npm ci
  else
    npm install
  fi
  npm run build
}

publish_dist() {
  sudo mkdir -p "$SITE_ROOT"
  sudo find "$SITE_ROOT" -mindepth 1 -delete
  sudo cp -a "$SOURCE_DIR/dist/." "$SITE_ROOT/"
  sudo chown -R www-data:www-data "$(dirname "$SITE_ROOT")"
}

write_nginx_config() {
  local ssl_block=""
  local http_behavior

  if [[ -n "$SSL_CERT_PATH" && -n "$SSL_KEY_PATH" ]]; then
    http_behavior=$(cat <<EOF
    return 301 https://${DOMAIN}\$request_uri;
EOF
)
  else
    http_behavior=$(cat <<EOF
    if (\$host = ${WWW_DOMAIN}) {
        return 301 http://${DOMAIN}\$request_uri;
    }

    root ${SITE_ROOT};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
EOF
)
  fi

  if [[ -n "$SSL_CERT_PATH" && -n "$SSL_KEY_PATH" ]]; then
    ssl_block=$(cat <<EOF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    ssl_certificate ${SSL_CERT_PATH};
    ssl_certificate_key ${SSL_KEY_PATH};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    if (\$host = ${WWW_DOMAIN}) {
        return 301 https://${DOMAIN}\$request_uri;
    }

    root ${SITE_ROOT};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
)
  fi

  sudo tee "$NGINX_SITE" >/dev/null <<EOF
server {
    listen 3001 default_server;
    listen [::]:3001 default_server;
    server_name _;

    root ${SITE_ROOT};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW_DOMAIN};

${http_behavior}
}

${ssl_block}
EOF

  sudo ln -sfn "$NGINX_SITE" /etc/nginx/sites-enabled/fearlab.conf
  if [[ -f /etc/nginx/sites-enabled/default ]]; then
    sudo rm -f /etc/nginx/sites-enabled/default
  fi
}

restart_nginx() {
  sudo nginx -t
  sudo systemctl enable nginx
  sudo systemctl restart nginx
}

install_node
install_nginx
prepare_source
build_site
publish_dist
write_nginx_config
restart_nginx

echo "Remote build complete."
echo "Preview URL: http://$(hostname -I | awk '{print $1}'):3001"
