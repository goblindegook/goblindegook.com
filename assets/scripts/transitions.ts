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
    const destination = await fetchDocument(url)
    await transitionTo(destination, url)
    if (updateHistory) {
      window.history.pushState({ url }, '', url)
    }
  } catch (error) {
    console.error(error)
    window.location.assign(url)
  } finally {
    isNavigating = false
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

async function transitionTo(destination: Document, url: string) {
  const current = document.querySelector('[data-transition="container"]') as HTMLElement | null
  const next = destination.querySelector('[data-transition="container"]') as HTMLElement | null

  if (!next || !current) {
    window.location.assign(url)
    return
  }

  const updateDom = () => {
    document.title = destination.title
    replaceFrom(destination, '[data-transition="breadcrumbs"]')
    replaceFrom(destination, '[data-transition="navigation"]')
    current.replaceWith(next)
    window.scrollTo(0, 0)
  }

  if (supportsViewTransitions) {
    const transition = document.startViewTransition(() => {
      updateDom()
    })
    await transition.finished
  } else {
    updateDom()
  }

  window.dispatchEvent(new HashChangeEvent('hashchange'))
  await onLoad(next, next.dataset.transitionNamespace)
}
