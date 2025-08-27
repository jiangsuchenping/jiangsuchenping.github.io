/**
 * 简化版智能静态资源管理器
 * 优化加载性能，减少不必要的CDN测试
 */
class SmartResourceManager {
  constructor() {
    // 资源配置 - 使用最可靠的CDN源
    this.resources = {
      'bootstrap-css': {
        name: 'Bootstrap CSS',
        type: 'css',
        primarySource: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        fallbackSource: 'assets/css/bootstrap.min.css'
      },
      'bootstrap-icons': {
        name: 'Bootstrap Icons',
        type: 'css',
        primarySource: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.min.css',
        fallbackSource: 'assets/css/bootstrap-icons.min.css'
      },
      'vue-js': {
        name: 'Vue.js',
        type: 'js',
        primarySource: 'https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.min.js',
        fallbackSource: 'assets/js/vue.global.min.js'
      },
      'bootstrap-js': {
        name: 'Bootstrap JS',
        type: 'js',
        primarySource: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
        fallbackSource: 'assets/js/bootstrap.bundle.min.js'
      }
    };

    // 加载状态跟踪
    this.loadedResources = new Set();
    this.loadingPromises = new Map();
  }

  /**
   * 加载CSS资源
   * @param {string} resourceKey 资源键名
   * @returns {Promise} 加载Promise
   */
  async loadCSS(resourceKey) {
    if (this.loadedResources.has(resourceKey)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(resourceKey)) {
      return this.loadingPromises.get(resourceKey);
    }

    const resource = this.resources[resourceKey];
    if (!resource || resource.type !== 'css') {
      return Promise.reject(new Error(`CSS资源 ${resourceKey} 不存在`));
    }

    const loadPromise = this._loadCSSFile(resource, resourceKey);
    this.loadingPromises.set(resourceKey, loadPromise);
    
    return loadPromise;
  }

  /**
   * 加载JS资源
   * @param {string} resourceKey 资源键名
   * @returns {Promise} 加载Promise
   */
  async loadJS(resourceKey) {
    if (this.loadedResources.has(resourceKey)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(resourceKey)) {
      return this.loadingPromises.get(resourceKey);
    }

    const resource = this.resources[resourceKey];
    if (!resource || resource.type !== 'js') {
      return Promise.reject(new Error(`JS资源 ${resourceKey} 不存在`));
    }

    const loadPromise = this._loadJSFile(resource, resourceKey);
    this.loadingPromises.set(resourceKey, loadPromise);
    
    return loadPromise;
  }

  /**
   * 内部方法：加载CSS文件
   * @private
   */
  _loadCSSFile(resource, resourceKey) {
    return new Promise((resolve, reject) => {
      // 检查是否已经存在相同的link标签
      const existingLink = document.querySelector(`link[data-resource="${resourceKey}"]`);
      if (existingLink) {
        this.loadedResources.add(resourceKey);
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('data-resource', resourceKey);
      
      const timeout = setTimeout(() => {
        console.warn(`CSS资源 ${resource.name} 加载超时，尝试本地资源`);
        this._loadLocalCSS(resource, resourceKey, resolve, reject);
      }, 5000);

      link.onload = () => {
        clearTimeout(timeout);
        this.loadedResources.add(resourceKey);
        console.log(`CSS资源 ${resource.name} 加载成功`);
        resolve();
      };

      link.onerror = () => {
        clearTimeout(timeout);
        console.warn(`CSS资源 ${resource.name} CDN加载失败，尝试本地资源`);
        this._loadLocalCSS(resource, resourceKey, resolve, reject);
      };

      link.href = resource.primarySource;
      document.head.appendChild(link);
    });
  }

  /**
   * 内部方法：加载本地CSS文件
   * @private
   */
  _loadLocalCSS(resource, resourceKey, resolve, reject) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = resource.fallbackSource;
    link.setAttribute('data-resource', `${resourceKey}-local`);
    
    link.onload = () => {
      this.loadedResources.add(resourceKey);
      console.log(`本地CSS资源 ${resource.name} 加载成功`);
      resolve();
    };

    link.onerror = () => {
      console.error(`本地CSS资源 ${resource.name} 加载失败`);
      reject(new Error(`CSS资源 ${resource.name} 加载失败`));
    };

    document.head.appendChild(link);
  }

  /**
   * 内部方法：加载JS文件
   * @private
   */
  _loadJSFile(resource, resourceKey) {
    return new Promise((resolve, reject) => {
      // 检查是否已经存在相同的script标签
      const existingScript = document.querySelector(`script[data-resource="${resourceKey}"]`);
      if (existingScript) {
        this.loadedResources.add(resourceKey);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.setAttribute('data-resource', resourceKey);
      
      const timeout = setTimeout(() => {
        console.warn(`JS资源 ${resource.name} 加载超时，尝试本地资源`);
        this._loadLocalJS(resource, resourceKey, resolve, reject);
      }, 8000);

      script.onload = () => {
        clearTimeout(timeout);
        this.loadedResources.add(resourceKey);
        console.log(`JS资源 ${resource.name} 加载成功`);
        resolve();
      };

      script.onerror = () => {
        clearTimeout(timeout);
        console.warn(`JS资源 ${resource.name} CDN加载失败，尝试本地资源`);
        this._loadLocalJS(resource, resourceKey, resolve, reject);
      };

      script.src = resource.primarySource;
      document.head.appendChild(script);
    });
  }

  /**
   * 内部方法：加载本地JS文件
   * @private
   */
  _loadLocalJS(resource, resourceKey, resolve, reject) {
    const script = document.createElement('script');
    script.src = resource.fallbackSource;
    script.setAttribute('data-resource', `${resourceKey}-local`);
    
    script.onload = () => {
      this.loadedResources.add(resourceKey);
      console.log(`本地JS资源 ${resource.name} 加载成功`);
      resolve();
    };

    script.onerror = () => {
      console.error(`本地JS资源 ${resource.name} 加载失败`);
      reject(new Error(`JS资源 ${resource.name} 加载失败`));
    };

    document.head.appendChild(script);
  }

  /**
   * 批量加载资源
   * @param {Array} resourceKeys 资源键名数组
   * @returns {Promise} 加载Promise
   */
  async loadResources(resourceKeys) {
    const promises = resourceKeys.map(key => {
      const resource = this.resources[key];
      if (!resource) return Promise.resolve();
      
      return resource.type === 'css' ? this.loadCSS(key) : this.loadJS(key);
    });

    return Promise.allSettled(promises);
  }

  /**
   * 获取资源加载状态
   * @param {string} resourceKey 资源键名
   * @returns {boolean} 是否已加载
   */
  isLoaded(resourceKey) {
    return this.loadedResources.has(resourceKey);
  }
}

// 创建全局实例
window.smartResourceManager = new SmartResourceManager();

// 导出类（如果需要模块化使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartResourceManager;
}