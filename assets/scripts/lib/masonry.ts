import Colcade from 'colcade'

export function masonry(container: HTMLElement): () => void {
  container.classList.add('content-list--masonry')

  const instance = new Colcade(container, {
    columns: '.masonry-column',
    items: '.archive-entry',
  })

  return () => {
    instance.destroy()
    container.classList.remove('content-list--masonry')
  }
}
