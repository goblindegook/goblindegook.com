import { afterEach, expect, test } from 'vitest'
import { parseQueryString } from '../assets/scripts/lib/url'

afterEach(() => window.history.replaceState({}, '', '/'))

test('reads the search terms and page from the current URL', () => {
  window.history.replaceState({}, '', '/search/?q=software&page=2')

  expect(parseQueryString()).toEqual({ q: 'software', page: '2' })
})

test('decodes percent-encoded names, punctuation, and Unicode', () => {
  window.history.replaceState({}, '', '/search/?search%20terms=Lu%C3%ADs%20%26%20design')

  expect(parseQueryString()).toEqual({ 'search terms': 'Luís & design' })
})

test('keeps an explicitly empty search term', () => {
  window.history.replaceState({}, '', '/search/?q=')

  expect(parseQueryString().q).toBe('')
})

test('uses the last value when a parameter is repeated', () => {
  window.history.replaceState({}, '', '/search/?q=old&q=new')

  expect(parseQueryString().q).toBe('new')
})
