#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')
const createDOMPurify = require('dompurify')
const { decode } = require('html-entities')
const stopwords = require('stopwords-en')
const stemmer = require('stemmer')
const { BloomSearch } = require('./lib/bloom-search')

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
  preprocess: (text) => decode(sanitize(text, { ALLOWED_TAGS: ['#text'] })),
  stopwords,
  stemmer,
})

documents.forEach((item) => searchIndex.add(item))

const serializedSearchIndex = JSON.stringify(searchIndex.index())
writeFileSync(searchIndexFile, serializedSearchIndex, 'utf8')

console.log(
  `Search index written to ${searchIndexFile} (${serializedSearchIndex.length} bytes).`
)
