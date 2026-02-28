## Context

当前 `web3-job-app` 前端应用使用本地模拟数据（mock data），所有职位、用户、消息等数据都硬编码在组件中。后端 `web3-api` 已经完成了基于 NestJS + Prisma 的真实 API 开发，支持完整的 CRUD 操作、JWT 认证和数据库持久化。

本任务目标是将前端数据源从本地模拟数据切换到连接本地 Docker 数据库（PostgreSQL）的真实后端 API。

技术栈：
- **前端**: React Native (Expo) + NativeWind + Zustand + React Query
- **后端**: NestJS 11 + Prisma ORM + JWT + Passport
- **数据库**: PostgreSQL (Docker)
- **API 基础路径**: `http://localhost:3000/api`

## Goals / Non-Goals

**Goals:**
- 前端 API 客户端 (`lib/api.ts`) 连接真实后端接口
- 认证流程（登录/注册）使用真实 JWT 令牌
- 职位列表、详情、发布、编辑使用真实 API
- 申请流程使用真实 API
- 消息系统使用真实 API
- 用户 Profile 使用真实 API
- 错误处理和加载状态完善
- React Query 缓存配置优化

**Non-Goals:**
- 不支持 SIWE 钱包认证（仅邮箱密码登录）
- 不涉及后端 API 修改（假设后端已稳定）
- 不修改 UI 设计或组件样式
- 不涉及 E2E 测试（由 tdd-guide 负责）

## Decisions

### 1. API 客户端架构
**决策**: 使用现有的 `lib/api.ts` 作为统一 API 层，封装所有 HTTP 请求

**理由**:
- 已存在且设计合理
- 集中管理认证 token
- 统一的错误处理

**替代方案**: 直接使用 React Query 的 fetcher
**未采用原因**: 失去对请求逻辑的细粒度控制

### 2. 认证状态管理
**决策**: 扩展 Zustand store 管理登录状态，token 存储在 AsyncStorage

**理由**:
- 与现有架构一致
- 组件可响应式更新
- 持久化简单

### 3. 数据同步策略
**决策**: 使用 React Query 管理服务端数据，Zustand 管理 UI 状态

**理由**:
- React Query 提供缓存、重试、乐观更新
- Zustand 适合管理全局 UI 状态（如主题、语言）
- 职责分离，各司其职

### 4. 错误处理
**决策**: 统一的 ApiResponse 类型，包含 success/data/error 字段

**理由**:
- 与后端响应格式一致
- 前端可统一处理
- 便于显示友好错误消息

## API Endpoints 映射

| 前端功能 | API Endpoint | Method | Auth |
|---------|--------------|--------|------|
| 登录 | `/auth/login` | POST | - |
| 注册 | `/auth/register` | POST | - |
| 获取 Profile | `/auth/profile` | GET | Yes |
| 更新 Profile | `/auth/profile` | POST | Yes |
| 获取职位列表 | `/jobs` | GET | - |
| 获取职位详情 | `/jobs/:id` | GET | - |
| 发布职位 | `/jobs` | POST | Yes |
| 更新职位 | `/jobs/:id` | PUT | Yes |
| 删除职位 | `/jobs/:id` | DELETE | Yes |
| 我的职位 | `/jobs/user/me` | GET | Yes |
| 申请职位 | `/applications` | POST | Yes |
| 我的申请 | `/applications/my-applications` | GET | Yes |
| 消息列表 | `/messages` | GET | Yes |
| 未读消息数 | `/messages/unread-count` | GET | Yes |
| 发送消息 | `/messages` | POST | Yes |
| 标记已读 | `/messages/:id/read` | POST | Yes |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 后端 API 不可用或返回格式变化 | 统一错误处理，显示友好提示 |
| 网络延迟影响体验 | React Query 缓存 + 骨架屏加载 |
| Token 过期处理 | 401 自动跳转登录 |
| 本地开发环境问题 | 提供 Docker 启动脚本和环境检查 |
| 跨域问题 (Web) | 后端配置 CORS，本地代理 |

## Migration Plan

1. **后端验证** → 确保后端 API 正常运行，数据库连接成功
2. **API 客户端审查** → 检查 `lib/api.ts` 与后端接口匹配度
3. **类型定义对齐** → 确保前端 types 与后端 DTO 一致
4. **认证集成** → 登录/注册连接真实 API
5. **职位模块集成** → 列表/详情/CRUD 连接真实 API
6. **申请模块集成** → 申请流程连接真实 API
7. **消息模块集成** → 消息系统连接真实 API
8. **Profile 集成** → 用户资料连接真实 API
9. **测试验证** → 端到端验证所有功能

**回滚策略**: 保留 mock 数据作为 fallback，添加 API 开关

## Open Questions

- 是否需要添加离线模式支持？（建议未来迭代）
- 是否需要实现请求重试机制？（React Query 已内置）
- 是否需要添加请求日志用于调试？（开发环境建议开启）
