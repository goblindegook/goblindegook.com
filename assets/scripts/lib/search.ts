import { CountingBloomFilter } from '@pacote/bloom-filter'
import stemmer from 'stemmer'

export interface IndexedDocument {
  title: string
  description?: string
  url: string
  filter: CountingBloomFilter<string>
}

export interface SearchResult {
  title: string
  description?: string
  url: string
  matches: number
}

interface SearchOptions {
  input: HTMLInputElement
  container: HTMLElement
  fetchIndex: () => Promise<IndexedDocument[]>
  perPage?: number
  renderLoading?: (terms: string) => string
  renderNoResults?: (terms: string) => string
  renderPrompt?: () => string
  renderResult?: (result: SearchResult) => string
}

function search(index: IndexedDocument[], query: string): SearchResult[] {
  const results = index
    .map((item) => ({
      title: item.title,
      description: item.description,
      url: item.url,
      matches: query
        .split(/\s/)
        .filter((i) => i)
        .reduce((acc, term) => acc + item.filter.has(stemmer(term)), 0),
    }))
    .filter((result) => result.matches > 0)
    .sort((a, b) =>
      a.matches === b.matches ? 0 : a.matches > b.matches ? -1 : 1
    )

  return results
}

export function createSearchHandler(userOptions: SearchOptions) {
  const options = {
    renderLoading: (terms: string) => `Loading search results for ${terms}.`,
    renderNoResults: (terms: string) => `No results found for ${terms}.`,
    renderPrompt: () => ``,
    renderResult: (r: SearchResult) => `<a href="${r.url}">${r.title}</a>`,
    ...userOptions,
  }

  const deactivation = (event: Event) => {
    const target = event.target as HTMLElement
    if (
      [options.container, options.input].every(
        (element) => !element.contains(target) && element !== target
      )
    ) {
      options.container.classList.remove('search-active')
      window.removeEventListener('click', deactivation)
    }
  }

  let index: IndexedDocument[]
  let isLoading = false
  let previousTerms = ''

  return async (event: Event) => {
    if (!isLoading && !index) {
      isLoading = true
      index = (await options.fetchIndex()).map((item) => ({
        ...item,
        filter: new CountingBloomFilter(item.filter),
      }))
      isLoading = false
    }

    const terms = (event.target as HTMLInputElement).value || ''

    if (terms && index) {
      options.container.classList.add('search-active')
      window.addEventListener('click', deactivation)
    } else {
      options.container.classList.remove('search-active')
      window.removeEventListener('click', deactivation)
    }

    if (isLoading) {
      userOptions.container.innerHTML = options.renderLoading(terms)
    }

    if (!isLoading && index && terms !== previousTerms) {
      const results = terms ? search(index, terms) : []
      previousTerms = terms
      userOptions.container.innerHTML = results.length
        ? results
            .filter((r, i) => !options.perPage || i < options.perPage)
            .reduce((h, r) => h + options.renderResult(r), '')
        : terms
        ? options.renderNoResults(terms)
        : options.renderPrompt()
    }

    event.stopPropagation()
  }
}
