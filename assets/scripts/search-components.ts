import van from 'vanjs-core'
import snarkdown from 'snarkdown'
import smartypants from 'smartypants'
import { sanitize } from 'dompurify'
import { SearchResult, createSearch } from './lib/search'

const { ul, li, label, input } = van.tags
const { svg, use } = van.tagsNS('http://www.w3.org/2000/svg')

export function Markdown(text: string): HTMLElement {
  const span = document.createElement('span')
  const html = sanitize(smartypants(snarkdown(text), 1))
    .replace(/<\/?p>/gi, '')
    .trim()
  span.innerHTML = html
  return span
}

type NoResultsProps = {
  classPrefix?: string
  text: string
}

const NoResults = ({ classPrefix = '', text }: NoResultsProps) =>
  li({ class: classPrefix + 'search-result-none' }, text)

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
  const isLoading = van.state(true)
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
    isActive.val = terms.trim().length > 0
    if (isActive.val) {
      items.val = await search(terms)
      isLoading.val = false
    }
  }

  searchTerms(defaultValue)

  const doSearch = (event: KeyboardEvent) => {
    const terms = (event.target as HTMLInputElement).value
    if (event.key === 'Enter') {
      navigate(terms)
    } else {
      searchTerms(terms)
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
          href: '#icon-search',
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
          ? isLoading.val
            ? NoResults({ classPrefix, text: 'Loading...' })
            : !items.val.length
            ? NoResults({ classPrefix, text: 'No results found.' })
            : items.val.slice(0, page).map(renderResult)
          : null,
      ),
  ]
}
