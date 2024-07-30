import van from 'vanjs-core'
import { getCachedUrls } from './lib/offline'
import { Result } from './search-main'

const { ul } = van.tags

type Page = {
  title: string
  url: URL | string
}

type OfflinePageListProps = {
  urls?: readonly URL[]
}

const OfflinePageList = async ({ urls }: OfflinePageListProps) => {
  const items = van.state<Page[]>([])

  for (const url of urls) {
    const response = await fetch(url)
    if (response.ok) {
      const content = await response.text()
      const container = document.createElement('div')
      container.innerHTML = content
      const title = container.querySelector('title')?.innerHTML
      items.val.push({ title, url })
      container.remove()
    }
  }

  return ul({ class: 'search-results' }, items.val.map(Result))
}

export async function setupOffline(cacheKey: string) {
  const cachedUrls = await getCachedUrls(cacheKey)
  const urls = cachedUrls
    .map((url) => new URL(url))
    .filter(
      (url) =>
        url.pathname.endsWith('/') &&
        url.search.length === 0 &&
        !['/', '/offline/'].includes(url.pathname),
    )
    .sort()

  const container = document.getElementById('available-offline')
  container.innerHTML = ''
  if (container) {
    van.add(container, await OfflinePageList({ urls }))
  }
}
