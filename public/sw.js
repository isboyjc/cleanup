const CACHE_NAME = 'clean-piggo-v2';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') return;

  // 跳过 Chrome 扩展和其他非 HTTP 请求
  if (!event.request.url.startsWith('http')) return;

  // 跳过 API 请求（如 GitHub API）
  if (event.request.url.includes('api.github.com')) return;

  // 跳过分析脚本
  if (
    event.request.url.includes('googletagmanager.com') ||
    event.request.url.includes('cloudflareinsights.com')
  ) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 如果有缓存，返回缓存
      if (cachedResponse) {
        // 同时在后台更新缓存
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // 没有缓存，从网络获取
      return fetch(event.request).then((response) => {
        // 检查是否是有效响应
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // 缓存响应
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // 离线时返回缓存的首页
        return caches.match('/');
      });
    })
  );
});
