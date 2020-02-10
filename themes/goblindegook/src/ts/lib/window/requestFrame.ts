/**
 * Create requestAnimationFrame() polyfill function.
 *
 * Creates a requestAnimationFrame()-compatible function based on setTimeout().
 */
function createRequestFrame(fps = 60): (cb: FrameRequestCallback) => number {
  const tick = 1000 / fps
  let progress = 0

  return frameRequestCallback => {
    const now = new Date().getTime()
    const wait = Math.max(0, progress + tick - now)
    const id = window.setTimeout(() => frameRequestCallback(now + wait), wait)
    progress = now + wait
    return id
  }
}

export const requestFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  (window as any).msRequestAnimationFrame ||
  (window as any).mozRequestAnimationFrame ||
  (window as any).oRequestAnimationFrame ||
  createRequestFrame()
