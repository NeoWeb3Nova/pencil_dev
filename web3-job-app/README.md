# Web3 Job App - Web3.0 招聘应用

一个基于 React Native + Expo 构建的跨平台移动应用，支持 iOS 和 Android。

## 🚀 项目特性

- **跨平台支持**: 一次开发，iOS 和 Android 同时运行
- **现代化 UI**: 基于 Pencil 设计稿，使用 NativeWind (Tailwind CSS) 构建
- **类型安全**: 完整的 TypeScript 类型定义
- **状态管理**: Zustand + TanStack Query
- **模拟后端**: 包含完整的模拟 API 服务

## 📱 功能模块

### 5 个核心页面

1. **首页** - 职位搜索、推荐列表、分类筛选
2. **职位浏览** - 按分类浏览所有职位
3. **发布职位** - 职位发布表单
4. **消息** - 与雇主的消息列表
5. **个人中心** - 用户信息、统计数据、设置

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React Native 0.83 + Expo SDK 55 |
| 语言 | TypeScript |
| 样式 | NativeWind (Tailwind CSS) |
| 导航 | Expo Router |
| 状态管理 | Zustand |
| 数据获取 | TanStack Query |
| 图标 | Lucide React Native |
| 表单 | React Hook Form + Zod |

## 📦 项目结构

```
web3-job-app/
├── app/                      # Expo Router 路由
│   ├── (tabs)/               # 底部 Tab 导航
│   │   ├── index.tsx         # 首页
│   │   ├── jobs.tsx          # 职位浏览
│   │   ├── post.tsx          # 发布职位
│   │   ├── messages.tsx      # 消息
│   │   └── profile.tsx       # 个人中心
│   ├── job/
│   │   └── [id].tsx          # 职位详情页
│   └── _layout.tsx           # 根布局
├── components/
│   ├── ui/                   # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── job/                  # 职位相关组件
│   ├── home/                 # 首页组件
│   ├── profile/              # 个人中心组件
│   ├── messages/             # 消息组件
│   └── post/                 # 发布职位组件
├── lib/
│   ├── api.ts                # API 服务
│   ├── constants.ts          # 设计令牌和模拟数据
│   └── utils.ts              # 工具函数
├── hooks/
│   └── useApi.ts             # API Hooks
├── store/
│   └── app-store.ts          # Zustand 状态管理
├── types/
│   └── index.ts              # TypeScript 类型定义
├── tailwind.config.js        # Tailwind 配置
└── package.json
```

## 🎨 设计令牌

从 Pencil 设计稿提取的颜色和样式：

```javascript
colors: {
  primary: '#6366F1',        // 主紫色
  primaryLight: '#C7D2FE',   // 浅紫色
  dark: '#18181B',           // 深色文字
  secondary: '#71717A',      // 次要文字
  muted: '#A1A1AA',          // 占位符文字
  border: '#E4E4E7',         // 边框
  background: '#FAFAFA',     // 输入背景
  card: '#FFFFFF',           // 卡片背景
}
```

## 🏃 运行项目

### 前置要求

- Node.js 18+
- npm 或 yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) 或 Android Emulator

### 安装依赖

```bash
cd web3-job-app
npm install
```

### 启动开发服务器

```bash
npm start
# 或
npx expo start
```

### 运行在设备上

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📲 使用 Expo Go

1. 在手机上安装 Expo Go
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 扫描终端显示的二维码

## 🔌 API 集成

当前使用模拟数据，位于 `lib/constants.ts`。

要连接真实后端，修改 `lib/api.ts`：

```typescript
const API_BASE_URL = 'https://your-api.com/api';

export async function getJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs`);
  return response.json();
}
```

## 📝 添加新页面

1. 在 `components/` 创建新组件
2. 在 `app/` 创建新路由
3. 在 `(tabs)/_layout.tsx` 添加 Tab（如需要）

## 🔧 配置

### 修改应用名称

编辑 `app.json` 中的 `name` 和 `slug` 字段。

### 修改应用图标

替换 `assets/images/` 目录下的图标文件。

### 添加新颜色

在 `tailwind.config.js` 的 `colors` 对象中添加。

## 📄 License

MIT

---

## 🔁 重置测试环境 SOP

### 快速重置步骤

#### 1. 清理旧进程

```bash
# Windows - 清理 Expo 端口 (8081)
netstat -ano | findstr ":8081" | findstr "LISTENING" | awk '{print $5}' | xargs -I {} taskkill //F //PID {}

# Windows - 清理后端端口 (3000)
netstat -ano | findstr ":3000" | findstr "LISTENING" | awk '{print $5}' | xargs -I {} taskkill //F //PID {}
```

或者手动查找并终止：
```bash
# 查找占用端口的进程
netstat -ano | findstr ":8081"
netstat -ano | findstr ":3000"

# 终止进程 (替换 <PID> 为实际进程 ID)
taskkill //F //PID <PID>
```

#### 2. 重启后端服务

```bash
cd web3-api

# 确保数据库运行中
docker-compose up -d

# (可选) 如果 Prisma 报错，重新生成 Client
npm run prisma:generate

# 启动后端
npm run start:dev
```

**验证后端启动成功：**
```bash
curl http://localhost:3000/api
# 预期输出：Hello World!
```

#### 3. 启动前端

```bash
cd web3-job-app

# 方式一：使用 Expo Go (推荐)
npm start

# 方式二：直接在 Android 模拟器运行
npm run android
```

---

### 一键重置脚本

#### Windows PowerShell (`reset-env.ps1`)

```powershell
Write-Host "=== 重置测试环境 ===" -ForegroundColor Green

# 1. 清理旧进程
Write-Host "`n[1/3] 清理旧进程..." -ForegroundColor Yellow

$expoPid = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($expoPid) { Stop-Process -Id $expoPid -Force -ErrorAction SilentlyContinue }

$backendPid = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($backendPid) { Stop-Process -Id $backendPid -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

# 2. 启动后端
Write-Host "`n[2/3] 启动后端服务..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\web3-api'; npm run start:dev"

Start-Sleep -Seconds 5

# 3. 提示
Write-Host "`n[3/3] 启动前端服务" -ForegroundColor Yellow
Write-Host "请手动运行：cd web3-job-app && npm run android" -ForegroundColor Cyan
Write-Host "`n=== 环境重置完成 ===" -ForegroundColor Green
```

使用方法：
```powershell
.\reset-env.ps1
```

#### Bash 脚本 (`reset-env.sh`)

```bash
#!/bin/bash

echo "=== 重置测试环境 ==="

# 清理端口
for port in 8081 3000; do
    pid=$(netstat -ano | grep ":$port" | grep "LISTENING" | awk '{print $5}' | head -1)
    if [ ! -z "$pid" ]; then
        echo "终止端口 $port 的进程 (PID: $pid)"
        kill -9 $pid 2>/dev/null
    fi
done

sleep 2

# 启动后端
echo -e "\n启动后端服务..."
cd "$(dirname "$0")/web3-api"
npm run start:dev > /dev/null 2>&1 &

sleep 5

echo -e "\n请手动运行：cd web3-job-app && npm run android"
echo "=== 环境重置完成 ==="
```

使用方法：
```bash
chmod +x reset-env.sh && ./reset-env.sh
```

---

### 常见问题排查

| 问题 | 错误信息 | 解决方案 |
|------|----------|----------|
| 端口被占用 | `EADDRINUSE: address already in use` | `netstat -ano \| findstr ":3000"` 然后 `taskkill //F //PID <PID>` |
| Prisma 生成失败 | `EPERM: operation not permitted` | 先终止后端进程，再运行 `npm run prisma:generate` |
| 数据库连接失败 | `PrismaClientInitializationError` | `docker-compose restart` 然后 `npm run prisma:migrate` |
| Android Network Error | `Network error` | 确保 API 地址配置为 `http://10.0.2.2:3000/api` |

---

### 测试账号

| 邮箱 | 密码 | 角色 |
|------|------|------|
| `admin@web3jobs.com` | `password123` | Admin |
| `user@web3jobs.com` | `password123` | User |
| `test@test.com` | `password123` | User |
| `demo@demo.com` | `123456` | User |

---

### 验证清单

- [ ] 后端 API 可访问：`curl http://localhost:3000/api`
- [ ] 数据库容器运行中：`docker-compose ps`
- [ ] Metro Bundler 启动：`http://localhost:8081`
- [ ] 应用可在模拟器/手机上运行
- [ ] 注册功能测试通过

---

**最后更新：** 2026-03-01
