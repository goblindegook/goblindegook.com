/**
 * Check for CSS1 compatibility
 */
const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat'

/**
 * Get the viewport's vertical scroll offset.
 * @return {Number} Vertical scroll offset.
 */
export function getPageYOffset (): number {
  return window.pageYOffset !== undefined ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop
}
