import { masonry } from './lib/masonry'

export function setupMasonry(container: HTMLElement | null) {
  const contentList = container?.querySelector('.content-list')

  if (contentList) {
    masonry(contentList, { itemSelector: '.archive-entry' })
  }
}
