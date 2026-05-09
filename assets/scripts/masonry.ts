import { masonry } from './lib/masonry'

export function setupMasonry(container: HTMLElement | null): () => void {
  const contentList = container?.querySelector<HTMLElement>('.content-list')

  if (!contentList?.querySelector('.archive-entry')) {
    return () => {}
  }

  return masonry(contentList)
}
