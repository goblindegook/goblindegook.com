/* globals self */

const CACHE_KEY = 'goblindegook-offline-v3'

const OFFLINE_URL = '/offline/'

const PRECACHE_URLS = [
  OFFLINE_URL,
  '/',
  '/offline/index.html',
  '/index.html',
  '/search-index.json',
]

type ExtendableEvent = Event & {
  waitUntil: (promise: Promise<any>) => Promise<void>
}

type FetchEvent = ExtendableEvent & {
  request: Request
  respondWith: (response: Promise<Response>) => Promise<void>
}

function precache(): Promise<void> {
  return self.caches
    .open(CACHE_KEY)
    .then((cache) => cache.addAll(PRECACHE_URLS))
}

function purge(): Promise<boolean[]> {
  return self.caches
    .keys()
    .then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_KEY).map((k) => self.caches.delete(k))
      )
    )
}

function networkFetchAndCache(request: RequestInfo): Promise<Response> {
  return self.fetch(request).then((response) =>
    self.caches
      .open(CACHE_KEY)
      .then((cache) => cache.put(request, response.clone()))
      .catch()
      .then(() => response)
  )
}

function offlineFallback(request: RequestInfo): Promise<Response> {
  return self.caches.match(request).then((response) =>
    !response || response.status === 404
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        self.caches.match(OFFLINE_URL).then((offline) => offline!)
      : response
  )
}

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(precache())
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(purge())
})

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      networkFetchAndCache(event.request).catch(() =>
        offlineFallback(event.request)
      )
    )
  }
})
