#!/usr/bin/env node
import { stemmer } from 'stemmer'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import createDOMPurify from 'dompurify'
import { decode } from 'html-entities'
import { BloomSearch } from '@pacote/bloom-search'
import { encode } from '@msgpack/msgpack'
import stopwords from 'stopwords-en' assert { type: 'json' }

const documentIndexFile = path.join('public', 'document-index.json')
const searchIndexFile = path.join('public', 'search-index.msgpack')

const documents = JSON.parse(readFileSync(documentIndexFile, 'utf8'))

console.log(`Indexing ${documents.length} documents...`)

const { window } = new JSDOM('')
const { sanitize } = createDOMPurify(window)

const searchIndex = new BloomSearch({
  errorRate: 0.001,
  fields: { title: 5, description: 3, content: 1 },
  summary: ['url', 'title', 'description'],
  preprocess: (text) =>
    decode(sanitize(String(text), { ALLOWED_TAGS: ['#text'] })),
  stopwords: (term) => term.length > 1 && !stopwords.includes(term),
  stemmer,
})

documents.forEach((item) => searchIndex.add(String(item.id), item))

const serializedSearchIndex = encode(
  JSON.parse(JSON.stringify(searchIndex.index))
)

writeFileSync(searchIndexFile, serializedSearchIndex)

console.log(
  `Search index written to ${searchIndexFile} (${serializedSearchIndex.byteLength} bytes).`
)
