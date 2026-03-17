#!/usr/bin/env bash
# =============================================================================
# deploy.sh — WD-01 Deployment Script
# Target: Digital Ocean VPS + Nginx
#
# Usage:
#   ./scripts/deploy.sh --server <ip-or-hostname> --domain <domain.com> --build-dir <path/to/dist>
#
# Options:
#   --server    Server IP address or hostname          (required)
#   --domain    Domain name, e.g. example.com          (required)
#   --build-dir Path to the production dist folder     (required)
#   --ssh-user  SSH user on the server                 (default: root)
#   --ssh-key   Path to SSH private key                (default: ~/.ssh/id_rsa)
#   --ssl       Run certbot for Let's Encrypt SSL       (optional flag)
#   --skip-build  Skip npm run build step              (optional flag)
#
# Examples:
#   ./scripts/deploy.sh --server 64.225.10.20 --domain example.com --build-dir site-builder/dist
#   ./scripts/deploy.sh --server 64.225.10.20 --domain example.com --build-dir site-builder/dist --ssl
# =============================================================================

set -euo pipefail

# ── Color output ──────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

log()     { echo -e "${CYAN}[deploy]${RESET} $*"; }
success() { echo -e "${GREEN}[✓]${RESET} $*"; }
warn()    { echo -e "${YELLOW}[!]${RESET} $*"; }
error()   { echo -e "${RED}[✗]${RESET} $*" >&2; }
die()     { error "$*"; exit 1; }

# ── Defaults ──────────────────────────────────────────────────────────────────
SERVER=""
DOMAIN=""
BUILD_DIR=""
SSH_USER="root"
SSH_KEY="$HOME/.ssh/id_rsa"
RUN_SSL=false
SKIP_BUILD=false

# ── Parse arguments ───────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --server)     SERVER="$2";    shift 2 ;;
    --domain)     DOMAIN="$2";    shift 2 ;;
    --build-dir)  BUILD_DIR="$2"; shift 2 ;;
    --ssh-user)   SSH_USER="$2";  shift 2 ;;
    --ssh-key)    SSH_KEY="$2";   shift 2 ;;
    --ssl)        RUN_SSL=true;   shift   ;;
    --skip-build) SKIP_BUILD=true; shift  ;;
    *) die "Unknown argument: $1. Run with --help for usage." ;;
  esac
done

# ── Validate required arguments ───────────────────────────────────────────────
[ -z "$SERVER" ]    && die "--server is required"
[ -z "$DOMAIN" ]    && die "--domain is required"
[ -z "$BUILD_DIR" ] && die "--build-dir is required"

# ── Dependency checks ─────────────────────────────────────────────────────────
command -v rsync &>/dev/null || die "rsync is required but not installed. Run: brew install rsync"
command -v ssh   &>/dev/null || die "ssh is required but not installed."
[ -f "$SSH_KEY" ]            || die "SSH key not found at: $SSH_KEY (override with --ssh-key)"

SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=accept-new -o BatchMode=yes"
REMOTE="${SSH_USER}@${SERVER}"
REMOTE_WEB_ROOT="/var/www/${DOMAIN}"
NGINX_CONF_PATH="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/${DOMAIN}"

echo ""
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  WD-01 Deploy — ${DOMAIN}${RESET}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
log "Server:    $SERVER"
log "Domain:    $DOMAIN"
log "Build dir: $BUILD_DIR"
log "SSH user:  $SSH_USER"
log "SSL:       $RUN_SSL"
echo ""

# ── STEP 1: Build production bundle ───────────────────────────────────────────
# Runs `npm run build` inside site-builder to generate the dist folder.
# Skip with --skip-build if you've already built and just want to deploy.
if [ "$SKIP_BUILD" = false ]; then
  log "Building production bundle..."
  SITE_BUILDER_DIR="$(dirname "$0")/../site-builder"

  if [ ! -d "$SITE_BUILDER_DIR" ]; then
    die "site-builder directory not found at: $SITE_BUILDER_DIR"
  fi

  (cd "$SITE_BUILDER_DIR" && npm run build) \
    || die "Build failed. Fix errors before deploying."

  success "Build complete."
else
  warn "Skipping build step (--skip-build set)."
fi

# ── STEP 2: Verify dist folder exists ────────────────────────────────────────
[ -d "$BUILD_DIR" ] || die "Build directory not found: $BUILD_DIR — did the build succeed?"
[ -f "$BUILD_DIR/index.html" ] || die "No index.html in $BUILD_DIR — build may be incomplete."
success "Dist folder verified: $BUILD_DIR"

# ── STEP 3: Test SSH connection ───────────────────────────────────────────────
log "Testing SSH connection to $REMOTE..."
ssh $SSH_OPTS "$REMOTE" "echo connected" &>/dev/null \
  || die "Cannot connect to $REMOTE. Check your --server, --ssh-user, and --ssh-key."
success "SSH connection OK."

# ── STEP 4: Create web root on server ────────────────────────────────────────
# Creates /var/www/[domain]/ on the remote server if it doesn't exist.
log "Preparing remote web root at $REMOTE_WEB_ROOT..."
ssh $SSH_OPTS "$REMOTE" "mkdir -p $REMOTE_WEB_ROOT" \
  || die "Failed to create remote directory: $REMOTE_WEB_ROOT"
success "Remote web root ready."

# ── STEP 5: Upload dist files via rsync ──────────────────────────────────────
# rsync: delete files on server that are no longer in dist (clean deploy),
# compress during transfer, skip unchanged files.
log "Uploading files to server..."
rsync -az --delete \
  -e "ssh $SSH_OPTS" \
  "$BUILD_DIR/" \
  "$REMOTE:$REMOTE_WEB_ROOT/" \
  || die "rsync failed. Check your SSH credentials and server connectivity."
success "Files uploaded."

# ── STEP 6: Generate Nginx config ────────────────────────────────────────────
# Generates a production-ready Nginx config for a React SPA:
# - try_files for client-side routing (all 404s return index.html)
# - gzip compression for text assets
# - Long-term cache headers for hashed static assets
# - No-cache for index.html (so deploys are picked up immediately)
# - Security headers (XSS, clickjacking, content-type sniffing)
log "Generating Nginx config..."

NGINX_CONFIG="server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    root ${REMOTE_WEB_ROOT};
    index index.html;

    # ── SPA routing ───────────────────────────────────────────────────────────
    # For React Router — serve index.html for all non-file routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # ── Static asset caching ──────────────────────────────────────────────────
    # Vite hashes asset filenames — safe to cache for 1 year
    location ~* \\.(?:js|css|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|gif|ico|webp|avif)\$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
        access_log off;
    }

    # ── Never cache index.html ────────────────────────────────────────────────
    # Ensures users always get the latest deploy
    location = /index.html {
        add_header Cache-Control \"no-store, no-cache, must-revalidate\";
        expires 0;
    }

    # ── Gzip compression ──────────────────────────────────────────────────────
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/x-javascript
        application/json
        application/xml
        application/rss+xml
        application/atom+xml
        image/svg+xml
        font/truetype
        font/opentype
        application/vnd.ms-fontobject;

    # ── Security headers ──────────────────────────────────────────────────────
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;
    add_header Permissions-Policy \"camera=(), microphone=(), geolocation=()\" always;

    # ── Hide Nginx version ─────────────────────────────────────────────────────
    server_tokens off;
}"

# Write config to a temp file and upload to server
TMPCONF=$(mktemp /tmp/nginx-wd01-XXXXXX.conf)
echo "$NGINX_CONFIG" > "$TMPCONF"

scp $SSH_OPTS "$TMPCONF" "$REMOTE:/tmp/nginx-${DOMAIN}.conf" \
  || { rm -f "$TMPCONF"; die "Failed to upload Nginx config."; }
rm -f "$TMPCONF"

# Move config into place and enable the site
ssh $SSH_OPTS "$REMOTE" "
  mv /tmp/nginx-${DOMAIN}.conf ${NGINX_CONF_PATH} &&
  ln -sf ${NGINX_CONF_PATH} ${NGINX_ENABLED_PATH} &&
  nginx -t
" || die "Nginx config invalid or failed to install. Check server logs."

success "Nginx config installed and validated."

# ── STEP 7: Reload Nginx ──────────────────────────────────────────────────────
# Graceful reload — applies new config without dropping connections.
log "Reloading Nginx..."
ssh $SSH_OPTS "$REMOTE" "systemctl reload nginx || service nginx reload" \
  || die "Nginx reload failed. Check: ssh $REMOTE 'journalctl -u nginx -n 50'"
success "Nginx reloaded."

# ── STEP 8: SSL with Let's Encrypt (optional) ─────────────────────────────────
# Run with --ssl flag to obtain/renew a certificate via certbot.
# Requires: certbot installed on server, domain DNS already pointing to this server.
if [ "$RUN_SSL" = true ]; then
  log "Running certbot for SSL on ${DOMAIN} and www.${DOMAIN}..."

  ssh $SSH_OPTS "$REMOTE" "
    command -v certbot &>/dev/null || apt-get install -y certbot python3-certbot-nginx
    certbot --nginx \
      -d ${DOMAIN} \
      -d www.${DOMAIN} \
      --non-interactive \
      --agree-tos \
      --redirect \
      --email admin@${DOMAIN}
  " || die "certbot failed. Ensure DNS is pointing to $SERVER and port 80 is open."

  success "SSL certificate installed. Site is now HTTPS."
else
  warn "SSL skipped. Run again with --ssl flag when DNS is pointing to $SERVER."
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
if [ "$RUN_SSL" = true ]; then
  success "${BOLD}Deploy complete → https://${DOMAIN}${RESET}"
else
  success "${BOLD}Deploy complete → http://${DOMAIN}${RESET}"
  warn "Run with --ssl to enable HTTPS once DNS is configured."
fi
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
