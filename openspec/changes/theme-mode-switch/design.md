## Context

当前 APP 使用 React Navigation 的 `DefaultTheme` 作为唯一主题，颜色配置在 `tailwind.config.js` 中定义但不支持动态切换。Zustand store 已用于管理语言设置和登录状态，可作为主题状态的管理中心。

技术栈：
- React Native (Expo)
- NativeWind (Tailwind)
- Zustand (状态管理)
- AsyncStorage (持久化)
- React Navigation (已支持深色主题)

## Goals / Non-Goals

**Goals:**
- 用户可以手动切换浅色/深色模式
- 主题选择自动持久化，重启 APP 后保持
- 所有屏幕和组件正确响应主题切换
- 切换动画流畅，无闪烁

**Non-Goals:**
- 不支持系统自动主题跟随（可在未来扩展）
- 不支持自定义颜色主题（仅限预定义浅色/深色）
- 不影响现有语言切换功能

## Decisions

### 1. 状态管理方案
**决策:** 扩展现有的 `app-store.ts` Zustand store，添加 `themeMode` 状态和方法。

**理由:** 
- 避免引入新的状态管理库
- 与语言设置模式保持一致
- 简化组件订阅逻辑

**替代方案:** 创建独立的 `theme-store.ts`
**未采用原因:** 增加复杂性，且语言/主题都是应用级设置，应统一管理

### 2. 持久化方案
**决策:** 使用 AsyncStorage 直接存储主题偏好

**理由:**
- 与现有语言存储模式一致
- AsyncStorage 已随 Expo 安装
- 简单可靠

### 3. 主题应用方式
**决策:** 在 `_layout.tsx` 中读取 store 的 themeMode，动态传递 `DefaultTheme` 或 `DarkTheme` 给 `ThemeProvider`

**理由:**
- React Navigation 已内置两个主题
-  centralized 控制点，便于维护

### 4. 深色模式颜色系统
**决策:** 在 `tailwind.config.js` 中使用 `darkMode: 'class'` 策略，通过父容器 class 控制

**理由:**
- NativeWind 官方推荐方案
- 便于细粒度控制组件颜色

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 主题切换时可能闪烁 | 在 root layout 初始化时立即读取存储的主题 |
| 部分组件忘记适配深色模式 | 建立深色模式颜色令牌，强制使用语义化颜色名 |
| AsyncStorage 读取异步导致延迟 | 使用 Suspense 或 loading 状态处理 |
| 未来需要系统主题跟随 | 预留 `system` 选项，当前先实现手动切换 |

## Migration Plan

1. 扩展 store → 2. 添加存储方法 → 3. 更新 Tailwind 配置 → 4. 更新 layout → 5. 添加 UI 开关

**回滚策略:** 回滚所有修改的文件，主题默认为 `light`

## Open Questions

- 是否需要添加"跟随系统"选项？（建议未来迭代）
- 是否需要主题切换动画过渡？（当前使用系统默认）
