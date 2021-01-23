/* eslint-disable @typescript-eslint/no-var-requires */

const { CountingBloomFilter, optimal } = require('@pacote/bloom-filter')

const repeat = (times, fn) => Array(times).fill(null).forEach(fn)

class BloomSearch {
  index = []

  constructor({ errorRate, fields, summary, preprocess, stopwords, stemmer }) {
    this.errorRate = errorRate
    this.fields = Array.isArray(fields)
      ? fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {})
      : fields
    this.summary = summary ?? ['id']
    this.preprocess = preprocess ?? ((text) => text)
    this.stemmer = stemmer ?? ((text) => text)
    this.stopwords = stopwords ?? (() => true)
  }

  tokenizer(text) {
    return text
      .split(/\s/)
      .map((token) => token.normalize('NFD').replace(/\W/gi, '').toLowerCase())
  }

  add(document, language) {
    const tokens = Object.keys(this.fields).reduce((acc, field) => {
      acc[field] = this.tokenizer(this.preprocess(document[field]))
        .filter((token) => this.stopwords(token, language))
        .map((token) => this.stemmer(token, language))
      return acc
    }, {})

    const uniqTokens = new Set(Object.values(tokens).flat()).size

    const filter = new CountingBloomFilter(optimal(uniqTokens, this.errorRate))

    Object.entries(this.fields).forEach(([field, weight]) => {
      tokens[field].forEach((token) => repeat(weight, () => filter.add(token)))
    })

    const entry = this.summary.reduce(
      (acc, name) => {
        acc.summary[name] = document[name]
        return acc
      },
      { summary: {}, filter }
    )

    this.index.push(entry)
  }
}

module.exports = { BloomSearch }
