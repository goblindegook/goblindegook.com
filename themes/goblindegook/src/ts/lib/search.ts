import lunr from 'lunr'
import fetch from 'unfetch'

interface Entry extends Object {
  uri: string
}

interface SearchRepository {
  content: Entry[], index: lunr.Index
}

interface SearchResult extends Object {
  score: number
}

export async function fetchIndex (url: string): Promise<SearchRepository> {
  const response = await fetch(url)
  const content: Entry[] = await response.json()

  const index = lunr(function () {
    this.field('title', { boost: 10 })
    this.field('categories', { boost: 3 })
    this.field('tags', { boost: 3 })
    this.field('content')
    this.ref('uri')

    content.forEach((entry) => {
      this.add(entry)
    })
  })

  return { content, index }
}

export function searchIndex (repository: SearchRepository, query: string): SearchResult[] {
  return repository.index.search(query)
    .map((result) => {
      const entry = repository.content.find((e) => e.uri === result.ref)
      return { ...entry, score: result.score }
    })
}
