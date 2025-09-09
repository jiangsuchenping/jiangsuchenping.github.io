/**
 * 幼儿园大班学习乐园 Service Worker
 * 提供离线访问和资源缓存功能
 */

// 缓存版本号，更新缓存时需要修改此版本号
const CACHE_VERSION = 'v1';
const CACHE_NAME = `youeryuan-cache-${CACHE_VERSION}`;

// 需要缓存的资源列表 - 只包含确认存在的资源
const CACHE_URLS = [
  '/youeryuan/',
  '/youeryuan/index.html',
  '/youeryuan/math-training.html',
  '/youeryuan/assets/css/bootstrap.min.css',
  '/youeryuan/assets/css/bootstrap-custom.min.css',
  '/youeryuan/assets/css/bootstrap-icons.css',
  '/youeryuan/assets/js/bootstrap.bundle.min.js',
  '/youeryuan/assets/js/cdn-manager.js',
  '/youeryuan/assets/js/smart-resource-manager.js',
  '/youeryuan/assets/fonts/bootstrap-icons/bootstrap-icons.woff',
  '/youeryuan/assets/fonts/bootstrap-icons/bootstrap-icons.woff2',
  '/youeryuan/assets/images/favicon.svg'
];

// Service Worker 安装事件
self.addEventListener('install', event => {
  console.log('[Service Worker] 安装中...');
  
  // 跳过等待，直接激活
  self.skipWaiting();
  
  // 缓存核心资源 - 使用更可靠的方式缓存资源
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] 缓存资源中...');
        // 逐个缓存资源，避免一个资源失败导致整个缓存失败
        const cachePromises = CACHE_URLS.map(url => {
          // 单独处理每个资源，忽略失败的资源
          return fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`缓存失败: ${url}`);
              }
              return cache.put(url, response);
            })
            .catch(error => {
              console.warn(`[Service Worker] 资源缓存失败: ${url}`, error);
              // 继续处理其他资源
              return Promise.resolve();
            });
        });
        
        return Promise.all(cachePromises);
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
  
  // 立即接管所有页面
  return self.clients.claim();
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  // 只处理GET请求
  if (event.request.method !== 'GET') return;
  
  // 网络优先策略
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 请求成功，复制响应并存入缓存
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        // 网络请求失败，尝试从缓存获取
        console.log('[Service Worker] 网络请求失败，从缓存获取:', event.request.url);
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // 如果缓存中也没有，返回离线页面或默认响应
            return caches.match('/youeryuan/index.html');
          });
      })
  );
});

// 接收消息
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});