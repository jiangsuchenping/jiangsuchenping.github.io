/**
 * 静态资源CDN管理器 - 管理JS、CSS等静态文件的CDN源
 * 支持多种静态资源类型和智能选择
 */
class StaticCDNManager {
  constructor() {
    // 静态资源CDN源配置
    this.cdnConfigs = {
      // Bootstrap CSS
      'bootstrap-css': {
        name: 'Bootstrap CSS',
        type: 'css',
        sources: [
          'https://cdn.bootcdn.net/bootstrap/5.3.0/css/bootstrap.min.css',
          'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
          'https://cdn.staticfile.org/bootstrap/5.3.0/css/bootstrap.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css',
          'https://unpkg.com/bootstrap@5.3.0/dist/css/bootstrap.min.css'
        ]
      },
      // Bootstrap Icons CSS
      'bootstrap-icons': {
        name: 'Bootstrap Icons',
        type: 'css',
        sources: [
          'https://cdn.bootcdn.net/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css',
          'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.min.css',
          'https://cdn.staticfile.org/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css',
          'https://unpkg.com/bootstrap-icons@1.10.0/font/bootstrap-icons.min.css'
        ]
      },
      // Bootstrap JS
      'bootstrap-js': {
        name: 'Bootstrap JS',
        type: 'js',
        sources: [
          'https://cdn.bootcdn.net/bootstrap/5.3.0/js/bootstrap.bundle.min.js',
          'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          'https://cdn.staticfile.org/bootstrap/5.3.0/js/bootstrap.bundle.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js',
          'https://unpkg.com/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
        ]
      },
      // Vue.js
      'vue-js': {
        name: 'Vue.js',
        type: 'js',
        sources: [
          'https://cdn.bootcdn.net/vue/3.3.4/vue.global.min.js',
          'https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.min.js',
          'https://cdn.staticfile.org/vue/3.3.4/vue.global.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.global.min.js',
          'https://unpkg.com/vue@3.3.4/dist/vue.global.min.js'
        ]
      }
    };
    
    // 从localStorage获取历史记录
    this.history = this.loadHistory();
    
    // 当前使用的CDN源
    this.currentSources = this.loadCurrentSources();
    
    // 测试状态
    this.isTesting = false;
    this.testResults = new Map();
    
    // 初始化
    this.init();
  }
  
  /**
   * 加载历史记录
   */
  loadHistory() {
    try {
      const saved = localStorage.getItem('staticCDNHistory');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('加载静态资源CDN历史记录失败:', error);
      return {};
    }
  }
  
  /**
   * 保存历史记录
   */
  saveHistory() {
    try {
      localStorage.setItem('staticCDNHistory', JSON.stringify(this.history));
    } catch (error) {
      console.warn('保存静态资源CDN历史记录失败:', error);
    }
  }
  
  /**
   * 加载当前使用的CDN源
   */
  loadCurrentSources() {
    try {
      const saved = localStorage.getItem('staticCDNCurrentSources');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('加载当前CDN源失败:', error);
      return {};
    }
  }
  
  /**
   * 保存当前使用的CDN源
   */
  saveCurrentSources() {
    try {
      localStorage.setItem('staticCDNCurrentSources', JSON.stringify(this.currentSources));
    } catch (error) {
      console.warn('保存当前CDN源失败:', error);
    }
  }
  
  /**
   * 更新CDN源的历史记录
   */
  updateHistory(resourceKey, cdnUrl, isWorking, responseTime = null) {
    const recordKey = `${resourceKey}:${cdnUrl}`;
    
    if (!this.history[recordKey]) {
      this.history[recordKey] = {
        resourceKey,
        cdnUrl,
        totalTests: 0,
        successfulTests: 0,
        lastTestTime: null,
        lastSuccessTime: null,
        lastFailureTime: null,
        averageResponseTime: null,
        consecutiveFailures: 0,
        consecutiveSuccesses: 0,
        reliability: 0
      };
    }
    
    const record = this.history[recordKey];
    const now = Date.now();
    
    // 更新基本统计
    record.totalTests++;
    record.lastTestTime = now;
    
    if (isWorking) {
      record.successfulTests++;
      record.lastSuccessTime = now;
      record.consecutiveSuccesses++;
      record.consecutiveFailures = 0;
      
      // 更新响应时间
      if (responseTime !== null) {
        if (record.averageResponseTime === null) {
          record.averageResponseTime = responseTime;
        } else {
          // 使用加权平均，新数据权重更高
          record.averageResponseTime = record.averageResponseTime * 0.7 + responseTime * 0.3;
        }
      }
    } else {
      record.lastFailureTime = now;
      record.consecutiveFailures++;
      record.consecutiveSuccesses = 0;
    }
    
    // 计算可靠性分数 (0-100)
    record.reliability = (record.successfulTests / record.totalTests) * 100;
    
    // 保存历史记录
    this.saveHistory();
  }
  
  /**
   * 计算CDN源的综合评分
   */
  calculateScore(resourceKey, cdnUrl) {
    const recordKey = `${resourceKey}:${cdnUrl}`;
    const record = this.history[recordKey];
    
    if (!record || record.totalTests === 0) {
      return 50; // 默认中等分数
    }
    
    let score = 0;
    
    // 1. 可靠性权重 40%
    const reliabilityScore = record.reliability;
    score += reliabilityScore * 0.4;
    
    // 2. 最近表现权重 30%
    const recentWeight = Math.min(record.totalTests, 10) / 10;
    const recentSuccessRate = record.consecutiveSuccesses / Math.min(record.totalTests, 10);
    score += recentSuccessRate * 100 * 0.3 * recentWeight;
    
    // 3. 响应时间权重 20%
    let responseTimeScore = 100;
    if (record.averageResponseTime !== null) {
      // 响应时间越短分数越高，超过3秒开始扣分
      if (record.averageResponseTime > 3000) {
        responseTimeScore = Math.max(0, 100 - (record.averageResponseTime - 3000) / 100);
      }
    }
    score += responseTimeScore * 0.2;
    
    // 4. 稳定性权重 10%
    const stabilityScore = Math.max(0, 100 - record.consecutiveFailures * 10);
    score += stabilityScore * 0.1;
    
    return Math.round(score);
  }
  
  /**
   * 智能选择最佳CDN源
   */
  selectBestCDN(resourceKey) {
    const config = this.cdnConfigs[resourceKey];
    if (!config) {
      console.warn(`未找到资源配置: ${resourceKey}`);
      return null;
    }
    
    let bestCDN = config.sources[0];
    let bestScore = 0;
    
    // 计算每个CDN源的评分
    const scores = {};
    for (const cdnUrl of config.sources) {
      const score = this.calculateScore(resourceKey, cdnUrl);
      scores[cdnUrl] = score;
      
      if (score > bestScore) {
        bestScore = score;
        bestCDN = cdnUrl;
      }
    }
    
    console.log(`${resourceKey} CDN源评分:`, scores);
    console.log(`选择最佳CDN源:`, bestCDN, '评分:', bestScore);
    
    return bestCDN;
  }
  
  /**
   * 测试单个CDN源
   */
  async testCDN(resourceKey, cdnUrl) {
    const testKey = `${resourceKey}:${cdnUrl}`;
    if (this.testResults.has(testKey)) {
      return this.testResults.get(testKey);
    }
    
    return new Promise((resolve) => {
      const config = this.cdnConfigs[resourceKey];
      if (!config) {
        resolve(false);
        return;
      }
      
      const startTime = Date.now();
      
      if (config.type === 'css') {
        // 测试CSS文件
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cdnUrl;
        
        const timeout = setTimeout(() => {
          document.head.removeChild(link);
          const responseTime = Date.now() - startTime;
          this.testResults.set(testKey, false);
          this.updateHistory(resourceKey, cdnUrl, false, responseTime);
          resolve(false);
        }, 3000);
        
        link.onload = () => {
          clearTimeout(timeout);
          document.head.removeChild(link);
          const responseTime = Date.now() - startTime;
          this.testResults.set(testKey, true);
          this.updateHistory(resourceKey, cdnUrl, true, responseTime);
          resolve(true);
        };
        
        link.onerror = () => {
          clearTimeout(timeout);
          const responseTime = Date.now() - startTime;
          this.testResults.set(testKey, false);
          this.updateHistory(resourceKey, cdnUrl, false, responseTime);
          resolve(false);
        };
        
        document.head.appendChild(link);
      } else if (config.type === 'js') {
        // 测试JS文件
        const script = document.createElement('script');
        script.src = cdnUrl;
        
        const timeout = setTimeout(() => {
          document.head.removeChild(script);
          const responseTime = Date.now() - startTime;
          this.testResults.set(testKey, false);
          this.updateHistory(resourceKey, cdnUrl, false, responseTime);
          resolve(false);
        }, 3000);
        
        script.onload = () => {
          clearTimeout(timeout);
          document.head.removeChild(script);
          const responseTime = Date.now() - startTime;
          this.testResults.set(testKey, true);
          this.updateHistory(resourceKey, cdnUrl, true, responseTime);
          resolve(true);
        };
        
        script.onerror = () => {
          clearTimeout(timeout);
          const responseTime = Date.now() - startTime;
          this.testResults.set(testKey, false);
          this.updateHistory(resourceKey, cdnUrl, false, responseTime);
          resolve(false);
        };
        
        document.head.appendChild(script);
      }
    });
  }
  
  /**
   * 查找可用的CDN源
   */
  async findWorkingCDN(resourceKey) {
    if (this.isTesting) return;
    
    this.isTesting = true;
    console.log(`开始测试 ${resourceKey} CDN源...`);
    
    const config = this.cdnConfigs[resourceKey];
    if (!config) {
      console.warn(`未找到资源配置: ${resourceKey}`);
      this.isTesting = false;
      return;
    }
    
    // 并行测试所有CDN源
    const testPromises = config.sources.map(async (cdnUrl) => {
      const isWorking = await this.testCDN(resourceKey, cdnUrl);
      return { cdnUrl, isWorking };
    });
    
    const results = await Promise.all(testPromises);
    
    // 找到可用的CDN源，按评分排序
    const workingCDNs = results
      .filter(result => result.isWorking)
      .map(result => ({
        cdnUrl: result.cdnUrl,
        score: this.calculateScore(resourceKey, result.cdnUrl)
      }))
      .sort((a, b) => b.score - a.score);
    
    if (workingCDNs.length > 0) {
      this.currentSources[resourceKey] = workingCDNs[0].cdnUrl;
      this.saveCurrentSources();
      console.log(`选择评分最高的可用CDN源:`, workingCDNs[0].cdnUrl, '评分:', workingCDNs[0].score);
    } else {
      console.warn(`所有 ${resourceKey} CDN源都不可用，使用默认源`);
      this.currentSources[resourceKey] = config.sources[0];
      this.saveCurrentSources();
    }
    
    this.isTesting = false;
  }
  
  /**
   * 获取资源的最佳CDN URL
   */
  getBestCDNUrl(resourceKey) {
    // 如果已有当前源，先测试它
    if (this.currentSources[resourceKey]) {
      return this.currentSources[resourceKey];
    }
    
    // 否则选择最佳CDN源
    const bestCDN = this.selectBestCDN(resourceKey);
    if (bestCDN) {
      this.currentSources[resourceKey] = bestCDN;
      this.saveCurrentSources();
    }
    
    return bestCDN;
  }
  
  /**
   * 动态加载CSS文件
   */
  loadCSS(resourceKey) {
    const cdnUrl = this.getBestCDNUrl(resourceKey);
    if (!cdnUrl) return false;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cdnUrl;
    link.id = `cdn-${resourceKey}`;
    
    // 移除已存在的相同资源
    const existing = document.getElementById(`cdn-${resourceKey}`);
    if (existing) {
      document.head.removeChild(existing);
    }
    
    document.head.appendChild(link);
    return true;
  }
  
  /**
   * 动态加载JS文件
   */
  loadJS(resourceKey) {
    const cdnUrl = this.getBestCDNUrl(resourceKey);
    if (!cdnUrl) return false;
    
    const script = document.createElement('script');
    script.src = cdnUrl;
    script.id = `cdn-${resourceKey}`;
    
    // 移除已存在的相同资源
    const existing = document.getElementById(`cdn-${resourceKey}`);
    if (existing) {
      document.head.removeChild(existing);
    }
    
    document.head.appendChild(script);
    return true;
  }
  
  /**
   * 初始化CDN管理器
   */
  async init() {
    console.log('初始化静态资源CDN管理器...');
    
    // 为每个资源选择最佳CDN源
    for (const resourceKey of Object.keys(this.cdnConfigs)) {
      const bestCDN = this.selectBestCDN(resourceKey);
      if (bestCDN) {
        this.currentSources[resourceKey] = bestCDN;
      }
    }
    
    this.saveCurrentSources();
  }
  
  /**
   * 获取统计信息
   */
  getStats() {
    const totalTests = Object.values(this.history).reduce((sum, record) => sum + record.totalTests, 0);
    const totalSuccesses = Object.values(this.history).reduce((sum, record) => sum + record.successfulTests, 0);
    const overallReliability = totalTests > 0 ? (totalSuccesses / totalTests) * 100 : 0;
    
    return {
      totalTests,
      totalSuccesses,
      overallReliability: Math.round(overallReliability * 100) / 100,
      testedResources: Object.keys(this.cdnConfigs).length,
      totalResources: Object.keys(this.cdnConfigs).length
    };
  }
  
  /**
   * 获取资源信息
   */
  getResourceInfo(resourceKey) {
    const config = this.cdnConfigs[resourceKey];
    if (!config) return null;
    
    const currentCDN = this.currentSources[resourceKey];
    const scores = {};
    
    config.sources.forEach(cdnUrl => {
      scores[cdnUrl] = this.calculateScore(resourceKey, cdnUrl);
    });
    
    return {
      resourceKey,
      name: config.name,
      type: config.type,
      currentCDN,
      scores,
      sources: config.sources
    };
  }
  
  /**
   * 清除历史记录
   */
  clearHistory() {
    this.history = {};
    this.saveHistory();
    console.log('静态资源CDN历史记录已清除');
  }
}

// 创建全局静态资源CDN管理器实例
window.staticCDNManager = new StaticCDNManager(); 