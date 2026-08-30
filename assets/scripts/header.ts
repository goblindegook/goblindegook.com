import { scrollTo } from './lib/scrollTo'

export function setupHeader(parent: ParentNode) {
  const link = parent.querySelector<HTMLAnchorElement>('.site-header .site-title a')

  link?.addEventListener('click', (event) => {
    if (link.pathname === window.location.pathname) {
      event.preventDefault()
      scrollTo(0)
    }
  })
}
