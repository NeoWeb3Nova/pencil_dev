@echo off
REM 临时启动脚本 - 在不修改系统环境变量的情况下运行 Expo Android
REM 适用于只想临时测试的情况

echo ========================================
echo   Expo Android 启动脚本（临时环境变量）
echo ========================================
echo.

REM 设置 Android SDK 路径
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk

REM 添加 Android 工具到 PATH
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\emulator;%PATH%

echo Android SDK: %ANDROID_HOME%
echo.

REM 验证 SDK 是否存在
if not exist "%ANDROID_HOME%" (
    echo [警告] Android SDK 未找到：%ANDROID_HOME%
    echo 请确保已安装 Android SDK
    echo.
    pause
    exit /b 1
)

REM 检查 adb
where adb >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [提示] adb 当前不可用，将使用临时 PATH
    echo.
)

echo 启动 Expo 开发服务器...
echo.

REM 切换到前端目录并启动
cd /d "%~dp0web3-job-app"
npm start

REM 如果需要直接运行 Android
REM npm run android
