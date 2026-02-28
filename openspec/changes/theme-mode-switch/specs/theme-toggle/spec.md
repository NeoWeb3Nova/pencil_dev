## ADDED Requirements

### Requirement: 用户可以切换主题模式
系统应当允许用户在浅色模式和深色模式之间切换，主题选择应当立即生效并持久化保存。

#### Scenario: 用户从浅色切换到深色
- **WHEN** 用户当前处于浅色模式
- **WHEN** 用户在 Profile 页面点击"深色模式"开关
- **THEN** 应用界面立即切换为深色主题
- **THEN** 主题偏好保存到本地存储

#### Scenario: 用户从深色切换到浅色
- **WHEN** 用户当前处于深色模式
- **WHEN** 用户关闭"深色模式"开关
- **THEN** 应用界面立即切换为浅色主题
- **THEN** 主题偏好更新并保存到本地存储

#### Scenario: 应用重启后保持主题
- **WHEN** 用户选择深色模式后关闭应用
- **WHEN** 用户重新启动应用
- **THEN** 应用自动使用深色主题
- **THEN** 无需用户重新选择

### Requirement: 主题状态在应用内全局可用
主题状态应当在 Zustand store 中管理，任何组件都可以读取当前主题或触发切换。

#### Scenario: 组件读取当前主题
- **WHEN** 组件需要知道当前主题
- **THEN** 组件可以从 useAppStore 获取 themeMode 值

#### Scenario: 组件触发主题切换
- **WHEN** 组件需要切换主题
- **THEN** 组件可以调用 setThemeMode 方法

### Requirement: 主题切换无闪烁
主题切换过程应当流畅，避免闪烁或颜色跳变。

#### Scenario: 初始化时主题正确加载
- **WHEN** 应用启动时
- **WHEN** 用户之前选择过主题
- **THEN** 首屏渲染前读取存储的主题
- **THEN** 避免先显示浅色再切换到深色
