import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'

const production = !process.env.ROLLUP_WATCH

const plugins = [
  alias({
    entries: [{ find: 'marked', replacement: 'marked/lib/marked' }],
  }),
  resolve({ mainFields: ['main'] }),
  commonjs({
    namedExports: {
      tslib: ['__assign', '__awaiter', '__generator', '__spreadArrays'],
    },
  }),
  typescript({
    sourceMap: !production,
  }),
  production && uglify(),
]

export default [
  {
    context: 'window',
    input: './src/ts/inline.ts',
    output: {
      file: './layouts/partials/inline.js',
      format: 'iife',
    },
    plugins,
  },
  {
    context: 'window',
    input: './src/ts/main.ts',
    output: {
      file: './static/js/main.js',
      format: 'iife',
    },
    plugins,
  },
  {
    context: 'window',
    input: './src/ts/sw.ts',
    output: {
      file: './static/sw.js',
      format: 'iife',
    },
    plugins,
  },
]
