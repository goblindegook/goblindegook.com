import LazyLoad from 'vanilla-lazyload'

export function setupLazyLoad(parent: ParentNode) {
  Array.from(parent.querySelectorAll<HTMLElement>('img.lazy')).forEach(
    (item) => {
      item.style.display = 'inline'
    }
  )

  return new LazyLoad({
    elements_selector: '.lazy',
  }).update
}
