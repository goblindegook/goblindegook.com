import { screen } from '@testing-library/dom'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest'
import { setupOffline } from '../assets/scripts/offline'

const articleUrl = new URL('/article/', window.location.href).href
const server = setupServer(
  http.get(articleUrl, () => HttpResponse.html('<title>Saved article</title><p>Article content</p>')),
)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => {
  document.body.innerHTML = '<main id="available-offline"></main>'
  vi.stubGlobal('caches', {
    open: async () => ({ keys: async () => [{ url: articleUrl }] }),
  })
})
afterEach(() => {
  server.resetHandlers()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})
afterAll(() => server.close())

test('renders a cached article as a link with its page title', async () => {
  setupOffline('offline-pages')

  const link = await screen.findByRole<HTMLAnchorElement>('link', { name: 'Saved article' })
  expect(link.href).toBe(articleUrl)
})

test('uses the article path when a cached page has no title', async () => {
  server.use(http.get(articleUrl, () => HttpResponse.html('<p>Article without a title</p>')))

  setupOffline('offline-pages')

  const link = await screen.findByRole<HTMLAnchorElement>('link', { name: '/article/' })
  expect(link.href).toBe(articleUrl)
})
