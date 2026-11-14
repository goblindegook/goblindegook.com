import { SignatureSearch } from '@pacote/signature-search'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { stemmer } from 'stemmer'
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest'
import { createSearch, type SearchResult } from '../../assets/scripts/lib/search'

const articles: SearchResult[] = [
  { url: '/design/', title: 'Designing software', description: 'Interfaces for humans' },
  { url: '/books/', title: 'Reading fiction', description: 'Books and literature' },
]

function indexResponse() {
  const index = new SignatureSearch<SearchResult>({
    fields: ['title', 'description'],
    summary: ['url', 'title', 'description'],
    stemmer,
  })
  for (const article of articles) index.add(article.url, article)
  return HttpResponse.json(index.index)
}

const indexUrl = new URL('/search-index.json', window.location.href).href
const server = setupServer(http.get(indexUrl, indexResponse))

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('empty queries return no results without needing the network', async () => {
  server.use(http.get(indexUrl, () => HttpResponse.error()))
  const search = createSearch()

  expect(await search()).toEqual([])
  expect(await search('   ')).toEqual([])
})

test('finds indexed articles and returns their public summaries', async () => {
  const search = createSearch()

  expect(await search('  design  ')).toEqual([articles[0]])
})

test('returns no results when no article matches', async () => {
  expect(await createSearch()('astronaut')).toEqual([])
})

test('loaded articles remain searchable after the network goes offline', async () => {
  const search = createSearch()
  await search('design')
  server.use(http.get(indexUrl, () => HttpResponse.error()))

  expect(await search('fiction')).toEqual([articles[1]])
})

test('a failed index download can be retried by a later query', async () => {
  server.use(http.get(indexUrl, () => HttpResponse.error()))
  const search = createSearch()
  expect(await search('design')).toEqual([])
  server.resetHandlers()

  expect(await search('design')).toEqual([articles[0]])
})

test('an invalid index response does not prevent a later successful search', async () => {
  server.use(http.get(indexUrl, () => new HttpResponse('invalid JSON')))
  const search = createSearch()
  expect(await search('design')).toEqual([])
  server.resetHandlers()

  expect(await search('design')).toEqual([articles[0]])
})
