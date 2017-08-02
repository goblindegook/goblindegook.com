import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'
import uglify from 'rollup-plugin-uglify'

const namedExports = {
  'node_modules/lodash/lodash.js': [ 'debounce' ],
  'node_modules/estimate/src/estimate.js': [ 'element' ]
}

export default [
  {
    context: 'window',
    entry: './src/ts/inline.ts',
    format: 'es',
    plugins: [
      resolve(),
      commonjs({ namedExports }),
      typescript({
        typescript: require('typescript')
      }),
      uglify()
    ],
    dest: './layouts/partials/inline.js'
  },
  {
    context: 'window',
    entry: './src/ts/main.ts',
    format: 'es',
    plugins: [
      resolve(),
      commonjs({ namedExports }),
      typescript({
        typescript: require('typescript')
      }),
      uglify()
    ],
    dest: './static/js/main.js'
  }
]
