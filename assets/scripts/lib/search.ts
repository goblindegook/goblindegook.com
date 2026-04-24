import { decode } from '@msgpack/msgpack'
import { BloomSearch, type Index } from '@pacote/bloom-search'
import { stemmer } from 'stemmer'

export type SearchResult = {
  url: string
  title: string
  description?: string
}

type Status = 'idle' | 'loading' | 'ready'

export function createSearch() {
  let status: Status = 'idle'
  let loadPromise: Promise<void> | null = null
  const bs = new BloomSearch<SearchResult, keyof SearchResult, never>({
    errorRate: 0.0000001,
    fields: [],
    summary: ['title', 'description', 'url'],
    stemmer,
  })

  const loadIndex = async (): Promise<void> => {
    if (status === 'ready') return
    if (!loadPromise) {
      status = 'loading'
      loadPromise = fetch('/search-index.msgpack')
        .then((response) => response.arrayBuffer())
        .then((buffer) => decode(buffer))
        .then((index: Index<SearchResult, keyof SearchResult>) => bs.load(index))
        .then(() => {
          status = 'ready'
        })
        .catch(() => {
          status = 'idle'
          loadPromise = null
        })
    }

    await loadPromise
  }

  return async (terms = ''): Promise<SearchResult[]> => {
    const query = terms.trim()
    if (!query) return []

    if (status === 'idle') {
      await loadIndex()
    }

    if (status !== 'ready') return []

    return bs.search(query)
  }
}
