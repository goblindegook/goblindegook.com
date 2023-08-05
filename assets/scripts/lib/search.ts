import { BloomSearch, Index } from '@pacote/bloom-search'
import { stemmer } from 'stemmer'
import { decode } from '@msgpack/msgpack'

export type SearchResult = {
  url: string
  title: string
  description?: string
}

export function createSearch() {
  let isLoading = false
  let isReady = false

  const bs = new BloomSearch<SearchResult, keyof SearchResult, never>({
    errorRate: 0.0000001,
    fields: [],
    summary: ['title', 'description', 'url'],
    stemmer,
  })

  return async (terms = '') => {
    if (!isLoading && !isReady) {
      isLoading = true
      bs.load(
        await fetch('/search-index.msgpack')
          .then((response) => response.arrayBuffer())
          .then(
            (buffer) =>
              decode(buffer) as Index<SearchResult, keyof SearchResult>,
          ),
      )
      isReady = true
      isLoading = false
    }

    return terms ? bs.search(terms) : []
  }
}
