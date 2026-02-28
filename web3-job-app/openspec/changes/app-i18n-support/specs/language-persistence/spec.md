## ADDED Requirements

### Requirement: 语言设置持久化
系统 SHALL 使用 AsyncStorage 保存用户选择的语言设置，并在应用重启后恢复。

#### Scenario: 保存用户选择的语言
- **WHEN** 用户在个人中心选择新语言
- **THEN** 系统 SHALL 将语言设置保存到 AsyncStorage，键名为 `@web3-job-app:language`

#### Scenario: 应用启动时恢复语言设置
- **WHEN** 应用启动且 AsyncStorage 中存在已保存的语言设置
- **THEN** 系统 SHALL 读取并使用上次保存的语言设置

#### Scenario: 首次启动默认语言
- **WHEN** 应用首次启动且 AsyncStorage 中无语言设置
- **THEN** 系统 SHALL 使用默认语言中文 (zh)

### Requirement: 语言持久化存储封装
系统 SHALL 提供统一的 API 用于语言设置的读写操作。

#### Scenario: 读取语言设置
- **WHEN** 调用 `getStoredLanguage()` 函数
- **THEN** 返回 AsyncStorage 中保存的语言代码，若无则返回 null

#### Scenario: 保存语言设置
- **WHEN** 调用 `saveLanguagePreference(language)` 函数
- **THEN** 将语言代码保存到 AsyncStorage
