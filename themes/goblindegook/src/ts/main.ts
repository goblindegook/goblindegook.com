import insane from 'insane'
import littlefoot from 'littlefoot'
import { debounce } from 'lodash'
import showdown from 'showdown'
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
import { getSearchValue } from './lib/url'

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

triggerEvent(window, 'scroll')

// Search

const searchInput = document.querySelector('.search-input') as HTMLInputElement
const searchResultsContainer = document.querySelector('.search-results')
const md = new showdown.Converter({
  strikethrough: true
})

function safeMarkdown (text: string): string {
  return insane(md.makeHtml(text)).replace(/<\/?p>/ig, '')
}

function searchEnterHandler (event: KeyboardEvent): void {
  const terms = (event.target as HTMLInputElement).value || ''
  
  if (event.keyCode === 13) {
    const currentUrl = window.location.toString()
    const location = currentUrl.indexOf('?') >= 0 ? currentUrl.substr(0, currentUrl.indexOf('?')) : currentUrl
    history.pushState(null, '', `${location}?q=${terms}`)
  }
}

if (searchInput && searchResultsContainer) {
  const searchHandler = createSearchHandler({
    collectionUrl: '/lunr.json',
    container: searchResultsContainer,
    renderNoResults: () => `<li class="search-result-none">No results found.</li>`,
    renderResult: (r) => `
      <li>
        <article class="search-result-single">
          <h2 class="search-result-title"><a href="${r.url}">${safeMarkdown(r.title)}</a></h2>
          ${r.description ? `<p class="search-result-preview">${r.description}</p>` : ''}
        </article>
      </li>
    `
  })

  searchInput.addEventListener('change', searchHandler)
  searchInput.addEventListener('keyup', searchHandler)
  searchInput.addEventListener('keyup', searchEnterHandler)

  const q = getSearchValue('q')

  if (q && q.length) {
    searchInput.value = q
    searchInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
  }
}
