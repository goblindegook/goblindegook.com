import { safeMarkdown } from '../lib/markdown'
import { createSearchHandler, SearchDocument } from '../lib/search'
import { parseQueryString } from '../lib/url'

type SearchOptions = {
  inputSelector: string
  perPage?: number
  useQueryString: boolean
  resultsSelector: string
  renderLoading: (t: string) => string
  renderNoResults: (t: string) => string
  renderResult: (r: SearchDocument) => string
}

function updateSearchOnEnter (event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    const terms = (event.target as HTMLInputElement).value || ''
    const [path] = window.location.toString().split('?')
    window.history.pushState(null, '', `${path}?q=${terms}`)
  }
}

function pushSearchUrl (event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    const terms = (event.target as HTMLInputElement).value || ''
    window.location.replace(`/search/?q=${terms}`)
  }
}

function setupSearch (options: SearchOptions): void {
  const searchInput = document.querySelector(options.inputSelector) as HTMLInputElement
  const searchResultsContainer = document.querySelector(options.resultsSelector) as HTMLElement

  if (searchInput && searchResultsContainer) {
    const searchHandler = createSearchHandler({
      collectionUrl: '/lunr-documents.json',
      container: searchResultsContainer,
      perPage: options.perPage,
      renderLoading: options.renderLoading,
      renderNoResults: options.renderNoResults,
      renderResult: options.renderResult
    })

    searchInput.addEventListener('change', searchHandler)
    searchInput.addEventListener('keyup', searchHandler)
    
    if (options.useQueryString) {
      const q = parseQueryString().q
      if (q && q.length) {
        searchInput.value = q
        searchInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
      }

      searchInput.addEventListener('keyup', updateSearchOnEnter)
      searchInput.focus()

    } else {
      searchInput.addEventListener('keyup', pushSearchUrl)
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
    resultsSelector: '.search-results',
    useQueryString: true
  })
}

export function setupSidebarSearch (): void {
  setupSearch({
    inputSelector: '.sidebar-search-input',
    perPage: 5,
    renderLoading: () => `<li class="sidebar-search-result-none">Loading...</li>`,
    renderNoResults: () => `<li class="sidebar-search-result-none">No results found.</li>`,
    renderResult: (r) => `<li class="sidebar-search-result-single"><a href="${r.url}">${safeMarkdown(r.title)}</a></li>`,
    resultsSelector: '.sidebar-search-results',
    useQueryString: false
  })
}
