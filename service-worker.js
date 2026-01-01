const CACHE_NAME = 'bioblock-v2'; // Mudei para v2 para forçar atualização do cache
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
	'./assets/sounds/drop.mp3',
    
    // Novos caminhos organizados
    './assets/css/style.css',
    
    './js/app.js',
    './js/modules/game.js',
    './js/modules/shapes.js',
    './js/modules/effects.js',
    './js/modules/audio.js', // Se você mover o audio.js para modules, descomente esta linha
    
    // Ícones (se você já tiver criado a pasta assets/icons)
    // './assets/icons/icon-192.png',
    // './assets/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
    // skipWaiting força o novo service worker a assumir imediatamente
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});

// Limpeza de caches antigos
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});