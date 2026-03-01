## 1. 国际化配置

- [x] 1.1 在 `lib/i18n.ts` 中添加注册相关的翻译文本（中文/英文）
- [x] 1.2 翻译键包括：register, registerTitle, registerDesc, name, namePlaceholder, email, emailPlaceholder, password, passwordPlaceholder, confirmPassword, confirmPasswordPlaceholder, registerButton, hasAccount, login, registerSuccess, registerFailed

## 2. 注册组件实现

- [x] 2.1 创建 `components/profile/RegisterContent.tsx` 组件
- [x] 2.2 实现表单状态管理（邮箱、密码、确认密码、姓名）
- [x] 2.3 实现表单验证逻辑（邮箱格式、密码长度 >= 6、确认密码匹配）
- [x] 2.4 集成注册 API 调用
- [x] 2.5 处理注册成功（存储 token、跳转主页）
- [x] 2.6 处理错误显示（字段级错误 + Alert 提示）

## 3. 注册页面创建

- [x] 3.1 创建 `app/(tabs)/register.tsx` 页面
- [x] 3.2 配置页面导航头部（返回按钮、标题）
- [x] 3.3 集成 RegisterContent 组件

## 4. 登录页面更新

- [x] 4.1 更新 `components/profile/LoginContent.tsx` 中的注册链接
- [x] 4.2 将注册链接的 Alert 改为导航到注册页面

## 5. 导航配置

- [x] 5.1 在 `app/(tabs)/register.tsx` 中确认注册路由可访问
- [x] 5.2 测试从登录页到注册页的导航

## 6. 测试与验证

- [x] 6.1 测试正常注册流程
- [x] 6.2 测试表单验证（各种无效输入）
- [x] 6.3 测试错误处理（邮箱已存在、网络错误）
- [x] 6.4 测试注册成功后跳转
