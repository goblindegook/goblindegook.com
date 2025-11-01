import { onFirstLoad } from './scripts/load'
import { navigateTo, shouldSkipTransition } from './scripts/transitions'

document.addEventListener('click', (event: PointerEvent) => {
  const anchor = (event.target as Element | null)?.closest('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) return

  const url = new URL(anchor.href, window.location.href)

  if (shouldSkipTransition(event, anchor, url)) return

  event.preventDefault()
  navigateTo(url.href)
})

window.addEventListener('popstate', () => {
  navigateTo(window.location.href, { updateHistory: false })
})

window.addEventListener('load', async () => {
  const container = document.querySelector<HTMLElement>('[data-transition="container"]')
  await onFirstLoad(container, container?.dataset.transitionNamespace)
})
