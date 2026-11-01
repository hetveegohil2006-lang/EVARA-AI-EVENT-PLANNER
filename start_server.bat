@echo off
title EVARA Private Concierge — Localhost Server
echo ===================================================
echo   EVARA — Every moment, beautifully planned.
echo   Starting local web server on http://localhost:8000
echo ===================================================
echo.

:: Try Python 3 http.server
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [EVARA] Starting Python 3 HTTP Server...
    start http://localhost:8000/index.html
    python -m http.server 8000
    goto :end
)

:: Try Node npx serve / http-server
where npx >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [EVARA] Starting Node npx http-server...
    start http://localhost:8000/index.html
    npx -y http-server . -p 8000 -c-1
    goto :end
)

:: Fallback direct browser launch
echo [EVARA] Launching default browser with index.html...
start index.html

:end
pause
