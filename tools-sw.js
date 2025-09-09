/**
 * tools-sw.js
 * 工具页面Service Worker，用于资源缓存和离线访问
 * 
 * @author AI Assistant
 * @version 1.0.0
 */

// 缓存名称和版本
const CACHE_NAME = 'tools-cache-v1';

// 需要缓存的资源列表
const CACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/smart-resource-manager.js',
  '/offline.html',
  '/tools/json-format/index.html',
  '/tools/html-encode/index.html',
  '/tools/number-convert/index.html'
];

// Service Worker 安装事件
self.addEventListener('install', event => {
  console.log('[Service Worker] 安装中...');
  
  // 跳过等待，直接激活
  self.skipWaiting();
  
  // 缓存核心资源
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] 缓存资源中...');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] 资源缓存完成');
      })
  );
});

// Service Worker 激活事件
self.addEventListener('activate', event => {
  console.log('[Service Worker] 激活中...');
  
  // 清理旧版本缓存
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // 立即控制所有客户端
  return self.clients.claim();
});

// 请求拦截事件
self.addEventListener('fetch', event => {
  // 只处理GET请求
  if (event.request.method !== 'GET') return;
  
  // 忽略浏览器扩展请求和非HTTP(S)请求
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  
  // 网络优先策略，适用于经常更新的内容
  if (url.pathname.includes('/api/') || url.pathname.endsWith('.json')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // 缓存优先策略，适用于静态资源
  event.respondWith(cacheFirstStrategy(event.request));
});

/**
 * 缓存优先策略
 * 先从缓存获取，如果没有则从网络获取并缓存
 * @param {Request} request - 请求对象
 * @returns {Promise<Response>} 响应对象
 */
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // 检查响应是否有效
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
      return networkResponse;
    }
    
    // 克隆响应，因为响应流只能使用一次
    const responseToCache = networkResponse.clone();
    
    // 缓存新响应
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    // 网络请求失败，尝试返回离线页面
    console.error('[Service Worker] 网络请求失败:', error);
    return caches.match('/offline.html') || new Response('网络连接失败，请检查网络设置。', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

/**
 * 网络优先策略
 * 先从网络获取，如果失败则从缓存获取
 * @param {Request} request - 请求对象
 * @returns {Promise<Response>} 响应对象
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // 检查响应是否有效
    if (!networkResponse || networkResponse.status !== 200) {
      throw new Error('网络响应无效');
    }
    
    // 克隆响应，因为响应流只能使用一次
    const responseToCache = networkResponse.clone();
    
    // 缓存新响应
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] 从网络获取失败，尝试从缓存获取:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果缓存中也没有，返回离线页面或错误信息
    return caches.match('/offline.html') || new Response('网络连接失败，请检查网络设置。', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// 消息处理
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});