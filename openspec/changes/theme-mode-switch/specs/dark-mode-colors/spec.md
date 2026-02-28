## ADDED Requirements

### Requirement: 深色模式颜色系统
系统应当定义完整的深色模式颜色令牌，确保所有 UI 元素在深色模式下正确显示。

#### Scenario: 背景颜色适配
- **WHEN** 主题切换到深色模式
- **THEN** 主背景色从 #FAFAFA 变为 #18181B
- **THEN** 卡片背景色从 #FFFFFF 变为 #27272A

#### Scenario: 文本颜色适配
- **WHEN** 主题切换到深色模式
- **THEN** 主要文本颜色保持可读性
- **THEN** 次要文本颜色适当调整对比度

#### Scenario: 边框和分隔线适配
- **WHEN** 主题切换到深色模式
- **THEN** 边框颜色从 #E4E4E7 调整为 #3F3F46
- **THEN** 分隔线在深色背景下可见

### Requirement: Tailwind 深色模式配置
Tailwind 配置应当支持 darkMode: 'class' 策略，允许通过父容器 class 控制深色样式。

#### Scenario: dark: 前缀样式生效
- **WHEN** 根容器添加 dark class
- **THEN** dark:bg-black 等样式应用
- **THEN** dark:text-white 等样式应用

#### Scenario: 深色模式颜色映射
- **WHEN** 深色模式启用
- **THEN** background 映射到深灰色 #18181B
- **THEN** card 映射到深灰色 #27272A
- **THEN** border 映射到中灰色 #3F3F46
