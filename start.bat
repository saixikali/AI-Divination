@echo off
chcp 65001 >nul
title 易经算命系统

echo.
echo     ☰ ☷  易经算命系统  ☰ ☷
echo     ─────────────────────
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python，请先安装 Python 3.8+
    pause
    exit /b 1
)

REM 检查依赖是否安装
pip show flask >nul 2>&1
if errorlevel 1 (
    echo [提示] 正在安装依赖...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

REM 检查 .env 文件
if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [提示] 已创建 .env 文件，请编辑填入 DEEPSEEK_API_KEY
        echo.
    )
)

REM 启动 Flask（后台）
echo [启动] 正在启动本地服务...
start /b python app.py >nul 2>&1

REM 等待服务启动
timeout /t 2 /nobreak >nul

REM 打开浏览器
echo [打开] 正在打开算命页面...
start http://localhost:5000/preview

echo.
echo     服务已启动！
echo     地址: http://localhost:5000/preview
echo.
echo     按任意键停止服务并退出...
pause >nul

REM 停止 Flask
taskkill /f /im python.exe >nul 2>&1
echo [停止] 服务已停止
timeout /t 2 >nul
