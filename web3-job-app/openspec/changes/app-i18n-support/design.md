## Context

当前应用的语言设置功能仅在个人中心页面实现，其他页面（首页、职位、发布职位、消息）仍然使用硬编码的中文文本。应用使用 Zustand 进行状态管理，已有基础的 i18n 字典结构。

**约束条件：**
- 使用 React Native (Expo) 框架
- 使用 Zustand 进行状态管理
- 需要支持中英文两种语言
- 语言设置需要持久化保存

## Goals / Non-Goals

**Goals:**
- 所有页面和组件支持中英文切换
- 语言设置持久化存储（应用重启后保持）
- 翻译键统一管理，易于维护和扩展
- 组件代码清晰，翻译逻辑不侵入业务逻辑

**Non-Goals:**
- 不支持除中英文外的其他语言（架构上保留扩展性）
- 不实现动态翻译（需要重新加载应用）
- 不修改后端 API（仅前端国际化）

## Decisions

### 1. 翻译管理方式
**决策：** 使用集中式翻译字典（lib/i18n.ts），而不是分散在各组件中。

**理由：** 便于统一管理和审计，避免翻译重复，支持翻译缺失时的回退逻辑。

**替代方案：** 使用 react-i18next 库。考虑到项目规模较小，引入额外的库会增加复杂性，故选择轻量级自研方案。

### 2. 语言持久化
**决策：** 使用 AsyncStorage 保存用户选择的语言。

**理由：** React Native 标准方案，简单易用，无需额外依赖（expo 已包含）。

**注意：** 需要安装 `@react-native-async-storage/async-storage` 或使用 expo 内置方案。

### 3. 组件更新策略
**决策：** 使用 Zustand store 的 language 状态，组件通过 Hook 订阅变化自动重新渲染。

**理由：** 与现有状态管理方式一致，无需引入额外的 Context Provider。

### 4. 翻译键命名规范
**决策：** 使用驼峰命名法，按页面/组件组织：
- `home.heroTitle`, `home.heroSubtitle`
- `profile.myResume`, `profile.savedJobs`
- `common.cancel`, `common.confirm`

**理由：** 清晰的层级结构便于查找和维护。

## Risks / Trade-offs

**[风险] 翻译键遗漏导致部分文本未国际化**
→ 缓解：创建翻译键清单，逐一核对每个组件的硬编码文本

**[风险] 新增语言时需要修改多个文件**
→ 缓解：集中式字典已降低复杂度，未来可考虑 JSON 格式分离

**[风险] 文本长度变化导致布局问题**
→ 缓解：英文通常比中文短，设计时预留足够空间

**[风险] AsyncStorage 在旧设备上性能问题**
→ 缓解：仅在语言切换和启动时读写，频率低影响小

## Migration Plan

1. 扩展 lib/i18n.ts 翻译字典
2. 更新 app-store.ts 添加 AsyncStorage 持久化
3. 逐个更新组件（HomeContent, JobCard, PostJobContent, MessagesContent）
4. 更新 _layout.tsx 导航标题
5. 测试语言切换功能
6. 验证持久化功能

## Open Questions

- 是否需要支持动态加载翻译文件（按需加载）？
- 是否需要添加语言自动检测（根据系统设置）？
