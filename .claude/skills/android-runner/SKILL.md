---
name: android-runner
description: React Native (Expo) Android 应用的编译、启动和测试自动化。处理环境配置、模拟器管理、APK 安装和 Metro 连接。
license: MIT
compatibility: Requires Android SDK, JDK, and Expo project.
metadata:
  author: web3-job-app team
  version: "1.0"
---

# Android App Runner

React Native (Expo) Android 应用的编译、启动和测试自动化技能。

## 适用场景

- 编译 React Native / Expo Android 应用
- 启动 Android 模拟器
- 安装并运行 APK 到模拟器
- 连接 Metro 服务器进行热重载
- 快速调试 Android 应用

## 前置条件检查

### 1. 确认 JAVA_HOME 设置

```bash
# 查找正确的 JDK 位置
ls "C:/Program Files/Java/"
# 或检查 Android Studio 自带的 JDK
ls "C:/Program Files/Android/Android Studio/jbr/"

# 设置 JAVA_HOME (PowerShell)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
# 或 (bash)
export JAVA_HOME="/c/Program Files/Java/jdk-17"
```

### 2. 确认 ANDROID_HOME 设置

```bash
# 通常位于
ANDROID_HOME="C:\Users\<username>\AppData\Local\Android\Sdk"
```

### 3. 关键工具路径

| 工具 | 路径 |
|------|------|
| adb | `$ANDROID_HOME/platform-tools/adb.exe` |
| emulator | `$ANDROID_HOME/emulator/emulator.exe` |
| gradlew | `<project>/android/gradlew.bat` |

## 工作流程

### 阶段 1: 环境验证

```bash
# 1. 检查 Java
java -version

# 2. 检查 ADB
adb version

# 3. 检查模拟器
emulator -list-avds
```

### 阶段 2: 启动模拟器

```bash
# 列出可用模拟器
emulator -list-avds

# 启动指定模拟器 (后台运行)
emulator -avd <AVD_NAME>

# 等待启动完成 (15-30 秒)
adb wait-for-device
sleep 15

# 确认设备在线
adb devices
```

### 阶段 3: 编译应用

```bash
# 方式 A: 使用 npm 脚本 (推荐)
npm run android

# 方式 B: 直接使用 Gradle (更灵活)
cd android
gradlew.bat assembleDebug

# 方式 C: 使用 Expo CLI
npx expo run:android

# 输出位置
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 阶段 4: 安装 APK

```bash
# 安装到模拟器
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# 如果失败，先卸载旧版本
adb uninstall <package_name>
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 阶段 5: 启动应用

```bash
# 启动 MainActivity
adb shell am start -n <package_name>/.MainActivity

# 示例
adb shell am start -n com.web3jobapp/.MainActivity
```

### 阶段 6: 连接 Metro 服务器

```bash
# 检查 Metro 状态
curl http://localhost:8081/status

# 如果没有运行，启动 Expo
npm start

# 应用会自动连接 Metro 进行热重载
```

## 完整自动化脚本

```bash
#!/bin/bash

# android-run.sh - React Native Android 快速启动脚本

set -e

PROJECT_ROOT="${1:-.}"
APK_PATH="$PROJECT_ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
PACKAGE_NAME="com.web3jobapp"

echo "=== Android App Runner ==="

# 1. 环境变量
export JAVA_HOME="C:/Program Files/Java/jdk-17"
export ANDROID_HOME="C:/Users/$USER/AppData/Local/Android/Sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

# 2. 检查设备
echo "Checking devices..."
if ! adb devices | grep -q "emulator.*device"; then
    echo "Starting emulator..."
    AVD_NAME=$(emulator -list-avds | head -1)
    emulator -avd "$AVD_NAME" &
    echo "Waiting for emulator to boot..."
    adb wait-for-device
    sleep 20
fi

# 3. 编译应用
echo "Building app..."
cd "$PROJECT_ROOT"
npm run android -- --no-bundler || {
    echo "Build failed, checking JAVA_HOME..."
    java -version
    exit 1
}

# 4. 安装 APK
echo "Installing APK..."
adb install -r "$APK_PATH"

# 5. 启动应用
echo "Launching app..."
adb shell am start -n "$PACKAGE_NAME/.MainActivity"

# 6. 检查 Metro
echo "Checking Metro server..."
if curl -s http://localhost:8081/status | grep -q "running"; then
    echo "✓ Metro server running"
else
    echo "⚠ Metro server not running, start with: npm start"
fi

echo "=== Done ==="
```

## 常见问题排查

### 问题 1: JAVA_HOME 未设置

```
ERROR: JAVA_HOME is not set
```

**解决:**
```bash
# 找到正确的 JDK 路径
ls "C:/Program Files/Java/"

# 设置环境变量
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

### 问题 2: 端口被占用

```
Port 8081 is being used by another process
```

**解决:**
```bash
# 查找占用进程
netstat -ano | findstr :8081

# 终止进程 (替换 PID)
taskkill /PID <PID> /F

# 或使用其他端口
npm start -- --port 8082
```

### 问题 3: 无设备/模拟器

```
adb: no devices/emulators found
```

**解决:**
```bash
# 重启 ADB 服务器
adb kill-server
adb start-server

# 启动模拟器
emulator -avd <AVD_NAME>

# 等待启动
adb wait-for-device
```

### 问题 4: 安装失败

```
Failure [INSTALL_FAILED_UPDATE_INCOMPATIBLE]
```

**解决:**
```bash
# 先卸载
adb uninstall <package>

# 再安装
adb install -r <apk_path>
```

### 问题 5: Gradle 构建失败

```
Could not resolve all dependencies
```

**解决:**
```bash
# 清理并重建
cd android
gradlew clean
gradlew assembleDebug

# 或删除缓存
rm -rf ~/.gradle/caches/
```

## 快速参考命令

| 操作 | 命令 |
|------|------|
| 列出模拟器 | `emulator -list-avds` |
| 启动模拟器 | `emulator -avd <NAME>` |
| 列出设备 | `adb devices` |
| 安装 APK | `adb install -r <path>` |
| 卸载应用 | `adb uninstall <package>` |
| 启动应用 | `adb shell am start -n <package>/.MainActivity` |
| 查看日志 | `adb logcat` |
| 清除应用数据 | `adb shell pm clear <package>` |
| 编译 Debug | `gradlew assembleDebug` |
| 编译 Release | `gradlew assembleRelease` |

## Expo 特定命令

```bash
# 启动开发服务器
npm start

# 运行 Android
npm run android

# 运行 Android (不启动新 bundler)
npm run android -- --no-bundler

# 清除缓存
npx expo start -c
```

## 最佳实践

1. **保持 Metro 运行** - 在后台运行 `npm start`，支持热重载
2. **使用现有模拟器** - 通过 Android Studio AVD Manager 管理模拟器
3. **环境变量持久化** - 在系统环境变量中设置 `JAVA_HOME` 和 `ANDROID_HOME`
4. **冷启动后等待** - 模拟器启动后等待 20-30 秒再操作
5. **使用完整路径** - Windows 上建议用正斜杠或完整 Windows 路径

## 相关文件

- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Expo Android Documentation](https://docs.expo.dev/workflow/android/)
- [Android Emulator Documentation](https://developer.android.com/studio/run/emulator)
