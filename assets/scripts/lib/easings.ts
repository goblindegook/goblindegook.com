export type EasingFunction = (t: number) => number

export const linear: EasingFunction = (t) => t
export const easeInQuadratic: EasingFunction = (t) => t ** 2
export const easeOutQuadratic: EasingFunction = (t) => (t - 1) ** 2 + 1
export const easeInOutQuadratic: EasingFunction = (t) => (t < 0.5 ? t ** 2 * 4 : (t - 1) ** 2 * 4 + 1)
export const easeInCubic: EasingFunction = (t) => t ** 3
export const easeOutCubic: EasingFunction = (t) => (t - 1) ** 3 + 1
export const easeInOutCubic: EasingFunction = (t) => (t < 0.5 ? t ** 3 * 4 : (t - 1) ** 3 * 4 + 1)
