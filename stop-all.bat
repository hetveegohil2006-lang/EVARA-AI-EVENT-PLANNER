@echo off
setlocal EnableDelayedExpansion

:: Ensure system utilities are available in PATH
set "PATH=%SystemRoot%;%SystemRoot%\System32;%PATH%"

set PID_FILE=.server.pid

if not exist "%PID_FILE%" (
    echo [EVARA] No PID file found. Server is not running.
    exit /b 0
)

set /p TARGET_PID=<"%PID_FILE%"

if not defined TARGET_PID (
    del /f /q "%PID_FILE%" 2>nul
    echo [EVARA] PID file was empty. Cleaned up.
    exit /b 0
)

tasklist /FI "PID eq %TARGET_PID%" 2>nul | findstr /i "%TARGET_PID%" >nul
if %ERRORLEVEL% equ 0 (
    echo [EVARA] Terminating server process ^(PID: %TARGET_PID%^)...
    taskkill /F /T /PID %TARGET_PID% >nul 2>&1
    echo [EVARA] Frontend server stopped successfully.
) else (
    echo [EVARA] Process with PID %TARGET_PID% is not running.
)

del /f /q "%PID_FILE%" 2>nul
exit /b 0
