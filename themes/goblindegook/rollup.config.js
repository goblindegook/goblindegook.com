import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'

const plugins = [
  resolve(),
  commonjs(),
  typescript(),
  uglify()
]

export default [
  {
    context: 'window',
    input: './src/ts/inline.ts',
    output: {
      file: './layouts/partials/inline.js',
      format: 'es'
    },
    plugins
  },
  {
    context: 'window',
    input: './src/ts/main.ts',
    output: {
      file: './static/js/main.js',
      format: 'es'
    },
    plugins
  },
  {
    context: 'window',
    input: './src/ts/sw.ts',
    output: {
      file: './static/sw.js',
      format: 'es'
    },
    plugins
  }
]
