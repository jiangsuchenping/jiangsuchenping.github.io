/**
 * SmartResourceManager.js
 * 智能资源管理器，用于优化资源加载、提供CDN回退机制和离线访问支持
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

(function() {
    /**
     * SmartResourceManager类
     * 提供资源管理、CDN回退、离线访问等功能
     */
    class SmartResourceManager {
        /**
         * 构造函数
         * @param {Object} options - 配置选项
         * @param {string} options.cdn - 主CDN地址
         * @param {string} options.fallbackCDN - 备用CDN地址
         * @param {string} options.serviceWorker - Service Worker文件路径
         * @param {Object} options.resourceMap - 资源映射表
         */
        constructor(options = {}) {
            this.options = Object.assign({
                cdn: '',
                fallbackCDN: '',
                serviceWorker: '../tools-sw.js',
                resourceMap: {}
            }, options);
            
            this.networkStatus = navigator.onLine;
            this.init();
        }
        
        /**
         * 初始化资源管理器
         */
        init() {
            // 监听网络状态变化
            this._setupNetworkListener();
            
            // 注册Service Worker
            this._registerServiceWorker();
        }
        
        /**
         * 设置网络状态监听
         * @private
         */
        _setupNetworkListener() {
            window.addEventListener('online', () => {
                this.networkStatus = true;
                console.log('网络已连接');
            });
            
            window.addEventListener('offline', () => {
                this.networkStatus = false;
                console.log('网络已断开');
            });
        }
        
        /**
         * 注册Service Worker
         * @private
         */
        _registerServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register(this.options.serviceWorker)
                    .then(registration => {
                        console.log('Service Worker 注册成功:', registration.scope);
                    })
                    .catch(error => {
                        console.error('Service Worker 注册失败:', error);
                    });
            }
        }
        
        /**
         * 加载脚本资源
         * @param {string} src - 脚本路径
         * @param {boolean} async - 是否异步加载
         * @param {Function} callback - 加载完成回调函数
         * @returns {HTMLScriptElement} 脚本元素
         */
        loadScript(src, async = true, callback = null) {
            const mappedSrc = this._getMappedResource(src);
            const script = document.createElement('script');
            script.src = mappedSrc;
            script.async = async;
            
            if (callback) {
                script.onload = callback;
                script.onerror = () => {
                    console.warn(`脚本加载失败: ${mappedSrc}，尝试使用备用CDN`);
                    this._loadFromFallback(src, 'script', callback);
                };
            }
            
            document.head.appendChild(script);
            return script;
        }
        
        /**
         * 加载样式资源
         * @param {string} href - 样式路径
         * @param {Function} callback - 加载完成回调函数
         * @returns {HTMLLinkElement} 链接元素
         */
        loadStyle(href, callback = null) {
            const mappedHref = this._getMappedResource(href);
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = mappedHref;
            
            if (callback) {
                link.onload = callback;
                link.onerror = () => {
                    console.warn(`样式加载失败: ${mappedHref}，尝试使用备用CDN`);
                    this._loadFromFallback(href, 'style', callback);
                };
            }
            
            document.head.appendChild(link);
            return link;
        }
        
        /**
         * 预加载资源
         * @param {Array<string>} resources - 资源路径数组
         */
        preload(resources) {
            if (!Array.isArray(resources)) return;
            
            resources.forEach(resource => {
                const mappedResource = this._getMappedResource(resource);
                const link = document.createElement('link');
                link.rel = 'preload';
                
                // 根据资源类型设置as属性
                if (resource.endsWith('.js')) {
                    link.as = 'script';
                } else if (resource.endsWith('.css')) {
                    link.as = 'style';
                } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(resource)) {
                    link.as = 'image';
                } else if (/\.(woff|woff2|ttf|otf|eot)$/i.test(resource)) {
                    link.as = 'font';
                }
                
                link.href = mappedResource;
                document.head.appendChild(link);
            });
        }
        
        /**
         * 获取映射后的资源路径
         * @param {string} resource - 原始资源路径
         * @returns {string} 映射后的资源路径
         * @private
         */
        _getMappedResource(resource) {
            // 如果资源在映射表中存在，使用映射后的路径
            const mappedResource = this.options.resourceMap[resource] || resource;
            
            // 如果是完整URL，直接返回
            if (mappedResource.startsWith('http://') || mappedResource.startsWith('https://')) {
                return mappedResource;
            }
            
            // 如果有CDN配置且网络在线，使用CDN路径
            if (this.options.cdn && this.networkStatus) {
                return `${this.options.cdn}/${mappedResource}`;
            }
            
            return mappedResource;
        }
        
        /**
         * 从备用CDN加载资源
         * @param {string} resource - 资源路径
         * @param {string} type - 资源类型 (script|style)
         * @param {Function} callback - 加载完成回调函数
         * @private
         */
        _loadFromFallback(resource, type, callback) {
            if (!this.options.fallbackCDN) return;
            
            const mappedResource = this.options.resourceMap[resource] || resource;
            const fallbackUrl = `${this.options.fallbackCDN}/${mappedResource}`;
            
            if (type === 'script') {
                const script = document.createElement('script');
                script.src = fallbackUrl;
                script.async = true;
                script.onload = callback;
                document.head.appendChild(script);
            } else if (type === 'style') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = fallbackUrl;
                link.onload = callback;
                document.head.appendChild(link);
            }
        }
    }
    
    /**
     * 静态配置方法
     * @param {Object} options - 配置选项
     * @returns {SmartResourceManager} 资源管理器实例
     */
    SmartResourceManager.config = function(options) {
        window._smartResourceManager = new SmartResourceManager(options);
        return window._smartResourceManager;
    };
    
    /**
     * 静态加载脚本方法
     * @param {string} src - 脚本路径
     * @param {boolean} async - 是否异步加载
     * @param {Function} callback - 加载完成回调函数
     * @returns {HTMLScriptElement} 脚本元素
     */
    SmartResourceManager.loadScript = function(src, async = true, callback = null) {
        if (!window._smartResourceManager) {
            window._smartResourceManager = new SmartResourceManager();
        }
        return window._smartResourceManager.loadScript(src, async, callback);
    };
    
    /**
     * 静态加载样式方法
     * @param {string} href - 样式路径
     * @param {Function} callback - 加载完成回调函数
     * @returns {HTMLLinkElement} 链接元素
     */
    SmartResourceManager.loadStyles = function(href, callback = null) {
        if (!window._smartResourceManager) {
            window._smartResourceManager = new SmartResourceManager();
        }
        return window._smartResourceManager.loadStyle(href, callback);
    };
    
    /**
     * 静态预加载方法
     * @param {Array<string>} resources - 资源路径数组
     */
    SmartResourceManager.preload = function(resources) {
        if (!window._smartResourceManager) {
            window._smartResourceManager = new SmartResourceManager();
        }
        window._smartResourceManager.preload(resources);
    };
    
    // 将SmartResourceManager暴露到全局
    window.SmartResourceManager = SmartResourceManager;
})();