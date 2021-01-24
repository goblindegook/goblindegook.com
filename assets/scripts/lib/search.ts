import { BloomSearch } from '@pacote/bloom-search'
import stemmer from 'stemmer'

export type SearchResult = {
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

  const bs = new BloomSearch<SearchResult, keyof SearchResult, never>({
    errorRate: 0.0001,
    fields: [],
    summary: ['title', 'description', 'url'],
    stemmer,
  })

  let isLoading = false
  let isReady = false
  let previousTerms = ''

  return async (event: InputEvent) => {
    if (!isLoading && !isReady) {
      isLoading = true
      bs.load(await options.fetchIndex())
      isReady = true
      isLoading = false
    }

    const terms = (event.target as HTMLInputElement).value || ''

    if (terms && isReady) {
      options.container.classList.add('search-active')
      window.addEventListener('click', deactivation)
    } else {
      options.container.classList.remove('search-active')
      window.removeEventListener('click', deactivation)
    }

    if (isLoading) {
      userOptions.container.innerHTML = options.renderLoading(terms)
    }

    if (!isLoading && isReady && terms !== previousTerms) {
      const results = terms ? bs.search(terms) : []
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
