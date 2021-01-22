/* eslint-disable @typescript-eslint/no-var-requires */

const { CountingBloomFilter, optimal } = require('@pacote/bloom-filter')

const repeat = (times, fn) => Array(times).fill(null).forEach(fn)

class BloomSearch {
  items = []

  constructor({ errorRate, fields, summary, preprocess, stopwords, stemmer }) {
    this.errorRate = errorRate
    this.fields = fields
    this.summary = summary ?? ['id']
    this.preprocess = preprocess ?? ((text) => text)
    this.stemmer = stemmer ?? ((text) => text)
    this.stopwords = stopwords ?? []
  }

  normalize(term) {
    return term.normalize('NFD').replace(/\W/gi, '').toLowerCase()
  }

  add(document, language) {
    const terms = Object.keys(this.fields).reduce((acc, field) => {
      acc[field] = this.preprocess(document[field])
        .split(/\s/)
        .map(this.normalize)
        .filter((term) => term.length > 1 && !this.stopwords.includes(term))
        .map((term) => this.stemmer(term, language))
      return acc
    }, {})

    const uniqueTerms = new Set(Object.values(terms).flat()).size

    const filter = new CountingBloomFilter(optimal(uniqueTerms, this.errorRate))

    Object.entries(this.fields).forEach(([field, weight]) => {
      repeat(weight ?? 1, () =>
        terms[field].forEach((term) => filter.add(term))
      )
    })

    const entry = this.summary.reduce(
      (acc, name) => {
        acc.summary[name] = document[name]
        return acc
      },
      { summary: {}, filter }
    )

    this.items.push(entry)
  }

  index() {
    return this.items.map((entry) => ({
      ...entry,
      filter: {
        ...entry.filter,
        filter: Array.from(entry.filter.filter),
      },
    }))
  }
}

module.exports = { BloomSearch }
