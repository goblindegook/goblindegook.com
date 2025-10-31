import { setupFootnotes } from './footnotes'
import { setupHeader } from './header'
import { setupMasonry } from './masonry'
import { setupOffline } from './offline'
import { setupProgress } from './progress'
import { setupMainSearch } from './search-main'

let isNavigating = false

const parser = new DOMParser()

const from = (source: Document) => ({
  replace(name: string) {
    const element = source.querySelector(`[data-transition="${name}"]`)
    if (element) {
      const target = document.querySelector(`[data-transition="${name}"]`)
      target?.parentNode?.replaceChild(element, target)
    }
    return this
  },
})

type NavigationContext = {
  container: HTMLElement
  namespace?: string
  source: Document
  url: URL
}

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

export async function navigateTo(url: URL, { updateHistory = true }: { updateHistory?: boolean } = {}) {
  if (isNavigating) return
  isNavigating = true

  try {
    const doc = await fetchDocument(url)
    await renderDocument(doc, url)
    if (updateHistory) {
      window.history.pushState({ url: url.href }, '', url.href)
    }
  } catch (error) {
    console.error(error)
    window.location.assign(url.href)
  } finally {
    isNavigating = false
  }
}

async function fetchDocument(url: URL): Promise<Document> {
  const response = await fetch(url.href, {
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'view-transition',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url.href}: ${response.status}`)
  }

  const html = await response.text()
  return parser.parseFromString(html, 'text/html')
}

async function renderDocument(doc: Document, url: URL) {
  const nextContainer = doc.querySelector('[data-transition="container"]') as HTMLElement | null
  const currentContainer = document.querySelector('[data-transition="container"]') as HTMLElement | null

  if (!nextContainer || !currentContainer) {
    window.location.assign(url.href)
    return
  }

  const namespace = nextContainer.dataset.transitionNamespace

  const updateDom = () => {
    document.title = doc.title
    from(doc).replace('breadcrumbs').replace('navigation')
    currentContainer.replaceWith(nextContainer)
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
  await runNamespaceHandlers({
    container: nextContainer,
    namespace,
    source: doc,
    url,
  })
}

export async function runNamespaceHandlers(context: NavigationContext) {
  const { container, namespace } = context

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
