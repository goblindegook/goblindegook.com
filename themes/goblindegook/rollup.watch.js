import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'

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
      })
    ],
    dest: './layouts/partials/inline.js',
    sourceMap: 'inline'
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
      })
    ],
    dest: './static/js/main.js',
    sourceMap: 'inline'
  }
]
