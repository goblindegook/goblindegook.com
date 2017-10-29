export async function getCachedUrls (cacheKey: string): Promise<string[]> {
  if (caches) {
    const offline = await caches.open(cacheKey)
    const keys = await offline.keys() as Request[]
    return keys.map(r => r.url)
  } else {
    return []
  }
}
