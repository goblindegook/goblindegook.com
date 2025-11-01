import { onFirstLoad, type UnloadCallback } from './scripts/load'
import { navigateTo, shouldSkipTransition } from './scripts/transitions'

let cleanup: UnloadCallback = () => {}

window.addEventListener('load', async () => {
  const container = document.querySelector<HTMLElement>('[data-transition="container"]')
  cleanup = onFirstLoad(container, container?.dataset.transitionNamespace)
})

document.addEventListener('click', async (event: PointerEvent) => {
  const anchor = (event.target as Element | null)?.closest('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) return

  const url = new URL(anchor.href, window.location.href)

  if (shouldSkipTransition(event, anchor, url)) return

  event.preventDefault()
  cleanup()
  cleanup = await navigateTo(url.href)
})

window.addEventListener('popstate', async () => {
  cleanup()
  cleanup = await navigateTo(window.location.href, { updateHistory: false })
})
