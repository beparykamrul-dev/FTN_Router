#!/usr/bin/env bash
set -euo pipefail

# FTN GoBGP runtime bootstrap.
# Safe by default: installs/configures the daemon but does not announce routes.

PREFIX="${PREFIX:-/usr/local/bin}"
CONFIG_DIR="${CONFIG_DIR:-/etc/gobgp}"
CONFIG_FILE="${CONFIG_FILE:-${CONFIG_DIR}/gobgpd.toml}"
SERVICE="${SERVICE:-gobgpd}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash scripts/setup-gobgp.sh"
  exit 1
fi

mkdir -p "$CONFIG_DIR"

if ! command -v gobgpd >/dev/null 2>&1; then
  echo "GoBGP is not installed. Install a matching GoBGP v3 release first."
  echo "The script intentionally does not download arbitrary binaries."
  exit 2
fi

if [[ ! -f "$CONFIG_FILE" ]]; then
  cat > "$CONFIG_FILE" <<'EOF'
[global.config]
  as = 65000
  router-id = "127.0.0.1"

[global.apply-policy.config]
  default-import-policy = "reject-route"
  default-export-policy = "reject-route"
EOF
  chmod 0640 "$CONFIG_FILE"
fi

if command -v systemctl >/dev/null 2>&1; then
  cat > "/etc/systemd/system/${SERVICE}.service" <<EOF
[Unit]
Description=FTN GoBGP Control Plane
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=${PREFIX}/gobgpd -f ${CONFIG_FILE}
Restart=on-failure
RestartSec=3
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF
  systemctl daemon-reload
  systemctl enable --now "$SERVICE"
  systemctl --no-pager --full status "$SERVICE" || true
fi

echo "GoBGP bootstrap complete. No routes were announced by this script."
echo "Config: $CONFIG_FILE"
