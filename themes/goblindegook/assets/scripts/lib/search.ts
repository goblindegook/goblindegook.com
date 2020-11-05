import lunr from 'lunr'

export interface SearchDocument {
  [attribute: string]: any
  content: string
  description?: string
  title: string
  url: string
}

interface SearchIndex {
  search(term: string): SearchDocument[]
}

interface SearchOptions {
  input: HTMLInputElement
  container: HTMLElement
  fetchCollection: () => Promise<SearchDocument[]>
  perPage?: number
  renderLoading?: (terms: string) => string
  renderNoResults?: (terms: string) => string
  renderPrompt?: () => string
  renderResult?: (result: SearchDocument) => string
}

function buildIndex(entries: SearchDocument[]): lunr.Index {
  return lunr(function () {
    this.field('title', { boost: 10 })
    this.field('categories', { boost: 3 })
    this.field('tags', { boost: 3 })
    this.field('description', { boost: 3 })
    this.field('content')
    this.ref('url')

    entries.forEach((entry) => {
      this.add(entry)
    })
  })
}

function createIndex(collection: SearchDocument[]): SearchIndex {
  const index = buildIndex(collection)

  return {
    search: (query: string) =>
      index
        .search(query.trim())
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((r) => collection.find((d) => d.url === r.ref)!),
  }
}

export function createSearchHandler(userOptions: SearchOptions) {
  const options = {
    renderLoading: (terms: string) => `Loading search results for ${terms}.`,
    renderNoResults: (terms: string) => `No results found for ${terms}.`,
    renderPrompt: () => ``,
    renderResult: (r: SearchDocument) => `<a href="${r.url}">${r.title}</a>`,
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

  let index: SearchIndex
  let isLoading = false
  let previousTerms = ''

  return async (event: Event) => {
    if (!isLoading && !index) {
      isLoading = true
      const collection = await options.fetchCollection()
      index = createIndex(collection)
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
