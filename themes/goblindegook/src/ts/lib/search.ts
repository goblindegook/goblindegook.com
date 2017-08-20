import lunr from 'lunr'
import fetch from 'unfetch'

// tslint:disable:ter-indent
interface Entry extends Object {
  content: string
  description?: string
  title: string
  url: string
}
// tslint:enable:ter-indent

interface SearchIndex {
  search (term: string): Entry[]
}

async function fetchIndex (url: string): Promise<Entry[]> {
  const response = await fetch(url)
  return await response.json()
}

function buildIndex (entries: Entry[]): lunr.Index {
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

export async function createIndex (url: string): Promise<SearchIndex> {
  const entries = await fetchIndex(url)
  const index = buildIndex(entries)

  return {
    search: (query: string) => index.search(query.trim())
      .map(r => entries.find(e => e.url === r.ref)!)
  }
}

function renderSearchResultPreview (result: Entry): string {
  return result.description ? `<p class="search-result-preview">${result.description}</p>` : ''
}

function renderSearchResult (result: Entry): string {
  return `
    <li>
      <article class="search-result-single">
        <h2 class="search-result-title"><a href="${result.url}">${result.title}</a></h2>
        ${renderSearchResultPreview(result)}
      </article>
    </li>
  `
}

export function createSearchHandler (input: HTMLInputElement, container: HTMLElement, dataUrl: string) {
  let isLoading = false
  let index: SearchIndex
  let previousTerms: string

  return async (event: Event) => {
    const terms = (event.target as HTMLInputElement).value || ''

    if (!isLoading) {
      if (!index) {
        isLoading = true
        index = await createIndex(dataUrl)
        isLoading = false
      }

      if (index && terms !== previousTerms) {
        const results = index.search(terms)
        previousTerms = terms
        container.innerHTML = results.length
          ? container.innerHTML = results.reduce((h, r) => h + renderSearchResult(r), '')
          : '<li class="search-result-none">No results found.</li>'
      }
    }
  }
}
