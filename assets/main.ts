import { setupFonts } from './scripts/fonts'
import { setupHash } from './scripts/hash'
import { setupHeader } from './scripts/header'
import { setupSidebarSearch } from './scripts/search-sidebar'
import { navigateTo, runNamespaceHandlers, shouldInterceptNavigation } from './scripts/transitions'

document.addEventListener('click', (event) => {
  if (!(event instanceof MouseEvent)) {
    return
  }

  const anchor = (event.target as Element | null)?.closest('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) {
    return
  }

  const url = new URL(anchor.href, window.location.href)

  if (!shouldInterceptNavigation(event, anchor, url)) {
    return
  }

  event.preventDefault()
  navigateTo(url)
})

window.addEventListener('popstate', () => {
  navigateTo(new URL(window.location.href), { updateHistory: false })
})

window.addEventListener('load', async () => {
  setupHash()
  setupFonts()
  await setupSidebarSearch()
  setupHeader(document)

  const container = document.querySelector<HTMLElement>('[data-transition="container"]')

  if (container) {
    await runNamespaceHandlers({
      container,
      namespace: container?.dataset.transitionNamespace,
      source: document,
      url: new URL(window.location.href),
    })
  }
})
