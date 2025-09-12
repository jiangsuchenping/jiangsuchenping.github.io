# 开发维护速查表

## 🚀 快速开始

### 本地开发环境
```bash
# 启动开发服务器
python -m http.server 8000

# 访问地址
http://localhost:8000/youeryuan/
```

### 常用命令
```bash
# 查看git状态
git status

# 添加新文件
git add .
git commit -m "feat: 新增功能描述"
git push origin main
```

## 📂 文件定位速查

### 数学训练系统
| 功能 | 文件路径 |
|---|---|
| **入口页面** | `youeryuan/index.html` |
| **30以内加减法** | `youeryuan/math-training.html` |
| **50以内加减法** | `youeryuan/math-training-50.html` |
| **乘法口诀** | `youeryuan/multiplication-training.html` |

### 工具页面
| 工具类型 | 目录路径 |
|---|---|
| **加密工具** | `tools/*-encrypt/` |
| **编码转换** | `tools/*-encode/` |
| **生成器** | `tools/*-generator/` |

## 🔧 常见修改场景

### 1. 添加新数学训练
```javascript
// 1. 复制模板
cp youeryuan/math-training.html youeryuan/new-training.html

// 2. 修改训练逻辑
// 找到 generateQuestion() 方法
// 修改题目范围：MAX_NUMBER = 100

// 3. 更新导航
// 在 youeryuan/index.html 中添加新卡片
```

### 2. 修改题目难度
```javascript
// 在对应的 training.html 文件中
// 找到题目生成函数
function generateQuestion() {
    const maxNumber = 50; // 修改这个数字
    const num1 = Math.floor(Math.random() * maxNumber) + 1;
    const num2 = Math.floor(Math.random() * maxNumber) + 1;
    return { num1, num2, operation: '+' };
}
```

### 3. 调整界面颜色
```css
/* 在对应页面的 <style> 标签中 */
:root {
    --primary-color: #007bff; /* 修改主色调 */
    --success-color: #28a745; /* 修改成功颜色 */
    --error-color: #dc3545;   /* 修改错误颜色 */
}
```

### 4. 修改答题延迟时间
```javascript
// 在 checkAnswer 方法中找到
const delay = isCorrect ? 1000 : 1500; // 单位：毫秒
```

## 📊 调试技巧

### 浏览器调试
1. **F12** 打开开发者工具
2. **Console** 查看日志输出
3. **Application** 查看本地存储
4. **Network** 检查资源加载

### 常用调试代码
```javascript
// 查看训练数据
console.log(localStorage.getItem('math.training.basic'));

// 重置训练数据
localStorage.removeItem('math.training.basic');

// 强制刷新缓存
location.reload(true);

// 检查Service Worker
navigator.serviceWorker.getRegistrations().then(console.log);
```

### 移动端调试
1. **Chrome DevTools** 远程调试
2. **Safari Web Inspector** iOS调试
3. **微信开发者工具** 微信内调试

## 🎨 设计规范速查

### 间距规范
```css
/* 卡片间距 */
.card { margin: 15px; }

/* 按钮间距 */
.btn { margin: 5px; }

/* 文字间距 */
.text { line-height: 1.5; }
```

### 字体大小
```css
/* 标题 */
h1 { font-size: 2rem; }    /* 32px */
h2 { font-size: 1.5rem; }  /* 24px */

/* 按钮 */
.btn { font-size: 1.25rem; } /* 20px */

/* 正文 */
body { font-size: 1rem; }   /* 16px */
```

### 响应式断点
```css
/* 手机 */
@media (max-width: 575px) { ... }

/* 平板 */
@media (min-width: 576px) { ... }

/* 桌面 */
@media (min-width: 992px) { ... }
```

## 🔍 性能优化检查

### 加载性能
- [ ] 图片是否压缩（<100KB）
- [ ] CSS/JS是否压缩
- [ ] 是否启用Gzip
- [ ] CDN是否配置

### 运行性能
- [ ] 动画使用CSS3 transform
- [ ] 避免频繁DOM操作
- [ ] 事件使用委托模式
- [ ] 减少重排重绘

### 用户体验
- [ ] 首屏加载 < 2秒
- [ ] 交互响应 < 100ms
- [ ] 按钮大小 > 44px
- [ ] 文字对比度 > 4.5:1

## 🐛 常见问题解决

### 页面显示异常
```bash
# 清除缓存
Ctrl+F5 强制刷新
# 或
开发者工具 → Application → Clear storage
```

### 数据不保存
1. 检查浏览器是否支持LocalStorage
2. 检查是否开启隐私模式
3. 检查存储空间是否已满

### 样式错乱
1. 检查CSS文件路径
2. 检查浏览器兼容性
3. 检查媒体查询条件

### 功能失效
1. 检查Console错误信息
2. 检查网络请求状态
3. 检查JavaScript语法错误

## 📱 PWA配置检查

### Service Worker更新
```javascript
// 强制更新SW
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    registrations.forEach(function(registration) {
        registration.update();
    });
});
```

### 缓存清理
```javascript
// 清理旧缓存
caches.keys().then(function(names) {
    names.forEach(function(name) {
        caches.delete(name);
    });
});
```

## 🚀 发布流程

### 1. 本地测试
```bash
# 启动测试服务器
python -m http.server 8000

# 测试所有页面
http://localhost:8000/youeryuan/
```

### 2. 代码检查
- [ ] 所有功能正常
- [ ] 无控制台错误
- [ ] 移动端测试通过
- [ ] 性能测试通过

### 3. 提交代码
```bash
git add .
git commit -m "feat: 更新描述"
git push origin main
```

### 4. 线上验证
- [ ] 访问线上地址
- [ ] 检查CDN缓存
- [ ] 验证HTTPS证书
- [ ] 测试PWA功能

## 📞 紧急联系

### 技术支持
- **GitHub**: [提Issue](https://github.com/jiangsuchenping/jiangsuchenping.github.io/issues)
- **微信**: 扫码联系开发者

### 文档更新
- 发现文档错误请直接修改
- 新增功能请更新对应文档
- 提交Pull Request合并

---

*速查表版本: v1.0*  
*最后更新: 2024年1月*