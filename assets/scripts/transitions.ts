import { replaceFrom } from './lib/dom'
import { onLoad, type UnloadCallback } from './load'

const supportsViewTransitions =
  typeof document.startViewTransition === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function shouldSkipTransition(event: MouseEvent, anchor: HTMLAnchorElement, url: URL): boolean {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (anchor.target && anchor.target !== '_self') ||
    anchor.hasAttribute('download') ||
    anchor.dataset.preventTransition != null ||
    url.origin !== window.location.origin ||
    url.pathname.endsWith('.pdf') ||
    url.href === window.location.href ||
    (url.pathname === window.location.pathname && url.search === window.location.search && url.hash.length > 0)
  )
}

let isNavigating = false

export async function navigateTo(
  url: string,
  { updateHistory = true }: { updateHistory?: boolean } = {},
): Promise<UnloadCallback> {
  if (isNavigating) return () => {}
  isNavigating = true

  try {
    const cleanup = await transitionTo(url)
    if (updateHistory) {
      window.history.pushState({ url }, '', url)
    }
    return cleanup
  } catch {
    window.location.assign(url)
  } finally {
    isNavigating = false
  }
  return () => {}
}

async function transitionTo(url: string): Promise<UnloadCallback> {
  const current = document.querySelector('[data-transition="container"]') as HTMLElement | null
  if (!current) throw new Error('no view to transition from')

  const destination = await fetchDocument(url)

  const next = destination.querySelector('[data-transition="container"]') as HTMLElement | null
  if (!next) throw new Error('no view to transition to')

  let cleanup: UnloadCallback = () => {}

  const performTransition = () => {
    document.title = destination.title
    replaceFrom(destination, '[data-transition="breadcrumbs"]')
    replaceFrom(destination, '[data-transition="navigation"]')
    current.replaceWith(next)
    window.scrollTo(0, 0)
    // TODO: Unmount previous event listeners
    cleanup = onLoad(next, next.dataset.transitionNamespace)
  }

  if (supportsViewTransitions) {
    const transition = document.startViewTransition(performTransition)
    await transition.finished
  } else {
    performTransition()
  }

  return cleanup
}

async function fetchDocument(url: string): Promise<Document> {
  const response = await fetch(url, { credentials: 'same-origin' })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  const html = await response.text()
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}
