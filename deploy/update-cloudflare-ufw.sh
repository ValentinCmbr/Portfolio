#!/usr/bin/env bash
# Keeps ufw's 80/443 allow rules in sync with Cloudflare's published IP
# ranges, so the VPS only accepts web traffic proxied through Cloudflare.
# Safe to re-run: only adds/removes what actually changed, and aborts
# without touching anything if Cloudflare's IP lists can't be fetched
# (a failed fetch must never be treated as "empty list, remove everything").
#
# Install once:
#   sudo cp update-cloudflare-ufw.sh /usr/local/sbin/
#   sudo chmod 750 /usr/local/sbin/update-cloudflare-ufw.sh
#   sudo /usr/local/sbin/update-cloudflare-ufw.sh        # initial run
#   sudo crontab -e
#     0 4 * * 1 /usr/local/sbin/update-cloudflare-ufw.sh >> /var/log/cloudflare-ufw-update.log 2>&1

set -euo pipefail

COMMENT="cf-auto"
NEW_IPS="$(mktemp)"
trap 'rm -f "$NEW_IPS"' EXIT

curl -fsS https://www.cloudflare.com/ips-v4 >> "$NEW_IPS"
curl -fsS https://www.cloudflare.com/ips-v6 >> "$NEW_IPS"
sort -u -o "$NEW_IPS" "$NEW_IPS"

# Sanity check: Cloudflare publishes ~20 ranges total. Bail out rather than
# risk wiping legitimate rules if the fetch returned something malformed.
if [ "$(wc -l < "$NEW_IPS")" -lt 10 ]; then
  echo "$(date -Is) refusing to update: fetched IP list looks too short ($(wc -l < "$NEW_IPS") lines)" >&2
  exit 1
fi

CURRENT_IPS="$(mktemp)"
trap 'rm -f "$NEW_IPS" "$CURRENT_IPS"' EXIT
ufw show added | grep "comment '$COMMENT'" | sed -E "s/.*allow from ([^ ]+).*/\1/" | sort -u > "$CURRENT_IPS"

to_add=$(comm -13 "$CURRENT_IPS" "$NEW_IPS")
to_remove=$(comm -23 "$CURRENT_IPS" "$NEW_IPS")

for ip in $to_add; do
  echo "$(date -Is) adding $ip"
  ufw allow from "$ip" to any port 80,443 proto tcp comment "$COMMENT"
done

for ip in $to_remove; do
  echo "$(date -Is) removing $ip"
  ufw delete allow from "$ip" to any port 80,443 proto tcp
done

if [ -n "$to_add$to_remove" ]; then
  ufw reload
  echo "$(date -Is) ufw reloaded"
else
  echo "$(date -Is) no changes — already up to date"
fi
