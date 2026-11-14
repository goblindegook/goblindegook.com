import { onLoad, type UnloadCallback } from './scripts/load'
import { setup } from './scripts/site'
import { navigateTo, shouldSkipTransition } from './scripts/transitions'

let cleanup: UnloadCallback = () => {}

function initialize() {
  const container = document.querySelector<HTMLElement>('[data-transition="container"]')
  setup()
  cleanup = onLoad(container, container?.dataset.transitionNamespace)
}

if (document.readyState === 'complete') initialize()
else window.addEventListener('load', initialize, { once: true })

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
