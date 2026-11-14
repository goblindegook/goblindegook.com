import { SignatureSearch } from '@pacote/signature-search'
import { fireEvent, screen, waitFor, within } from '@testing-library/dom'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { stemmer } from 'stemmer'
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest'
import type { SearchResult } from '../assets/scripts/lib/search'
import { setupSearch } from '../assets/scripts/search'

const index = new SignatureSearch<SearchResult>({
  fields: ['title', 'description'],
  summary: ['url', 'title', 'description'],
  stemmer,
})
for (let number = 1; number <= 6; number++) {
  index.add(String(number), {
    url: `/article-${number}/`,
    title: `Design article ${number}`,
    description: `Description for article ${number}`,
  })
}

const server = setupServer(
  http.get(new URL('/search-index.json', window.location.href).href, () => HttpResponse.json(index.index)),
)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => {
  window.history.replaceState({}, '', '/search/')
  document.body.innerHTML = `
    <main id="main-search">Old main search</main>
    <aside id="sidebar-search">Old sidebar search</aside>
    <button type="button">Outside search</button>`
})
afterEach(() => {
  server.resetHandlers()
  document.body.innerHTML = ''
  window.history.replaceState({}, '', '/')
})
afterAll(() => server.close())

test.each(['main', 'sidebar'] as const)('replaces the existing %s search UI', (placement) => {
  const container = screen.getByRole(placement === 'main' ? 'main' : 'complementary')

  setupSearch(document, placement)

  expect(within(container).getByRole('searchbox', { name: 'Search' })).toBeTruthy()
  expect(within(container).queryByText(`Old ${placement} search`)).toBeNull()
  expect(screen.getByText(`Old ${placement === 'main' ? 'sidebar' : 'main'} search`)).toBeTruthy()
})

test('main search uses the URL query and shows full article results', async () => {
  window.history.replaceState({}, '', '/search/?q=design')

  setupSearch(document, 'main')

  const searchbox = screen.getByRole<HTMLInputElement>('searchbox', { name: 'Search' })
  expect(searchbox.value).toBe('design')
  expect(searchbox.autofocus).toBe(true)
  expect(searchbox.placeholder).toBe('Search this site')
  expect(await screen.findAllByRole('link')).toHaveLength(6)
  expect(screen.getAllByRole('article')).toHaveLength(6)
  expect(screen.getByText('Description for article 1')).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Design article 1' }).getAttribute('href')).toBe('/article-1/')
})

test('sidebar search starts empty and shows at most five compact results', async () => {
  window.history.replaceState({}, '', '/search/?q=design')
  setupSearch(document, 'sidebar')
  const searchbox = screen.getByRole<HTMLInputElement>('searchbox', { name: 'Search' })
  expect(searchbox.value).toBe('')
  expect(searchbox.autofocus).toBe(false)
  expect(searchbox.placeholder).toBe('Search')

  fireEvent.input(searchbox, { target: { value: 'design' } })

  expect(await screen.findAllByRole('link')).toHaveLength(5)
  expect(screen.queryAllByRole('article')).toHaveLength(0)
  expect(screen.queryByText('Description for article 1')).toBeNull()
})

test.each(['main', 'sidebar'] as const)('%s search explains when no articles match', async (placement) => {
  setupSearch(document, placement)

  fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'astronaut' } })

  expect(await screen.findByText('No results for "astronaut". Try a different search.')).toBeTruthy()
})

test.each(['main', 'sidebar'] as const)('clearing %s search removes its results', async (placement) => {
  setupSearch(document, placement)
  const searchbox = screen.getByRole('searchbox')
  fireEvent.input(searchbox, { target: { value: 'design' } })
  await screen.findAllByRole('link')

  fireEvent.input(searchbox, { target: { value: '   ' } })

  await waitFor(() => expect(screen.getByRole('status').textContent).toBe(''))
  expect(screen.queryAllByRole('link')).toHaveLength(0)
})

test('outside clicks dismiss sidebar results while main search stays visible', async () => {
  setupSearch(document, 'main')
  setupSearch(document, 'sidebar')
  const main = within(screen.getByRole('main'))
  const sidebar = within(screen.getByRole('complementary'))
  fireEvent.input(main.getByRole('searchbox'), { target: { value: 'design' } })
  fireEvent.input(sidebar.getByRole('searchbox'), { target: { value: 'design' } })
  await main.findAllByRole('link')
  await sidebar.findAllByRole('link')

  fireEvent.click(sidebar.getByRole('searchbox'))
  await Promise.resolve()
  expect(sidebar.getAllByRole('link')).toHaveLength(5)
  fireEvent.click(screen.getByRole('button', { name: 'Outside search' }))

  await waitFor(() => expect(sidebar.queryAllByRole('link')).toHaveLength(0))
  expect(main.getAllByRole('link')).toHaveLength(6)
})

test('Enter in main search updates the URL without replacing the search UI', async () => {
  setupSearch(document, 'main')
  const searchbox = screen.getByRole('searchbox')
  fireEvent.input(searchbox, { target: { value: 'design' } })
  await screen.findAllByRole('link')

  fireEvent.keyDown(searchbox, { key: 'Enter' })

  expect(window.location.pathname).toBe('/search/')
  expect(window.location.search).toBe('?q=design')
  expect(screen.getByRole('searchbox')).toBe(searchbox)
  expect(screen.getAllByRole('link')).toHaveLength(6)
})

test.each(['main', 'sidebar'] as const)('leaves the document alone when the %s container is absent', (placement) => {
  document.body.innerHTML = '<p>Unrelated content</p>'

  setupSearch(document, placement)

  expect(screen.getByText('Unrelated content')).toBeTruthy()
  expect(screen.queryByRole('searchbox')).toBeNull()
})
