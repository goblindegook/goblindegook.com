#!/usr/bin/env node
const { CountingBloomFilter, optimal } = require('@pacote/bloom-filter')
const fs = require('fs')
const path = require('path')
const { times, uniq } = require('ramda')
const stemmer = require('stemmer')
const stopwords = require('stopwords-en')

const documentIndexFile = path.join('public', 'document-index.json')
const searchIndexFile = path.join('public', 'search-index.json')

const ERROR_RATE = 0.02

const documents = JSON.parse(
  fs.readFileSync(documentIndexFile, {
    encoding: 'utf8',
  })
)

function process(text) {
  return text
    .split(/[\s-]/)
    .map((word) =>
      word
        .replace(/\&[\w\d]+;/gi, '')
        .replace(/[\.\?\(\)\[\]\{\}!,;:—·]/gi, '')
        .toLowerCase()
    )
    .filter((i) => i.length > 1)
    .filter((word) => !stopwords.includes(word))
    .map((word) => stemmer(word))
}

function addToFilter(filter, words, weight) {
  times(() => words.forEach((word) => filter.add(word)), weight)
}

console.log(`Indexing ${documents.length} documents...`)

const searchIndex = documents.map(
  ({
    url,
    title = '',
    description = '',
    tags = [],
    categories = [],
    content = '',
  }) => {
    const titleTerms = process(title)
    const descriptionTerms = process(description)
    const tagTerms = process(tags.join(' '))
    const categoryTerms = process(categories.join(' '))
    const contentTerms = process(content)

    const wordCount = uniq([
      ...titleTerms,
      ...descriptionTerms,
      ...tagTerms,
      ...categoryTerms,
      ...contentTerms,
    ]).length

    const filter = new CountingBloomFilter(optimal(wordCount, ERROR_RATE))

    addToFilter(filter, titleTerms, 5)
    addToFilter(filter, descriptionTerms, 3)
    addToFilter(filter, tagTerms, 3)
    addToFilter(filter, categoryTerms, 3)
    addToFilter(filter, contentTerms, 1)

    return {
      url,
      title,
      description,
      filter: {
        size: filter.size,
        hashes: filter.hashes,
        seed: filter.seed,
        filter: Array.from(filter.filter),
      },
    }
  }
)

const serializedSearchIndex = JSON.stringify(searchIndex)

fs.writeFileSync(searchIndexFile, serializedSearchIndex, { encoding: 'utf-8' })

console.log(
  `Search index written to ${searchIndexFile} (${serializedSearchIndex.length} bytes).`
)
