/**
 * Service Worker for 宜家房产网站
 * 实现智能缓存策略和离线支持
 * Version: 1.0.0
 */

const CACHE_NAME = 'yijia-fc-v1.0.0';
const RUNTIME_CACHE = 'yijia-fc-runtime-v1.0.0';

// 预缓存的静态资源
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/properties.html',
    '/about.html',
    '/contact.html',
    '/assets/css/styles.css',
    '/assets/js/main.js',
    '/assets/js/properties.js',
    '/assets/images/logo.png',
    // Bootstrap CDN
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    // Font Awesome CDN
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 动态缓存策略配置
const CACHE_STRATEGIES = {
    // 图片资源：缓存优先，失效时间长
    images: {
        pattern: /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i,
        strategy: 'CacheFirst',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
        maxEntries: 100
    },
    // 字体资源：缓存优先
    fonts: {
        pattern: /\.(woff|woff2|eot|ttf)$/i,
        strategy: 'CacheFirst',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1年
        maxEntries: 50
    },
    // API请求：网络优先，离线时使用缓存
    api: {
        pattern: /\/api\//,
        strategy: 'NetworkFirst',
        maxAge: 5 * 60 * 1000, // 5分钟
        maxEntries: 50
    },
    // 外部CDN资源：缓存优先
    external: {
        pattern: /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)/,
        strategy: 'CacheFirst',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
        maxEntries: 30
    }
};

/**
 * Service Worker安装事件
 */
self.addEventListener('install', event => {
    console.log('[SW] 安装中...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] 开始预缓存静态资源');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('[SW] 静态资源预缓存完成');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] 预缓存失败:', error);
            })
    );
});

/**
 * Service Worker激活事件
 */
self.addEventListener('activate', event => {
    console.log('[SW] 激活中...');
    
    event.waitUntil(
        Promise.all([
            // 清理旧版本缓存
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
                        })
                        .map(cacheName => {
                            console.log('[SW] 删除旧缓存:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            }),
            // 立即控制所有客户端
            self.clients.claim()
        ])
    );
});

/**
 * 网络请求拦截
 */
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 只处理GET请求
    if (request.method !== 'GET') {
        return;
    }
    
    // 确定缓存策略
    const strategy = determineCacheStrategy(request.url);
    
    event.respondWith(
        handleRequest(request, strategy)
            .catch(error => {
                console.error('[SW] 请求处理失败:', error);
                return handleOfflineRequest(request);
            })
    );
});

/**
 * 确定请求的缓存策略
 */
function determineCacheStrategy(url) {
    for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
        if (config.pattern.test(url)) {
            return { name, ...config };
        }
    }
    
    // 默认策略：网络优先
    return {
        name: 'default',
        strategy: 'NetworkFirst',
        maxAge: 24 * 60 * 60 * 1000, // 1天
        maxEntries: 50
    };
}

/**
 * 处理请求的核心逻辑
 */
async function handleRequest(request, strategy) {
    const cacheName = RUNTIME_CACHE;
    const cache = await caches.open(cacheName);
    
    switch (strategy.strategy) {
        case 'CacheFirst':
            return handleCacheFirst(request, cache, strategy);
        case 'NetworkFirst':
            return handleNetworkFirst(request, cache, strategy);
        case 'StaleWhileRevalidate':
            return handleStaleWhileRevalidate(request, cache, strategy);
        default:
            return handleNetworkFirst(request, cache, strategy);
    }
}

/**
 * 缓存优先策略
 */
async function handleCacheFirst(request, cache, strategy) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        // 检查缓存是否过期
        const cacheTime = parseInt(cachedResponse.headers.get('sw-cache-time') || '0');
        const now = Date.now();
        
        if (now - cacheTime < strategy.maxAge) {
            return cachedResponse;
        }
    }
    
    // 缓存未命中或已过期，从网络获取
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            await updateCache(cache, request, networkResponse, strategy);
        }
        return networkResponse;
    } catch (error) {
        // 网络失败，返回缓存的响应（即使过期）
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

/**
 * 网络优先策略
 */
async function handleNetworkFirst(request, cache, strategy) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            await updateCache(cache, request, networkResponse, strategy);
        }
        return networkResponse;
    } catch (error) {
        // 网络失败，尝试从缓存获取
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

/**
 * 过期重新验证策略
 */
async function handleStaleWhileRevalidate(request, cache, strategy) {
    const cachedResponse = await cache.match(request);
    
    // 异步更新缓存
    const fetchPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                updateCache(cache, request, networkResponse, strategy);
            }
            return networkResponse;
        })
        .catch(error => {
            console.warn('[SW] 后台更新失败:', error);
        });
    
    // 立即返回缓存的响应，如果有的话
    return cachedResponse || await fetchPromise;
}

/**
 * 更新缓存
 */
async function updateCache(cache, request, response, strategy) {
    // 克隆响应，因为响应流只能使用一次
    const responseToCache = response.clone();
    
    // 添加缓存时间戳
    const headers = new Headers(responseToCache.headers);
    headers.append('sw-cache-time', Date.now().toString());
    
    const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
    });
    
    await cache.put(request, modifiedResponse);
    
    // 清理过期缓存
    await cleanupCache(cache, strategy);
}

/**
 * 清理缓存
 */
async function cleanupCache(cache, strategy) {
    if (!strategy.maxEntries) return;
    
    const keys = await cache.keys();
    if (keys.length <= strategy.maxEntries) return;
    
    // 按时间戳排序，删除最旧的条目
    const entries = await Promise.all(
        keys.map(async key => {
            const response = await cache.match(key);
            const cacheTime = parseInt(response.headers.get('sw-cache-time') || '0');
            return { key, cacheTime };
        })
    );
    
    entries.sort((a, b) => a.cacheTime - b.cacheTime);
    
    const itemsToDelete = entries.slice(0, keys.length - strategy.maxEntries);
    await Promise.all(
        itemsToDelete.map(item => cache.delete(item.key))
    );
}

/**
 * 处理离线请求
 */
function handleOfflineRequest(request) {
    const url = new URL(request.url);
    
    // HTML页面请求：返回离线页面
    if (request.headers.get('accept')?.includes('text/html')) {
        return createOfflineResponse();
    }
    
    // 图片请求：返回占位图
    if (request.headers.get('accept')?.includes('image')) {
        return createPlaceholderImage();
    }
    
    // 其他请求：返回基本错误响应
    return new Response('离线状态，无法访问此资源', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

/**
 * 创建离线页面响应
 */
function createOfflineResponse() {
    const offlineHtml = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>网络连接异常 - 宜家房产</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                       margin: 0; padding: 40px; text-align: center; background: #f8f9fa; }
                .offline-container { max-width: 400px; margin: 0 auto; 
                                   background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .offline-icon { font-size: 64px; color: #6c757d; margin-bottom: 20px; }
                h1 { color: #2B5BB5; margin-bottom: 20px; }
                p { color: #6c757d; line-height: 1.6; margin-bottom: 30px; }
                .retry-btn { background: #2B5BB5; color: white; border: none; 
                           padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; }
                .retry-btn:hover { background: #1a4494; }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📡</div>
                <h1>网络连接异常</h1>
                <p>抱歉，当前网络连接不可用。请检查您的网络设置，然后重试。</p>
                <button class="retry-btn" onclick="window.location.reload()">重新加载</button>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHtml, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

/**
 * 创建占位图片响应
 */
function createPlaceholderImage() {
    // 简单的SVG占位图
    const svg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f9fa"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6c757d" font-family="Arial, sans-serif" font-size="16">
                图片加载失败
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: { 'Content-Type': 'image/svg+xml' }
    });
}

/**
 * 消息处理
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[SW] Service Worker 已加载');