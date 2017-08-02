/**
 * Create requestAnimationFrame() polyfill function.
 *
 * Creates a requestAnimationFrame()-compatible function based on setTimeout().
 *
 * @param  {Number}   fps Frames per second (defaults to 60).
 * @return {Function}     requestAnimationFrame() polyfill.
 */
function createRequestFrame (fps = 60): (cb: FrameRequestCallback) => number {
  const tick = 1000 / fps
  let progress = 0

  /**
   * requestAnimationFrame() polyfill.
   *
   * @param  {Function} cb Callback to invoke on every tick.
   * @return {Number}      Timeout ID.
   */
  return (cb) => {
    const now = new Date().getTime()
    const wait = Math.max(0, progress + tick - now)
    const id = window.setTimeout(() => cb(now + wait), wait)
    progress = now + wait
    return id
  }
}

export const requestFrame = window.requestAnimationFrame
  || (window as any).msRequestAnimationFrame
  || (window as any).mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || (window as any).oRequestAnimationFrame
  || createRequestFrame()
