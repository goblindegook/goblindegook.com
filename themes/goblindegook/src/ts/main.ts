import littlefoot from 'littlefoot'
import { debounce } from 'lodash'
import LazyLoad from 'vanilla-lazyload'
import { outerHeight } from './lib/dom/outerHeight'
import { triggerEvent } from './lib/dom/triggerEvent'
import { getPageYOffset } from './lib/window/getPageYOffset'
import { targetIsValid, targetMatchesLocation } from './lib/hash'
import { masonry } from './lib/masonry'
import { readingProgress } from './lib/readingProgress'
import { scrollTo } from './lib/scrollTo'
import { scrollToTarget } from './lib/scrollToTarget'

// Lazy loading

const lazyImages = Array.from(document.querySelectorAll('img.lazy')) as HTMLElement[]

lazyImages.forEach(item => {
  item.style.display = 'inline'
})

// tslint:disable-next-line:no-unused-expression
new LazyLoad()

// Masonry

const contentList = document.querySelector('.content-list')

if (contentList) {
  masonry(contentList, { itemSelector: '.archive-entry' })
}

// Footnotes

littlefoot({ allowDuplicates: true })

// Hash

document.body.addEventListener('click', (event) => {
  const anchor = event.target as HTMLAnchorElement
  if (targetMatchesLocation(anchor, location) && targetIsValid(anchor)) {
    event.preventDefault()
    scrollToTarget(anchor.hash, 0, () => {
      location.hash = anchor.hash
    })
  }
})

window.addEventListener('hashchange', () => scrollToTarget(location.hash, 0))
window.addEventListener('load', () => scrollToTarget(location.hash, 0))

// Header

const header = document.querySelector('.single-entry-header') as HTMLElement
const headerHeight = header ? outerHeight(header, true) : 0
const headerImage = document.querySelector('.single-entry-image-wrapper') as HTMLElement
const headerImageHeight = headerImage ? outerHeight(headerImage, true) : 0
const breadcrumbs = document.querySelector('.site-breadcrumbs') as HTMLElement
const content = document.querySelector('main') as HTMLElement
const progressBar = document.getElementById('reading-progress')

/**
 * Update fixed header visibility.
 */
function updateNavHeaderVisibility () {
  const hidden = 'bounceOutUp'
  const visible = 'slideInDown'
  const shouldMakeHeaderStick = getPageYOffset() > content.offsetTop + headerHeight - headerImageHeight

  if (breadcrumbs && shouldMakeHeaderStick && breadcrumbs.classList.contains('site-breadcrumbs-initial')) {
    breadcrumbs.classList.remove('site-breadcrumbs-initial')
    breadcrumbs.classList.add(visible)
  }

  if (breadcrumbs && !shouldMakeHeaderStick && breadcrumbs.classList.contains(visible)) {
    breadcrumbs.classList.remove(visible)
    breadcrumbs.classList.add(hidden)
  }

  if (breadcrumbs && shouldMakeHeaderStick && breadcrumbs.classList.contains(hidden)) {
    breadcrumbs.classList.remove(hidden)
    breadcrumbs.classList.add(visible)
  }
}

if (progressBar) {
  const entryContent = document.querySelector('.single-entry-body') as HTMLElement
  const scrollButton = document.querySelector('.button-furthest-read') as HTMLElement

  const reading = readingProgress(entryContent, (progress, furthest) => {
    const scrolledBack = progress < furthest && furthest < 100
    scrollButton.classList.toggle('hidden', !scrolledBack)
    progressBar.setAttribute('value', `${progress}`)
  })

  scrollButton.addEventListener('click', (event: Event): void => {
    event.preventDefault()
    scrollTo(reading.getFurthestRead())
  })

  reading.start()
}

Array.from(breadcrumbs.querySelectorAll('.trail-end, .site-title'))
  .forEach((element: HTMLElement) => {
    element.addEventListener('click', () => scrollTo(0))
  })

window.addEventListener('scroll', debounce(updateNavHeaderVisibility, 30))
triggerEvent(window, 'scroll')
