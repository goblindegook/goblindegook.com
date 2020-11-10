function isElement(element: any): element is Element {
  return element.tagName !== undefined
}

export function fadeOut<T extends Element>(elements: T | NodeListOf<T>): void {
  const collection = isElement(elements) ? [elements] : Array.from(elements)
  collection.forEach((element) => {
    element.classList.add('animate__animated')
    element.classList.remove('animate__fadeIn')
    element.classList.add('animate__fadeOut')
  })
}

export function fadeIn<T extends Element>(elements: T | NodeListOf<T>): void {
  const collection = isElement(elements) ? [elements] : Array.from(elements)
  Array.from(collection).forEach((element) => {
    element.classList.add('animate__animated')
    element.classList.add('animate__fadeIn')
  })
}

export async function delay(duration: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration))
}
