/**
 * Get the total top and bottom margin height for the provided DOM element.
 *
 * @param  element DOM element.
 * @return         Top and bottom margin height.
 */
function getMarginHeight (element: HTMLElement): number {
  const style = (element as any).currentStyle || window.getComputedStyle(element)
  return parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10)
}

/**
 * Calculate a DOM element's total height.
 *
 * @param  element       DOM element.
 * @param  includeMargin Include the top and bottom margins.
 * @return               The DOM element's total height.
 */
export function outerHeight (element: HTMLElement, includeMargin = false): number {
  const marginHeight = element && includeMargin ? getMarginHeight(element) : 0
  return (element && element.offsetHeight || 0) + marginHeight
}
