import Barba, { Transition } from 'barba.js'

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface FadeTransition extends Transition {
  fadeIn: () => Promise<void>
  fadeOut: () => Promise<void>
}

const FadeTransition = Barba.BaseTransition.extend<FadeTransition>({
  async start() {
    await this.newContainerLoading
    await this.fadeOut()
    this.done()
    window.scrollTo(0, 0)
    await this.fadeIn()
  },

  async fadeOut() {
    this.oldContainer.classList.add('animated')
    this.oldContainer.classList.remove('fadeIn')
    this.oldContainer.classList.add('fadeOut')
    await delay(200)
  },

  async fadeIn() {
    this.newContainer.classList.add('animated')
    this.newContainer.classList.add('fadeIn')
    await delay(200)
  }
})

export function setupPageTransitions(updateFns: (() => void)[] = []) {
  Barba.Pjax.Dom.containerClass = 'transition-container'
  Barba.Pjax.Dom.wrapperId = 'transition-wrapper'
  Barba.Pjax.getTransition = () => FadeTransition
  Barba.Pjax.start()

  updateFns.forEach(fn => {
    Barba.Dispatcher.on('transitionCompleted', fn)
  })
}
