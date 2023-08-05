import van from 'vanjs-core'
import { SearchResult } from './lib/search'
import { parseQueryString } from './lib/url'
import { Markdown, Search } from './search-components'

const { li, a, article, h2, p } = van.tags

const Result = ({ url, title, description }: SearchResult) =>
  li(
    article(
      { class: 'search-result-single' },
      h2({ class: 'search-result-title' }, a({ href: url }, Markdown(title))),
      description
        ? p({ class: 'search-result-preview' }, Markdown(description))
        : '',
    ),
  )

export function setupMainSearch(doc: Document): void {
  const container = doc.getElementById('main-search')
  container.innerHTML = ''
  if (container) {
    van.add(
      container,
      Search({
        autofocus: true,
        defaultValue: parseQueryString().q,
        navigate: (terms) => {
          window.history.pushState(
            null,
            '',
            `${window.location.pathname}?q=${terms}`,
          )
        },
        renderResult: Result,
      }),
    )
  }
}
