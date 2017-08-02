import { injectStyle } from './lib/cssCache'

const html = document.documentElement
html.className = html.className.replace(/\bno-js\b/, 'js')

injectStyle('fonts', '/fonts/fonts.css#2.0.0')
