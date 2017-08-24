import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'
import uglify from 'rollup-plugin-uglify'

const namedExports = {
  'node_modules/lodash/lodash.js': [ 'debounce' ],
  'node_modules/estimate/src/estimate.js': [ 'element' ]
}

const plugins = [
  resolve(),
  commonjs({ namedExports }),
  typescript({
    typescript: require('typescript')
  }),
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
  }
]
