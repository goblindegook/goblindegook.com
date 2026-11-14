import { screen, within } from '@testing-library/dom'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { masonry } from '../../assets/scripts/lib/masonry'

let dispose: (() => void) | undefined

beforeEach(() => {
  document.body.innerHTML = `
    <section aria-label="Archive">
      <div class="masonry-column" role="group" aria-label="First column"></div>
      <div class="masonry-column" role="group" aria-label="Second column"></div>
      <article class="archive-entry">First essay</article>
      <article class="archive-entry">Second essay</article>
      <article class="archive-entry">Third essay</article>
    </section>`
})

afterEach(() => {
  dispose?.()
  dispose = undefined
  document.body.innerHTML = ''
})

test('arranges archive entries into the visible columns', () => {
  const archive = screen.getByRole('region', { name: 'Archive' })

  dispose = masonry(archive)

  expect(within(screen.getByRole('group', { name: 'First column' })).getAllByRole('article')).toHaveLength(2)
  expect(within(screen.getByRole('group', { name: 'Second column' })).getAllByRole('article')).toHaveLength(1)
  expect(archive.classList.contains('content-list--masonry')).toBe(true)
})

test('keeps entries out of hidden columns', () => {
  const hiddenColumn = screen.getByRole('group', { name: 'Second column' })
  hiddenColumn.style.display = 'none'

  dispose = masonry(screen.getByRole('region', { name: 'Archive' }))

  expect(within(screen.getByRole('group', { name: 'First column' })).getAllByRole('article')).toHaveLength(3)
  expect(within(hiddenColumn).queryAllByRole('article')).toHaveLength(0)
})

test('cleanup restores entries to the archive without losing their order or content', () => {
  const archive = screen.getByRole('region', { name: 'Archive' })
  const cleanup = masonry(archive)

  cleanup()

  expect(archive.classList.contains('content-list--masonry')).toBe(false)
  const entries = within(archive).getAllByRole('article')
  expect(entries.map((entry) => entry.textContent)).toEqual(['First essay', 'Second essay', 'Third essay'])
  expect(entries.every((entry) => entry.parentElement === archive)).toBe(true)
})
