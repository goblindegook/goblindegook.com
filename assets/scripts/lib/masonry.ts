import imagesLoaded from 'imagesloaded'
import Masonry from 'masonry-layout'

const defaultOptions = {
  columnWidth: '.masonry-column',
  gutter: '.masonry-gutter',
  percentPosition: true,
}

function hasStyleHolder(container: Element, className: string): boolean {
  return container.getElementsByClassName(className).length > 0
}

/**
 * Apply Masonry to a container.
 *
 * TODO: Reapply masonry layout on window resize or device orientation.
 *
 * @param container Container element.
 * @param options   Masonry options.
 */
export function masonry(container: Element, options = {}): void {
  if (container?.firstElementChild) {
    // Some templates already include sizing elements; avoid duplicating them.
    if (!hasStyleHolder(container, 'masonry-column')) {
      container.insertAdjacentHTML('afterbegin', '<div class="masonry-column"></div>')
    }
    if (!hasStyleHolder(container, 'masonry-gutter')) {
      container.insertAdjacentHTML('afterbegin', '<div class="masonry-gutter"></div>')
    }

    const instance = new Masonry(container, {
      ...defaultOptions,
      ...options,
    })

    imagesLoaded(container).on('progress', () => instance.layout?.())
  }
}
