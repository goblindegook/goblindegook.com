import { scrollTo } from '../lib/scrollTo'

export function setupHeader() {
  const selector = '.site-header'
  const header = document.querySelector(selector)

  if (header) {
    Array.from(
      header.querySelectorAll('.trail-end, .site-title, .site-tagline')
    ).forEach((element: HTMLElement) =>
      element.addEventListener('click', () => scrollTo(0))
    )
  }
}
