import { BloomSearch, Index } from '@pacote/bloom-search'
import { stemmer } from 'stemmer'
import { decode } from '@msgpack/msgpack'

export type SearchResult = {
  url: string
  title: string
  description?: string
}

type Status = 'idle' | 'loading' | 'ready'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createSearch() {
  let status: Status = 'idle'
  const bs = new BloomSearch<SearchResult, keyof SearchResult, never>({
    errorRate: 0.0000001,
    fields: [],
    summary: ['title', 'description', 'url'],
    stemmer,
  })

  return async (terms = ''): Promise<SearchResult[]> => {
    if (status === 'idle') {
      status = 'loading'
      await fetch('/search-index.msgpack')
        .then((response) => response.arrayBuffer())
        .then((buffer) => decode(buffer))
        .then((index: Index<SearchResult, keyof SearchResult>) =>
          bs.load(index),
        )
        .then(() => (status = 'ready'))
        .catch(() => (status = 'idle'))
    }

    // eslint-disable-next-line no-unmodified-loop-condition
    while (status !== 'ready') {
      await sleep(300)
    }

    return bs.search(terms)
  }
}
