import { scrollToTarget } from './scrollToTarget'

/**
 * Checks if the target document matches the current document.
 * @param  target   Anchor node.
 * @param  location Document location.
 * @return          Whether target and document match.
 */
function targetMatchesLocation (target: HTMLAnchorElement, location: Location): boolean {
  return location.hostname === target.hostname &&
    location.pathname.replace(/^\//, '') === target.pathname.replace(/^\//, '')
}

/**
 * Target is valid.
 *
 * @param  target Anchor node.
 * @return        Whether target should start an animation.
 */
function targetIsValid (target: HTMLAnchorElement): boolean {
  return !!target.closest('main') && !!document.querySelector(target.hash)
}

export function hashClickHandler (event: MouseEvent): void {
  const anchor = event.target as HTMLAnchorElement
  if (targetMatchesLocation(anchor, location) && targetIsValid(anchor)) {
    event.preventDefault()
    scrollToTarget(anchor.hash, 0, () => {
      location.hash = anchor.hash
    })
  }
}

export function hashChangeHandler (event: HashChangeEvent | Event): void {
  scrollToTarget(location.hash, 0)
}
