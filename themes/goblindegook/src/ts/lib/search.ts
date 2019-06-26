import lunr from 'lunr'
import fetch from 'unfetch'

export interface SearchDocument {
  [attribute: string]: any
  content: string
  description?: string
  title: string
  url: string
}

interface SearchIndex {
  search (term: string): SearchDocument[]
}

type SearchOptions = {
  collectionUrl: string
  container: HTMLElement
  perPage?: number
  renderLoading?: (terms: string) => string
  renderNoResults?: (terms: string) => string
  renderResult?: (result: SearchDocument) => string
}

async function fetchCollection (url: string): Promise<SearchDocument[]> {
  const response = await fetch(url)
  return response.json()
}

function buildIndex (entries: SearchDocument[]): lunr.Index {
  return lunr(function () {
    this.field('title', { boost: 10 })
    // this.field('categories', { boost: 3 })
    // this.field('tags', { boost: 3 })
    this.field('description', { boost: 3 })
    this.field('content')
    // this.field('image')
    this.ref('url')

    entries.forEach(entry => {
      this.add(entry)
    })
  })
}

function createIndex (collection: SearchDocument[]): SearchIndex {
  const index = buildIndex(collection)

  return {
    search: (query: string) => index.search(query.trim())
      .map(r => collection.find(d => d.url === r.ref)!)
  }
}

export function createSearchHandler (userOptions: SearchOptions) {
  const options = {
    renderLoading: (terms: string) => `Loading search results for ${terms}.`,
    renderNoResults: (terms: string) => `No results found for ${terms}.`,
    renderResult: (r: SearchDocument) => `<a href="${r.url}">${r.title}</a>`,
    ...userOptions
  }

  let index: SearchIndex
  let isLoading = false
  let previousTerms = ''

  return async (event: Event) => {
    if (!isLoading && !index) {
      isLoading = true
      const collection = await fetchCollection(options.collectionUrl)
      index = createIndex(collection)
      isLoading = false
    }

    const terms = (event.target as HTMLInputElement).value || ''

    options.container.style.display = terms ? 'inherit' : 'none'

    if (isLoading) {
      userOptions.container.innerHTML = options.renderLoading(terms)
    }

    if (!isLoading && index && terms !== previousTerms) {
      const results = index.search(terms)
      previousTerms = terms
      userOptions.container.innerHTML = results.length
        ? results
          .filter((r, i) => !options.perPage || i < options.perPage)
          .reduce((h, r) => h + options.renderResult(r), '')
        : options.renderNoResults(terms)
    }
  }
}
