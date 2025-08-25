/**
 * CDN管理器
 * 用于管理静态资源的加载，优先使用CDN，本地资源作为备用
 */

class CDNManager {
  /**
   * 已加载的资源缓存
   * @type {Object}
   */
  static loadedResources = {};

  /**
   * 加载CSS资源
   * @param {string} id - 资源唯一标识符
   * @param {string} localPath - 本地CSS文件路径
   * @param {string} cdnPath - CDN上的CSS文件路径
   * @returns {Promise} - 加载完成的Promise
   */
  static loadCSS(id, localPath, cdnPath) {
    // 如果已经加载过，直接返回
    if (this.loadedResources[id]) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = id;

      // 优先使用CDN路径
      link.href = cdnPath;

      // 监听加载事件
      link.onload = () => {
        this.loadedResources[id] = true;
        resolve();
      };

      // 监听错误事件，如果CDN加载失败，使用本地资源
      link.onerror = () => {
        console.warn(`CDN资源加载失败: ${cdnPath}，使用本地资源: ${localPath}`);
        link.href = localPath;
        link.onload = () => {
          this.loadedResources[id] = true;
          resolve();
        };
        link.onerror = () => {
          reject(new Error(`无法加载CSS资源: ${id}`));
        };
      };

      document.head.appendChild(link);
    });
  }

  /**
   * 加载JavaScript资源
   * @param {string} id - 资源唯一标识符
   * @param {string} localPath - 本地JS文件路径
   * @param {string} cdnPath - CDN上的JS文件路径
   * @returns {Promise} - 加载完成的Promise
   */
  static loadScript(id, localPath, cdnPath) {
    // 如果已经加载过，直接返回
    if (this.loadedResources[id]) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = id;

      // 优先使用CDN路径
      script.src = cdnPath;

      // 监听加载事件
      script.onload = () => {
        this.loadedResources[id] = true;
        resolve();
      };

      // 监听错误事件，如果CDN加载失败，使用本地资源
      script.onerror = () => {
        console.warn(`CDN资源加载失败: ${cdnPath}，使用本地资源: ${localPath}`);
        script.src = localPath;
        script.onload = () => {
          this.loadedResources[id] = true;
          resolve();
        };
        script.onerror = () => {
          reject(new Error(`无法加载JS资源: ${id}`));
        };
      };

      document.head.appendChild(script);
    });
  }

  /**
   * 预加载常用资源
   */
  static preloadCommonResources() {
    // 预加载Bootstrap CSS
    this.loadCSS('bootstrap', '../assets/css/bootstrap.min.css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
    
    // 预加载Bootstrap图标
    this.loadCSS('bootstrap-icons', '../assets/css/bootstrap-icons.min.css', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.min.css');
    
    // 预加载Vue.js
    this.loadScript('vue', '../assets/js/vue.global.min.js', 'https://cdn.jsdelivr.net/npm/vue@3.2.36/dist/vue.global.min.js');
  }
}

// 页面加载完成后自动预加载常用资源
document.addEventListener('DOMContentLoaded', () => {
  CDNManager.preloadCommonResources();
});