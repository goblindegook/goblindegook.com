import { debounce } from 'lodash'
import { outerHeight } from '../lib/dom/outerHeight'
import { createStickinessToggler } from '../lib/header'
import { scrollTo } from '../lib/scrollTo'

export function setupHeader () {
  const breadcrumbs = document.querySelector('.site-breadcrumbs')
  
  if (breadcrumbs) {
    const headerHeight = outerHeight(document.querySelector('.single-entry-header') as HTMLElement, true)
    const featuredImageHeight = outerHeight(document.querySelector('.single-entry-featured-image') as HTMLElement, true)
    const content = document.querySelector('main') as HTMLElement
  
    const headerToggler = createStickinessToggler(breadcrumbs, {
      hiddenClass: 'bounceOutUp',
      initialClass: 'site-breadcrumbs-initial',
      threshold: content.offsetTop + headerHeight - featuredImageHeight,
      visibleClass: 'slideInDown'
    })
  
    Array.from(breadcrumbs.querySelectorAll('.trail-end, .site-title'))
      .forEach((element: HTMLElement) => element.addEventListener('click', () => scrollTo(0)))
  
    window.addEventListener('scroll', debounce(headerToggler, 30))
  }
}
