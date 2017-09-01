import Barba from 'barba.js'

function delay (ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

const FadeTransition = Barba.BaseTransition.extend({
  async start () {
    await this.newContainerLoading
    await this.fadeOut()
    this.done()
    document.body.scrollTop = 0
    await this.fadeIn()
  },
  async fadeOut () {
    this.oldContainer.classList.add('animated')
    this.oldContainer.classList.remove('fadeIn')
    this.oldContainer.classList.add('fadeOut')
    await delay(200)
  },
  async fadeIn () {
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
