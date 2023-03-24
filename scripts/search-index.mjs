#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { stemmer } from 'stemmer'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { decode } from 'html-entities'
import { BloomSearch } from '@pacote/bloom-search'
import { encode } from '@msgpack/msgpack'
import stopwords from 'stopwords-en' assert { type: 'json' }

const documentIndexFile = join('public', 'document-index.json')
const searchIndexFile = join('public', 'search-index.msgpack')

const documents = JSON.parse(readFileSync(documentIndexFile, 'utf8'))

console.log(`Indexing ${documents.length} documents...`)

const DOMPurify = createDOMPurify(new JSDOM().window)

const search = new BloomSearch({
  errorRate: 0.001,
  fields: { title: 5, description: 3, content: 1 },
  summary: ['url', 'title', 'description'],
  preprocess: (text) =>
    decode(DOMPurify.sanitize(String(text), { ALLOWED_TAGS: ['#text'] })),
  stopwords: (term) => term.length > 1 && !stopwords.includes(term),
  stemmer,
})

documents.forEach((item) => search.add(item.id, item))

const serializedSearchIndex = encode(JSON.parse(JSON.stringify(search.index)))

writeFileSync(searchIndexFile, serializedSearchIndex)

console.log(
  `Search index written to ${searchIndexFile} (${serializedSearchIndex.byteLength} bytes).`
)
