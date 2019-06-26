#!/usr/bin/env node

const lunr = require('lunr')

const stdin = process.stdin
const stdout = process.stdout
const buffer = []

stdin.resume()
stdin.setEncoding('utf8')

stdin.on('data', data => buffer.push(data))

stdin.on('end', () => {
  const entries = JSON.parse(buffer.join(''))

  const idx = lunr(function () {
    this.field('title', { boost: 10 })
    // this.field('categories', { boost: 3 })
    // this.field('tags', { boost: 3 })
    this.field('description', { boost: 3 })
    this.field('content')
    this.ref('url')

    entries.forEach(entry => {
      this.add(entry)
    })
  })

  stdout.write(JSON.stringify(idx))
})
