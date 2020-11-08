/* globals Event */
import fetch from 'unfetch'
import { safeMarkdown } from './lib/markdown'
import { createSearchHandler, SearchDocument } from './lib/search'
import { parseQueryString } from './lib/url'

interface SearchOptions {
  input: HTMLInputElement
  container: HTMLElement
  perPage?: number
  useQueryString: boolean
  renderLoading: (t: string) => string
  renderNoResults: (t: string) => string
  renderResult: (r: SearchDocument) => string
}

function updateSearchOnEnter(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    const terms = (event.target as HTMLInputElement).value || ''
    const [path] = window.location.toString().split('?')
    window.history.pushState(null, '', `${path}?q=${terms}`)
  }
}

function pushSearchUrl(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    const terms = (event.target as HTMLInputElement).value || ''
    window.location.replace(`/search/?q=${terms}`)
  }
}

function setupSearch({
  input,
  container,
  perPage,
  useQueryString,
  renderLoading,
  renderNoResults,
  renderResult,
}: SearchOptions): void {
  const searchHandler = createSearchHandler({
    fetchCollection: () =>
      fetch('/lunr-documents.json').then(({ json }) => json()),
    input,
    container,
    perPage,
    renderLoading,
    renderNoResults,
    renderResult,
  })

  input.addEventListener('input', searchHandler)
  input.addEventListener('change', searchHandler)
  input.addEventListener('keyup', searchHandler)
  input.addEventListener('click', searchHandler)

  if (useQueryString) {
    const q = parseQueryString().q
    if (q && q.length) {
      input.value = q
      input.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true })
      )
    }

    input.addEventListener('keyup', updateSearchOnEnter)
    input.focus()
  } else {
    input.addEventListener('keyup', pushSearchUrl)
  }
}

export function setupMainSearch(parent: ParentNode): void {
  const input = parent.querySelector<HTMLInputElement>('.search-input')
  const container = parent.querySelector<HTMLElement>('.search-results')

  if (!input || !container) {
    return
  }

  setupSearch({
    input,
    container,
    useQueryString: true,
    renderLoading: () => `<li class="search-result-none">Loading...</li>`,
    renderNoResults: () =>
      `<li class="search-result-none">No results found.</li>`,
    renderResult: (r) => `
      <li>
        <article class="search-result-single">
          <h2 class="search-result-title"><a href="${r.url}">${safeMarkdown(
      r.title
    )}</a></h2>
          ${
            r.description
              ? `<p class="search-result-preview">${r.description}</p>`
              : ''
          }
        </article>
      </li>
    `,
  })
}

export function setupSidebarSearch(parent: ParentNode): void {
  const input = parent.querySelector<HTMLInputElement>('.sidebar-search-input')
  const container = parent.querySelector<HTMLElement>('.sidebar-search-results')

  if (!input || !container) {
    return
  }

  setupSearch({
    input,
    container,
    perPage: 5,
    useQueryString: false,
    renderLoading: () =>
      `<li class="sidebar-search-result-none">Loading...</li>`,
    renderNoResults: () =>
      `<li class="sidebar-search-result-none">No results found.</li>`,
    renderResult: (r) =>
      `<li class="sidebar-search-result-single"><a href="${
        r.url
      }">${safeMarkdown(r.title)}</a></li>`,
  })
}
