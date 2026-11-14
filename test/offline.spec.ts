import { afterEach, expect, test, vi } from 'vitest'
import { getCachedUrls } from '../assets/scripts/lib/offline'

afterEach(() => vi.unstubAllGlobals())

test('returns no cached pages when cache storage is unavailable', async () => {
  vi.stubGlobal('caches', undefined)

  expect(await getCachedUrls('offline-pages')).toEqual([])
})

test('returns the URLs saved in the requested cache', async () => {
  const stores = new Map([
    ['offline-pages', ['https://example.com/post/', 'https://example.com/offline/']],
    ['other-cache', ['https://example.com/unrelated/']],
  ])
  vi.stubGlobal('caches', {
    open: async (name: string) => ({ keys: async () => (stores.get(name) ?? []).map((url) => ({ url })) }),
  })

  expect(await getCachedUrls('offline-pages')).toEqual(['https://example.com/post/', 'https://example.com/offline/'])
})

test('returns an empty list for an empty cache', async () => {
  vi.stubGlobal('caches', { open: async () => ({ keys: async () => [] }) })

  expect(await getCachedUrls('new-cache')).toEqual([])
})

test('propagates cache storage errors to its caller', async () => {
  vi.stubGlobal('caches', {
    open: async () => {
      throw new Error('Cache storage unavailable')
    },
  })

  await expect(getCachedUrls('offline-pages')).rejects.toThrow('Cache storage unavailable')
})
