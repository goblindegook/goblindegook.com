export {}

declare const self: ServiceWorkerGlobalScope

const CACHE_KEY = 'goblindegook-offline-v3'

const OFFLINE_URL = '/offline/'

const PRECACHE_URLS = [OFFLINE_URL, '/', '/offline/index.html', '/index.html', '/search-index.json']

async function precache(): Promise<void> {
  const cache = await self.caches.open(CACHE_KEY)
  return await cache.addAll(PRECACHE_URLS)
}

async function purge(): Promise<boolean[]> {
  const keys = await self.caches.keys()
  return await Promise.all(keys.filter((k) => k !== CACHE_KEY).map((k_1) => self.caches.delete(k_1)))
}

async function networkFetchAndCache(request: RequestInfo): Promise<Response> {
  const response = await self.fetch(request)
  const cache = await self.caches.open(CACHE_KEY)
  await cache.put(request, response.clone())
  return response
}

async function offlineFallback(request: RequestInfo): Promise<Response> {
  const response = await self.caches.match(request)
  return !response || response.status === 404
    ? self.caches.match(OFFLINE_URL).then((offline) => offline ?? Response.error())
    : response
}

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(precache())
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(purge())
})

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method === 'GET') {
    event.respondWith(networkFetchAndCache(event.request).catch(() => offlineFallback(event.request)))
  }
})
