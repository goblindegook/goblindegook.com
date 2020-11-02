export function fadeOut<T extends Element>(elements: T | T[]): void {
  Array<T>()
    .concat(elements)
    .forEach((element) => {
      element.classList.add('animate__animated')
      element.classList.remove('animate__fadeIn')
      element.classList.add('animate__fadeOut')
    })
}

export function fadeIn<T extends Element>(elements: T | T[]): void {
  Array<T>()
    .concat(elements)
    .forEach((element) => {
      element.classList.add('animate__animated')
      element.classList.add('animate__fadeIn')
    })
}
