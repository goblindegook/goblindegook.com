import Barba from 'barba.js'

function delay (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const FadeTransition = Barba.BaseTransition.extend({
  async start () {
    await Promise.all([this.newContainerLoading, this.fadeOut()])
    await this.fadeIn()
  },
  async fadeOut () {
    this.oldContainer.classList.add('animated')
    this.oldContainer.classList.remove('fadeIn')
    this.oldContainer.classList.add('fadeOut')
    await delay(200)
    this.done()
  },
  async fadeIn () {
    document.body.scrollTop = 0;
    this.newContainer.classList.add('animated')
    this.newContainer.classList.add('fadeIn')
    await delay(200)
  },
})

export function setupPageTransitions (updateFns: Function[] = []) {
  Barba.Pjax.Dom.containerClass = 'transition-container'
  Barba.Pjax.Dom.wrapperId = 'transition-wrapper'
  Barba.Pjax.getTransition = () => FadeTransition
  Barba.Pjax.start()

  updateFns.forEach(fn => {
    Barba.Dispatcher.on('transitionCompleted', fn)
  })

}
