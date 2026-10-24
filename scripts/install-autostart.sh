#!/bin/bash
# Makes English OS start by itself when you log in to the Mac, and restart if it
# stops. Run once from Terminal:  bash ~/english-os/scripts/install-autostart.sh
# Undo with:                      bash ~/english-os/scripts/uninstall-autostart.sh
set -eu

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="com.english-os.server"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG="$HOME/Library/Logs/english-os.log"
PORT="${ENGLISH_OS_PORT:-3000}"

chmod +x "$APP_DIR/scripts/start-server.sh"
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"

cat > "$PLIST" <<PL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$APP_DIR/scripts/start-server.sh</string>
  </array>
  <key>WorkingDirectory</key><string>$APP_DIR</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>ENGLISH_OS_PORT</key><string>$PORT</string>
    <key>NODE_ENV</key><string>production</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>ThrottleInterval</key><integer>60</integer>
  <key>StandardOutPath</key><string>$LOG</string>
  <key>StandardErrorPath</key><string>$LOG</string>
</dict>
</plist>
PL

# Stop a copy that was started by hand in Terminal, so the port is free.
pids="$(lsof -ti tcp:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$pids" ]; then
  echo "Stopping the English OS already running on port $PORT ($pids)"
  kill $pids 2>/dev/null || true
  sleep 2
fi

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl kickstart -k "gui/$(id -u)/$LABEL"

echo -n "Waiting for http://localhost:$PORT "
for _ in $(seq 1 120); do
  if curl -fs -o /dev/null "http://localhost:$PORT"; then echo " ready."; break; fi
  echo -n "."; sleep 2
done
curl -fs -o /dev/null "http://localhost:$PORT" || { echo; echo "Not answering yet. Log: $LOG"; exit 1; }

echo "Done. English OS now starts by itself after login. Log: $LOG"
