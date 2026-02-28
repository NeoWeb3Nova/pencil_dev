## 1. 基础结构

- [x] 1.1 扩展 lib/i18n.ts 翻译字典，添加首页、职位、发布职位、消息页的所有翻译键
- [x] 1.2 安装 AsyncStorage 依赖（@react-native-async-storage/async-storage）
- [x] 1.3 创建 lib/storage.ts 文件，封装 AsyncStorage 读写操作

## 2. 语言持久化

- [x] 2.1 更新 app-store.ts，添加 loadLanguage 和 saveLanguage 方法
- [x] 2.2 在应用启动时从 AsyncStorage 加载语言设置
- [x] 2.3 在语言切换时保存到 AsyncStorage

## 3. 首页国际化

- [x] 3.1 更新 HomeContent.tsx，使用 t() 函数替换所有硬编码中文
- [x] 3.2 更新首页横幅文本（Hero Banner）
- [x] 3.3 更新首页搜索标签和占位符
- [x] 3.4 更新首页分类标签
- [x] 3.5 更新首页推荐职位标签

## 4. 职位详情页国际化

- [x] 4.1 更新 _layout.tsx 导航标题，使用动态翻译
- [x] 4.2 更新 JobDetail.tsx 组件的文本

## 5. 发布职位页国际化

- [x] 5.1 更新 PostJobContent.tsx，使用 t() 函数替换表单标签
- [x] 5.2 更新工作类型选项
- [x] 5.3 更新提交按钮文本

## 6. 消息页国际化

- [x] 6.1 更新 MessagesContent.tsx，使用 t() 函数替换搜索框占位符

## 7. 验证测试

- [ ] 7.1 测试中英文切换功能正常
- [ ] 7.2 测试应用重启后语言设置保持
- [ ] 7.3 验证所有页面文本正确显示
