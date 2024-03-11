import van from 'vanjs-core'
import { SearchResult } from './lib/search'
import { Markdown, Search } from './search-components'

const { li, a } = van.tags

const Result = ({ url, title }: SearchResult) =>
  li(
    { class: 'sidebar-search-result-single' },
    a({ href: url }, Markdown(title)),
  )

export async function setupSidebarSearch(): void {
  const container = document.getElementById('sidebar-search')
  if (container) {
    van.add(
      container,
      await Search({
        classPrefix: 'sidebar-',
        container,
        page: 5,
        navigate: (terms) => window.location.replace(`/search/?q=${terms}`),
        renderResult: Result,
      }),
    )
  }
}
