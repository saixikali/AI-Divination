@echo off
chcp 65001 >nul
title Dev Mode - Yi Jing Fortune Telling

echo.
echo     Dev Mode (Hot Reload)
echo     ==============================
echo.

REM Check node_modules
if not exist frontend\node_modules (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    if errorlevel 1 (
        echo [ERROR] npm install failed. Install Node.js first.
        pause
        exit /b 1
    )
)

REM Start Flask backend in its own window
echo [START] Flask API on :5000 ...
start "Flask API" cmd /k python app.py

REM Start Vite dev server in its own window
echo [START] Vite dev server on :5173 ...
start "Vite Dev" cmd /k "cd frontend && npm run dev"

REM Wait for servers to boot
timeout /t 4 /nobreak >nul

REM Open browser
echo [OPEN] http://localhost:5173
start http://localhost:5173

echo.
echo     Edit files in frontend\src - page updates instantly.
echo     Close the two server windows to stop.
echo.
pause
