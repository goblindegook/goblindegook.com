import { masonry } from '../lib/masonry'

export function setupMasonry () {
  const contentList = document.querySelector('.content-list')
  
  if (contentList) {
    masonry(contentList, { itemSelector: '.archive-entry' })
  }
}
