## Why

当前 APP 仅支持浅色模式（light mode），用户无法切换到深色模式。随着深色模式在现代移动应用中的普及，用户对深色模式的需求日益增长。深色模式可以减少眼睛疲劳、节省电池电量（OLED 屏幕），并提供更好的夜间使用体验。

## What Changes

- 添加主题模式切换功能（浅色/深色）
- 在 Profile 页面添加主题切换开关
- 主题选择持久化存储（使用 AsyncStorage）
- 更新 Tailwind 配置以支持深色模式颜色令牌
- 更新导航主题以响应模式切换

## Capabilities

### New Capabilities
- `theme-toggle`: 主题切换功能，包括 Zustand store 扩展、持久化存储、UI 切换组件
- `dark-mode-colors`: 深色模式颜色系统设计，扩展 tailwind.config.js 和 constants.ts

### Modified Capabilities
- (无)

## Impact

- **前端 (web3-job-app)**:
  - `store/app-store.ts` - 扩展 Zustand store 添加 theme 状态
  - `lib/storage.ts` - 添加主题持久化方法
  - `lib/constants.ts` - 添加深色模式颜色令牌
  - `tailwind.config.js` - 配置 darkMode 支持
  - `app/_layout.tsx` - 动态主题切换
  - `app/(tabs)/profile.tsx` - 添加主题切换 UI
- **依赖**: `@react-navigation/native` (已安装), `expo-system-ui` (可能需要)
