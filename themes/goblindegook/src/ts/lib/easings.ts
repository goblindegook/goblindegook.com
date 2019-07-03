export type EasingFunction = (t: number) => number

export const linear: EasingFunction = t => t
export const easeInQuadratic: EasingFunction = t => Math.pow(t, 2)
export const easeOutQuadratic: EasingFunction = t => Math.pow(t - 1, 2) + 1
export const easeInOutQuadratic: EasingFunction = t =>
  t < 0.5 ? Math.pow(t, 2) * 4 : Math.pow(t - 1, 2) * 4 + 1
export const easeInCubic: EasingFunction = t => Math.pow(t, 3)
export const easeOutCubic: EasingFunction = t => Math.pow(t - 1, 3) + 1
export const easeInOutCubic: EasingFunction = t =>
  t < 0.5 ? Math.pow(t, 3) * 4 : Math.pow(t - 1, 3) * 4 + 1
