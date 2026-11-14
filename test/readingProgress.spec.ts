import { fireEvent, screen } from '@testing-library/dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { readingProgress } from '../assets/scripts/lib/readingProgress'

const cleanups: (() => void)[] = []

// jsdom does not calculate element layout.
function layout(element: HTMLElement, top: number, height: number) {
  Object.defineProperties(element, {
    offsetTop: { configurable: true, value: top },
    offsetHeight: { configurable: true, value: height },
    getBoundingClientRect: {
      configurable: true,
      value: () => new DOMRect(0, top - document.documentElement.scrollTop, 600, height),
    },
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('innerHeight', 800)
  vi.stubGlobal('pageYOffset', 0)
  document.documentElement.scrollTop = 0
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 2400 })
  document.body.innerHTML = `
    <article>Some article text to read.</article>
    <progress aria-label="Reading progress" max="100" value="0"></progress>
    <output aria-label="Furthest read">0</output>`
  layout(screen.getByRole('article'), 400, 2000)
})

afterEach(() => {
  for (const cleanup of cleanups.splice(0)) cleanup()
  Reflect.deleteProperty(document.documentElement, 'scrollHeight')
  document.documentElement.scrollTop = 0
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function startReading() {
  const reading = readingProgress(screen.getByRole('article'), (current, furthest) => {
    screen.getByRole('progressbar').setAttribute('value', String(current))
    screen.getByLabelText('Furthest read').textContent = String(furthest)
  })
  const stop = reading.start()
  cleanups.push(stop)
  return { reading, stop }
}

function scrollToPosition(position: number) {
  vi.stubGlobal('pageYOffset', position)
  document.documentElement.scrollTop = position
  fireEvent.scroll(window)
  vi.advanceTimersToNextFrame()
}

test('reports progress relative to the reachable end of the article', () => {
  startReading()

  scrollToPosition(800)

  expect(screen.getByRole('progressbar').getAttribute('value')).toBe('50')
  expect(screen.getByLabelText('Furthest read').textContent).toBe('50')
})

test('remembers the furthest point after scrolling back', () => {
  const { reading } = startReading()
  scrollToPosition(800)

  scrollToPosition(400)

  expect(screen.getByRole('progressbar').getAttribute('value')).toBe('25')
  expect(screen.getByLabelText('Furthest read').textContent).toBe('50')
  expect(reading.getFurthestRead()).toBe(800)
})

test('reaches 100 percent at the bottom of the page', () => {
  startReading()

  scrollToPosition(1600)

  expect(screen.getByRole('progressbar').getAttribute('value')).toBe('100')
})

test.each(['resize', 'orientationchange'])('updates progress after a %s event', (eventName) => {
  startReading()
  vi.stubGlobal('pageYOffset', 800)

  fireEvent(window, new Event(eventName))
  vi.advanceTimersToNextFrame()

  expect(screen.getByRole('progressbar').getAttribute('value')).toBe('50')
})

test('cleanup stops reacting to subsequent scroll and viewport events', () => {
  const { stop } = startReading()
  scrollToPosition(800)

  stop()
  scrollToPosition(1200)
  fireEvent.resize(window)
  fireEvent(window, new Event('orientationchange'))
  vi.advanceTimersToNextFrame()

  expect(screen.getByRole('progressbar').getAttribute('value')).toBe('50')
  expect(screen.getByLabelText('Furthest read').textContent).toBe('50')
})
