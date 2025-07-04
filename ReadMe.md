# 快乐成长乐园

这是一个针对幼儿园中班儿童设计的教育游戏平台，包含语文、数学、英语等多个学习模块。

## 项目特点

- 基于艾宾浩斯记忆曲线的学习系统
- 自适应难度的练习生成
- 多模块学习体验（语文、数学、英语）
- 趣味游戏（华容道、数独等）
- 本地存储学习进度

## 项目架构

项目采用模块化结构，主要包含以下部分：

- **核心模块**：语文、数学、英语、游戏
- **工具模块**：
  - `UIUtil`: UI相关工具函数
  - `StorageUtil`: 本地存储工具
  - `LearningUtil`: 学习系统工具（基于艾宾浩斯记忆法）
- **数据模块**：
  - `chinese-chars.js`: 汉字数据
  - `english-words.js`: 英语单词数据
  - `css-templates.js`: CSS样式模板

## 最新优化

### 代码优化

1. **模块化与重用**
   - 实现表格渲染工具函数，减少代码重复
   - 添加防抖功能，优化按钮点击体验
   - 重构历史记录显示逻辑

2. **用户体验优化**
   - 添加动画反馈效果
   - 改进答题体验，按钮点击效果增强
   - 禁用逻辑优化，只禁用未选择的按钮
   - 增加倒计时动画效果

3. **性能优化**
   - 减少不必要的DOM操作
   - 优化排序和渲染逻辑
   - 防止快速连续点击导致的重复操作

## 版本历史

### v1.5.0 (当前)
- 添加防抖功能，优化按钮点击体验
- 实现表格渲染工具函数，减少代码重复
- 添加动画反馈效果
- 优化答题体验和界面交互

### v1.4.0
- 添加数学乐园答题动画
- 提高历史记录显示高度至500px
- 增强用户反馈机制

### v1.3.0
- 英语模块重构，使用独立数据文件
- 添加英语单词音标和翻译
- 优化学习进度跟踪

### v1.2.0
- 数据与代码分离
- 创建工具模块
- 重构存储逻辑

### v1.1.0
- 添加语文和英语学习模块
- 实现艾宾浩斯记忆法
- 添加学习进度记录

### v1.0.0
- 初始版本
- 基本数学练习功能
- 简单游戏模块

## 使用说明

1. 打开`index.html`启动应用
2. 选择相应的学习模块
3. 按照提示进行练习
4. 学习进度会自动保存到本地浏览器

## 技术栈

- 原生JavaScript
- HTML5 / CSS3
- 本地存储 (localStorage)

## 🌟 主要功能

### 📚 语文乐园
- **汉字识字学习**：通过生动的展示方式学习常用汉字
- **拼音展示**：每个汉字配有标准拼音，帮助孩子掌握发音规则
- **进度跟踪**：记录学习过的汉字，智能安排复习计划

### 🌎 英语乐园
- **单词学习**：包含丰富的基础英语单词库
- **音标展示**：每个单词配有标准音标，帮助正确发音
- **中文翻译**：直观理解单词含义，建立英汉对照记忆

### 🔢 数学乐园
- **基础运算练习**：加减法算术题目动态生成
- **互动式答题**：选择题形式，即时反馈结果
- **智能出题**：根据答题正确率智能调整题目难度

### 🎮 公共功能
- **艾宾浩斯记忆法**：科学安排复习间隔，提高记忆效果
  - 复习间隔：5分钟、30分钟、1小时、3小时、6小时、12小时、1天、2天、3天、5天
- **学习历史记录**：详细记录每个题目的学习情况，包括正确率、上次复习时间等
- **学习统计分析**：展示学习进度、掌握程度和薄弱环节
- **每日学习量设置**：根据孩子的能力设置合理的每日学习目标
- **自适应学习路径**：优先安排正确率低的内容，强化薄弱环节

## 🚀 技术特点

- **前端纯静态实现**：无需服务器支持，可直接在浏览器中运行
- **本地数据存储**：使用LocalStorage保存学习记录和设置
- **模块化设计**：代码组织清晰，易于维护和扩展
- **响应式布局**：适配不同设备屏幕，提供一致的用户体验
- **渐进式学习算法**：结合艾宾浩斯记忆法的科学学习模式
- **无依赖设计**：不依赖第三方库，轻量化实现所有功能

## 📂 系统架构

### 核心模块
- **语文模块** (`js/chinese.js`): 汉字学习功能实现
- **英语模块** (`js/english.js`): 英语单词学习功能实现
- **数学模块** (`js/math.js`): 数学运算练习功能实现

### 工具库
- **存储工具** (`js/utils/storage.js`): 处理本地存储操作
- **学习工具** (`js/utils/learning.js`): 实现艾宾浩斯记忆法和学习进度管理
- **UI工具** (`js/utils/ui.js`): 提供通用UI交互功能
- **常量管理** (`js/utils/constants.js`): 集中管理系统常量

### 数据模块
- **英语单词库** (`js/data/english-words.js`): 英语学习资源
- **汉字词库** (`js/data/chinese-chars.js`): 汉字学习资源
- **CSS模板** (`js/data/css-templates.js`): 统一管理样式模板

## 📊 数据结构

### 学习记录格式
```javascript
{
  "项目标识": {
    "totalTests": 学习次数,
    "correctCount": 正确次数,
    "round": 当前记忆轮次,
    "lastTestTime": 上次测试时间,
    "nextReviewTime": 下次复习时间
  }
}
```

### 艾宾浩斯记忆曲线实现
系统根据学习者对每个项目的掌握情况，动态安排复习时间。回答正确则提升记忆轮次，延长下次复习间隔；回答错误则降低记忆轮次，缩短复习间隔。

## 📱 使用方法

1. **首页**：选择您想要进入的学习模块（语文乐园、英语乐园或数学乐园）
2. **学习**：根据提示完成学习内容，点击"认识"或"不认识"按钮进行反馈
3. **设置**：调整每日学习量以适应个人节奏
4. **查看历史**：查看学习记录，了解学习进度和统计数据

## 🔧 本地部署

1. 克隆代码库到本地
2. 使用任何静态文件服务器提供服务，如：
   ```
   python -m http.server 8000
   ```
3. 浏览器访问 `http://localhost:8000` 即可使用

## 💡 未来计划

- 添加更多学习内容和游戏类型
- 支持多用户配置文件
- 添加学习成就系统
- 提供学习数据导出功能
- 开发家长监控面板

## 📄 许可证

本项目采用MIT许可证开源。

---

快乐成长乐园 - 让学习变得简单有趣！

## 📝 版本历史

| 版本号 | 发布日期 | 更新内容 |
|--------|----------|----------|
| v1.0.0 | 2023-12-01 | 初始版本发布 |
| | | - 基础学习模块：语文、英语和数学 |
| | | - 基础用户界面和交互功能 |
| | | - 本地存储学习记录 |
| v1.1.0 | 2023-12-15 | 功能增强更新 |
| | | - 添加艾宾浩斯记忆法学习算法 |
| | | - 增加学习历史记录和统计功能 |
| | | - 添加每日学习量设置 |
| v1.2.0 | 2024-01-10 | 用户体验优化 |
| | | - 改进UI界面，增强视觉效果 |
| | | - 优化学习反馈机制 |
| | | - 改进答题流程，增加动画效果 |
| v1.3.0 | 2024-02-05 | 数据管理优化 |
| | | - 创建英语单词数据文件，分离核心代码和数据 |
| | | - 提取汉字词库为独立数据文件 |
| | | - 增加历史记录显示行数至10-15行 |
| v1.4.0 | 2024-03-01 | 代码结构优化 |
| | | - 创建Storage、Learning、UI等工具模块 |
| | | - 实现常量管理系统，统一维护键名和配置 |
| | | - CSS样式模板化，集中管理各模块样式 |
| v1.5.0 | 2024-03-15 | 学习体验升级 |
| | | - 数学乐园增加答题动画和视觉反馈 |
| | | - 增加防重复点击机制，提高答题稳定性 |
| | | - 优化错误反馈，显示正确答案 |
| | | - 模块化重构，提升代码复用性和可维护性 |
