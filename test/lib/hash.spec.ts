import { createEvent, screen } from '@testing-library/dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { hashClickHandler } from '../../assets/scripts/lib/hash'

beforeEach(() => {
  vi.useFakeTimers()
  window.history.replaceState({}, '', '/article/')
  document.body.innerHTML = `
    <nav><a href="#section">Navigation link</a></nav>
    <main>
      <a href="#section">Read the section</a>
      <h2 id="section">The section</h2>
    </main>`
})

afterEach(() => {
  document.body.innerHTML = ''
  window.history.replaceState({}, '', '/')
  vi.clearAllTimers()
  vi.useRealTimers()
})

function clickEvent(anchor: HTMLAnchorElement): MouseEvent {
  const event = createEvent.click(anchor) as MouseEvent
  // Direct handler calls do not get a target from DOM dispatch.
  Object.defineProperty(event, 'target', { value: anchor })
  return event
}

test('handles clicks on links to existing sections in the same article', () => {
  const event = clickEvent(screen.getByRole<HTMLAnchorElement>('link', { name: 'Read the section' }))

  hashClickHandler(event)

  expect(event.defaultPrevented).toBe(true)
})

test.each([
  ['https://elsewhere.example/article/#section', 'another site'],
  ['/other-article/#section', 'another page'],
  ['#missing-section', 'a missing section'],
])('leaves a link to %s (%s) to the browser', (href) => {
  const anchor = screen.getByRole<HTMLAnchorElement>('link', { name: 'Read the section' })
  anchor.href = href
  const event = clickEvent(anchor)

  hashClickHandler(event)

  expect(event.defaultPrevented).toBe(false)
})

test('leaves links outside the article to the browser', () => {
  const event = clickEvent(screen.getByRole<HTMLAnchorElement>('link', { name: 'Navigation link' }))

  hashClickHandler(event)

  expect(event.defaultPrevented).toBe(false)
})
