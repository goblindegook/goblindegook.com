import { getPageYOffset } from './window/pageYOffset'
import { scrollTo } from './scrollTo'

/**
 * Scroll smoothly to target, accounting for header height.
 *
 * @param target   Link or hash target.
 * @param offset   Vertical pixel offset.
 * @param complete Completion callback.
 */
function scrollToTarget(
  target: string | HTMLElement,
  offset: number,
  complete?: () => void
): void {
  if (target) {
    const targetEl =
      typeof target === 'string' ? document.querySelector(target) : target

    if (targetEl && targetEl.getBoundingClientRect) {
      const position =
        targetEl.getBoundingClientRect().top + getPageYOffset() - offset
      scrollTo(position, 1000, complete)
    }
  }
}

/**
 * Checks if the target document matches the current document.
 * @param  target   Anchor node.
 * @param  location Document location.
 * @return          Whether target and document match.
 */
function targetMatchesLocation(
  target: HTMLAnchorElement,
  location: Location
): boolean {
  return (
    location.hostname === target.hostname &&
    location.pathname.replace(/^\//, '') === target.pathname.replace(/^\//, '')
  )
}

/**
 * Target is valid.
 *
 * @param  target Anchor node.
 * @return        Whether target should start an animation.
 */
function targetIsValid(target: HTMLAnchorElement): boolean {
  return !!target.closest('main') && !!document.querySelector(target.hash)
}

export function hashClickHandler(event: MouseEvent): void {
  const anchor = event.target as HTMLAnchorElement
  if (targetMatchesLocation(anchor, window.location) && targetIsValid(anchor)) {
    event.preventDefault()
    scrollToTarget(anchor.hash, 0, () => {
      window.location.hash = anchor.hash
    })
  }
}

export function hashChangeHandler(): void {
  scrollToTarget(window.location.hash, 0)
}
