## Why

当前应用只有个人中心页面支持中英文语言切换，其他页面（首页、职位列表、发布职位、消息）仍然是硬编码的中文文本。为了实现完整的国际化体验，需要将语言支持扩展到整个应用的所有页面和组件。

## What Changes

- **扩展 i18n 字典**：添加所有页面和组件需要的翻译键
- **更新首页组件**：HomeContent 中的横幅、搜索、分类、推荐职位等文本
- **更新职位组件**：JobCard、JobDetail 中的标签和按钮文本
- **更新发布职位组件**：PostJobContent 中的表单标签和占位符
- **更新消息组件**：MessagesContent 中的搜索和标签
- **更新布局文件**：_layout.tsx 中的导航标题
- **添加语言持久化**：使用 AsyncStorage 保存用户选择的语言

## Capabilities

### New Capabilities
- `app-i18n`: 全应用范围的国际化支持，包括所有页面和组件的翻译
- `language-persistence`: 语言设置持久化存储，使用 AsyncStorage 保存用户选择

### Modified Capabilities
- `profile-language-selector`: 扩展语言选择器功能，支持更多语言选项

## Impact

- **受影响组件**：HomeContent, JobCard, JobDetail, PostJobContent, MessagesContent, _layout
- **受影响的 Store**：app-store.ts 需要集成 AsyncStorage 持久化
- **新增依赖**：可能需要 @react-native-async-storage/async-storage
- **翻译文件**：lib/i18n.ts 需要扩展大量翻译键
