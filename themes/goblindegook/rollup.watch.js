import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    typescript: require('typescript')
  })
]

export default [
  {
    context: 'window',
    input: './src/ts/inline.ts',
    output: {
      file: './layouts/partials/inline.js',
      format: 'es',
      sourcemap: 'inline'
    },
    plugins
  },
  {
    context: 'window',
    input: './src/ts/main.ts',
    output: {
      file: './static/js/main.js',
      format: 'es',
      sourcemap: 'inline'
    },
    plugins
  },
  {
    context: 'window',
    input: './src/ts/sw.ts',
    output: {
      file: './static/sw.js',
      format: 'es',
      sourcemap: 'inline'
    },
    plugins
  }
]
