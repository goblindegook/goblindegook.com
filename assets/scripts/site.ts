import van from 'vanjs-core'
import WebFont from 'webfontloader'
import { hashChangeHandler, hashClickHandler } from './lib/hash'
import { markdown } from './lib/markdown'
import type { SearchResult } from './lib/search'
import { Search } from './search-components'

const { li, a } = van.tags

const Result = ({ url, title }: SearchResult) =>
  li({ class: 'sidebar-search-result-single' }, a({ href: url }, markdown(title)))

export function setup(): void {
  setupHash()
  setupFonts()
  setupSidebarSearch()
}

function setupHash() {
  document.body.addEventListener('click', hashClickHandler)
  window.addEventListener('hashchange', hashChangeHandler)
  hashChangeHandler()
}

function setupFonts() {
  const fontClasses: { [key: string]: string } = {
    Alegreya: 'body-font-active',
    'Alegreya SC': 'small-caps-font-active',
    'Fira Sans': 'ui-font-active',
    'Fira Mono': 'code-font-active',
  }

  WebFont.load({
    custom: {
      families: ['Alegreya:n4,i4,n7,i7', 'Alegreya SC:n4,n7', 'Fira Sans:n4,i4', 'Fira Mono:n4'],
    },
    active: () => {
      window.sessionStorage.fonts = true
    },
    fontactive: (familyName) => {
      if (fontClasses[familyName]) {
        document.documentElement.classList.add(fontClasses[familyName])
      }
    },
  })
}

function setupSidebarSearch(): void {
  const container = document.getElementById('sidebar-search')
  if (container) {
    van.add(
      container,
      Search({
        classPrefix: 'sidebar-',
        container,
        page: 5,
        placeholder: 'Search',
        navigate: (terms) => window.location.replace(`/search/?q=${terms}`),
        renderResult: Result,
      }),
    )
  }
}
