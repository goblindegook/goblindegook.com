import { setupFonts } from './fonts'
import { setupFootnotes } from './footnotes'
import { setupHash } from './hash'
import { setupHeader } from './header'
import { setupMasonry } from './masonry'
import { setupOffline } from './offline'
import { setupProgress } from './progress'
import { setupMainSearch } from './search-main'
import { setupSidebarSearch } from './search-sidebar'

export async function onFirstLoad(container: HTMLElement | null, namespace?: string) {
  setupHash()
  setupFonts()
  await setupSidebarSearch()
  await onLoad(container, namespace)
}

export async function onLoad(container: HTMLElement | null, namespace?: string) {
  setupHeader(document)

  switch (namespace) {
    case 'home':
    case 'section':
    case 'taxonomy':
    case 'term':
      if (container) setupMasonry(container)
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
