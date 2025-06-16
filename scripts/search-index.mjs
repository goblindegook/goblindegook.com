#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { encode } from '@msgpack/msgpack'
import { BloomSearch } from '@pacote/bloom-search'
import createDOMPurify from 'dompurify'
import { decode } from 'html-entities'
import { JSDOM } from 'jsdom'
import { stemmer } from 'stemmer'

const stopwords = JSON.parse(
  await readFile(
    new URL('../node_modules/stopwords-en/stopwords-en.json', import.meta.url),
    'utf-8',
  ),
)

const documentIndexFile = join('public', 'document-index.json')
const searchIndexFile = join('public', 'search-index.msgpack')

const documents = JSON.parse(await readFile(documentIndexFile, 'utf8'))

console.log(`Indexing ${documents.length} documents...`)

const DOMPurify = createDOMPurify(new JSDOM().window)

const content = new BloomSearch({
  errorRate: 0.0001,
  minSize: 64,
  fields: { title: 5, description: 3, content: 1 },
  summary: ['url', 'title', 'description'],
  preprocess: (text) =>
    decode(DOMPurify.sanitize(String(text), { ALLOWED_TAGS: ['#text'] })),
  stopwords: (term) => term.length > 2 && !stopwords.includes(term),
  stemmer,
})

for (const document of documents) {
  content.add(document.id, document)
}

const serializedSearchIndex = encode(JSON.parse(JSON.stringify(content.index)))

await writeFile(searchIndexFile, serializedSearchIndex)

console.log(
  `Search index written to ${searchIndexFile} (${serializedSearchIndex.byteLength} bytes).`,
)
