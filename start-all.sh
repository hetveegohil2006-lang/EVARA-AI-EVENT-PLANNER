#!/usr/bin/env bash
PID_FILE=".server.pid"
LOG_FILE="server.log"
PORT=5500

# Avoid duplicate processes
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
    echo "Frontend server is already running (PID: $PID) on port $PORT."
    exit 0
  else
    rm -f "$PID_FILE"
  fi
fi

# Select available HTTP server
if command -v python3 >/dev/null 2>&1; then
  CMD="python3 -m http.server $PORT"
elif command -v python >/dev/null 2>&1; then
  CMD="python -m http.server $PORT"
elif command -v npx >/dev/null 2>&1; then
  CMD="npx -y http-server . -p $PORT -c-1"
elif command -v php >/dev/null 2>&1; then
  CMD="php -S localhost:$PORT"
else
  echo "Error: No suitable HTTP server found (python3, python, npx, php)."
  exit 1
fi

echo "Starting frontend server on http://localhost:$PORT..."
nohup $CMD > "$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo "$SERVER_PID" > "$PID_FILE"

sleep 1
if kill -0 "$SERVER_PID" 2>/dev/null; then
  echo "Frontend server started successfully (PID: $SERVER_PID)."
else
  echo "Failed to start frontend server. Inspect $LOG_FILE for details."
  rm -f "$PID_FILE"
  exit 1
fi

