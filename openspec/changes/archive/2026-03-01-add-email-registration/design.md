## Context

**当前状态：**
- 后端 (`web3-api`) 已完整实现注册功能：
  - `POST /api/auth/register` 端点
  - `RegisterDto` 验证
  - `AuthService.register()` 方法支持邮箱密码注册
  - bcrypt 密码哈希
- 前端 (`web3-job-app`) 已有：
  - `lib/api.ts` 中的 `register()` API 函数
  - `types/index.ts` 中的 `RegisterRequest` 类型
  - UI 组件库（Input、Button）
- 缺失部分：
  - 前端注册界面
  - 注册表单验证逻辑
  - 注册成功后的跳转流程

**约束条件：**
- 使用 React Native (Expo) 和 NativeWind/Tailwind
- 遵循现有组件模式（参考 `LoginContent.tsx`）
- 支持国际化（使用 `lib/i18n.ts`）
- 使用 SecureStore 存储 token

## Goals / Non-Goals

**Goals:**
1. 创建注册界面组件 `RegisterContent.tsx`
2. 实现表单验证（邮箱格式、密码长度、确认密码匹配）
3. 添加国际化支持（中文/英文）
4. 注册成功后自动登录并跳转到主页
5. 显示友好的错误提示

**Non-Goals:**
1. 邮箱验证流程（留待后续实现）
2. 社交登录（Google、GitHub 等）
3. 密码强度复杂规则（仅要求最小长度）
4. 验证码机制

## Decisions

### 1. 注册界面位置
**决策：** 在 `app/(tabs)/register.tsx` 创建独立的路由页面
**理由：**
- 遵循 Expo Router 的文件路由约定
- 与现有页面（登录、主页）保持一致的组织结构
- 便于导航跳转

### 2. 表单验证方式
**决策：** 使用简单的本地验证函数，不引入额外库
**理由：**
- 验证规则简单（邮箱格式、密码长度 >= 6、确认密码匹配）
- 避免增加依赖负担
- 参考现有代码风格

### 3. 注册成功流程
**决策：** 注册成功后自动登录并跳转到主页
**理由：**
- 提供流畅的用户体验
- 后端已返回 token，无需重新登录
- 减少用户操作步骤

### 4. 错误处理
**决策：** 使用 Alert 显示错误，同时在表单字段下方显示具体错误
**理由：**
- 字段级错误帮助用户快速定位问题
- Alert 用于显示系统性错误（如网络失败、邮箱已存在）

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 密码强度不足 | 最小长度要求（6 位），后续可增强 |
| 邮箱未验证 | 留待后续实现邮件验证功能 |
| 重复提交 | 使用 loading 状态防止重复点击 |
| 网络错误 | 友好的错误提示，建议检查网络连接 |

## Migration Plan

1. **创建注册界面组件** - `components/profile/RegisterContent.tsx`
2. **创建注册页面** - `app/(tabs)/register.tsx`
3. **更新登录组件** - 修改 `LoginContent.tsx` 的注册链接跳转到新页面
4. **添加导航配置** - 在 `(tabs)/_layout.tsx` 中添加注册路由（如需要）
5. **添加国际化文本** - 在 `lib/i18n.ts` 中添加注册相关的翻译

## Open Questions

1. 是否需要密码确认功能？（建议添加）
2. 是否需要用户协议/隐私政策勾选？
3. 注册成功后是否需要引导完善资料？
