/**
 * 图片懒加载和资源优化管理器
 * 提升网站加载性能和用户体验
 */

class ResourceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.loadedImages = new Set();
        this.preloadedResources = new Set();
        this.criticalImages = new Set();
        
        // 配置选项
        this.options = {
            // 懒加载配置
            lazyLoad: {
                rootMargin: '50px 0px',
                threshold: 0.1,
                loadingPlaceholder: 'data:image/svg+xml,%3Csvg width="400" height="300" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100%25" height="100%25" fill="%23f8f9fa"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236c757d" font-family="Arial, sans-serif" font-size="16"%3E加载中...%3C/text%3E%3C/svg%3E'
            },
            
            // 预加载配置
            preload: {
                images: ['assets/images/hero-building.jpg', 'assets/images/logo.png'],
                stylesheets: ['assets/css/styles.css'],
                scripts: ['assets/js/main.js']
            },
            
            // 性能优化配置
            performance: {
                webpSupport: null,
                connectionSpeed: null,
                enableAdaptiveLoading: true
            }
        };
        
        this.init();
    }
    
    /**
     * 初始化资源优化器
     */
    init() {
        // 检测WebP支持
        this.detectWebPSupport();
        
        // 检测网络连接速度
        this.detectConnectionSpeed();
        
        // 初始化图片懒加载
        this.initLazyLoading();
        
        // 预加载关键资源
        this.preloadCriticalResources();
        
        // 优化CSS加载
        this.optimizeCSSLoading();
        
        // 优化字体加载
        this.optimizeFontLoading();
        
        console.log('[ResourceOptimizer] 资源优化器初始化完成');
    }
    
    /**
     * 检测WebP支持
     */
    detectWebPSupport() {
        return new Promise((resolve) => {
            const webp = new Image();
            webp.onload = webp.onerror = () => {
                this.options.performance.webpSupport = webp.height === 2;
                resolve(this.options.performance.webpSupport);
            };
            webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
    
    /**
     * 检测网络连接速度
     */
    detectConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.options.performance.connectionSpeed = connection.effectiveType;
            
            // 监听连接变化
            connection.addEventListener('change', () => {
                this.options.performance.connectionSpeed = connection.effectiveType;
                this.adaptToConnectionSpeed();
            });
        }
    }
    
    /**
     * 根据网络连接速度调整加载策略
     */
    adaptToConnectionSpeed() {
        if (!this.options.performance.enableAdaptiveLoading) return;
        
        const speed = this.options.performance.connectionSpeed;
        
        switch (speed) {
            case 'slow-2g':
            case '2g':
                // 慢速连接：减少预加载，增大懒加载阈值
                this.options.lazyLoad.rootMargin = '10px 0px';
                this.options.preload.images = this.options.preload.images.slice(0, 1);
                break;
                
            case '3g':
                // 中速连接：标准设置
                this.options.lazyLoad.rootMargin = '50px 0px';
                break;
                
            case '4g':
            default:
                // 高速连接：积极预加载
                this.options.lazyLoad.rootMargin = '100px 0px';
                break;
        }
        
        // 重新初始化懒加载观察器
        this.reinitLazyLoading();
    }
    
    /**
     * 初始化图片懒加载
     */
    initLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            // 不支持IntersectionObserver，直接加载所有图片
            this.loadAllImages();
            return;
        }
        
        this.imageObserver = new IntersectionObserver(
            this.handleImageIntersection.bind(this),
            {
                rootMargin: this.options.lazyLoad.rootMargin,
                threshold: this.options.lazyLoad.threshold
            }
        );
        
        // 为所有需要懒加载的图片添加观察
        this.setupLazyImages();
    }
    
    /**
     * 重新初始化懒加载
     */
    reinitLazyLoading() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        this.initLazyLoading();
    }
    
    /**
     * 设置懒加载图片
     */
    setupLazyImages() {
        const images = document.querySelectorAll('img[data-src], img[src]:not([data-critical])');
        
        images.forEach(img => {
            if (img.hasAttribute('data-critical')) {
                // 关键图片立即加载
                this.criticalImages.add(img);
                this.loadImage(img);
            } else {
                // 非关键图片懒加载
                this.setupLazyImage(img);
                this.imageObserver.observe(img);
            }
        });
    }
    
    /**
     * 设置单个懒加载图片
     */
    setupLazyImage(img) {
        // 保存原始src到data-src
        if (img.src && !img.dataset.src) {
            img.dataset.src = img.src;
        }
        
        // 设置占位符
        if (!img.src || img.src === img.dataset.src) {
            img.src = this.options.lazyLoad.loadingPlaceholder;
        }
        
        // 添加懒加载类
        img.classList.add('lazy-loading');
        
        // 添加错误处理
        img.addEventListener('error', this.handleImageError.bind(this, img));
    }
    
    /**
     * 处理图片与视口相交
     */
    handleImageIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                observer.unobserve(img);
            }
        });
    }
    
    /**
     * 加载图片
     */
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const src = img.dataset.src || img.src;
            if (this.loadedImages.has(src)) {
                resolve(img);
                return;
            }
            
            // 优化图片URL（WebP支持）
            const optimizedSrc = this.optimizeImageUrl(src);
            
            // 创建新图片对象预加载
            const newImg = new Image();
            
            newImg.onload = () => {
                // 加载成功，更新实际图片
                img.src = optimizedSrc;
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
                
                // 添加淡入动画
                this.addFadeInAnimation(img);
                
                this.loadedImages.add(src);
                resolve(img);
            };
            
            newImg.onerror = () => {
                this.handleImageError(img);
                reject(new Error(`图片加载失败: ${src}`));
            };
            
            newImg.src = optimizedSrc;
        });
    }
    
    /**
     * 优化图片URL
     */
    optimizeImageUrl(src) {
        // 如果支持WebP，尝试使用WebP版本
        if (this.options.performance.webpSupport && src.match(/\.(jpg|jpeg|png)$/i)) {
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            return webpSrc;
        }
        
        return src;
    }
    
    /**
     * 处理图片加载错误
     */
    handleImageError(img) {
        console.warn('图片加载失败:', img.dataset.src || img.src);
        
        // 设置错误占位符
        img.src = 'data:image/svg+xml,%3Csvg width="400" height="300" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100%25" height="100%25" fill="%23f8f9fa"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23dc3545" font-family="Arial, sans-serif" font-size="16"%3E图片加载失败%3C/text%3E%3C/svg%3E';
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-error');
    }
    
    /**
     * 添加淡入动画
     */
    addFadeInAnimation(img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        
        requestAnimationFrame(() => {
            img.style.opacity = '1';
        });
    }
    
    /**
     * 预加载关键资源
     */
    preloadCriticalResources() {
        // 预加载关键图片
        this.options.preload.images.forEach(src => {
            this.preloadImage(src);
        });
        
        // 预加载样式表
        this.options.preload.stylesheets.forEach(href => {
            this.preloadStylesheet(href);
        });
        
        // 预加载脚本
        this.options.preload.scripts.forEach(src => {
            this.preloadScript(src);
        });
    }
    
    /**
     * 预加载图片
     */
    preloadImage(src) {
        if (this.preloadedResources.has(src)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
        
        this.preloadedResources.add(src);
    }
    
    /**
     * 预加载样式表
     */
    preloadStylesheet(href) {
        if (this.preloadedResources.has(href)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
        
        this.preloadedResources.add(href);
    }
    
    /**
     * 预加载脚本
     */
    preloadScript(src) {
        if (this.preloadedResources.has(src)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = src;
        document.head.appendChild(link);
        
        this.preloadedResources.add(src);
    }
    
    /**
     * 优化CSS加载
     */
    optimizeCSSLoading() {
        // 异步加载非关键CSS
        const nonCriticalCSS = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];
        
        nonCriticalCSS.forEach(href => {
            this.loadCSSAsync(href);
        });
    }
    
    /**
     * 异步加载CSS
     */
    loadCSSAsync(href) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.onload = function() {
            this.onload = null;
            this.rel = 'stylesheet';
        };
        link.href = href;
        document.head.appendChild(link);
    }
    
    /**
     * 优化字体加载
     */
    optimizeFontLoading() {
        // 字体显示策略
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                console.log('[ResourceOptimizer] 字体加载完成');
            });
        }
        
        // 添加字体显示CSS
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: system-ui;
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 加载所有图片（后备方案）
     */
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
        });
    }
    
    /**
     * 获取加载统计
     */
    getLoadingStats() {
        return {
            totalImages: document.querySelectorAll('img').length,
            loadedImages: this.loadedImages.size,
            preloadedResources: this.preloadedResources.size,
            webpSupport: this.options.performance.webpSupport,
            connectionSpeed: this.options.performance.connectionSpeed
        };
    }
    
    /**
     * 销毁资源优化器
     */
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        
        this.loadedImages.clear();
        this.preloadedResources.clear();
        this.criticalImages.clear();
    }
}

// 自动初始化
let resourceOptimizer;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        resourceOptimizer = new ResourceOptimizer();
    });
} else {
    resourceOptimizer = new ResourceOptimizer();
}

// 暴露到全局
window.ResourceOptimizer = ResourceOptimizer;
window.resourceOptimizer = resourceOptimizer;