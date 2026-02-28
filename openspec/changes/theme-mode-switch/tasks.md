## 1. 状态管理扩展

- [x] 1.1 扩展 app-store.ts 添加 themeMode 状态 ('light' | 'dark')
- [x] 1.2 添加 setThemeMode 方法到 store
- [x] 1.3 添加 loadTheme 和 saveTheme 方法（使用 AsyncStorage）
- [x] 1.4 初始化时从存储加载主题偏好

## 2. 持久化存储

- [x] 2.1 在 storage.ts 中添加 getStoredTheme 函数
- [x] 2.2 在 storage.ts 中添加 saveThemePreference 函数
- [x] 2.3 定义存储键名 THEME_KEY

## 3. Tailwind 深色模式配置

- [x] 3.1 在 tailwind.config.js 中添加 darkMode: 'class'
- [x] 3.2 为 colors 添加深色模式变体（darkBackground, darkCard 等）
- [x] 3.3 在 constants.ts 中定义深色模式颜色常量

## 4. 应用主题切换

- [x] 4.1 更新 app/_layout.tsx 使用 store 中的 themeMode
- [x] 4.2 根据 themeMode 传递 DefaultTheme 或 DarkTheme
- [x] 4.3 在根容器添加 dark class 条件

## 5. Profile 页面 UI

- [x] 5.1 在 profile.tsx 中添加主题切换 Toggle 组件
- [x] 5.2 绑定 Toggle 到 store 的 themeMode 和 setThemeMode
- [x] 5.3 添加适当的图标和标签（浅色/深色）

## 6. 验证与测试

- [x] 6.1 验证主题切换流畅无闪烁
- [x] 6.2 验证重启后主题保持
- [x] 6.3 检查所有屏幕在深色模式下显示正确
