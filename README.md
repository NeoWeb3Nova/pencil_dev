# Web3 Job App - 开发环境配置

## Android 环境变量配置

### 问题说明
`.env.local` 文件中的环境变量不会自动加载到系统 `PATH` 中，需要在系统层面配置 Android 开发环境。

---

## 快速配置（推荐）

### 使用自动配置脚本

以管理员身份运行 PowerShell 脚本：

```powershell
# 方法 1: 在 PowerShell 中执行（右键以管理员身份运行）
.\setup-android-env.ps1

# 方法 2: 使用命令直接提权运行
Start-Process powershell -Verb RunAs -ArgumentList '-ExecutionPolicy Bypass -File .\setup-android-env.ps1'
```

**运行后需要重启终端/VS Code 才能生效**

---

## 手动配置（Windows 10/11）

1. 按 `Win + S` 搜索 **"编辑系统环境变量"**
2. 点击 **"环境变量..."** 按钮
3. 在 **"系统变量"** 部分：
   - 新建 `ANDROID_HOME`，值为：`C:\Users\almyq\AppData\Local\Android\Sdk`
   - 编辑 `Path`，添加以下路径：
     ```
     C:\Users\almyq\AppData\Local\Android\Sdk
     C:\Users\almyq\AppData\Local\Android\Sdk\platform-tools
     C:\Users\almyq\AppData\Local\Android\Sdk\tools
     C:\Users\almyq\AppData\Local\Android\Sdk\tools\bin
     C:\Users\almyq\AppData\Local\Android\Sdk\emulator
     ```
4. 点击 **"确定"** 保存
5. **重启终端/VS Code**

---

## 临时启动（不修改系统环境变量）

双击运行或在终端执行：

```bash
.\start-android.bat
```

---

## 验证配置

在新的终端中运行：

```powershell
# 检查 ANDROID_HOME
echo $env:ANDROID_HOME

# 检查 ADB
adb --version
```

---

## 项目结构

- `web3-api/` - NestJS 后端 API
- `web3-job-app/` - React Native (Expo) 前端

详细命令请参考 `CLAUDE.md`

---

## Docker 数据库配置

### 启动 PostgreSQL 容器

```bash
cd web3-api
docker-compose up -d
```

### 常用命令

```bash
# 查看容器状态
docker ps -a

# 启动/停止/重启容器
docker start web3-job-app-db
docker stop web3-job-app-db
docker restart web3-job-app-db

# 查看日志
docker logs web3-job-app-db

# 健康检查
docker inspect web3-job-app-db --format '{{.State.Health.Status}}'

# 完全停止并移除容器（数据卷保留）
docker-compose down

# ⚠️ 删除数据卷（数据会丢失！）
docker-compose down -v
```

### 数据库连接配置

| 场景 | DATABASE_URL |
|------|-------------|
| Windows 主机 + Docker Desktop | `postgresql://postgres:postgres@127.0.0.1:5432/web3-job-app` |
| Linux 虚拟机原生 Docker | `postgresql://postgres:postgres@localhost:5432/web3-job-app` |
| 容器内访问（API 容器化时） | `postgresql://postgres:postgres@web3-job-app-db:5432/web3-job-app` |

---

## 虚拟机测试注意事项

### 1. Docker 容器必须保持运行

PostgreSQL 数据库运行在 Docker 容器中，测试期间需要保持容器运行：
- 容器停止 = 数据库不可访问
- 数据存储在 Docker volume 中，重启容器不会丢失数据

### 2. 完整启动顺序

```bash
# 1. 启动数据库
cd web3-api
docker-compose up -d

# 2. 等待数据库就绪（约 5-10 秒）
docker-compose logs -f postgres

# 3. 运行数据库迁移
npm run prisma:migrate

# 4. 启动 API 服务
npm run start:dev

# 5. 启动前端（可选）
cd ../web3-job-app
npm start
```

### 3. 防火墙配置（虚拟机）

如需从外部访问虚拟机：

```bash
# 开放 PostgreSQL 端口
sudo ufw allow 5432/tcp

# 开放 API 端口
sudo ufw allow 3000/tcp
```

### 4. 健康检查脚本

```bash
# 检查数据库连接
docker exec web3-job-app-db pg_isready -U postgres

# 检查端口监听
netstat -tlnp | grep 5432
```

---

## 安全配置（部署前必须修改）

### 修改 `.env` 中的敏感信息

编辑 `web3-api/.env` 文件：

```bash
# ⚠️ 生产环境必须修改为强随机字符串
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# ⚠️ 修改数据库密码
POSTGRES_PASSWORD=postgres  # 改为强密码
```

### 生成强随机 JWT_SECRET

```bash
# OpenSSL 生成
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 安全清单

- [ ] 不使用默认密码 `postgres`
- [ ] JWT_SECRET 长度至少 32 字符
- [ ] `.env` 文件不提交到 Git（已加入 `.gitignore`）
- [ ] 虚拟机防火墙限制外部访问
- [ ] 定期备份数据库数据

---

## 数据持久化

数据存储在 Docker volume `postgres_data` 中：

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data  # 持久化数据
```

**备份数据：**
```bash
# 导出数据
docker exec web3-job-app-db pg_dump -U postgres web3-job-app > backup.sql

# 恢复数据
docker exec -i web3-job-app-db psql -U postgres web3-job-app < backup.sql
```
