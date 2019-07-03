/**
 * Trigger event.
 *
 * @param element [description]
 * @param type    [description]
 */
export function triggerEvent(
  element: HTMLElement | Window,
  type: string
): void {
  if (document.createEvent) {
    const event = document.createEvent('HTMLEvents')
    event.initEvent(type, true, false)
    element.dispatchEvent(event)
  } else {
    ;(element as any).fireEvent('on' + type)
  }
}
