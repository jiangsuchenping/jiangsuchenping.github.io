# CDN智能管理器使用说明

## 概述

为了解决英语单词学习中的图标加载问题，我们实现了一个智能的CDN管理器，支持多个国内CDN源，并能够自动测试和记录最后成功的CDN源。**新增智能选择功能，基于历史可用状况和综合评价自动选择最佳CDN源。同时支持JS、CSS等静态资源的智能CDN管理。**

## 功能特性

### 1. 多CDN源支持
- **BootCDN**: `https://cdn.bootcdn.net/twemoji/14.0.2/72x72/`
- **jsDelivr**: `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/`
- **Staticfile**: `https://cdn.staticfile.org/twemoji/14.0.2/72x72/`
- **Cloudflare**: `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/`
- **unpkg**: `https://unpkg.com/twemoji@14.0.2/dist/72x72/`

### 2. 🆕 静态资源CDN管理
支持以下静态资源的智能CDN管理：
- **Bootstrap CSS**: 5.3.0版本
- **Bootstrap Icons**: 1.10.0版本
- **Bootstrap JS**: 5.3.0版本
- **Vue.js**: 3.3.4版本

### 3. 智能测试机制
- 页面加载时自动测试所有CDN源
- 优先使用智能选择的最佳CDN源
- 3秒超时机制，避免长时间等待
- 并行测试，提高效率

### 4. 🆕 智能选择算法
基于综合评价选择最佳CDN源，评分权重如下：
- **可靠性权重 40%**: 历史成功率
- **最近表现权重 30%**: 连续成功次数
- **响应时间权重 20%**: 平均响应时间
- **稳定性权重 10%**: 连续失败次数

### 5. 🆕 历史记录管理
- 使用localStorage记录每个CDN源的详细历史
- 记录测试次数、成功率、响应时间等
- 支持连续成功/失败统计
- 自动计算可靠性分数

### 6. 错误处理
- 图片加载失败时自动重新测试CDN源
- 显示占位符图标，避免页面显示异常
- 控制台日志记录，便于调试

## 文件结构

```
assets/js/cdn-manager.js           # 图片CDN管理器核心文件
assets/js/static-cdn-manager.js    # 静态资源CDN管理器核心文件
test-cdn.html                     # 图片CDN测试页面
test-static-cdn.html              # 静态资源CDN测试页面
CDN_README.md                     # 本说明文档
```

## 使用方法

### 1. 在主页面中使用

```html
<!-- 引入CDN管理器 -->
<script src="assets/js/static-cdn-manager.js"></script>
<script src="assets/js/cdn-manager.js"></script>

<!-- 动态加载CSS和JS资源 -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // 动态加载CSS文件
  if (window.staticCDNManager) {
    window.staticCDNManager.loadCSS('bootstrap-css');
    window.staticCDNManager.loadCSS('bootstrap-icons');
  }
});

// 动态加载JS文件
function loadJSResources() {
  if (window.staticCDNManager) {
    window.staticCDNManager.loadJS('vue-js');
    window.staticCDNManager.loadJS('bootstrap-js');
  }
}
</script>
```

### 2. 测试CDN功能

#### 图片CDN测试
访问 `test-cdn.html` 页面可以：
- 查看当前CDN状态和智能评分
- 手动测试所有CDN源
- 查看详细的历史记录
- 预览图片加载效果
- 查看总体统计信息

#### 静态资源CDN测试
访问 `test-static-cdn.html` 页面可以：
- 查看所有静态资源的CDN状态
- 测试Bootstrap、Vue.js等资源的CDN源
- 查看每个资源的详细评分
- 手动加载所有资源
- 管理静态资源的CDN配置

### 3. 在英语单词学习中

在英语单词学习页面中，用户可以：
- 查看当前使用的CDN源和智能评分
- 手动重新测试CDN源
- 查看详细的CDN统计信息
- 实时监控CDN状态

## API接口

### CDNManager类 (图片CDN)

```javascript
// 获取图片URL
getImageUrl(emojiCode)

// 获取当前CDN源
getCurrentCDN()

// 重新测试所有CDN源
retestAll()

// 获取测试结果
getTestResults()

// 🆕 获取CDN源详细信息
getCDNInfo(cdnUrl)

// 🆕 获取所有CDN源信息
getAllCDNInfo()

// 🆕 获取历史记录
getHistory()

// 🆕 获取统计信息
getStats()

// 🆕 清除历史记录
clearHistory()
```

### StaticCDNManager类 (静态资源CDN)

```javascript
// 动态加载CSS文件
loadCSS(resourceKey)

// 动态加载JS文件
loadJS(resourceKey)

// 获取最佳CDN URL
getBestCDNUrl(resourceKey)

// 测试单个CDN源
testCDN(resourceKey, cdnUrl)

// 查找可用的CDN源
findWorkingCDN(resourceKey)

// 获取资源信息
getResourceInfo(resourceKey)

// 获取统计信息
getStats()

// 清除历史记录
clearHistory()
```

## 🆕 智能评分系统

### 评分算法
每个CDN源的评分基于以下因素：

1. **可靠性 (40%)**: `(成功测试次数 / 总测试次数) * 100`
2. **最近表现 (30%)**: 连续成功次数，权重随测试次数增加
3. **响应时间 (20%)**: 平均响应时间，超过3秒开始扣分
4. **稳定性 (10%)**: 连续失败次数，失败越多分数越低

### 评分等级
- **80-100分**: 优秀 (绿色)
- **60-79分**: 良好 (蓝色)
- **40-59分**: 一般 (黄色)
- **0-39分**: 较差 (红色)

## 🆕 静态资源配置

### 添加新的静态资源

在 `static-cdn-manager.js` 中修改 `cdnConfigs` 对象：

```javascript
this.cdnConfigs = {
  // 添加新的CSS资源
  'my-css': {
    name: 'My CSS',
    type: 'css',
    sources: [
      'https://cdn1.example.com/my.css',
      'https://cdn2.example.com/my.css'
    ]
  },
  // 添加新的JS资源
  'my-js': {
    name: 'My JS',
    type: 'js',
    sources: [
      'https://cdn1.example.com/my.js',
      'https://cdn2.example.com/my.js'
    ]
  }
};
```

### 支持的资源类型
- **css**: CSS样式文件
- **js**: JavaScript文件

## 配置说明

### 添加新的CDN源

在 `cdn-manager.js` 中修改 `cdnSources` 数组：

```javascript
this.cdnSources = [
  'https://cdn.bootcdn.net/twemoji/14.0.2/72x72/',
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/',
  // 添加新的CDN源
  'https://your-new-cdn.com/twemoji/14.0.2/72x72/'
];
```

### 修改评分权重

在 `calculateScore` 方法中调整权重：

```javascript
// 1. 可靠性权重 40%
score += reliabilityScore * 0.4;

// 2. 最近表现权重 30%
score += recentSuccessRate * 100 * 0.3 * recentWeight;

// 3. 响应时间权重 20%
score += responseTimeScore * 0.2;

// 4. 稳定性权重 10%
score += stabilityScore * 0.1;
```

### 修改超时时间

```javascript
const timeout = setTimeout(() => {
  // 超时处理
}, 3000); // 修改这里的毫秒数
```

## 故障排除

### 1. 所有CDN源都不可用
- 检查网络连接
- 查看浏览器控制台错误信息
- 尝试手动访问CDN源

### 2. 图片仍然无法加载
- 确认emojiCode格式正确
- 检查CDN源是否支持该emoji
- 查看网络请求是否被阻止

### 3. 静态资源加载失败
- 检查资源URL是否正确
- 确认CDN源支持该资源类型
- 查看浏览器网络面板

### 4. 测试页面无法访问
- 确认测试文件存在
- 检查文件路径是否正确
- 查看浏览器控制台错误

### 5. 历史记录异常
- 清除浏览器localStorage
- 重新测试所有CDN源
- 检查localStorage是否被禁用

## 性能优化

1. **智能缓存**: 基于历史记录智能选择最佳CDN源
2. **并行测试**: 同时测试多个CDN源，提高效率
3. **超时控制**: 避免长时间等待不可用的CDN源
4. **懒加载**: 图片使用lazy loading，减少初始加载时间
5. **历史优化**: 使用加权平均计算响应时间，新数据权重更高
6. **资源预加载**: 静态资源按需加载，减少初始页面大小

## 更新日志

- **v3.0.0**: 新增静态资源CDN管理功能
  - 支持Bootstrap、Vue.js等静态资源的智能CDN管理
  - 动态加载CSS和JS文件
  - 独立的静态资源CDN管理器
  - 静态资源CDN测试页面
- **v2.0.0**: 新增智能选择和历史记录功能
  - 基于综合评价的智能CDN选择算法
  - 详细的历史记录和统计信息
  - 响应时间监控和优化
  - 增强的测试页面和状态监控
- **v1.0.0**: 初始版本，支持多CDN源和自动测试
  - 支持localStorage缓存
  - 添加错误处理和占位符显示
  - 提供测试页面和状态监控 