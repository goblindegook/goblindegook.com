import { replaceFrom } from './lib/dom'
import { onLoad } from './load'

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

export async function navigateTo(url: string, { updateHistory = true }: { updateHistory?: boolean } = {}) {
  if (isNavigating) return
  isNavigating = true

  try {
    await transitionTo(url)
    if (updateHistory) {
      window.history.pushState({ url }, '', url)
    }
  } catch {
    window.location.assign(url)
  } finally {
    isNavigating = false
  }
}

async function transitionTo(url: string): Promise<void> {
  const current = document.querySelector('[data-transition="container"]') as HTMLElement | null
  if (!current) throw new Error('no view to transition from')

  const destination = await fetchDocument(url)

  const next = destination.querySelector('[data-transition="container"]') as HTMLElement | null
  if (!next) throw new Error('no view to transition to')

  const updateDom = () => {
    document.title = destination.title
    replaceFrom(destination, '[data-transition="breadcrumbs"]')
    replaceFrom(destination, '[data-transition="navigation"]')
    current.replaceWith(next)
    window.scrollTo(0, 0)
  }

  if (supportsViewTransitions) {
    const transition = document.startViewTransition(async () => {
      updateDom()
      await onLoad(next, next.dataset.transitionNamespace)
    })
    await transition.finished
  } else {
    updateDom()
    await onLoad(next, next.dataset.transitionNamespace)
  }
}

async function fetchDocument(url: string): Promise<Document> {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'view-transition',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  const html = await response.text()
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}
