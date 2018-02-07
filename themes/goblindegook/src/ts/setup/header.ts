import { scrollTo } from '../lib/scrollTo'

export function setupHeader () {
  const selector = '.site-breadcrumbs'
  const breadcrumbs = document.querySelector(selector)

  if (breadcrumbs) {
    Array.from(breadcrumbs.querySelectorAll('.trail-end, .site-title, .site-tagline'))
      .forEach((element: HTMLElement) => element.addEventListener('click', () => scrollTo(0)))
  }
}
