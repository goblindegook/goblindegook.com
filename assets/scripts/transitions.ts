import { setupFootnotes } from './footnotes'
import { setupHeader } from './header'
import { replaceFrom } from './lib/dom'
import { setupMasonry } from './masonry'
import { setupOffline } from './offline'
import { setupProgress } from './progress'
import { setupMainSearch } from './search-main'

const supportsViewTransitions =
  typeof document.startViewTransition === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function shouldInterceptNavigation(event: MouseEvent, anchor: HTMLAnchorElement, url: URL): boolean {
  return !(
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
    (url.pathname === window.location.pathname && url.search === window.location.search && url.hash)
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

  setupHeader(document)
  window.dispatchEvent(new Event('scroll'))
  window.dispatchEvent(new HashChangeEvent('hashchange'))
  await runNamespaceHandlers(next, next.dataset.transitionNamespace)
}

export async function runNamespaceHandlers(container: HTMLElement, namespace?: string) {
  switch (namespace) {
    case 'home':
    case 'section':
    case 'taxonomy':
    case 'term':
      setupMasonry(container)
      break
    case 'page':
      setupProgress(document)
      setupFootnotes()
      break
    case 'search':
      await setupMainSearch(document)
      break
    case 'offline':
      await setupOffline('goblindegook-offline-v3')
      break
    default:
      break
  }
}
