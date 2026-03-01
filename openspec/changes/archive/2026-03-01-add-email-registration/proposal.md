## Why

当前项目缺少用户注册功能，用户无法通过邮箱创建账户。虽然已有登录端点，但没有注册流程，用户无法首次使用系统。需要实现完整的邮箱 + 密码注册功能，让用户能够创建账户并使用应用。

## What Changes

- 新增用户注册 API 端点 (`POST /api/auth/register`)
- 新增前端注册界面 (邮箱、密码、确认密码输入)
- 添加密码验证逻辑 (长度、强度要求)
- 添加邮箱格式验证
- 注册成功后自动登录或跳转到登录页
- 显示友好的错误提示 (邮箱已存在、密码不匹配等)

## Capabilities

### New Capabilities

- `user-registration`: 用户通过邮箱和密码注册账户的功能，包括表单验证、API 调用和错误处理

### Modified Capabilities

- 无

## Impact

- **后端**: 需要在 `web3-api/src/auth/` 模块新增注册端点、DTO、Service 方法
- **前端**: 需要在 `web3-job-app/app/(tabs)/` 新增注册界面
- **数据库**: User 表需要支持密码存储 (bcrypt 哈希)
- **依赖**: bcrypt 或类似密码哈希库
