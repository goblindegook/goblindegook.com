export async function getCachedUrls(cacheKey: string): Promise<string[]> {
  if (window.caches) {
    const offline = await window.caches.open(cacheKey)
    const keys = (await offline.keys()) as Request[]
    return keys.map(r => r.url)
  } else {
    return []
  }
}
