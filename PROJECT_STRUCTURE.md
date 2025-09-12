# 网站项目结构总结文档

## 📊 项目概览

这是一个多功能的静态网站项目，包含以下主要模块：
- **幼儿园数学训练系统**（youeryuan/）
- **房产展示网站**（yijiafangchan/）
- **在线工具集合**（tools/）
- **主站页面**（根目录）

## 🏗️ 目录结构

```
jiangsuchenping.github.io/
├── 📁 根目录（主站）
├── 📁 youeryuan/           # 幼儿园数学训练系统
├── 📁 yijiafangchan/       # 房产展示网站
├── 📁 tools/              # 在线工具集合
├── 📁 css/                # 全局样式
├── 📁 js/                 # 全局JavaScript
└── 📁 templates/          # 模板文件
```

---

## 🎯 幼儿园数学训练系统（youeryuan/）

### 核心功能模块

#### 1. 数学训练页面
- **30以内加减法**（math-training.html）
- **50以内加减法**（math-training-50.html）
- **乘法口诀训练**（multiplication-training.html）

#### 2. 系统特性
| 功能 | 描述 | 实现技术 |
|---|---|---|
| **智能题目生成** | 基于学习进度动态调整难度 | JavaScript算法 |
| **实时统计** | 答题正确率、历史记录 | LocalStorage |
| **记忆曲线** | 艾宾浩斯复习提醒 | 时间戳算法 |
| **响应式设计** | 移动端适配 | CSS Flexbox |
| **动画反馈** | 答题结果视觉反馈 | CSS3动画 |

#### 3. 文件结构
```
youeryuan/
├── 📄 index.html                 # 主入口页面
├── 📄 math-training.html         # 30以内加减法
├── 📄 math-training-50.html      # 50以内加减法
├── 📄 multiplication-training.html # 乘法口诀训练
├── 📁 assets/                    # 静态资源
│   ├── 📁 css/                   # 样式文件
│   ├── 📁 images/                # 图片资源
│   └── 📁 js/                    # JavaScript库
├── 📁 data/                      # 数据文件
├── 📁 V2/                        # 第二代系统（开发中）
└── 📄 sw.js                     # Service Worker
```

---

## 🏠 房产展示网站（yijiafangchan/）

### 功能模块
- **首页展示**（index.html）
- **房产列表**（properties.html）
- **房贷计算器**（calculator.html）
- **地图找房**（map.html）
- **CRM系统**（crm.html）

### 技术栈
- **前端框架**: Bootstrap 5.x
- **地图服务**: 百度地图API
- **计算器**: JavaScript金融算法
- **响应式**: 移动优先设计

---

## 🛠️ 在线工具集合（tools/）

### 工具分类

#### 1. 加密工具
- **AES加密**（aes-encrypt/）
- **DES加密**（des-encrypt/）
- **3DES加密**（3des-encrypt/）
- **SHA系列**（sha256-encrypt/, sha512-encrypt/）
- **MD5加密**（md5-encrypt/）

#### 2. 编码转换
- **Base64编码**（base64-encode/）
- **URL编码**（url-encode/）
- **HTML编码**（html-encode/）
- **Unicode编码**（unicode-encode/）

#### 3. 数据处理
- **JSON格式化**（json-format/）
- **JSON转C#**（json-to-csharp/）
- **JSON转Java**（json-to-java/）
- **XML转JSON**（xml-to-json/）

#### 4. 实用工具
- **二维码生成**（qrcode/）
- **密码生成器**（password-generator/）
- **GUID生成器**（guid-generator/）
- **时间戳转换**（timestamp/）

---

## 🎨 设计规范

### 色彩方案
- **主色调**: #007bff（蓝色系）
- **辅助色**: #28a745（绿色系）
- **警告色**: #ffc107（橙色系）
- **危险色**: #dc3545（红色系）

### 字体规范
- **中文**: "Microsoft YaHei", sans-serif
- **英文**: "Segoe UI", Roboto, sans-serif
- **代码**: "Consolas", "Monaco", monospace

### 响应式断点
- **超小屏幕**: <576px（手机）
- **小屏幕**: ≥576px（平板竖屏）
- **中等屏幕**: ≥768px（平板横屏）
- **大屏幕**: ≥992px（桌面）
- **超大屏幕**: ≥1200px（宽屏）

---

## 🔧 技术架构

### 前端技术栈
| 层级 | 技术 | 用途 |
|---|---|---|
| **结构** | HTML5 | 语义化标记 |
| **样式** | CSS3 + Bootstrap 5 | 响应式布局 |
| **交互** | Vanilla JavaScript | 动态功能 |
| **存储** | LocalStorage/SessionStorage | 本地数据 |
| **PWA** | Service Worker | 离线支持 |

### 兼容性要求
- **浏览器**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **设备**: 桌面、平板、手机全适配
- **网络**: 支持离线缓存（PWA）

---

## 📁 文件命名规范

### 页面文件
- **功能页面**: `{功能名}.html`（如：math-training.html）
- **工具页面**: `{工具名}/index.html`（如：aes-encrypt/index.html）
- **分类页面**: `{分类}-{子功能}.html`（如：math-training-50.html）

### 资源文件
- **样式**: `assets/css/{模块}.css`
- **脚本**: `assets/js/{功能}.js`
- **图片**: `assets/images/{分类}/{文件名}.{ext}`

---

## 🚀 开发规范

### 代码风格
- **HTML**: 使用语义化标签，符合HTML5规范
- **CSS**: BEM命名法，避免深层嵌套
- **JavaScript**: ES6+语法，使用const/let，避免var

### 性能优化
- **图片优化**: WebP格式优先，压缩大小
- **代码压缩**: 生产环境自动压缩CSS/JS
- **懒加载**: 图片和组件按需加载
- **缓存策略**: 静态资源长期缓存

### 安全规范
- **HTTPS**: 全站强制HTTPS
- **CSP**: 内容安全策略
- **XSS防护**: 输入验证和输出编码
- **CSRF**: 表单令牌验证

---

## 📊 数据存储规范

### LocalStorage键名规范
```javascript
// 用户设置
user.settings.{key}
// 训练数据
training.{type}.{userid}
// 工具配置
tools.{toolname}.config
```

### 数据格式
- **时间**: ISO 8601格式（YYYY-MM-DDTHH:mm:ss.sssZ）
- **数字**: 使用Number类型，避免字符串
- **布尔**: 使用true/false，避免0/1

---

## 🔍 测试检查清单

### 功能测试
- [ ] 所有页面在不同设备上的显示
- [ ] 数学训练逻辑正确性
- [ ] 工具功能完整性
- [ ] 离线访问能力

### 性能测试
- [ ] 页面加载时间 < 3秒
- [ ] Lighthouse评分 > 90
- [ ] 移动端体验评分 > 90

### 兼容性测试
- [ ] 主流浏览器测试
- [ ] 不同屏幕尺寸测试
- [ ] 网络环境测试（3G/4G/WiFi）

---

## 📝 更新维护指南

### 添加新数学训练
1. 复制现有训练页面模板
2. 修改题目生成算法
3. 更新导航菜单
4. 测试数据存储兼容性

### 添加新工具
1. 在`tools/`目录创建新文件夹
2. 创建`index.html`和必要资源
3. 更新主站工具列表
4. 添加Service Worker缓存规则

### 样式更新
1. 修改`css/style.css`全局样式
2. 检查各模块兼容性
3. 测试响应式效果
4. 更新版本号

---

## 📞 技术支持

### 联系方式
- **GitHub Issues**: 功能建议和Bug报告
- **文档更新**: 通过Pull Request提交
- **性能优化**: 使用Lighthouse分析

### 监控指标
- **页面性能**: Core Web Vitals
- **用户体验**: 交互响应时间
- **功能可用性**: 错误率监控

---

*最后更新: 2024年*  
*版本: v2.0*