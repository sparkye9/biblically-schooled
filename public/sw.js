const CACHE_NAME = 'biblically-schooled-v1'
const RUNTIME_CACHE = 'biblically-schooled-runtime'

const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) return response

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response
          }

          const responseToCache = response.clone()

          if (request.destination === '' ||
              request.destination === 'document' ||
              request.destination === 'style' ||
              request.destination === 'script') {
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache)
            })
          }

          return response
        })
      })
      .catch(() => {
        if (request.destination === 'document') {
          return caches.match('/offline.html')
        }
      })
  )
})
