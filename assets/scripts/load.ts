import { setupFonts } from './fonts'
import { setupFootnotes } from './footnotes'
import { setupHash } from './hash'
import { setupHeader } from './header'
import { setupMasonry } from './masonry'
import { setupOffline } from './offline'
import { setupProgress } from './progress'
import { setupMainSearch } from './search-main'
import { setupSidebarSearch } from './search-sidebar'

export type UnloadCallback = () => void

export function onFirstLoad(container: HTMLElement | null, namespace?: string): UnloadCallback {
  setupHash()
  setupFonts()
  setupSidebarSearch()
  return onLoad(container, namespace)
}

export function onLoad(container: HTMLElement | null, namespace?: string): UnloadCallback {
  const callbacks: UnloadCallback[] = []

  setupHeader(document)

  switch (namespace) {
    case 'home':
    case 'section':
    case 'taxonomy':
    case 'term':
      setupMasonry(container)
      break
    case 'page':
      callbacks.push(setupProgress(document))
      callbacks.push(setupFootnotes())
      break
    case 'search':
      setupMainSearch(document)
      break
    case 'offline':
      setupOffline('goblindegook-offline-v3')
      break
    default:
      break
  }

  window.dispatchEvent(new Event('scroll')) // trigger progress bar updates
  window.dispatchEvent(new HashChangeEvent('hashchange')) // trigger scroll to target

  return () => {
    for (const callback of callbacks) {
      callback()
    }
  }
}
