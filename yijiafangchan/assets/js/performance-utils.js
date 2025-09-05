/**
 * 防抖节流性能优化工具
 * 提供防抖、节流、RAF优化等性能工具
 */

class PerformanceUtils {
    constructor() {
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
        this.raf = new Map();
        this.domUpdateQueue = [];
        this.isProcessingQueue = false;
        
        // 性能指标
        this.performanceMetrics = {
            debouncedCalls: 0,
            throttledCalls: 0,
            rafCalls: 0
        };
        
        this.init();
    }
    
    /**
     * 初始化
     */
    init() {
        // 自动优化常见的DOM事件
        this.optimizeCommonEvents();
        
        // 批量DOM更新优化
        this.initBatchDOMUpdates();
        
        // 内存管理
        this.initMemoryManagement();
        
        console.log('[PerformanceUtils] 性能优化工具初始化完成');
    }
    
    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @param {string} key - 唯一标识符
     * @param {boolean} immediate - 是否立即执行
     */
    debounce(func, delay = 300, key = 'default', immediate = false) {
        return (...args) => {
            const callNow = immediate && !this.debounceTimers.has(key);
            
            if (this.debounceTimers.has(key)) {
                clearTimeout(this.debounceTimers.get(key));
            }
            
            this.debounceTimers.set(key, setTimeout(() => {
                this.debounceTimers.delete(key);
                if (!immediate) {
                    func.apply(this, args);
                    this.performanceMetrics.debouncedCalls++;
                }
            }, delay));
            
            if (callNow) {
                func.apply(this, args);
                this.performanceMetrics.debouncedCalls++;
            }
        };
    }
    
    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间间隔（毫秒）
     * @param {string} key - 唯一标识符
     * @param {object} options - 配置选项
     */
    throttle(func, limit = 100, key = 'default', options = {}) {
        const { leading = true, trailing = true } = options;
        let lastFunc, lastRan;
        
        return (...args) => {
            if (!lastRan) {
                if (leading) {
                    func.apply(this, args);
                    this.performanceMetrics.throttledCalls++;
                }
                lastRan = Date.now();
            } else {
                if (this.throttleTimers.has(key)) {
                    clearTimeout(this.throttleTimers.get(key));
                }
                
                this.throttleTimers.set(key, setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        if (trailing) {
                            func.apply(this, args);
                            this.performanceMetrics.throttledCalls++;
                        }
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan)));
            }
        };
    }
    
    /**
     * RAF节流 - 使用requestAnimationFrame优化动画和滚动
     * @param {Function} func - 要执行的函数
     * @param {string} key - 唯一标识符
     */
    rafThrottle(func, key = 'default') {
        return (...args) => {
            if (this.raf.has(key)) {
                return;
            }
            
            this.raf.set(key, requestAnimationFrame(() => {
                func.apply(this, args);
                this.raf.delete(key);
                this.performanceMetrics.rafCalls++;
            }));
        };
    }
    
    /**
     * 智能防抖 - 根据设备性能动态调整延迟
     * @param {Function} func - 要防抖的函数
     * @param {string} key - 唯一标识符
     */
    smartDebounce(func, key = 'default') {
        // 根据设备性能调整延迟
        let delay = 300;
        
        if ('hardwareConcurrency' in navigator) {
            const cores = navigator.hardwareConcurrency;
            delay = cores >= 4 ? 200 : cores >= 2 ? 300 : 500;
        }
        
        // 根据网络状态调整
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                delay += 200;
            }
        }
        
        return this.debounce(func, delay, key);
    }
    
    /**
     * 批量DOM更新
     */
    batchDOMUpdate(updates) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                // 批量执行DOM更新
                updates.forEach(update => {
                    try {
                        update();
                    } catch (error) {
                        console.error('[PerformanceUtils] DOM更新错误:', error);
                    }
                });
                resolve();
            });
        });
    }
    
    /**
     * 延迟执行 - 在空闲时间执行非关键任务
     * @param {Function} func - 要延迟执行的函数
     * @param {object} options - 配置选项
     */
    idle(func, options = {}) {
        const { timeout = 5000 } = options;
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(func, { timeout });
        } else {
            // 降级到setTimeout
            setTimeout(func, 0);
        }
    }
    
    /**
     * 自动优化常见DOM事件
     */
    optimizeCommonEvents() {
        // 优化滚动事件
        this.optimizeScrollEvents();
        
        // 优化调整大小事件
        this.optimizeResizeEvents();
        
        // 优化输入事件
        this.optimizeInputEvents();
        
        // 优化鼠标移动事件
        this.optimizeMouseEvents();
    }
    
    /**
     * 优化滚动事件
     */
    optimizeScrollEvents() {
        const optimizedScroll = this.rafThrottle(() => {
            // 滚动相关的DOM操作
            this.handleScrollEffects();
        }, 'scroll');
        
        window.addEventListener('scroll', optimizedScroll, { passive: true });
    }
    
    /**
     * 处理滚动效果
     */
    handleScrollEffects() {
        const scrollY = window.scrollY;
        
        // 导航栏滚动效果
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // 回到顶部按钮
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (scrollY > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'translateY(100px)';
            }
        }
    }
    
    /**
     * 优化调整大小事件
     */
    optimizeResizeEvents() {
        const optimizedResize = this.debounce(() => {
            // 处理窗口大小变化
            this.handleResize();
        }, 250, 'resize');
        
        window.addEventListener('resize', optimizedResize);
    }
    
    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 重新计算布局
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('optimizedResize', {
            detail: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }));
    }
    
    /**
     * 优化输入事件
     */
    optimizeInputEvents() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="search"], input[type="text"]')) {
                const optimizedInput = this.smartDebounce((event) => {
                    // 处理搜索或筛选
                    this.handleInputChange(event.target);
                }, `input-${e.target.id || 'default'}`);
                
                optimizedInput(e);
            }
        });
    }
    
    /**
     * 处理输入变化
     */
    handleInputChange(input) {
        const value = input.value.trim();
        
        // 搜索功能
        if (input.type === 'search' || input.classList.contains('search-input')) {
            this.performSearch(value);
        }
        
        // 表单验证
        if (input.hasAttribute('data-validate')) {
            this.validateInput(input);
        }
    }
    
    /**
     * 优化鼠标事件
     */
    optimizeMouseEvents() {
        const optimizedMouseMove = this.throttle((e) => {
            // 处理鼠标移动相关的效果
            this.handleMouseMove(e);
        }, 16, 'mousemove'); // 60fps
        
        document.addEventListener('mousemove', optimizedMouseMove, { passive: true });
    }
    
    /**
     * 处理鼠标移动
     */
    handleMouseMove(e) {
        // 视差效果或其他鼠标跟随效果
        this.updateParallaxEffects(e);
    }
    
    /**
     * 更新视差效果
     */
    updateParallaxEffects(e) {
        const elements = document.querySelectorAll('[data-parallax]');
        
        elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const x = (e.clientX - window.innerWidth / 2) * speed;
            const y = (e.clientY - window.innerHeight / 2) * speed;
            
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    }
    
    /**
     * 执行搜索
     */
    performSearch(query) {
        if (query.length === 0) {
            // 清空搜索结果
            this.clearSearchResults();
            return;
        }
        
        if (query.length < 2) {
            // 查询太短，不执行搜索
            return;
        }
        
        // 执行搜索逻辑
        console.log('[PerformanceUtils] 执行搜索:', query);
        
        // 这里可以添加实际的搜索逻辑
        this.idle(() => {
            this.displaySearchResults(query);
        });
    }
    
    /**
     * 验证输入
     */
    validateInput(input) {
        const validationType = input.dataset.validate;
        let isValid = true;
        let message = '';
        
        switch (validationType) {
            case 'phone':
                isValid = /^1[3-9]\d{9}$/.test(input.value);
                message = '请输入正确的手机号码';
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
                message = '请输入正确的邮箱地址';
                break;
        }
        
        this.showValidationResult(input, isValid, message);
    }
    
    /**
     * 显示验证结果
     */
    showValidationResult(input, isValid, message) {
        input.classList.toggle('is-invalid', !isValid);
        input.classList.toggle('is-valid', isValid);
        
        // 显示错误信息
        let feedback = input.parentNode.querySelector('.invalid-feedback');
        if (!isValid && !feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentNode.appendChild(feedback);
        }
        
        if (feedback) {
            feedback.textContent = isValid ? '' : message;
            feedback.style.display = isValid ? 'none' : 'block';
        }
    }
    
    /**
     * 初始化批量DOM更新
     */
    initBatchDOMUpdates() {
        this.domUpdateQueue = [];
        this.isProcessingQueue = false;
        
        // 创建全局DOM更新队列
        window.queueDOMUpdate = (updateFn) => {
            this.domUpdateQueue.push(updateFn);
            this.processDOMQueue();
        };
    }
    
    /**
     * 处理DOM更新队列
     */
    processDOMQueue() {
        if (this.isProcessingQueue) return;
        
        this.isProcessingQueue = true;
        
        requestAnimationFrame(() => {
            const updates = this.domUpdateQueue.splice(0);
            
            updates.forEach(update => {
                try {
                    update();
                } catch (error) {
                    console.error('[PerformanceUtils] DOM更新队列错误:', error);
                }
            });
            
            this.isProcessingQueue = false;
        });
    }
    
    /**
     * 初始化内存管理
     */
    initMemoryManagement() {
        // 定期清理计时器
        setInterval(() => {
            this.cleanupTimers();
        }, 60000); // 每分钟清理一次
        
        // 页面卸载时清理资源
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }
    
    /**
     * 清理计时器
     */
    cleanupTimers() {
        // 清理过期的防抖计时器
        this.debounceTimers.forEach((timer, key) => {
            if (!timer) {
                this.debounceTimers.delete(key);
            }
        });
        
        // 清理过期的节流计时器
        this.throttleTimers.forEach((timer, key) => {
            if (!timer) {
                this.throttleTimers.delete(key);
            }
        });
    }
    
    /**
     * 获取性能指标
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            activeTimers: {
                debounce: this.debounceTimers.size,
                throttle: this.throttleTimers.size,
                raf: this.raf.size
            }
        };
    }
    
    /**
     * 清理所有资源
     */
    cleanup() {
        // 清理所有计时器
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.throttleTimers.forEach(timer => clearTimeout(timer));
        this.raf.forEach(id => cancelAnimationFrame(id));
        
        // 清理映射
        this.debounceTimers.clear();
        this.throttleTimers.clear();
        this.raf.clear();
        
        console.log('[PerformanceUtils] 资源清理完成');
    }
    
    // 占位方法，可以在具体项目中实现
    clearSearchResults() {
        console.log('[PerformanceUtils] 清空搜索结果');
    }
    
    displaySearchResults(query) {
        console.log('[PerformanceUtils] 显示搜索结果:', query);
    }
}

// 自动初始化
let performanceUtils;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        performanceUtils = new PerformanceUtils();
    });
} else {
    performanceUtils = new PerformanceUtils();
}

// 暴露到全局
window.PerformanceUtils = PerformanceUtils;
window.performanceUtils = performanceUtils;