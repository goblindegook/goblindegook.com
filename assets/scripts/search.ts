import van from 'vanjs-core'
import { markdown } from './lib/markdown'
import { createSearch, type SearchResult } from './lib/search'
import { parseQueryString } from './lib/url'

const { ul, li, label, input, a, article, h2, p } = van.tags
const { svg, use } = van.tags('http://www.w3.org/2000/svg')

export const Result = ({ url, title, description }: SearchResult) =>
  li(
    article(
      { class: 'search-result-single' },
      h2({ class: 'search-result-title' }, a({ href: url }, markdown(title))),
      description ? p({ class: 'search-result-preview' }, markdown(description)) : '',
    ),
  )

const SidebarResult = ({ url, title }: SearchResult) =>
  li({ class: 'sidebar-search-result-single' }, a({ href: url }, markdown(title)))

export function setupSearch(doc: Document, placement: 'main' | 'sidebar'): void {
  const container = doc.getElementById(placement === 'sidebar' ? 'sidebar-search' : 'main-search')
  if (!container) return

  container.innerHTML = ''

  van.add(
    container,
    Search(
      placement === 'sidebar'
        ? {
            classPrefix: 'sidebar-',
            container,
            page: 5,
            placeholder: 'Search',
            navigate: (terms) => window.location.replace(`/search/?q=${terms}`),
            renderResult: SidebarResult,
          }
        : {
            autofocus: true,
            defaultValue: parseQueryString().q,
            navigate: (terms) => {
              window.history.pushState(null, '', `${window.location.pathname}?q=${terms}`)
            },
            renderResult: Result,
          },
    ),
  )
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
  placeholder?: string
  navigate: (terms: string) => void
  renderResult: (props: SearchResult) => HTMLElement
}

const Search = ({
  autofocus = false,
  classPrefix = '',
  container,
  page,
  defaultValue = '',
  placeholder = 'Search this site',
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
        'aria-label': 'Search',
        autocomplete: 'off',
        autofocus,
        class: `${classPrefix}search-input`,
        name: 'q',
        placeholder,
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
          ? isLoading.val || items.val.length === 0
            ? NoResults({
                classPrefix,
                text: isLoading.val
                  ? 'Searching the site...'
                  : `No results for "${searchTermsText.val}". Try a different search.`,
              })
            : items.val.slice(0, page).map(renderResult)
          : null,
      ),
  ]
}
