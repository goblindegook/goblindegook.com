import { screen } from '@testing-library/dom'
import { afterEach, expect, test } from 'vitest'
import { replaceFrom } from '../../assets/scripts/lib/dom'

afterEach(() => {
  document.body.innerHTML = ''
})

test('replaces the matching page region with the destination content', () => {
  document.body.innerHTML = '<main><h1>Old page</h1></main><footer>Keep this footer</footer>'
  const destination = new DOMParser().parseFromString('<main><h1>New page</h1></main>', 'text/html')

  replaceFrom(destination, 'main')

  expect(screen.getByRole('heading', { name: 'New page' })).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'Old page' })).toBeNull()
  expect(screen.getByRole('contentinfo').textContent).toBe('Keep this footer')
})

test('can replace a region with a differently named destination region', () => {
  document.body.innerHTML = '<main>Old page</main>'
  const destination = new DOMParser().parseFromString('<article>New article</article>', 'text/html')

  replaceFrom(destination, 'article', 'main')

  expect(screen.getByRole('article').textContent).toBe('New article')
  expect(screen.queryByRole('main')).toBeNull()
})

test('leaves the current region alone when the source region is missing', () => {
  document.body.innerHTML = '<main><h1>Current page</h1></main>'
  const destination = new DOMParser().parseFromString('<aside>Other content</aside>', 'text/html')

  replaceFrom(destination, 'main')

  expect(screen.getByRole('main').textContent).toBe('Current page')
})

test('leaves the page alone when the target region is missing', () => {
  document.body.innerHTML = '<h1>Current page</h1>'
  const destination = new DOMParser().parseFromString('<main>Replacement</main>', 'text/html')

  replaceFrom(destination, 'main')

  expect(screen.getByRole('heading').textContent).toBe('Current page')
  expect(screen.queryByRole('main')).toBeNull()
})
