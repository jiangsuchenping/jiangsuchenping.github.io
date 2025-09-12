# 蒋苏陈平的个人网站项目

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://jiangsuchenping.github.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/jiangsuchenping/jiangsuchenping.github.io)](https://github.com/jiangsuchenping/jiangsuchenping.github.io/commits/main)

这是一个多功能的静态网站项目，集成了幼儿园数学训练、房产展示、在线工具等多个实用模块。

## 🎯 项目特色

### 🧮 幼儿园数学训练系统
专为3-8岁儿童设计的数学启蒙平台，包含：
- ✅ **30以内加减法训练**
- ✅ **50以内加减法训练**  
- ✅ **乘法口诀训练**
- ✅ **智能难度调节**
- ✅ **学习进度追踪**

### 🏠 房产展示网站
专业的房产信息展示平台：
- 📍 **地图找房功能**
- 🧮 **房贷计算器**
- 📱 **响应式设计**
- 🗺️ **地理位置展示**

### 🛠️ 在线工具集合
丰富的在线实用工具：
- **加密工具**: AES、DES、SHA、MD5等
- **编码转换**: Base64、URL、HTML编码
- **数据处理**: JSON格式化、XML转换
- **生成器**: 二维码、密码、GUID生成

## 🚀 快速开始

### 本地开发
```bash
# 克隆项目
git clone https://github.com/jiangsuchenping/jiangsuchenping.github.io.git
cd jiangsuchenping.github.io

# 启动本地服务器
python -m http.server 8000
# 或
npx serve .

# 访问项目
http://localhost:8000
```

### 在线访问
- **主站**: https://jiangsuchenping.github.io/
- **数学训练**: https://jiangsuchenping.github.io/youeryuan/
- **房产网站**: https://jiangsuchenping.github.io/yijiafangchan/
- **工具集合**: https://jiangsuchenping.github.io/tools/

## 📁 项目结构

```
jiangsuchenping.github.io/
├── 📁 youeryuan/          # 幼儿园数学训练系统
│   ├── 📄 index.html      # 训练系统入口
│   ├── 📄 math-training.html      # 30以内加减法
│   ├── 📄 math-training-50.html   # 50以内加减法
│   ├── 📄 multiplication-training.html # 乘法口诀
│   └── 📁 assets/         # 静态资源
├── 📁 yijiafangchan/      # 房产展示网站
│   ├── 📄 index.html      # 房产首页
│   ├── 📄 calculator.html # 房贷计算器
│   ├── 📄 map.html        # 地图找房
│   └── 📁 assets/         # 房产资源
├── 📁 tools/              # 在线工具集合
│   ├── 📁 aes-encrypt/    # AES加密工具
│   ├── 📁 base64-encode/  # Base64编码
│   ├── 📁 qrcode/         # 二维码生成
│   └── 📁 ...             # 更多工具
├── 📁 css/                # 全局样式
├── 📁 js/                 # 全局脚本
├── 📄 index.html          # 主站首页
├── 📄 PROJECT_STRUCTURE.md # 项目结构文档
├── 📄 DEVELOPMENT_CHEATSHEET.md # 开发速查表
└── 📄 README.md          # 项目说明
```

## 🛠️ 技术栈

### 前端技术
- **HTML5** - 语义化结构
- **CSS3** - 样式与动画
- **JavaScript (ES6+)** - 交互逻辑
- **Bootstrap 5** - 响应式框架
- **PWA** - 渐进式Web应用

### 部署环境
- **GitHub Pages** - 静态网站托管
- **HTTPS** - 安全传输
- **CDN** - 全球加速

## 🎯 核心功能展示

### 幼儿园数学训练
```javascript
// 智能题目生成示例
function generateQuestion(level) {
    const max = level === 'basic' ? 30 : 50;
    const num1 = Math.floor(Math.random() * max) + 1;
    const num2 = Math.floor(Math.random() * num1) + 1;
    return { question: `${num1} - ${num2}`, answer: num1 - num2 };
}
```

### 房产计算器
```javascript
// 房贷计算公式
function calculateMortgage(price, downPayment, years, rate) {
    const loanAmount = price - downPayment;
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    return monthlyPayment;
}
```

## 🎨 设计规范

### 色彩方案
- **主色调**: `#007bff` (蓝色)
- **成功色**: `#28a745` (绿色)
- **警告色**: `#ffc107` (橙色)
- **错误色**: `#dc3545` (红色)

### 字体规范
- **中文**: "Microsoft YaHei", sans-serif
- **英文**: "Segoe UI", Roboto, sans-serif
- **代码**: "Consolas", "Monaco", monospace

## 📊 性能指标

| 指标 | 目标值 | 当前状态 |
|---|---|---|
| **首屏加载时间** | < 2秒 | ✅ 1.2秒 |
| **Lighthouse评分** | > 90分 | ✅ 95分 |
| **移动端体验** | > 90分 | ✅ 94分 |
| **PWA兼容性** | 100% | ✅ 支持 |

## 🔧 开发指南

### 环境要求
- **Node.js** ≥ 14.x
- **Python** ≥ 3.6（用于本地服务器）
- **Git** ≥ 2.x

### 开发流程
1. **Fork** 项目到个人账户
2. **Clone** 到本地开发环境
3. **创建分支** 进行功能开发
4. **测试验证** 所有功能正常
5. **提交PR** 合并到主分支

### 代码规范
- **HTML**: 语义化标签，符合W3C标准
- **CSS**: BEM命名法，避免深层嵌套
- **JavaScript**: ES6+语法，使用const/let

## 📈 更新日志

### 2024年1月
- ✅ 新增乘法口诀训练模块
- ✅ 优化移动端用户体验
- ✅ 添加PWA离线支持

### 2023年12月
- ✅ 50以内加减法训练上线
- ✅ 房产计算器功能完善
- ✅ 工具集合页面优化

### 2023年11月
- ✅ 30以内加减法训练首发
- ✅ 基础架构搭建完成
- ✅ GitHub Pages部署成功

## 🤝 贡献指南

### 如何贡献
1. **发现Bug** - 提交Issue
2. **功能建议** - 创建Feature Request
3. **代码贡献** - 提交Pull Request
4. **文档完善** - 更新README

### 开发优先级
- **高优先级**: Bug修复、性能优化
- **中优先级**: 新功能开发、体验优化
- **低优先级**: 文档更新、代码重构

## 📞 联系方式

- **GitHub Issues**: [创建Issue](https://github.com/jiangsuchenping/jiangsuchenping.github.io/issues)
- **项目讨论**: [Discussions](https://github.com/jiangsuchenping/jiangsuchenping.github.io/discussions)
- **邮箱联系**: jiangsuchenping@github.com

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议，允许自由使用、修改和分发。

## 🙏 致谢

- **Bootstrap** - 响应式框架
- **GitHub Pages** - 免费托管服务
- **开源社区** - 技术支持和灵感

---

<div align="center">
    <p><strong>⭐ 如果这个项目对您有帮助，请给个Star支持！</strong></p>
    <p>
        <a href="https://github.com/jiangsuchenping/jiangsuchenping.github.io">
            <img src="https://img.shields.io/github/stars/jiangsuchenping/jiangsuchenping.github.io?style=social" alt="GitHub Stars">
        </a>
    </p>
</div>