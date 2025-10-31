import { setupFonts } from './scripts/fonts'
import { setupHash } from './scripts/hash'
import { setupHeader } from './scripts/header'
import { setupSidebarSearch } from './scripts/search-sidebar'
import { navigateTo, runNamespaceHandlers, shouldInterceptNavigation } from './scripts/transitions'

document.addEventListener('click', (event: PointerEvent) => {
  const anchor = (event.target as Element | null)?.closest('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) {
    return
  }

  const url = new URL(anchor.href, window.location.href)

  if (!shouldInterceptNavigation(event, anchor, url)) {
    return
  }

  event.preventDefault()
  navigateTo(url.href)
})

window.addEventListener('popstate', () => {
  navigateTo(window.location.href, { updateHistory: false })
})

window.addEventListener('load', async () => {
  setupHash()
  setupFonts()
  setupHeader(document)
  await setupSidebarSearch()

  const container = document.querySelector<HTMLElement>('[data-transition="container"]')
  window.dispatchEvent(new Event('scroll'))
  if (container) {
    await runNamespaceHandlers(container, container?.dataset.transitionNamespace)
  }
})
