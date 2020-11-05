/**
 * Check for CSS1 compatibility
 */
const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat'

/**
 * Get the viewport's vertical scroll offset.
 * @return {Number} Vertical scroll offset.
 */
export function getPageYOffset(): number {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : isCSS1Compat
    ? document.documentElement.scrollTop
    : document.body.scrollTop
}

/**
 * Get the viewport's vertical scroll offset.
 *
 * @param offset Vertical scroll offset.
 */
export function setPageYOffset(offset: number): void {
  if (document.documentElement && document.documentElement.scrollTop != null) {
    document.documentElement.scrollTop = offset
  }

  if (document.body && document.body.scrollTop != null) {
    document.body.scrollTop = offset
  }
}
