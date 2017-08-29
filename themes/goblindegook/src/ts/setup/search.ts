import insane from 'insane'
import showdown from 'showdown'
import { createSearchHandler } from '../lib/search'
import { getSearchValue } from '../lib/url'

export function setupSearch () {
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
}
