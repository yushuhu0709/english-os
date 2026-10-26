#!/bin/bash
# Starts English OS on http://localhost:3000. launchd runs this at login and
# restarts it if it stops (see install-autostart.sh). Safe to run by hand too.
set -u

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${ENGLISH_OS_PORT:-3000}"
cd "$APP_DIR" || exit 1

# launchd starts with a bare PATH, so look for node where installers put it.
add_path() { [ -d "$1" ] && PATH="$1:$PATH"; }
add_path /usr/local/bin
add_path /opt/homebrew/bin
add_path "$HOME/.volta/bin"
if [ -d "$HOME/.nvm/versions/node" ]; then
  latest="$(ls -1 "$HOME/.nvm/versions/node" | sort -V | tail -1)"
  [ -n "$latest" ] && add_path "$HOME/.nvm/versions/node/$latest/bin"
fi
add_path "$HOME/.local/share/fnm/aliases/default/bin"
export PATH

if ! command -v node >/dev/null 2>&1; then
  echo "$(date '+%F %T') node not found. Install Node.js LTS from https://nodejs.org" >&2
  exit 1
fi

echo "$(date '+%F %T') starting English OS with node $(node -v) in $APP_DIR"

if [ ! -d node_modules ]; then
  npm install --no-audit --no-fund || exit 1
fi

# Rebuild when the code is newer than the last build (for example after an update).
if [ ! -f .next/BUILD_ID ] || [ -n "$(find app components content lib package.json next.config.ts -newer .next/BUILD_ID -print -quit 2>/dev/null)" ]; then
  echo "$(date '+%F %T') building…"
  npm run build || exit 1
fi

# Listen on this Mac only, not on the local network.
exec ./node_modules/.bin/next start -H 127.0.0.1 -p "$PORT"
