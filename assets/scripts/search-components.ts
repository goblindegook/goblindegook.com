import DOMPurify from 'dompurify'
import smartypants from 'smartypants'
import snarkdown from 'snarkdown'
import van from 'vanjs-core'
import { createSearch, type SearchResult } from './lib/search'

const { ul, li, label, input } = van.tags
const { svg, use } = van.tags('http://www.w3.org/2000/svg')

export function Markdown(text: string): HTMLElement {
  const span = document.createElement('span')
  span.innerHTML = DOMPurify.sanitize(smartypants(snarkdown(text), 1))
    .replace(/<\/?p>/gi, '')
    .trim()
  return span
}

type NoResultsProps = {
  classPrefix?: string
  text: string
}

const NoResults = ({ classPrefix = '', text }: NoResultsProps) =>
  li({ class: `${classPrefix}search-result-none` }, text)

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
  autofocus = false,
  classPrefix = '',
  container,
  page,
  defaultValue = '',
  navigate,
  renderResult,
}: SearchProps) => {
  const isActive = van.state(false)
  const isLoading = van.state(true)
  const searchTermsText = van.state('')
  const items = van.state<SearchResult[]>([])
  const search = createSearch()
  let searchTimer: number | null = null
  let lastRequestedTerms = ''
  let requestId = 0

  if (container) {
    window.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!container.contains(target) && container !== target) {
        isActive.val = false
      }
    })
  }

  const searchTerms = async (terms: string) => {
    const trimmedTerms = terms.trim()
    searchTermsText.val = trimmedTerms
    isActive.val = trimmedTerms.length > 0
    if (!isActive.val) {
      items.val = []
      isLoading.val = false
      lastRequestedTerms = ''
      return
    }

    if (trimmedTerms === lastRequestedTerms) return
    lastRequestedTerms = trimmedTerms

    if (searchTimer != null) {
      window.clearTimeout(searchTimer)
    }

    searchTimer = window.setTimeout(async () => {
      const currentRequestId = ++requestId
      isLoading.val = true
      const result = await search(trimmedTerms)
      if (currentRequestId !== requestId) return
      items.val = result
      isLoading.val = false
    }, 120)
  }

  searchTerms(defaultValue)

  const handleSearchInput = (event: Event) => {
    const terms = (event.target as HTMLInputElement).value
    searchTerms(terms)
    event.stopPropagation()
  }

  const handleSearchKeydown = (event: KeyboardEvent) => {
    const terms = (event.target as HTMLInputElement).value
    if (event.key === 'Enter') {
      navigate(terms)
    }
    event.stopPropagation()
  }

  return [
    label(
      { class: `${classPrefix}search-label` },
      svg(
        { class: `${classPrefix}search-icon`, title: 'Search' },
        use({
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          href: '#icon-search',
        }),
      ),
      input({
        autocomplete: 'off',
        autofocus,
        class: `${classPrefix}search-input`,
        name: 'q',
        placeholder: 'Search this site',
        type: 'search',
        value: defaultValue,
        oninput: handleSearchInput,
        onkeydown: handleSearchKeydown,
      }),
    ),
    () =>
      ul(
        {
          class: `${classPrefix}search-results ${isActive.val ? 'search-active' : ''}`,
          'aria-live': 'polite',
          'aria-atomic': 'true',
          role: 'status',
        },
        isActive.val
          ? isLoading.val
            ? NoResults({ classPrefix, text: 'Searching the site...' })
            : !items.val.length
              ? NoResults({
                  classPrefix,
                  text: `No results for "${searchTermsText.val}". Try a different search.`,
                })
              : items.val.slice(0, page).map(renderResult)
          : null,
      ),
  ]
}
