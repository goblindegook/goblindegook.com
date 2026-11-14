import { setupHeader } from './header'
import { setupMasonry } from './masonry'
import { setupOffline } from './offline'
import { setupPage } from './page'
import { setupSearch } from './search'

export type UnloadCallback = () => void

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
      callbacks.push(setupPage(document))
      break
    case 'search':
      setupSearch(document, 'main')
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
