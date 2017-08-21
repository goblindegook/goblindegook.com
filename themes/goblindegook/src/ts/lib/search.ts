import lunr from 'lunr'
import fetch from 'unfetch'

// tslint:disable:ter-indent
export interface SearchDocument {
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
  noResultsHtml?: string
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

async function createIndex (collection: SearchDocument[]): Promise<SearchIndex> {
  const index = buildIndex(collection)

  return {
    search: (query: string) => index.search(query.trim())
      .map(r => collection.find(d => d.url === r.ref)!)
  }
}

export function createSearchHandler (options: SearchOptions) {
  const o = {
    noResultsHtml: 'No results found.',
    renderResult: (r: SearchDocument) => `<a href="${r.url}">${r.title}</a>`,
    ...options
  }

  let index: SearchIndex
  let isLoading = false
  let previousTerms = ''

  return async (event: Event) => {
    const terms = (event.target as HTMLInputElement).value || ''

    if (!isLoading) {
      if (!index) {
        isLoading = true
        const collection = await fetchCollection(o.collectionUrl)
        index = await createIndex(collection)
        isLoading = false
      }

      if (index && terms !== previousTerms) {
        const results = index.search(terms)
        previousTerms = terms
        options.container.innerHTML = results.length
          ? results.reduce((h, r) => h + o.renderResult(r), '')
          : o.noResultsHtml
      }
    }
  }
}
