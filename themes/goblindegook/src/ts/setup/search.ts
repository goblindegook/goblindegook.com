import { safeMarkdown } from '../lib/markdown'
import { createSearchHandler, SearchDocument } from '../lib/search'
import { getSearchValue } from '../lib/url'

type SearchOptions = {
  inputSelector: string
  perPage?: number
  useQueryString?: boolean
  resultsSelector: string
  renderLoading: (t: string) => string
  renderNoResults: (t: string) => string
  renderResult: (r: SearchDocument) => string
}

function searchEnterHandler (event: KeyboardEvent): void {
  const terms = (event.target as HTMLInputElement).value || ''
  
  if (event.keyCode === 13) {
    const currentUrl = window.location.toString()
    const location = currentUrl.indexOf('?') >= 0 ? currentUrl.substr(0, currentUrl.indexOf('?')) : currentUrl
    history.pushState(null, '', `${location}?q=${terms}`)
  }
}

function setupSearch (options: SearchOptions): void {
  const searchInput = document.querySelector(options.inputSelector) as HTMLInputElement
  const searchResultsContainer = document.querySelector(options.resultsSelector) as HTMLElement
  
  if (searchInput && searchResultsContainer) {
    const searchHandler = createSearchHandler({
      collectionUrl: '/lunr.json',
      container: searchResultsContainer,
      perPage: options.perPage,
      renderLoading: options.renderLoading,
      renderNoResults: options.renderNoResults,
      renderResult: options.renderResult
    })
  
    searchInput.addEventListener('change', searchHandler)
    searchInput.addEventListener('keyup', searchHandler)

    if (options.useQueryString) {
      searchInput.addEventListener('keyup', searchEnterHandler)
    
      const q = getSearchValue('q')
    
      if (q && q.length) {
        searchInput.value = q
        searchInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
      }
    }
  } 
}

export function setupMainSearch (): void {
  setupSearch({
    inputSelector: '.search-input',
    renderLoading: () => `<li class="search-result-none">Loading...</li>`,
    renderNoResults: () => `<li class="search-result-none">No results found.</li>`,
    renderResult: (r) => `
      <li>
        <article class="search-result-single">
          <h2 class="search-result-title"><a href="${r.url}">${safeMarkdown(r.title)}</a></h2>
          ${r.description ? `<p class="search-result-preview">${r.description}</p>` : ''}
        </article>
      </li>
    `,
    resultsSelector: '.search-results'
  })
}

export function setupSidebarSearch (): void {
  setupSearch({
    inputSelector: '.sidebar-search-input',
    perPage: 5,
    renderLoading: () => `<li class="sidebar-search-result-none">Loading...</li>`,
    renderNoResults: () => `<li class="sidebar-search-result-none">No results found.</li>`,
    renderResult: (r) => `<li class="sidebar-search-result-single"><a href="${r.url}">${safeMarkdown(r.title)}</a></li>`,
    resultsSelector: '.sidebar-search-results'
  })
}
