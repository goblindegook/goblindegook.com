#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import { stemmer } from 'stemmer'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import createDOMPurify from 'dompurify'
import { decode } from 'html-entities'
import { BloomSearch } from '@pacote/bloom-search'

import stopwords from 'stopwords-en' assert { type: 'json' }

const documentIndexFile = path.join('public', 'document-index.json')
const searchIndexFile = path.join('public', 'search-index.json')

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

const serializedSearchIndex = JSON.stringify(
  Object.entries(searchIndex.index).reduce((acc, [ref, entry]) => {
    acc[ref] = {
      ...entry,
      filter: { ...entry.filter, filter: Array.from(entry.filter.filter) },
    }
    return acc
  }, {})
)

writeFileSync(searchIndexFile, serializedSearchIndex, 'utf8')

console.log(
  `Search index written to ${searchIndexFile} (${serializedSearchIndex.length} bytes).`
)
