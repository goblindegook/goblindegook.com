import van from 'vanjs-core'
import snarkdown from 'snarkdown'
import smartypants from 'smartypants'
import { sanitize } from 'dompurify'
import { SearchResult, createSearch } from './lib/search'

const { ul, li, label, svg, use, input } = van.tags

export function Markdown(text: string): HTMLElement {
  const span = document.createElement('span')
  const html = sanitize(smartypants(snarkdown(text), 1))
    .replace(/<\/?p>/gi, '')
    .trim()
  span.innerHTML = html
  return span
}

export const Loading = (props: { class: string }) =>
  li({ class: props.class }, 'Loading...')

export const NoResults = (props: { class: string }) =>
  li({ class: props.class }, 'No results found.')

type SearchProps = {
  autofocus?: boolean
  classPrefix?: string
  container?: HTMLElement
  defaultValue?: string
  page?: number
  navigate: (terms: string) => void
  renderResult: (props: SearchResult) => HTMLElement
}

export const Search = ({
  autofocus,
  classPrefix = '',
  container,
  page,
  defaultValue = '',
  navigate,
  renderResult,
}: SearchProps) => {
  const isActive = van.state(false)
  const items = van.state<SearchResult[]>([])
  const search = createSearch()

  if (container) {
    window.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!container.contains(target) && container !== target) {
        isActive.val = false
      }
    })
  }

  const searchTerms = async (terms: string) => {
    const isSearching = terms.trim().length > 0
    items.val = isSearching ? await search(terms) : []
    isActive.val = isSearching
  }

  ;(async () => searchTerms(defaultValue))()

  const doSearch = (event: KeyboardEvent) => {
    const terms = (event.target as HTMLInputElement).value
    if (event.key === 'Enter') {
      navigate(terms)
    } else {
      ;(async () => searchTerms(terms))()
    }
    event.stopPropagation()
  }

  return [
    label(
      { class: classPrefix + 'search-label' },
      svg(
        { class: classPrefix + 'search-icon', title: 'Search' },
        use({
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          'xlink:href': '#icon-search',
        }),
      ),
      input({
        autocomplete: 'off',
        autofocus,
        class: classPrefix + 'search-input',
        name: 'q',
        placeholder: 'Search terms',
        type: 'search',
        value: defaultValue,
        onchange: doSearch,
        onclick: doSearch,
        onfocus: doSearch,
        onkeyup: doSearch,
      }),
    ),
    () =>
      ul(
        {
          class: `${classPrefix}search-results ${
            isActive.val ? 'search-active' : ''
          }`,
        },
        isActive.val
          ? !items.val.length
            ? NoResults({ class: classPrefix + 'search-result-none' })
            : items.val.slice(0, page).map(renderResult)
          : null,
      ),
  ]
}
