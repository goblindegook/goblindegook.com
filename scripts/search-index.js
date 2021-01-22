#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const { CountingBloomFilter, optimal } = require('@pacote/bloom-filter')
const fs = require('fs')
const path = require('path')
const { times, uniq } = require('ramda')
const { JSDOM } = require('jsdom')
const createDOMPurify = require('dompurify')
const { decode } = require('html-entities')
const stemmer = require('stemmer')
const stopwords = require('stopwords-en')

const ERROR_RATE = 0.001
const FILE_OPTIONS = { encoding: 'utf8' }

const documentIndexFile = path.join('public', 'document-index.json')
const searchIndexFile = path.join('public', 'search-index.json')

const { window } = new JSDOM('')
const DOMPurify = createDOMPurify(window)

const stripHtml = (text) =>
  DOMPurify.sanitize(decode(text), { ALLOWED_TAGS: ['#text'] })

const normalize = (word) =>
  word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\W/gi, '')
    .toLowerCase()

const stopWords = (word) => word.length > 1 && !stopwords.includes(word)

function process(text) {
  return text.split(/[\s-]/).map(normalize).filter(stopWords).map(stemmer)
}

function addToFilter(filter, words, weight) {
  times(() => words.forEach((word) => filter.add(word)), weight)
}

const documents = JSON.parse(fs.readFileSync(documentIndexFile, FILE_OPTIONS))

console.log(`Indexing ${documents.length} documents...`)

const searchIndex = documents.map(
  ({ url, title = '', description = '', content = '' }) => {
    const titleTerms = process(stripHtml(title))
    const descriptionTerms = process(stripHtml(description))
    const contentTerms = process(stripHtml(content))

    const uniqueTermCount = uniq([
      ...titleTerms,
      ...descriptionTerms,
      ...contentTerms,
    ]).length

    const filter = new CountingBloomFilter(optimal(uniqueTermCount, ERROR_RATE))

    addToFilter(filter, titleTerms, 5)
    addToFilter(filter, descriptionTerms, 3)
    addToFilter(filter, contentTerms, 1)

    return {
      url,
      title,
      description,
      filter: { ...filter, filter: Array.from(filter.filter) },
    }
  }
)

const serializedSearchIndex = JSON.stringify(searchIndex)

fs.writeFileSync(searchIndexFile, serializedSearchIndex, FILE_OPTIONS)

console.log(
  `Search index written to ${searchIndexFile} (${serializedSearchIndex.length} bytes).`
)
