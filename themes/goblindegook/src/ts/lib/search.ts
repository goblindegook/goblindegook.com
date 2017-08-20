import lunr from 'lunr'
import fetch from 'unfetch'

interface Entry extends Object {
  url: string
}

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
    search: (query: string) => index.search(query)
      .map(r => entries.find(e => e.url === r.ref)!)
  }
}