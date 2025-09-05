/**
 * 响应式图片组件
 * 根据设备特性和网络状况动态优化图片显示
 */

class ResponsiveImageComponent {
    constructor() {
        this.imageBreakpoints = {
            xs: { maxWidth: 576, suffix: '-xs' },
            sm: { maxWidth: 768, suffix: '-sm' },
            md: { maxWidth: 992, suffix: '-md' },
            lg: { maxWidth: 1200, suffix: '-lg' },
            xl: { maxWidth: 1400, suffix: '-xl' },
            xxl: { maxWidth: Infinity, suffix: '-xxl' }
        };
        
        this.imageFormats = ['webp', 'avif', 'jpg'];
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.connectionType = this.getConnectionType();
        this.supportsIntersectionObserver = 'IntersectionObserver' in window;
        this.isWebpSupported = null;
        this.isAvifSupported = null;
        
        this.init();
    }
    
    /**
     * 初始化组件
     */
    async init() {
        await this.checkImageFormatSupport();
        this.createImageObserver();
        this.setupEventListeners();
        this.processExistingImages();
        this.injectCSS();
        
        console.log('[ResponsiveImageComponent] 响应式图片组件初始化完成');
    }
    
    /**
     * 检测图片格式支持
     */
    async checkImageFormatSupport() {
        this.isWebpSupported = await this.canUseFormat('webp');
        this.isAvifSupported = await this.canUseFormat('avif');
    }
    
    /**
     * 检测是否支持特定图片格式
     */
    canUseFormat(format) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            
            const testImages = {
                webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
                avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
            };
            
            img.src = testImages[format];
        });
    }
    
    /**
     * 获取网络连接类型
     */
    getConnectionType() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            switch (effectiveType) {
                case 'slow-2g':
                case '2g':
                    return 'slow';
                case '3g':
                    return 'medium';
                case '4g':
                default:
                    return 'fast';
            }
        }
        return 'medium'; // 默认中等网速
    }
    
    /**
     * 创建图片观察器
     */
    createImageObserver() {
        if (!this.supportsIntersectionObserver) {
            return;
        }
        
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 监听窗口大小变化
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // 监听网络状态变化
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.connectionType = this.getConnectionType();
                this.updateImageQuality();
            });
        }
    }
    
    /**
     * 处理现有图片
     */
    processExistingImages() {
        const images = document.querySelectorAll('img[data-responsive], picture[data-responsive]');
        images.forEach(img => this.setupResponsiveImage(img));
    }
    
    /**
     * 设置响应式图片
     */
    setupResponsiveImage(element) {
        if (element.tagName.toLowerCase() === 'img') {
            this.setupResponsiveImg(element);
        } else if (element.tagName.toLowerCase() === 'picture') {
            this.setupResponsivePicture(element);
        }
    }
    
    /**
     * 设置响应式IMG元素
     */
    setupResponsiveImg(img) {
        const baseSrc = img.dataset.src || img.src;
        const alt = img.alt;
        const className = img.className;
        
        if (!baseSrc) return;
        
        // 创建picture元素替换img
        const picture = document.createElement('picture');
        picture.className = className;
        picture.dataset.responsive = 'true';
        
        // 添加不同格式和尺寸的source元素
        this.addSourceElements(picture, baseSrc);
        
        // 添加默认img元素
        const fallbackImg = document.createElement('img');
        fallbackImg.src = this.getOptimalImageSrc(baseSrc);
        fallbackImg.alt = alt;
        fallbackImg.className = 'responsive-img';
        fallbackImg.loading = 'lazy';
        
        picture.appendChild(fallbackImg);
        
        // 替换原始img元素
        img.parentNode.replaceChild(picture, img);
        
        // 设置懒加载
        if (this.supportsIntersectionObserver) {
            this.imageObserver.observe(picture);
        } else {
            this.loadImage(picture);
        }
    }
    
    /**
     * 添加source元素
     */
    addSourceElements(picture, baseSrc) {
        const formats = this.getSupportedFormats();
        const breakpoints = Object.keys(this.imageBreakpoints).reverse();
        
        formats.forEach(format => {
            breakpoints.forEach(bp => {
                const breakpoint = this.imageBreakpoints[bp];
                const source = document.createElement('source');
                
                // 设置媒体查询
                if (breakpoint.maxWidth !== Infinity) {
                    source.media = `(max-width: ${breakpoint.maxWidth}px)`;
                }
                
                // 设置srcset
                const densities = this.getDensities();
                const srcset = densities.map(density => {
                    const src = this.generateImageSrc(baseSrc, breakpoint.suffix, format, density);
                    return density === 1 ? src : `${src} ${density}x`;
                }).join(', ');
                
                source.srcset = srcset;
                source.type = `image/${format}`;
                
                picture.appendChild(source);
            });
        });
    }
    
    /**
     * 获取支持的图片格式
     */
    getSupportedFormats() {
        const formats = [];
        
        if (this.isAvifSupported) {
            formats.push('avif');
        }
        
        if (this.isWebpSupported) {
            formats.push('webp');
        }
        
        formats.push('jpg');
        return formats;
    }
    
    /**
     * 获取像素密度配置
     */
    getDensities() {
        const densities = [1];
        
        // 根据网络连接和设备像素比决定是否加载高清图片
        if (this.connectionType === 'fast' && this.devicePixelRatio > 1) {
            densities.push(2);
        }
        
        if (this.connectionType === 'fast' && this.devicePixelRatio > 2) {
            densities.push(3);
        }
        
        return densities;
    }
    
    /**
     * 生成图片源地址
     */
    generateImageSrc(baseSrc, sizeSuffix, format, density = 1) {
        const pathInfo = this.parseImagePath(baseSrc);
        
        // 构建新的文件名
        let newName = pathInfo.name;
        
        // 添加尺寸后缀
        if (sizeSuffix && sizeSuffix !== '-xl') {
            newName += sizeSuffix;
        }
        
        // 添加密度后缀
        if (density > 1) {
            newName += `@${density}x`;
        }
        
        // 根据网络状况调整质量
        if (this.connectionType === 'slow') {
            newName += '-low';
        } else if (this.connectionType === 'medium') {
            newName += '-med';
        }
        
        // 构建完整路径
        const extension = format === 'jpg' ? 'jpg' : format;
        return `${pathInfo.dir}${newName}.${extension}`;
    }
    
    /**
     * 解析图片路径
     */
    parseImagePath(src) {
        const lastSlashIndex = src.lastIndexOf('/');
        const lastDotIndex = src.lastIndexOf('.');
        
        return {
            dir: src.substring(0, lastSlashIndex + 1),
            name: src.substring(lastSlashIndex + 1, lastDotIndex),
            extension: src.substring(lastDotIndex + 1)
        };
    }
    
    /**
     * 获取最优图片源
     */
    getOptimalImageSrc(baseSrc) {
        const currentBreakpoint = this.getCurrentBreakpoint();
        const format = this.getBestFormat();
        const density = this.getOptimalDensity();
        
        return this.generateImageSrc(baseSrc, currentBreakpoint.suffix, format, density);
    }
    
    /**
     * 获取当前断点
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        for (const [key, breakpoint] of Object.entries(this.imageBreakpoints)) {
            if (width <= breakpoint.maxWidth) {
                return breakpoint;
            }
        }
        
        return this.imageBreakpoints.xxl;
    }
    
    /**
     * 获取最佳格式
     */
    getBestFormat() {
        if (this.isAvifSupported) return 'avif';
        if (this.isWebpSupported) return 'webp';
        return 'jpg';
    }
    
    /**
     * 获取最优像素密度
     */
    getOptimalDensity() {
        if (this.connectionType === 'slow') return 1;
        if (this.connectionType === 'medium' && this.devicePixelRatio > 1) return Math.min(2, this.devicePixelRatio);
        return Math.min(3, this.devicePixelRatio);
    }
    
    /**
     * 加载图片
     */
    loadImage(element) {
        const img = element.tagName.toLowerCase() === 'img' ? element : element.querySelector('img');
        
        if (img && !img.dataset.loaded) {
            // 添加加载动画
            this.addLoadingState(element);
            
            // 创建新图片元素进行预加载
            const preloadImg = new Image();
            
            preloadImg.onload = () => {
                img.src = preloadImg.src;
                img.dataset.loaded = 'true';
                this.removeLoadingState(element);
                element.classList.add('loaded');
            };
            
            preloadImg.onerror = () => {
                // 降级到原始图片
                const fallbackSrc = img.dataset.fallback || img.src.replace(/-\w+\.(\w+)$/, '.$1');
                img.src = fallbackSrc;
                img.dataset.loaded = 'true';
                this.removeLoadingState(element);
                element.classList.add('error');
            };
            
            preloadImg.src = img.src;
        }
    }
    
    /**
     * 添加加载状态
     */
    addLoadingState(element) {
        element.classList.add('loading');
        
        // 创建加载占位符
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = '<div class="placeholder-spinner"></div>';
        
        element.appendChild(placeholder);
    }
    
    /**
     * 移除加载状态
     */
    removeLoadingState(element) {
        element.classList.remove('loading');
        
        const placeholder = element.querySelector('.image-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
    }
    
    /**
     * 处理窗口大小变化
     */
    handleResize() {
        const images = document.querySelectorAll('picture[data-responsive] img');
        images.forEach(img => {
            if (img.dataset.loaded) {
                const picture = img.parentElement;
                const baseSrc = img.dataset.originalSrc || img.src;
                const newSrc = this.getOptimalImageSrc(baseSrc);
                
                if (img.src !== newSrc) {
                    img.src = newSrc;
                }
            }
        });
    }
    
    /**
     * 更新图片质量
     */
    updateImageQuality() {
        const images = document.querySelectorAll('picture[data-responsive] img[data-loaded]');
        images.forEach(img => {
            const baseSrc = img.dataset.originalSrc || img.src;
            const newSrc = this.getOptimalImageSrc(baseSrc);
            
            if (img.src !== newSrc) {
                img.src = newSrc;
            }
        });
    }
    
    /**
     * 注入CSS样式
     */
    injectCSS() {
        const css = `
            .responsive-img {
                max-width: 100%;
                height: auto;
                transition: opacity 0.3s ease;
            }
            
            picture[data-responsive] {
                position: relative;
                display: block;
                overflow: hidden;
            }
            
            picture[data-responsive].loading {
                background: #f8f9fa;
                min-height: 200px;
            }
            
            picture[data-responsive].loading img {
                opacity: 0;
            }
            
            picture[data-responsive].loaded img {
                opacity: 1;
            }
            
            picture[data-responsive].error img {
                opacity: 0.7;
                filter: grayscale(50%);
            }
            
            .image-placeholder {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }
            
            .placeholder-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #e9ecef;
                border-top: 3px solid var(--primary-color, #007bff);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* 针对不同屏幕尺寸的优化 */
            @media (max-width: 576px) {
                picture[data-responsive] {
                    border-radius: 8px;
                }
            }
            
            @media (min-width: 1200px) {
                picture[data-responsive] {
                    border-radius: 12px;
                }
            }
            
            /* 打印样式优化 */
            @media print {
                picture[data-responsive] img {
                    max-width: 100% !important;
                    page-break-inside: avoid;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    /**
     * 创建响应式图片元素
     */
    createResponsiveImage(src, alt, className = '') {
        const picture = document.createElement('picture');
        picture.dataset.responsive = 'true';
        picture.className = className;
        
        this.addSourceElements(picture, src);
        
        const img = document.createElement('img');
        img.src = this.getOptimalImageSrc(src);
        img.alt = alt;
        img.className = 'responsive-img';
        img.loading = 'lazy';
        
        picture.appendChild(img);
        
        return picture;
    }
    
    /**
     * 获取性能统计
     */
    getStats() {
        const responsiveImages = document.querySelectorAll('picture[data-responsive]');
        const loadedImages = document.querySelectorAll('picture[data-responsive] img[data-loaded]');
        
        return {
            totalResponsiveImages: responsiveImages.length,
            loadedImages: loadedImages.length,
            devicePixelRatio: this.devicePixelRatio,
            connectionType: this.connectionType,
            webpSupported: this.isWebpSupported,
            avifSupported: this.isAvifSupported
        };
    }
}

// 自动初始化
let responsiveImageComponent;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        responsiveImageComponent = new ResponsiveImageComponent();
    });
} else {
    responsiveImageComponent = new ResponsiveImageComponent();
}

// 暴露到全局
window.ResponsiveImageComponent = ResponsiveImageComponent;
window.responsiveImageComponent = responsiveImageComponent;