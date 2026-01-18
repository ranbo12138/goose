// sw.js (PWA 极简保活版)

const CACHE_NAME = 'goose-helper-v2';

// 安装阶段：只缓存核心 HTML，图片就算了（防止图片路径不对导致整个SW崩溃）
self.addEventListener('install', (event) => {
  console.log('SW Installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 这里的路径必须真实存在，否则SW会安装失败！
      // 如果你不确定 icon.png 到底能不能访问，就只写 '/' 和 '/index.html'
      return cache.addAll([
        '/',
        '/index.html'
      ]);
    })
  );
  self.skipWaiting();
});

// 激活阶段
self.addEventListener('activate', (event) => {
  console.log('SW Activated');
  event.waitUntil(self.clients.claim());
});

// 请求阶段：有网就请求，没网尝试读缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});