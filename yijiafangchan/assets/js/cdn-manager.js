/**
 * 智能CDN管理器
 * 自动检测最佳CDN源并优化资源加载
 */

class CDNManager {
    constructor() {
        this.cdnSources = {
            bootstrap: [
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css',
                'https://unpkg.com/bootstrap@5.3.0/dist/css/bootstrap.min.css'
            ],
            bootstrapJs: [
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js',
                'https://unpkg.com/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
            ],
            fontawesome: [
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
                'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
                'https://unpkg.com/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
            ],
            jquery: [
                'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js',
                'https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js',
                'https://unpkg.com/jquery@3.7.0/dist/jquery.min.js'
            ]
        };
        
        this.speedCache = new Map();
        this.failedSources = new Set();
        this.loadedResources = new Set();
        
        this.init();
    }
    
    /**
     * 初始化CDN管理器
     */
    init() {
        // 从localStorage加载缓存的速度测试结果
        this.loadCachedSpeeds();
        
        // 启动后台速度测试
        this.startBackgroundSpeedTest();
        
        console.log('[CDNManager] 智能CDN管理器初始化完成');
    }
    
    /**
     * 加载资源
     * @param {string} resourceType - 资源类型
     * @param {Function} callback - 加载完成回调
     */
    async loadResource(resourceType, callback = null) {
        if (this.loadedResources.has(resourceType)) {
            if (callback) callback();
            return;
        }
        
        const sources = this.cdnSources[resourceType];
        if (!sources) {
            console.warn(`[CDNManager] 未知资源类型: ${resourceType}`);
            return;
        }
        
        // 获取最佳CDN源
        const bestSource = await this.getBestSource(sources);
        
        try {
            await this.loadFromSource(bestSource, resourceType);
            this.loadedResources.add(resourceType);
            if (callback) callback();
        } catch (error) {
            console.warn(`[CDNManager] 主源加载失败，尝试备用源: ${error.message}`);
            await this.loadWithFallback(sources, resourceType, callback);
        }
    }
    
    /**
     * 获取最佳CDN源
     * @param {Array} sources - CDN源列表
     * @returns {string} 最佳CDN源URL
     */
    async getBestSource(sources) {
        // 过滤掉已知失败的源
        const availableSources = sources.filter(source => !this.failedSources.has(source));
        
        if (availableSources.length === 0) {
            // 如果所有源都失败了，清空失败列表重试
            this.failedSources.clear();
            return sources[0];
        }
        
        // 如果有缓存的速度数据，使用最快的源
        let bestSource = availableSources[0];
        let bestSpeed = Infinity;
        
        for (const source of availableSources) {
            const speed = this.speedCache.get(source);
            if (speed && speed < bestSpeed) {
                bestSpeed = speed;
                bestSource = source;
            }
        }
        
        return bestSource;
    }
    
    /**
     * 从指定源加载资源
     * @param {string} source - CDN源URL
     * @param {string} resourceType - 资源类型
     */
    loadFromSource(source, resourceType) {
        return new Promise((resolve, reject) => {
            const startTime = performance.now();
            
            if (source.endsWith('.css')) {
                // 加载CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = source;
                
                link.onload = () => {
                    const loadTime = performance.now() - startTime;
                    this.updateSpeedCache(source, loadTime);
                    resolve();
                };
                
                link.onerror = () => {
                    this.failedSources.add(source);
                    reject(new Error(`CSS加载失败: ${source}`));
                };
                
                document.head.appendChild(link);
            } else if (source.endsWith('.js')) {
                // 加载JavaScript
                const script = document.createElement('script');
                script.src = source;
                
                script.onload = () => {
                    const loadTime = performance.now() - startTime;
                    this.updateSpeedCache(source, loadTime);
                    resolve();
                };
                
                script.onerror = () => {
                    this.failedSources.add(source);
                    reject(new Error(`JavaScript加载失败: ${source}`));
                };
                
                document.head.appendChild(script);
            }
        });
    }
    
    /**
     * 使用备用源加载
     * @param {Array} sources - 所有CDN源
     * @param {string} resourceType - 资源类型
     * @param {Function} callback - 回调函数
     */
    async loadWithFallback(sources, resourceType, callback) {
        for (let i = 1; i < sources.length; i++) {
            const source = sources[i];
            if (this.failedSources.has(source)) continue;
            
            try {
                await this.loadFromSource(source, resourceType);
                this.loadedResources.add(resourceType);
                if (callback) callback();
                return;
            } catch (error) {
                console.warn(`[CDNManager] 备用源 ${i} 加载失败:`, error.message);
                continue;
            }
        }
        
        console.error(`[CDNManager] 所有CDN源都加载失败: ${resourceType}`);
    }
    
    /**
     * 启动后台速度测试
     */
    startBackgroundSpeedTest() {
        // 延迟启动，避免影响页面主要内容加载
        setTimeout(() => {
            this.performSpeedTest();
        }, 5000);
        
        // 定期重新测试（每30分钟）
        setInterval(() => {
            this.performSpeedTest();
        }, 30 * 60 * 1000);
    }
    
    /**
     * 执行速度测试
     */
    async performSpeedTest() {
        const testUrls = [];
        
        // 收集所有CDN源进行测试
        Object.values(this.cdnSources).forEach(sources => {
            testUrls.push(...sources);
        });
        
        const testPromises = testUrls.map(url => this.testSourceSpeed(url));
        
        try {
            await Promise.allSettled(testPromises);
            this.saveCachedSpeeds();
            console.log('[CDNManager] 后台速度测试完成');
        } catch (error) {
            console.warn('[CDNManager] 速度测试失败:', error);
        }
    }
    
    /**
     * 测试单个源的速度
     * @param {string} url - 测试URL
     */
    testSourceSpeed(url) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const img = new Image();
            
            // 使用图片请求进行速度测试（轻量级）
            const testUrl = new URL(url);
            testUrl.searchParams.set('_test', Date.now());
            
            img.onload = img.onerror = () => {
                const endTime = performance.now();
                const speed = endTime - startTime;
                this.updateSpeedCache(url, speed);
                resolve(speed);
            };
            
            // 设置超时
            setTimeout(() => {
                this.failedSources.add(url);
                resolve(Infinity);
            }, 5000);
            
            img.src = testUrl.toString();
        });
    }
    
    /**
     * 更新速度缓存
     * @param {string} source - CDN源
     * @param {number} speed - 加载速度（毫秒）
     */
    updateSpeedCache(source, speed) {
        // 使用指数移动平均来更新速度数据
        const currentSpeed = this.speedCache.get(source);
        if (currentSpeed) {
            const alpha = 0.3; // 平滑因子
            const newSpeed = alpha * speed + (1 - alpha) * currentSpeed;
            this.speedCache.set(source, newSpeed);
        } else {
            this.speedCache.set(source, speed);
        }
    }
    
    /**
     * 加载缓存的速度数据
     */
    loadCachedSpeeds() {
        try {
            const cached = localStorage.getItem('cdn_speed_cache');
            if (cached) {
                const data = JSON.parse(cached);
                this.speedCache = new Map(data.speeds || []);
                this.failedSources = new Set(data.failed || []);
                
                // 检查缓存是否过期（24小时）
                const cacheAge = Date.now() - (data.timestamp || 0);
                if (cacheAge > 24 * 60 * 60 * 1000) {
                    this.speedCache.clear();
                    this.failedSources.clear();
                }
            }
        } catch (error) {
            console.warn('[CDNManager] 加载速度缓存失败:', error);
        }
    }
    
    /**
     * 保存速度缓存
     */
    saveCachedSpeeds() {
        try {
            const data = {
                speeds: Array.from(this.speedCache.entries()),
                failed: Array.from(this.failedSources),
                timestamp: Date.now()
            };
            localStorage.setItem('cdn_speed_cache', JSON.stringify(data));
        } catch (error) {
            console.warn('[CDNManager] 保存速度缓存失败:', error);
        }
    }
    
    /**
     * 预加载关键资源
     */
    preloadCriticalResources() {
        // 预加载Bootstrap CSS和JS
        this.loadResource('bootstrap');
        this.loadResource('bootstrapJs');
        
        // 延迟加载FontAwesome
        setTimeout(() => {
            this.loadResource('fontawesome');
        }, 1000);
    }
    
    /**
     * 获取CDN统计信息
     */
    getStats() {
        return {
            loadedResources: Array.from(this.loadedResources),
            speedCache: Object.fromEntries(this.speedCache),
            failedSources: Array.from(this.failedSources),
            totalSources: Object.values(this.cdnSources).flat().length
        };
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        this.saveCachedSpeeds();
        this.speedCache.clear();
        this.failedSources.clear();
        this.loadedResources.clear();
    }
}

// 自动初始化
let cdnManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        cdnManager = new CDNManager();
        cdnManager.preloadCriticalResources();
    });
} else {
    cdnManager = new CDNManager();
    cdnManager.preloadCriticalResources();
}

// 暴露到全局
window.CDNManager = CDNManager;
window.cdnManager = cdnManager;