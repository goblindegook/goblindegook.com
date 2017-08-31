import { debounce } from 'lodash'
import { outerHeight } from '../lib/dom/outerHeight'
import { createStickinessToggler } from '../lib/header'
import { scrollTo } from '../lib/scrollTo'

let scrollListener: EventListener

export function setupHeader () {
  const selector = '.site-breadcrumbs'
  const breadcrumbs = document.querySelector(selector)
  
  if (breadcrumbs) {
    const headerHeight = outerHeight(document.querySelector('.single-entry-header') as HTMLElement, true)
    const featuredImageHeight = outerHeight(document.querySelector('.single-entry-featured-image') as HTMLElement, true)
    const content = document.querySelector('main') as HTMLElement
  
    const headerToggler = createStickinessToggler({
      hiddenClass: 'bounceOutUp',
      initialClass: 'site-breadcrumbs-initial',
      selector,
      threshold: content.offsetTop + headerHeight - featuredImageHeight,
      visibleClass: 'slideInDown'
    })
  
    Array.from(breadcrumbs.querySelectorAll('.trail-end, .site-title'))
      .forEach((element: HTMLElement) => element.addEventListener('click', () => scrollTo(0)))

    if (scrollListener) {
      window.removeEventListener('scroll', scrollListener)
    }

    scrollListener = debounce(headerToggler, 30)  
    window.addEventListener('scroll', scrollListener)
  }
}
