## ADDED Requirements

### Requirement: 首页国际化
系统 SHALL 支持首页所有文本的中英文切换显示。

#### Scenario: 首页横幅文本切换
- **WHEN** 用户将语言从中文切换为英文
- **THEN** 首页横幅标题从"加入 Ethereum Foundation"变为"Join Ethereum Foundation"，副标题从"构建去中心化的未来"变为"Building the Decentralized Future"

#### Scenario: 首页搜索标签切换
- **WHEN** 用户将语言从中文切换为英文
- **THEN** 搜索标签从"搜索"变为"Search"，占位符从"Web3、智能合约..."变为"Web3, Smart Contracts..."

#### Scenario: 首页分类标签切换
- **WHEN** 用户将语言从中文切换为英文
- **THEN** 分类标签从"全部职位"、"智能合约"、"前端"、"DeFi"变为"All Jobs"、"Smart Contracts"、"Frontend"、"DeFi"

#### Scenario: 首页推荐职位标签切换
- **WHEN** 用户将语言从中文切换为英文
- **THEN** "推荐职位"变为"Recommended Jobs"，"查看全部"变为"View All"

### Requirement: 职位详情页国际化
系统 SHALL 支持职位详情页所有文本的中英文切换显示。

#### Scenario: 职位详情导航标题切换
- **WHEN** 用户将语言从中文切换为英文
- **THEN** 导航栏标题从"职位详情"变为"Job Details"，返回按钮从"返回"变为"Back"

### Requirement: 发布职位页国际化
系统 SHALL 支持发布职位页所有表单标签和占位符的中英文切换显示。

#### Scenario: 表单标签切换
- **WHEN** 用户将语言从中文切换为英文
- **THEN** 表单标签从"职位名称"、"公司名称"、"工作地点"、"最低薪资"、"最高薪资"、"工作类型"、"要求技能"变为对应的英文

#### Scenario: 工作类型选项切换
- **WHEN** 用户将语言从中文切换为英文
- **THEN** 工作类型从"全职"、"合同"、"兼职"变为"Full-time"、"Contract"、"Part-time"

#### Scenario: 提交按钮切换
- **WHEN** 用户将语言从中文切换为英文
- **THEN** 提交按钮从"发布职位 - ¥299"变为"Post Job - ¥299"

### Requirement: 消息页国际化
系统 SHALL 支持消息页所有文本的中英文切换显示。

#### Scenario: 搜索框占位符切换
- **WHEN** 用户将语言从中文切换为英文
- **THEN** 搜索框占位符从"搜索消息..."变为"Search messages..."
