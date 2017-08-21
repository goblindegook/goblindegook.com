import littlefoot from 'littlefoot'
import { debounce } from 'lodash'
import LazyLoad from 'vanilla-lazyload'
import WebFont from 'webfontloader'
import { outerHeight } from './lib/dom/outerHeight'
import { triggerEvent } from './lib/dom/triggerEvent'
import { hashChangeHandler, hashClickHandler } from './lib/hash'
import { createStickinessToggler } from './lib/header'
import { masonry } from './lib/masonry'
import { readingProgress } from './lib/readingProgress'
import { scrollTo } from './lib/scrollTo'
import { createSearchHandler } from './lib/search'

// Fonts

const fontClasses: { [key: string]: string } = {
  'Alegreya': 'body-font-active',
  'Alegreya SC': 'small-caps-font-active',
  'Fira Sans': 'ui-font-active',
  'Fira Code': 'code-font-active'
}

WebFont.load({
  custom: {
    families: [
      'Alegreya:n4,i4,n7,i7',
      'Alegreya SC:n4,n7',
      'Fira Sans:n4,i4',
      'Fira Code:n3'
    ]
  },
  active: () => {
    sessionStorage.fonts = true
  },
  fontactive: (familyName) => {
    if (fontClasses[familyName]) {
      document.documentElement.classList.add(fontClasses[familyName])
    }
  }
})

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

document.body.addEventListener('click', hashClickHandler)
window.addEventListener('hashchange', hashChangeHandler)
window.addEventListener('load', hashChangeHandler)

// Header

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
  triggerEvent(window, 'scroll')
}

// Progress Bar

const progressBar = document.getElementById('reading-progress')

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

// Search

const searchInput = document.querySelector('.search-input')
const searchResultsContainer = document.querySelector('.search-results')

if (searchInput && searchResultsContainer) {
  searchInput.addEventListener('keyup', createSearchHandler({
    collectionUrl: '/lunr.json',
    container: searchResultsContainer,
    renderResult: (r) => `
      <li>
        <article class="search-result-single">
          <h2 class="search-result-title"><a href="${r.url}">${r.title}</a></h2>
          ${r.description ? `<p class="search-result-preview">${r.description}</p>` : ''}
        </article>
      </li>
    `,
    noResultsHtml: '<li class="search-result-none">No results found.</li>'
  }))
}
