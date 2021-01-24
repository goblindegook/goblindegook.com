import { BloomSearch } from '@pacote/bloom-search'
import stemmer from 'stemmer'

export interface SearchResult extends Record<string, unknown> {
  url: string
  title: string
  description?: string
}

interface SearchOptions {
  input: HTMLInputElement
  container: HTMLElement
  fetchIndex: () => Promise<any[]>
  perPage?: number
  renderLoading?: (terms: string) => string
  renderNoResults?: (terms: string) => string
  renderPrompt?: () => string
  renderResult?: (result: SearchResult) => string
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

  let index: BloomSearch<SearchResult, 'url' | 'title' | 'description', 'url'>
  let isLoading = false
  let previousTerms = ''

  return async (event: InputEvent) => {
    if (!isLoading && !index) {
      isLoading = true
      index = new BloomSearch<
        SearchResult,
        'url' | 'title' | 'description',
        'url'
      >({
        errorRate: 0.0001,
        fields: [],
        summary: ['title', 'description', 'url'],
        index: await options.fetchIndex(),
        stemmer,
      })
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
      const results = terms ? index.search(terms) : []
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
