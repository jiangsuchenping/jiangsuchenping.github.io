/**
 * 智能静态资源管理器
 * 支持多个CDN源和本地资源回退
 */
class SmartResourceManager {
  constructor() {
    // 资源配置
    this.resources = {
      'bootstrap-css': {
        name: 'Bootstrap CSS',
        type: 'css',
        cdnSources: [
          'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css',
          'https://unpkg.com/bootstrap@5.3.0/dist/css/bootstrap.min.css',
          'https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css'
        ],
        localPath: 'assets/css/bootstrap.min.css'
      },
      'bootstrap-icons': {
        name: 'Bootstrap Icons',
        type: 'css',
        cdnSources: [
          'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css',
          'https://unpkg.com/bootstrap-icons@1.10.0/font/bootstrap-icons.min.css',
          'https://cdn.bootcdn.net/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css'
        ],
        localPath: 'assets/css/bootstrap-icons.min.css'
      },
      'vue-js': {
        name: 'Vue.js',
        type: 'js',
        cdnSources: [
          'https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.global.min.js',
          'https://unpkg.com/vue@3.3.4/dist/vue.global.min.js',
          'https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.min.js'
        ],
        localPath: 'assets/js/vue.global.min.js'
      },
      'bootstrap-js': {
        name: 'Bootstrap JS',
        type: 'js',
        cdnSources: [
          'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js',
          'https://unpkg.com/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          'https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js'
        ],
        localPath: 'assets/js/bootstrap.bundle.min.js'
      }
    };

    // 性能历史记录
    this.performanceHistory = this.loadPerformanceHistory();
    
    // 当前使用的资源源
    this.currentSources = this.loadCurrentSources();
    
    // 测试状态
    this.testingStatus = {};
    
    // 初始化
    this.init();
  }

  /**
   * 初始化管理器
   */
  init() {
    console.log('智能资源管理器初始化...');
    
    // 为每个资源选择最佳源
    Object.keys(this.resources).forEach(resourceKey => {
      this.selectBestSource(resourceKey);
    });
  }

  /**
   * 加载性能历史记录
   */
  loadPerformanceHistory() {
    try {
      const history = localStorage.getItem('smartResourceHistory');
      return history ? JSON.parse(history) : {};
    } catch (error) {
      console.warn('加载性能历史记录失败:', error);
      return {};
    }
  }

  /**
   * 保存性能历史记录
   */
  savePerformanceHistory() {
    try {
      localStorage.setItem('smartResourceHistory', JSON.stringify(this.performanceHistory));
    } catch (error) {
      console.warn('保存性能历史记录失败:', error);
    }
  }

  /**
   * 加载当前使用的资源源
   */
  loadCurrentSources() {
    try {
      const sources = localStorage.getItem('smartResourceCurrentSources');
      return sources ? JSON.parse(sources) : {};
    } catch (error) {
      console.warn('加载当前资源源失败:', error);
      return {};
    }
  }

  /**
   * 保存当前使用的资源源
   */
  saveCurrentSources() {
    try {
      localStorage.setItem('smartResourceCurrentSources', JSON.stringify(this.currentSources));
    } catch (error) {
      console.warn('保存当前资源源失败:', error);
    }
  }

  /**
   * 更新性能历史记录
   */
  updatePerformanceHistory(resourceKey, sourceUrl, isWorking, responseTime) {
    if (!this.performanceHistory[resourceKey]) {
      this.performanceHistory[resourceKey] = {};
    }

    if (!this.performanceHistory[resourceKey][sourceUrl]) {
      this.performanceHistory[resourceKey][sourceUrl] = {
        tests: 0,
        successes: 0,
        failures: 0,
        totalResponseTime: 0,
        averageResponseTime: 0,
        lastTestTime: 0,
        consecutiveSuccesses: 0,
        consecutiveFailures: 0
      };
    }

    const record = this.performanceHistory[resourceKey][sourceUrl];
    record.tests++;
    record.lastTestTime = Date.now();

    if (isWorking) {
      record.successes++;
      record.consecutiveSuccesses++;
      record.consecutiveFailures = 0;
      if (responseTime) {
        record.totalResponseTime += responseTime;
        record.averageResponseTime = record.totalResponseTime / record.successes;
      }
    } else {
      record.failures++;
      record.consecutiveFailures++;
      record.consecutiveSuccesses = 0;
    }

    this.savePerformanceHistory();
  }

  /**
   * 计算资源源的评分
   */
  calculateScore(resourceKey, sourceUrl) {
    const record = this.performanceHistory[resourceKey]?.[sourceUrl];
    if (!record || record.tests === 0) {
      return 50; // 默认评分
    }

    const reliability = (record.successes / record.tests) * 100;
    const recentPerformance = record.consecutiveSuccesses * 10;
    const responseTimeScore = record.averageResponseTime > 0 ? 
      Math.max(0, 100 - (record.averageResponseTime / 10)) : 50;
    const stability = Math.max(0, 100 - (record.consecutiveFailures * 20));

    // 加权评分
    const score = (
      reliability * 0.4 +           // 可靠性 40%
      recentPerformance * 0.3 +     // 最近表现 30%
      responseTimeScore * 0.2 +     // 响应时间 20%
      stability * 0.1               // 稳定性 10%
    );

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 选择最佳资源源
   */
  selectBestSource(resourceKey) {
    const resource = this.resources[resourceKey];
    if (!resource) return;

    let bestSource = null;
    let bestScore = -1;

    // 首先检查CDN源
    for (const cdnUrl of resource.cdnSources) {
      const score = this.calculateScore(resourceKey, cdnUrl);
      if (score > bestScore) {
        bestScore = score;
        bestSource = cdnUrl;
      }
    }

    // 如果所有CDN源评分都很低，使用本地资源
    if (bestScore < 30) {
      bestSource = resource.localPath;
      console.log(`${resource.name} 使用本地资源 (CDN评分过低)`);
    } else {
      console.log(`${resource.name} 使用最佳CDN: ${new URL(bestSource).hostname} (评分: ${bestScore.toFixed(1)})`);
    }

    this.currentSources[resourceKey] = bestSource;
    this.saveCurrentSources();
  }

  /**
   * 测试单个资源源
   */
  async testSource(resourceKey, sourceUrl) {
    const resource = this.resources[resourceKey];
    if (!resource) return { working: false, responseTime: 0 };

    return new Promise((resolve) => {
      const startTime = Date.now();
      let isWorking = false;
      let responseTime = 0;

      if (resource.type === 'css') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = sourceUrl;
        
        link.onload = () => {
          responseTime = Date.now() - startTime;
          isWorking = true;
          this.updatePerformanceHistory(resourceKey, sourceUrl, true, responseTime);
          resolve({ working: true, responseTime });
        };
        
        link.onerror = () => {
          responseTime = Date.now() - startTime;
          this.updatePerformanceHistory(resourceKey, sourceUrl, false, responseTime);
          resolve({ working: false, responseTime });
        };

        // 设置超时
        setTimeout(() => {
          if (!isWorking) {
            this.updatePerformanceHistory(resourceKey, sourceUrl, false, 5000);
            resolve({ working: false, responseTime: 5000 });
          }
        }, 5000);

        document.head.appendChild(link);
      } else if (resource.type === 'js') {
        const script = document.createElement('script');
        script.src = sourceUrl;
        
        script.onload = () => {
          responseTime = Date.now() - startTime;
          isWorking = true;
          this.updatePerformanceHistory(resourceKey, sourceUrl, true, responseTime);
          resolve({ working: true, responseTime });
        };
        
        script.onerror = () => {
          responseTime = Date.now() - startTime;
          this.updatePerformanceHistory(resourceKey, sourceUrl, false, responseTime);
          resolve({ working: false, responseTime });
        };

        // 设置超时
        setTimeout(() => {
          if (!isWorking) {
            this.updatePerformanceHistory(resourceKey, sourceUrl, false, 5000);
            resolve({ working: false, responseTime: 5000 });
          }
        }, 5000);

        document.head.appendChild(script);
      }
    });
  }

  /**
   * 测试所有资源源并选择最佳源
   */
  async testAllSources(resourceKey) {
    const resource = this.resources[resourceKey];
    if (!resource) return;

    console.log(`开始测试 ${resource.name} 的所有源...`);
    this.testingStatus[resourceKey] = true;

    const testResults = [];

    // 测试所有CDN源
    for (const cdnUrl of resource.cdnSources) {
      const result = await this.testSource(resourceKey, cdnUrl);
      testResults.push({ url: cdnUrl, ...result });
      console.log(`${new URL(cdnUrl).hostname}: ${result.working ? '✓' : '✗'} (${result.responseTime}ms)`);
    }

    // 测试本地资源
    const localResult = await this.testSource(resourceKey, resource.localPath);
    testResults.push({ url: resource.localPath, ...localResult });
    console.log(`本地资源: ${localResult.working ? '✓' : '✗'} (${localResult.responseTime}ms)`);

    // 选择最佳源
    this.selectBestSource(resourceKey);
    
    this.testingStatus[resourceKey] = false;
    console.log(`${resource.name} 测试完成，选择源: ${this.currentSources[resourceKey]}`);

    return testResults;
  }

  /**
   * 加载CSS资源
   */
  loadCSS(resourceKey) {
    const resource = this.resources[resourceKey];
    if (!resource || resource.type !== 'css') {
      console.error(`无效的CSS资源: ${resourceKey}`);
      return;
    }

    const sourceUrl = this.currentSources[resourceKey] || resource.cdnSources[0];
    
    // 移除已存在的相同资源
    const existingLinks = document.querySelectorAll(`link[href*="${resourceKey}"]`);
    existingLinks.forEach(link => link.remove());

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = sourceUrl;
    link.onerror = () => {
      console.warn(`${resource.name} 加载失败，尝试重新测试源...`);
      this.testAllSources(resourceKey).then(() => {
        this.loadCSS(resourceKey);
      });
    };
    
    document.head.appendChild(link);
    console.log(`加载CSS: ${resource.name} (${sourceUrl})`);
  }

  /**
   * 加载JS资源
   */
  loadJS(resourceKey) {
    const resource = this.resources[resourceKey];
    if (!resource || resource.type !== 'js') {
      console.error(`无效的JS资源: ${resourceKey}`);
      return;
    }

    const sourceUrl = this.currentSources[resourceKey] || resource.cdnSources[0];
    
    // 移除已存在的相同资源
    const existingScripts = document.querySelectorAll(`script[src*="${resourceKey}"]`);
    existingScripts.forEach(script => script.remove());

    const script = document.createElement('script');
    script.src = sourceUrl;
    script.onerror = () => {
      console.warn(`${resource.name} 加载失败，尝试重新测试源...`);
      this.testAllSources(resourceKey).then(() => {
        this.loadJS(resourceKey);
      });
    };
    
    document.head.appendChild(script);
    console.log(`加载JS: ${resource.name} (${sourceUrl})`);
  }

  /**
   * 获取资源信息
   */
  getResourceInfo(resourceKey) {
    const resource = this.resources[resourceKey];
    if (!resource) return null;

    const currentSource = this.currentSources[resourceKey];
    const history = this.performanceHistory[resourceKey] || {};
    
    return {
      name: resource.name,
      type: resource.type,
      currentSource,
      isLocal: currentSource === resource.localPath,
      history,
      score: currentSource ? this.calculateScore(resourceKey, currentSource) : 0,
      isTesting: this.testingStatus[resourceKey] || false
    };
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const stats = {
      totalResources: Object.keys(this.resources).length,
      localResources: 0,
      cdnResources: 0,
      averageScore: 0,
      totalScore: 0
    };

    Object.keys(this.resources).forEach(resourceKey => {
      const info = this.getResourceInfo(resourceKey);
      if (info) {
        if (info.isLocal) {
          stats.localResources++;
        } else {
          stats.cdnResources++;
        }
        stats.totalScore += info.score;
      }
    });

    stats.averageScore = stats.totalResources > 0 ? stats.totalScore / stats.totalResources : 0;
    return stats;
  }

  /**
   * 清除历史记录
   */
  clearHistory() {
    this.performanceHistory = {};
    this.currentSources = {};
    localStorage.removeItem('smartResourceHistory');
    localStorage.removeItem('smartResourceCurrentSources');
    console.log('历史记录已清除');
  }
}

// 创建全局实例
window.smartResourceManager = new SmartResourceManager(); 