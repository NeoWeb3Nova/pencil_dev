# API Client Specification

## Purpose

定义前端 API 客户端 (`lib/api.ts`) 的功能需求和接口规范，确保与后端 `web3-api` 完全兼容。

## Requirements

### 1. 基础配置

- API 基础 URL: `http://localhost:3000/api`
- 默认超时：30 秒
- 默认 Headers: `Content-Type: application/json`
- 认证 Header: `Authorization: Bearer <token>`

### 2. 认证 API

#### 2.1 登录
```typescript
POST /auth/login
Request: { email: string; password: string }
Response: { access_token: string; user: User }
```

#### 2.2 注册
```typescript
POST /auth/register
Request: { email: string; password: string; name: string }
Response: { access_token: string; user: User }
```

#### 2.3 获取 Profile
```typescript
GET /auth/profile
Headers: Authorization: Bearer <token>
Response: User
```

#### 2.4 更新 Profile
```typescript
POST /auth/profile
Headers: Authorization: Bearer <token>
Request: { name?: string; avatar?: string }
Response: User
```

### 3. 职位 API

#### 3.1 获取职位列表
```typescript
GET /jobs?page=1&limit=10&search=&type=&status=
Response: { data: Job[]; total: number; page: number; limit: number }
```

#### 3.2 获取职位详情
```typescript
GET /jobs/:id
Response: Job
```

#### 3.3 发布职位
```typescript
POST /jobs
Headers: Authorization: Bearer <token>
Request: CreateJobDto
Response: Job
```

#### 3.4 更新职位
```typescript
PUT /jobs/:id
Headers: Authorization: Bearer <token>
Request: UpdateJobDto
Response: Job
```

#### 3.5 删除职位
```typescript
DELETE /jobs/:id
Headers: Authorization: Bearer <token>
Response: { success: boolean }
```

#### 3.6 我的职位
```typescript
GET /jobs/user/me?page=1&limit=10
Headers: Authorization: Bearer <token>
Response: { data: Job[]; total: number }
```

### 4. 申请 API

#### 4.1 申请职位
```typescript
POST /applications
Headers: Authorization: Bearer <token>
Request: { jobId: string; coverLetter: string; resumeUrl?: string }
Response: Application
```

#### 4.2 我的申请
```typescript
GET /applications/my-applications?page=1&limit=10
Headers: Authorization: Bearer <token>
Response: { data: Application[]; total: number }
```

### 5. 消息 API

#### 5.1 获取消息列表
```typescript
GET /messages?page=1&limit=10
Headers: Authorization: Bearer <token>
Response: { data: Message[]; total: number }
```

#### 5.2 未读消息数
```typescript
GET /messages/unread-count
Headers: Authorization: Bearer <token>
Response: { count: number }
```

#### 5.3 发送消息
```typescript
POST /messages
Headers: Authorization: Bearer <token>
Request: { jobId: string; receiverId: string; content: string }
Response: Message
```

#### 5.4 标记已读
```typescript
POST /messages/:id/read
Headers: Authorization: Bearer <token>
Response: Message
```

## Error Handling

### 统一响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  message?: string;
}
```

### 错误码处理
- 400: Bad Request - 显示表单验证错误
- 401: Unauthorized - 清除 token，跳转登录
- 403: Forbidden - 显示无权限提示
- 404: Not Found - 显示资源不存在
- 500: Internal Server Error - 显示服务器错误

## Token Management

- 存储：AsyncStorage (`@web3job:token`)
- 自动附加：所有带 Auth 的请求
- 过期处理：401 响应时自动清除并跳转
