import { scrollTo } from './lib/scrollTo'

export function setupHeader(parent: ParentNode) {
  const headerElements = parent.querySelectorAll(
    '.site-header .trail-end, .site-header .site-title, .site-header .site-tagline',
  )

  for (const element of Array.from(headerElements)) {
    element.addEventListener('click', () => scrollTo(0))
  }
}
