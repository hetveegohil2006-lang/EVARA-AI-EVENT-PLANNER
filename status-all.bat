@echo off
setlocal EnableDelayedExpansion

set PORT=5500
set PID_FILE=.server.pid
set IS_RUNNING=0
set PID_VAL=

:: 1. Check if recorded PID is alive
if exist "%PID_FILE%" (
    set /p PID_VAL=<"%PID_FILE%"
    if defined PID_VAL (
        tasklist /FI "PID eq !PID_VAL!" 2>nul | findstr /i "!PID_VAL!" >nul
        if !ERRORLEVEL! equ 0 (
            set IS_RUNNING=1
        )
    )
)

:: 2. Check if port 5500 responds to HTTP request
set HTTP_OK=0
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:%PORT%' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set HTTP_OK=1
    set IS_RUNNING=1
)

:: 3. Output Status
if "%IS_RUNNING%"=="1" (
    echo STATUS: RUNNING
    if defined PID_VAL echo PID: %PID_VAL%
    echo Address: http://localhost:%PORT%
    if "%HTTP_OK%"=="1" (
        echo HTTP Response: 200 OK
    ) else (
        echo HTTP Response: Process active, socket initializing
    )
    exit /b 0
) else (
    echo STATUS: STOPPED
    exit /b 1
)

