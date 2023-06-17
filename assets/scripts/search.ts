/* globals Event */
import { safeMarkdown } from './lib/markdown'
import { createSearchHandler, SearchResult } from './lib/search'
import { parseQueryString } from './lib/url'
import { decode } from '@msgpack/msgpack'
import { Index } from '@pacote/bloom-search'

interface SearchOptions {
  input: HTMLInputElement
  container: HTMLElement
  perPage?: number
  useQueryString: boolean
  renderLoading: (t: string) => string
  renderNoResults: (t: string) => string
  renderResult: (r: SearchResult) => string
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
    fetchIndex: () =>
      fetch('/search-index.msgpack')
        .then((response) => response.arrayBuffer())
        .then(
          (buffer) => decode(buffer) as Index<SearchResult, keyof SearchResult>
        ),
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
    renderResult: ({ url, title, description }) => `
      <li>
        <article class="search-result-single">
          <h2 class="search-result-title"><a href="${url}">${safeMarkdown(
      title
    )}</a></h2>
          ${
            description
              ? `<p class="search-result-preview">${safeMarkdown(
                  description
                )}</p>`
              : ''
          }
        </article>
      </li>
    `,
  })
}

export function setupSidebarSearch(): void {
  const root = document.getElementById('sidebar-search')

  if (!root) {
    return
  }

  root.innerHTML = `
    <label class="sidebar-search-label">
      <svg class="sidebar-search-icon" title="Search"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-search"></use></svg>
      <input class="sidebar-search-input" name="q" placeholder="Search terms" type="search" value="" autocomplete="off">
    </label>
    <ul class="sidebar-search-results"></ul>`

  setupSearch({
    input: root.querySelector('input'),
    container: root.querySelector('ul'),
    perPage: 5,
    useQueryString: false,
    renderLoading: () =>
      `<li class="sidebar-search-result-none">Loading...</li>`,
    renderNoResults: () =>
      `<li class="sidebar-search-result-none">No results found.</li>`,
    renderResult: ({ url, title }) =>
      `<li class="sidebar-search-result-single"><a href="${url}">${safeMarkdown(
        title
      )}</a></li>`,
  })
}
