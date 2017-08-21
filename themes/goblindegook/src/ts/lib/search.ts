import lunr from 'lunr'
import fetch from 'unfetch'

// tslint:disable:ter-indent
interface SearchDocument {
  [attribute: string]: any
  content: string
  description?: string
  title: string
  url: string
}
// tslint:enable:ter-indent

interface SearchIndex {
  search (term: string): SearchDocument[]
}

// tslint:disable:ter-indent
type SearchOptions = {
  collectionUrl: string
  container: Element
  renderNoResults?: (terms: string) => string
  renderResult?: (result: SearchDocument) => string
}
// tslint:enable:ter-indent

async function fetchCollection (url: string): Promise<SearchDocument[]> {
  const response = await fetch(url)
  return await response.json()
}

function buildIndex (entries: SearchDocument[]): lunr.Index {
  return lunr(function () {
    this.field('title', { boost: 10 })
    this.field('categories', { boost: 3 })
    this.field('tags', { boost: 3 })
    this.field('description', { boost: 3 })
    this.field('content')
    this.field('image')
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
    renderNoResults: (terms?: string) => `No results found for ${terms}.`,
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

    if (!isLoading && index && terms !== previousTerms) {
      const results = index.search(terms)
      previousTerms = terms
      userOptions.container.innerHTML = results.length
        ? results.reduce((h, r) => h + options.renderResult(r), '')
        : options.renderNoResults(terms)
    }
  }
}
