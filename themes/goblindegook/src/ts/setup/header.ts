import { scrollTo } from '../lib/scrollTo'

export function setupHeader(parent: ParentNode) {
  Array.from(
    parent.querySelectorAll(
      '.site-header .trail-end, .site-header .site-title, .site-header .site-tagline'
    )
  ).forEach((element: HTMLElement) =>
    element.addEventListener('click', () => scrollTo(0))
  )
}
