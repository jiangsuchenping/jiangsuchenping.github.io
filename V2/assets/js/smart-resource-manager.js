/**
 * 智能资源管理器
 * 用于管理页面资源的加载和卸载，提高页面性能
 */

class SmartResourceManager {
  /**
   * 已加载的资源缓存
   * @type {Object}
   */
  static loadedResources = {};

  /**
   * 资源加载队列
   * @type {Array}
   */
  static loadQueue = [];

  /**
   * 资源加载优先级
   * @type {Object}
   */
  static priorities = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2
  };

  /**
   * 加载资源
   * @param {string} type - 资源类型 (css, script, image)
   * @param {string} url - 资源URL
   * @param {number} priority - 加载优先级
   * @param {Function} callback - 加载完成后的回调函数
   */
  static loadResource(type, url, priority = this.priorities.MEDIUM, callback = null) {
    // 如果资源已经加载，直接调用回调
    if (this.loadedResources[url]) {
      if (callback) callback();
      return;
    }

    // 添加到加载队列
    this.loadQueue.push({
      type,
      url,
      priority,
      callback
    });

    // 按优先级排序队列
    this.loadQueue.sort((a, b) => a.priority - b.priority);

    // 处理队列
    this.processQueue();
  }

  /**
   * 处理加载队列
   */
  static processQueue() {
    if (this.loadQueue.length === 0) return;

    // 获取队列中优先级最高的资源
    const resource = this.loadQueue.shift();

    // 根据资源类型加载
    switch (resource.type) {
      case 'css':
        this.loadCSS(resource.url, resource.callback);
        break;
      case 'script':
        this.loadScript(resource.url, resource.callback);
        break;
      case 'image':
        this.preloadImage(resource.url, resource.callback);
        break;
      default:
        console.warn(`不支持的资源类型: ${resource.type}`);
        if (resource.callback) resource.callback();
        this.processQueue();
    }
  }

  /**
   * 加载CSS资源
   * @param {string} url - CSS文件URL
   * @param {Function} callback - 加载完成后的回调函数
   */
  static loadCSS(url, callback = null) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    link.onload = () => {
      this.loadedResources[url] = true;
      if (callback) callback();
      this.processQueue();
    };

    link.onerror = () => {
      console.error(`无法加载CSS资源: ${url}`);
      if (callback) callback(new Error(`无法加载CSS资源: ${url}`));
      this.processQueue();
    };

    document.head.appendChild(link);
  }

  /**
   * 加载JavaScript资源
   * @param {string} url - JS文件URL
   * @param {Function} callback - 加载完成后的回调函数
   */
  static loadScript(url, callback = null) {
    const script = document.createElement('script');
    script.src = url;

    script.onload = () => {
      this.loadedResources[url] = true;
      if (callback) callback();
      this.processQueue();
    };

    script.onerror = () => {
      console.error(`无法加载JS资源: ${url}`);
      if (callback) callback(new Error(`无法加载JS资源: ${url}`));
      this.processQueue();
    };

    document.head.appendChild(script);
  }

  /**
   * 预加载图片
   * @param {string} url - 图片URL
   * @param {Function} callback - 加载完成后的回调函数
   */
  static preloadImage(url, callback = null) {
    const img = new Image();
    img.src = url;

    img.onload = () => {
      this.loadedResources[url] = true;
      if (callback) callback();
      this.processQueue();
    };

    img.onerror = () => {
      console.error(`无法加载图片资源: ${url}`);
      if (callback) callback(new Error(`无法加载图片资源: ${url}`));
      this.processQueue();
    };
  }

  /**
   * 卸载不需要的资源
   * @param {string} url - 资源URL
   */
  static unloadResource(url) {
    // 从已加载资源中移除
    if (this.loadedResources[url]) {
      delete this.loadedResources[url];

      // 移除DOM中的资源引用
      if (url.endsWith('.css')) {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        for (const link of links) {
          if (link.href.includes(url)) {
            link.remove();
            break;
          }
        }
      } else if (url.endsWith('.js')) {
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
          if (script.src.includes(url)) {
            script.remove();
            break;
          }
        }
      }
    }
  }

  /**
   * 预加载页面所需的所有资源
   * @param {Array} resources - 资源列表
   * @param {Function} callback - 所有资源加载完成后的回调函数
   */
  static preloadAll(resources, callback = null) {
    let loadedCount = 0;
    const totalCount = resources.length;

    // 如果没有资源需要加载，直接调用回调
    if (totalCount === 0) {
      if (callback) callback();
      return;
    }

    // 加载每个资源
    resources.forEach(resource => {
      this.loadResource(resource.type, resource.url, resource.priority, () => {
        loadedCount++;
        
        // 计算加载进度
        const progress = Math.floor((loadedCount / totalCount) * 100);
        
        // 触发进度事件
        const event = new CustomEvent('resourceLoadProgress', {
          detail: { progress, url: resource.url }
        });
        document.dispatchEvent(event);
        
        // 所有资源加载完成后调用回调
        if (loadedCount === totalCount && callback) {
          callback();
        }
      });
    });
  }

  /**
   * 根据页面需要智能加载资源
   */
  static smartLoad() {
    // 获取当前页面路径
    const path = window.location.pathname;
    
    // 根据页面路径加载特定资源
    if (path.includes('/chinese/')) {
      // 语文学习页面资源
      this.loadResource('css', '../css/chinese.css', this.priorities.HIGH);
      this.loadResource('script', '../js/chinese.js', this.priorities.MEDIUM);
    } else if (path.includes('/math/')) {
      // 数学学习页面资源
      this.loadResource('css', '../css/math.css', this.priorities.HIGH);
      this.loadResource('script', '../js/math.js', this.priorities.MEDIUM);
    } else if (path.includes('/english/')) {
      // 英语学习页面资源
      this.loadResource('css', '../css/english.css', this.priorities.HIGH);
      this.loadResource('script', '../js/english.js', this.priorities.MEDIUM);
    }
  }
}

// 页面加载完成后自动智能加载资源
document.addEventListener('DOMContentLoaded', () => {
  SmartResourceManager.smartLoad();
});