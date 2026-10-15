@echo off
chcp 65001 >nul
title Yi Jing Fortune Telling System

echo.
echo     Yi Jing Fortune Telling System
echo     ==============================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check Flask
pip show flask >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

REM Check .env
if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [INFO] Created .env from .env.example
        echo [INFO] Edit .env to add your DEEPSEEK_API_KEY
        echo.
    )
)

REM Start Flask
echo [START] Starting local server...
echo.
python app.py

echo.
echo [STOP] Server stopped.
pause
