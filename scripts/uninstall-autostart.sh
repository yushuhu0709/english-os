#!/bin/bash
# Turns off automatic start at login and stops the background server.
LABEL="com.english-os.server"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
rm -f "$HOME/Library/LaunchAgents/$LABEL.plist"
echo "Automatic start is off. Start by hand with: cd ~/english-os && npm start"
