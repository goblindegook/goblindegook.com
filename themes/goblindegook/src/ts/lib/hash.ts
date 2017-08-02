/**
 * Checks if the target document matches the current document.
 * @param  target   Anchor node.
 * @param  location Document location.
 * @return          Whether target and document match.
 */
export function targetMatchesLocation (target: HTMLAnchorElement, location: Location): boolean {
  return location.hostname === target.hostname &&
    location.pathname.replace(/^\//, '') === target.pathname.replace(/^\//, '')
}

/**
 * Target is valid.
 *
 * @param  target Anchor node.
 * @return        Whether target should start an animation.
 */
export function targetIsValid (target: HTMLAnchorElement): boolean {
  return !!target.closest('main') && !!document.querySelector(target.hash)
}
