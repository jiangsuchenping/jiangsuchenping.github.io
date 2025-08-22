/**
 * CDN管理器 - 管理多个国内CDN源
 * 自动测试CDN可用性并记录最后成功的源
 * 支持历史可用状况记录和智能选择
 */
class CDNManager {
  constructor() {
    // 多个国内CDN源
    this.cdnSources = [
      'https://cdn.bootcdn.net/twemoji/14.0.2/72x72/',
      'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/',
      'https://cdn.staticfile.org/twemoji/14.0.2/72x72/',
      'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
      'https://unpkg.com/twemoji@14.0.2/dist/72x72/'
    ];
    
    // 从localStorage获取历史记录
    this.history = this.loadHistory();
    
    // 当前使用的CDN源
    this.currentCDN = this.selectBestCDN();
    
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
      const saved = localStorage.getItem('cdnHistory');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('加载CDN历史记录失败:', error);
      return {};
    }
  }
  
  /**
   * 保存历史记录
   */
  saveHistory() {
    try {
      localStorage.setItem('cdnHistory', JSON.stringify(this.history));
    } catch (error) {
      console.warn('保存CDN历史记录失败:', error);
    }
  }
  
  /**
   * 更新CDN源的历史记录
   */
  updateHistory(cdnUrl, isWorking, responseTime = null) {
    if (!this.history[cdnUrl]) {
      this.history[cdnUrl] = {
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
    
    const record = this.history[cdnUrl];
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
  calculateScore(cdnUrl) {
    const record = this.history[cdnUrl];
    if (!record || record.totalTests === 0) {
      return 50; // 默认中等分数
    }
    
    let score = 0;
    
    // 1. 可靠性权重 40%
    const reliabilityScore = record.reliability;
    score += reliabilityScore * 0.4;
    
    // 2. 最近表现权重 30%
    const recentWeight = Math.min(record.totalTests, 10) / 10; // 最近10次测试的权重
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
  selectBestCDN() {
    let bestCDN = this.cdnSources[0];
    let bestScore = 0;
    
    // 计算每个CDN源的评分
    const scores = {};
    for (const cdnUrl of this.cdnSources) {
      const score = this.calculateScore(cdnUrl);
      scores[cdnUrl] = score;
      
      if (score > bestScore) {
        bestScore = score;
        bestCDN = cdnUrl;
      }
    }
    
    console.log('CDN源评分:', scores);
    console.log('选择最佳CDN源:', bestCDN, '评分:', bestScore);
    
    return bestCDN;
  }
  
  /**
   * 初始化CDN管理器
   */
  async init() {
    // 先测试当前选择的最佳CDN源
    const isWorking = await this.testCDN(this.currentCDN);
    if (isWorking) {
      console.log('使用智能选择的最佳CDN源:', this.currentCDN);
      return;
    }
    
    // 如果最佳CDN源不可用，测试所有CDN源
    await this.findWorkingCDN();
  }
  
  /**
   * 测试单个CDN源
   */
  async testCDN(cdnUrl) {
    if (this.testResults.has(cdnUrl)) {
      return this.testResults.get(cdnUrl);
    }
    
    return new Promise((resolve) => {
      const testImage = new Image();
      const testEmoji = '1f34e'; // 苹果emoji
      const testUrl = cdnUrl + testEmoji + '.png';
      const startTime = Date.now();
      
      const timeout = setTimeout(() => {
        testImage.onload = null;
        testImage.onerror = null;
        const responseTime = Date.now() - startTime;
        this.testResults.set(cdnUrl, false);
        this.updateHistory(cdnUrl, false, responseTime);
        resolve(false);
      }, 3000); // 3秒超时
      
      testImage.onload = () => {
        clearTimeout(timeout);
        const responseTime = Date.now() - startTime;
        this.testResults.set(cdnUrl, true);
        this.updateHistory(cdnUrl, true, responseTime);
        resolve(true);
      };
      
      testImage.onerror = () => {
        clearTimeout(timeout);
        const responseTime = Date.now() - startTime;
        this.testResults.set(cdnUrl, false);
        this.updateHistory(cdnUrl, false, responseTime);
        resolve(false);
      };
      
      testImage.src = testUrl;
    });
  }
  
  /**
   * 查找可用的CDN源
   */
  async findWorkingCDN() {
    if (this.isTesting) return;
    
    this.isTesting = true;
    console.log('开始测试CDN源...');
    
    // 并行测试所有CDN源
    const testPromises = this.cdnSources.map(async (cdnUrl) => {
      const isWorking = await this.testCDN(cdnUrl);
      return { cdnUrl, isWorking };
    });
    
    const results = await Promise.all(testPromises);
    
    // 找到可用的CDN源，按评分排序
    const workingCDNs = results
      .filter(result => result.isWorking)
      .map(result => ({
        cdnUrl: result.cdnUrl,
        score: this.calculateScore(result.cdnUrl)
      }))
      .sort((a, b) => b.score - a.score);
    
    if (workingCDNs.length > 0) {
      this.currentCDN = workingCDNs[0].cdnUrl;
      console.log('选择评分最高的可用CDN源:', this.currentCDN, '评分:', workingCDNs[0].score);
    } else {
      console.warn('所有CDN源都不可用，使用默认源');
      this.currentCDN = this.cdnSources[0];
    }
    
    this.isTesting = false;
  }
  
  /**
   * 获取完整的图片URL
   */
  getImageUrl(emojiCode) {
    return this.currentCDN + emojiCode + '.png';
  }
  
  /**
   * 获取当前使用的CDN源
   */
  getCurrentCDN() {
    return this.currentCDN;
  }
  
  /**
   * 获取CDN源的历史记录
   */
  getHistory() {
    return this.history;
  }
  
  /**
   * 获取CDN源的详细信息
   */
  getCDNInfo(cdnUrl) {
    const record = this.history[cdnUrl];
    if (!record) {
      return {
        cdnUrl,
        score: 50,
        reliability: 0,
        totalTests: 0,
        averageResponseTime: null,
        status: '未测试'
      };
    }
    
    return {
      cdnUrl,
      score: this.calculateScore(cdnUrl),
      reliability: record.reliability,
      totalTests: record.totalTests,
      successfulTests: record.successfulTests,
      averageResponseTime: record.averageResponseTime,
      consecutiveSuccesses: record.consecutiveSuccesses,
      consecutiveFailures: record.consecutiveFailures,
      lastTestTime: record.lastTestTime,
      lastSuccessTime: record.lastSuccessTime,
      lastFailureTime: record.lastFailureTime,
      status: record.lastSuccessTime > record.lastFailureTime ? '可用' : '不可用'
    };
  }
  
  /**
   * 获取所有CDN源的详细信息
   */
  getAllCDNInfo() {
    return this.cdnSources.map(cdnUrl => this.getCDNInfo(cdnUrl));
  }
  
  /**
   * 手动重新测试所有CDN源
   */
  async retestAll() {
    this.testResults.clear();
    await this.findWorkingCDN();
  }
  
  /**
   * 获取测试结果
   */
  getTestResults() {
    return this.testResults;
  }
  
  /**
   * 清除历史记录
   */
  clearHistory() {
    this.history = {};
    this.saveHistory();
    console.log('CDN历史记录已清除');
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
      testedCDNs: Object.keys(this.history).length,
      totalCDNs: this.cdnSources.length
    };
  }
}

// 创建全局CDN管理器实例
window.cdnManager = new CDNManager(); 