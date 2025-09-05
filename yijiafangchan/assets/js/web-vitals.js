/**
 * Web Vitals 性能监控系统
 * 监控和分析网站性能指标，提供性能优化建议
 */

class WebVitalsMonitor {
    constructor() {
        this.vitals = {
            FCP: null,  // First Contentful Paint
            LCP: null,  // Largest Contentful Paint
            FID: null,  // First Input Delay
            CLS: null,  // Cumulative Layout Shift
            TTFB: null, // Time to First Byte
            TTI: null   // Time to Interactive
        };
        
        this.performanceEntries = [];
        this.customMetrics = new Map();
        this.observers = new Map();
        
        // 配置阈值（Good/Needs Improvement/Poor）
        this.thresholds = {
            FCP: [1800, 3000],
            LCP: [2500, 4000],
            FID: [100, 300],
            CLS: [0.1, 0.25],
            TTFB: [800, 1800],
            TTI: [3800, 7300]
        };
        
        this.init();
    }
    
    /**
     * 初始化性能监控
     */
    init() {
        // 检查浏览器支持
        if (!this.checkSupport()) {
            console.warn('[WebVitalsMonitor] 浏览器不完全支持性能API');
            return;
        }
        
        // 监控核心Web Vitals
        this.monitorFCP();
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
        this.monitorTTFB();
        this.monitorTTI();
        
        // 监控自定义指标
        this.monitorCustomMetrics();
        
        // 监控资源加载
        this.monitorResourceLoading();
        
        // 页面卸载时发送数据
        this.setupDataSending();
        
        console.log('[WebVitalsMonitor] 性能监控初始化完成');
    }
    
    /**
     * 检查浏览器支持
     */
    checkSupport() {
        return 'performance' in window &&
               'PerformanceObserver' in window &&
               'PerformanceEntry' in window;
    }
    
    /**
     * 监控 First Contentful Paint
     */
    monitorFCP() {
        if (!('PerformancePaintTiming' in window)) return;
        
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    this.vitals.FCP = Math.round(entry.startTime);
                    this.onMetricUpdate('FCP', this.vitals.FCP);
                    observer.disconnect();
                    break;
                }
            }
        });
        
        try {
            observer.observe({ entryTypes: ['paint'] });
            this.observers.set('FCP', observer);
        } catch (e) {
            console.warn('[WebVitalsMonitor] FCP监控失败:', e);
        }
    }
    
    /**
     * 监控 Largest Contentful Paint
     */
    monitorLCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            if (lastEntry) {
                this.vitals.LCP = Math.round(lastEntry.startTime);
                this.onMetricUpdate('LCP', this.vitals.LCP);
            }
        });
        
        try {
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.set('LCP', observer);
            
            // 在页面隐藏时停止观察
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    observer.takeRecords();
                    observer.disconnect();
                }
            }, { once: true });
        } catch (e) {
            console.warn('[WebVitalsMonitor] LCP监控失败:', e);
        }
    }
    
    /**
     * 监控 First Input Delay
     */
    monitorFID() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.processingStart && entry.startTime) {
                    const fid = entry.processingStart - entry.startTime;
                    this.vitals.FID = Math.round(fid);
                    this.onMetricUpdate('FID', this.vitals.FID);
                    observer.disconnect();
                    break;
                }
            }
        });
        
        try {
            observer.observe({ entryTypes: ['first-input'] });
            this.observers.set('FID', observer);
        } catch (e) {
            console.warn('[WebVitalsMonitor] FID监控失败:', e);
        }
    }
    
    /**
     * 监控 Cumulative Layout Shift
     */
    monitorCLS() {
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];
        
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = sessionEntries[0];
                    const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
                    
                    if (sessionValue &&
                        entry.startTime - lastSessionEntry.startTime < 1000 &&
                        entry.startTime - firstSessionEntry.startTime < 5000) {
                        sessionValue += entry.value;
                        sessionEntries.push(entry);
                    } else {
                        sessionValue = entry.value;
                        sessionEntries = [entry];
                    }
                    
                    if (sessionValue > clsValue) {
                        clsValue = sessionValue;
                        this.vitals.CLS = Math.round(clsValue * 10000) / 10000;
                        this.onMetricUpdate('CLS', this.vitals.CLS);
                    }
                }
            }
        });
        
        try {
            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.set('CLS', observer);
        } catch (e) {
            console.warn('[WebVitalsMonitor] CLS监控失败:', e);
        }
    }
    
    /**
     * 监控 Time to First Byte
     */
    monitorTTFB() {
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        
        if (navigationEntry) {
            this.vitals.TTFB = Math.round(navigationEntry.responseStart - navigationEntry.requestStart);
            this.onMetricUpdate('TTFB', this.vitals.TTFB);
        }
    }
    
    /**
     * 监控 Time to Interactive
     */
    monitorTTI() {
        // TTI需要复杂的计算，这里提供简化版本
        window.addEventListener('load', () => {
            // 使用DOMContentLoaded + 一个启发式延迟作为TTI近似值
            const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
            
            // 检查是否有长任务
            const longTaskObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                let hasLongTasks = entries.length > 0;
                
                if (!hasLongTasks) {
                    this.vitals.TTI = Math.round(domContentLoaded);
                    this.onMetricUpdate('TTI', this.vitals.TTI);
                    longTaskObserver.disconnect();
                }
            });
            
            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                
                // 5秒后如果还没确定TTI，使用domContentLoaded + 估计值
                setTimeout(() => {
                    if (this.vitals.TTI === null) {
                        this.vitals.TTI = Math.round(domContentLoaded + 1000);
                        this.onMetricUpdate('TTI', this.vitals.TTI);
                    }
                    longTaskObserver.disconnect();
                }, 5000);
            } catch (e) {
                this.vitals.TTI = Math.round(domContentLoaded);
                this.onMetricUpdate('TTI', this.vitals.TTI);
            }
        });
    }
    
    /**
     * 监控自定义指标
     */
    monitorCustomMetrics() {
        // 监控页面加载完成时间
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.setCustomMetric('pageLoadTime', loadTime);
        });
        
        // 监控DOM准备时间
        if (document.readyState === 'complete') {
            this.setCustomMetric('domReadyTime', performance.now());
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                this.setCustomMetric('domReadyTime', performance.now());
            });
        }
        
        // 监控首屏图片加载时间
        this.monitorHeroImageLoading();
    }
    
    /**
     * 监控首屏图片加载
     */
    monitorHeroImageLoading() {
        const heroImages = document.querySelectorAll('.hero-section img, [data-critical] img');
        let loadedCount = 0;
        const totalCount = heroImages.length;
        
        if (totalCount === 0) return;
        
        const startTime = performance.now();
        
        heroImages.forEach(img => {
            const checkLoaded = () => {
                if (img.complete) {
                    loadedCount++;
                    if (loadedCount === totalCount) {
                        const heroImageLoadTime = performance.now() - startTime;
                        this.setCustomMetric('heroImageLoadTime', heroImageLoadTime);
                    }
                }
            };
            
            if (img.complete) {
                checkLoaded();
            } else {
                img.addEventListener('load', checkLoaded);
                img.addEventListener('error', checkLoaded);
            }
        });
    }
    
    /**
     * 监控资源加载性能
     */
    monitorResourceLoading() {
        const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.performanceEntries.push({
                    name: entry.name,
                    type: entry.initiatorType,
                    duration: entry.duration,
                    size: entry.transferSize || 0,
                    startTime: entry.startTime
                });
            }
        });
        
        try {
            resourceObserver.observe({ entryTypes: ['resource'] });
            this.observers.set('resource', resourceObserver);
        } catch (e) {
            console.warn('[WebVitalsMonitor] 资源监控失败:', e);
        }
    }
    
    /**
     * 设置自定义指标
     */
    setCustomMetric(name, value) {
        this.customMetrics.set(name, {
            value: Math.round(value),
            timestamp: Date.now()
        });
        
        this.onMetricUpdate(name, value);
    }
    
    /**
     * 指标更新回调
     */
    onMetricUpdate(metricName, value) {
        const rating = this.getMetricRating(metricName, value);
        
        console.log(`[WebVitalsMonitor] ${metricName}: ${value}ms (${rating})`);
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('webvital', {
            detail: {
                metric: metricName,
                value: value,
                rating: rating
            }
        }));
        
        // 如果性能较差，显示优化建议
        if (rating === 'poor') {
            this.showOptimizationSuggestion(metricName, value);
        }
    }
    
    /**
     * 获取指标评级
     */
    getMetricRating(metricName, value) {
        const thresholds = this.thresholds[metricName];
        if (!thresholds) return 'unknown';
        
        if (value <= thresholds[0]) return 'good';
        if (value <= thresholds[1]) return 'needs-improvement';
        return 'poor';
    }
    
    /**
     * 显示优化建议
     */
    showOptimizationSuggestion(metricName, value) {
        const suggestions = {
            FCP: '优化关键渲染路径，减少阻塞资源',
            LCP: '优化最大内容元素的加载速度',
            FID: '减少JavaScript执行时间，优化事件处理',
            CLS: '避免动态插入内容，预留布局空间',
            TTFB: '优化服务器响应时间',
            TTI: '减少主线程阻塞，优化JavaScript'
        };
        
        const suggestion = suggestions[metricName];
        if (suggestion && this.shouldShowSuggestion()) {
            console.warn(`[WebVitalsMonitor] ${metricName}性能较差 (${value}ms): ${suggestion}`);
        }
    }
    
    /**
     * 是否应该显示建议
     */
    shouldShowSuggestion() {
        // 在开发环境或本地环境显示建议
        return window.location.hostname === 'localhost' ||
               window.location.hostname.includes('dev') ||
               window.location.protocol === 'file:';
    }
    
    /**
     * 获取性能报告
     */
    getPerformanceReport() {
        const report = {
            webVitals: { ...this.vitals },
            customMetrics: Object.fromEntries(this.customMetrics),
            resourceStats: this.getResourceStats(),
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        return report;
    }
    
    /**
     * 获取资源统计
     */
    getResourceStats() {
        const stats = {
            totalResources: this.performanceEntries.length,
            totalSize: 0,
            averageLoadTime: 0,
            slowestResource: null,
            resourceTypes: {}
        };
        
        if (this.performanceEntries.length === 0) return stats;
        
        let totalDuration = 0;
        let slowestDuration = 0;
        
        this.performanceEntries.forEach(entry => {
            stats.totalSize += entry.size;
            totalDuration += entry.duration;
            
            if (entry.duration > slowestDuration) {
                slowestDuration = entry.duration;
                stats.slowestResource = {
                    name: entry.name,
                    type: entry.type,
                    duration: entry.duration
                };
            }
            
            stats.resourceTypes[entry.type] = (stats.resourceTypes[entry.type] || 0) + 1;
        });
        
        stats.averageLoadTime = Math.round(totalDuration / this.performanceEntries.length);
        stats.totalSize = Math.round(stats.totalSize / 1024); // KB
        
        return stats;
    }
    
    /**
     * 设置数据发送
     */
    setupDataSending() {
        // 页面卸载时发送数据
        window.addEventListener('beforeunload', () => {
            this.sendPerformanceData();
        });
        
        // 页面隐藏时发送数据（支持单页应用）
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.sendPerformanceData();
            }
        });
        
        // 定期发送数据
        setInterval(() => {
            this.sendPerformanceData();
        }, 30000); // 30秒发送一次
    }
    
    /**
     * 发送性能数据
     */
    sendPerformanceData() {
        const report = this.getPerformanceReport();
        
        // 在开发环境仅记录到控制台
        if (this.shouldShowSuggestion()) {
            console.log('[WebVitalsMonitor] 性能报告:', report);
            return;
        }
        
        // 生产环境可以发送到分析服务
        if (navigator.sendBeacon) {
            try {
                const data = JSON.stringify(report);
                navigator.sendBeacon('/api/performance', data);
            } catch (e) {
                console.warn('[WebVitalsMonitor] 发送性能数据失败:', e);
            }
        }
    }
    
    /**
     * 创建性能仪表板
     */
    createPerformanceDashboard() {
        if (!this.shouldShowSuggestion()) return;
        
        const dashboard = document.createElement('div');
        dashboard.id = 'performance-dashboard';
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <h3>性能监控</h3>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="dashboard-content" id="dashboard-content"></div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #performance-dashboard {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                font-family: monospace;
                font-size: 12px;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: #f8f9fa;
                border-bottom: 1px solid #ddd;
                border-radius: 8px 8px 0 0;
            }
            
            .dashboard-header h3 {
                margin: 0;
                font-size: 14px;
            }
            
            .dashboard-header button {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #666;
            }
            
            .dashboard-content {
                padding: 15px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .metric-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding: 4px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .metric-value {
                font-weight: bold;
            }
            
            .metric-good { color: #28a745; }
            .metric-needs-improvement { color: #ffc107; }
            .metric-poor { color: #dc3545; }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(dashboard);
        
        // 定期更新仪表板
        this.updateDashboard();
        setInterval(() => this.updateDashboard(), 1000);
    }
    
    /**
     * 更新仪表板
     */
    updateDashboard() {
        const content = document.getElementById('dashboard-content');
        if (!content) return;
        
        let html = '';
        
        // Web Vitals
        Object.entries(this.vitals).forEach(([metric, value]) => {
            if (value !== null) {
                const rating = this.getMetricRating(metric, value);
                html += `
                    <div class="metric-item">
                        <span>${metric}:</span>
                        <span class="metric-value metric-${rating}">${value}ms</span>
                    </div>
                `;
            }
        });
        
        // 自定义指标
        this.customMetrics.forEach((data, metric) => {
            html += `
                <div class="metric-item">
                    <span>${metric}:</span>
                    <span class="metric-value">${data.value}ms</span>
                </div>
            `;
        });
        
        content.innerHTML = html;
    }
    
    /**
     * 销毁监控器
     */
    destroy() {
        // 断开所有观察器
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        this.observers.clear();
        this.customMetrics.clear();
        this.performanceEntries.length = 0;
        
        // 移除仪表板
        const dashboard = document.getElementById('performance-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
        
        console.log('[WebVitalsMonitor] 监控器已销毁');
    }
}

// 自动初始化
let webVitalsMonitor;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        webVitalsMonitor = new WebVitalsMonitor();
        
        // 在开发环境显示仪表板
        if (webVitalsMonitor.shouldShowSuggestion()) {
            setTimeout(() => {
                webVitalsMonitor.createPerformanceDashboard();
            }, 2000);
        }
    });
} else {
    webVitalsMonitor = new WebVitalsMonitor();
    
    if (webVitalsMonitor.shouldShowSuggestion()) {
        setTimeout(() => {
            webVitalsMonitor.createPerformanceDashboard();
        }, 2000);
    }
}

// 暴露到全局
window.WebVitalsMonitor = WebVitalsMonitor;
window.webVitalsMonitor = webVitalsMonitor;