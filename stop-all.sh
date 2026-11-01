#!/usr/bin/env bash
PID_FILE=".server.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "No PID file found. Server is not running."
  exit 0
fi

PID=$(cat "$PID_FILE")

if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
  echo "Stopping frontend server (PID: $PID)..."
  kill "$PID" 2>/dev/null
  sleep 1
  if kill -0 "$PID" 2>/dev/null; then
    kill -9 "$PID" 2>/dev/null
  fi
  echo "Frontend server stopped."
else
  echo "Process with PID $PID was not running."
fi

rm -f "$PID_FILE"

