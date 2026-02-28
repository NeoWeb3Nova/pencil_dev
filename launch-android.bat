@echo off
REM ========================================
REM   Android 模拟器 + Expo 一键启动脚本
REM ========================================

echo ========================================
echo   Android 模拟器 + Expo 启动脚本
echo ========================================
echo.

REM 设置环境变量
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%

REM 检查模拟器是否存在
where emulator >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [错误] 找不到模拟器，请先运行：.\setup-android-env.ps1
    pause
    exit /b 1
)

echo 可用的模拟器:
echo.
emulator -list-avds
echo.

set /p AVD_NAME="输入要启动的模拟器名称 (直接回车跳过): "

if not "%AVD_NAME%"=="" (
    echo 启动模拟器：%AVD_NAME% ...
    start "" emulator -avd %AVD_NAME%
    echo 等待模拟器启动 (约 30-60 秒)...
    timeout /t 5 /nobreak >nul
) else (
    echo [提示] 跳过模拟器启动，请手动启动
)

echo.
echo ========================================
echo 启动 Expo 开发服务器...
echo ========================================
echo.

cd /d "%~dp0web3-job-app"
npm start

echo.
echo [提示] 在模拟器中按 'a' 键自动加载应用
echo.
