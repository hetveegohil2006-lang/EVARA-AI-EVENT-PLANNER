#!/usr/bin/env bash
PID_FILE=".server.pid"
PORT=5500

RUNNING=false

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
    RUNNING=true
  fi
fi

# Check HTTP probe on port 5500
HTTP_OK=false
if command -v curl >/dev/null 2>&1; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" --connect-timeout 2 2>/dev/null)
  if [ "$HTTP_CODE" != "000" ] && [ -n "$HTTP_CODE" ]; then
    HTTP_OK=true
  fi
fi

if [ "$RUNNING" = true ] || [ "$HTTP_OK" = true ]; then
  echo "STATUS: RUNNING"
  [ -f "$PID_FILE" ] && echo "PID: $(cat "$PID_FILE")"
  echo "Address: http://localhost:$PORT"
  if [ "$HTTP_OK" = true ]; then
    echo "HTTP Probe: Responding (HTTP $HTTP_CODE)"
  else
    echo "HTTP Probe: Process running, waiting for socket..."
  fi
  exit 0
else
  echo "STATUS: STOPPED"
  exit 1
fi

