#!/bin/bash
# Double-click to open English OS. The server normally runs by itself in the
# background (installed by scripts/install-autostart.sh); this only wakes it if
# needed and opens the browser. Closing this window does not stop anything.
PORT="${ENGLISH_OS_PORT:-3000}"
URL="http://localhost:$PORT"
LABEL="com.english-os.server"

if ! curl -fs -o /dev/null "$URL"; then
  if [ -f "$HOME/Library/LaunchAgents/$LABEL.plist" ]; then
    launchctl kickstart "gui/$(id -u)/$LABEL" 2>/dev/null || launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/$LABEL.plist"
  else
    nohup bash "$HOME/english-os/scripts/start-server.sh" >> "$HOME/Library/Logs/english-os.log" 2>&1 &
  fi
  echo -n "Starting English OS "
  for _ in $(seq 1 90); do curl -fs -o /dev/null "$URL" && break; echo -n "."; sleep 2; done
  echo
fi
open "$URL"
exit 0
