/**
 * Get the viewport's vertical scroll offset.
 * 
 * @param offset Vertical scroll offset.
 */
export function setPageYOffset (offset: number): void {
  if (document.documentElement && document.documentElement.scrollTop != null) {
    document.documentElement.scrollTop = offset
  }

  if (document.body && document.body.scrollTop != null) {
    document.body.scrollTop = offset
  }
}
