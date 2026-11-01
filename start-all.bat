@echo off
setlocal EnableDelayedExpansion

:: Ensure system utilities, Windows PowerShell, and Python launcher are in PATH
set "PATH=%SystemRoot%;%SystemRoot%\System32;%SystemRoot%\System32\WindowsPowerShell\v1.0;%PATH%"

set PORT=5500
set PID_FILE=.server.pid
set LOG_FILE=server.log

:: 1. Ensure terminal is in the correct project root directory
if not exist "index.html" (
    echo [EVARA Error] index.html not found in current directory.
    echo Please run this script from the EVARA project root directory: %~dp0
    exit /b 1
)

:: 2. Check whether Python launcher 'py' is installed
where py >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [EVARA Error] Python launcher 'py' was not found in PATH or SystemRoot.
    echo Please ensure Python is installed and 'py' is accessible.
    exit /b 1
)

:: 3. Check if server process is already running via PID file
if exist "%PID_FILE%" (
    set /p EXISTING_PID=<"%PID_FILE%"
    if defined EXISTING_PID (
        tasklist /FI "PID eq !EXISTING_PID!" 2>nul | findstr /i "!EXISTING_PID!" >nul
        if !ERRORLEVEL% equ 0 (
            echo [EVARA] Frontend server is already running on http://localhost:%PORT% ^(PID: !EXISTING_PID!^).
            exit /b 0
        )
    )
    del /f /q "%PID_FILE%" 2>nul
)

:: 4. Check whether port 5500 is already occupied
netstat -ano -p tcp 2>nul | findstr /r /c:":%PORT% .*LISTENING" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [EVARA Error] Port %PORT% is already occupied by another process.
    echo Run stop-all.bat or terminate the process on port %PORT% before starting.
    exit /b 1
)

:: 5. Launch frontend server in a separate background process using: py -m http.server 5500
echo [EVARA] Starting frontend server using: py -m http.server %PORT%...

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process 'cmd.exe' -ArgumentList '/c', 'py -m http.server %PORT% > %LOG_FILE% 2>&1' -WindowStyle Hidden"

:: 6. Wait for server to bind to port and detect its listening PID
set SERVER_PID=
for /l %%I in (1,1,10) do (
    if not defined SERVER_PID (
        for /f "tokens=5" %%A in ('netstat -ano -p tcp 2^>nul ^| findstr /r /c:":%PORT% .*LISTENING"') do (
            set SERVER_PID=%%A
        )
        if not defined SERVER_PID (
            timeout /t 1 /nobreak >nul 2>&1
        )
    )
)

if defined SERVER_PID (
    (echo !SERVER_PID!) > "%PID_FILE%"
    echo [EVARA] Server started successfully ^(PID: !SERVER_PID!^).
    echo [EVARA] Address: http://localhost:%PORT%
    echo [EVARA] Output log: %LOG_FILE%
    exit /b 0
) else (
    echo [EVARA Error] Failed to start frontend server on http://localhost:%PORT%.
    if exist "%LOG_FILE%" (
        echo [EVARA Error Details]
        type "%LOG_FILE%"
    )
    exit /b 1
)
