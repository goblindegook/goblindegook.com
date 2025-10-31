export function replaceFrom(source: Document, selector: string, targetSelector?: string): void {
  const element = source.querySelector(selector)
  if (element) {
    const target = document.querySelector(targetSelector ?? selector)
    target?.parentNode?.replaceChild(element, target)
  }
}
