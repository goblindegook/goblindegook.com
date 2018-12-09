const CACHE_KEY = 'goblindegook-offline-v3'

const OFFLINE_URL = '/offline/'

const PRECACHE_URLS = [
  OFFLINE_URL,
  '/',
  '/offline/index.html',
  '/index.html',
  '/lunr-documents.json'
]

type ExtendableEvent = Event & {
  waitUntil: (promise: Promise<any>) => Promise<void>
}

type FetchEvent = ExtendableEvent & {
  request: Request
  respondWith: (response: Promise<Response>) => Promise<void>
}

async function precache(): Promise<void> {
  const cache = await caches.open(CACHE_KEY)
  return cache.addAll(PRECACHE_URLS)
}

async function purge(): Promise<void> {
  const keys = await caches.keys()
  await Promise.all(keys
    .filter(k => k !== CACHE_KEY)
    .map(k => caches.delete(k))
  )
}

async function networkFetchAndCache(request: RequestInfo): Promise<Response> {
  const response = await fetch(request)

  try {
    const cache = await caches.open(CACHE_KEY)
    await cache.put(request, response.clone())
  } catch (e) {
    console.error(e)
  }

  return response
}

async function offlineFallback(request: RequestInfo): Promise<Response> {
  const response = await caches.match(request)
  if (!response || response.status === 404) {
    const offline = await caches.match(OFFLINE_URL)
    return offline!
  } else {
    return response
  }
}

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(precache()).catch(console.error)
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(purge()).catch(console.error)
})

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      networkFetchAndCache(event.request)
        .catch(() => offlineFallback(event.request))
    ).catch(console.error)
  }
})
