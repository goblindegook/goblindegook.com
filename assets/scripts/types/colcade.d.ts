declare module 'colcade' {
  export interface ColcadeOptions {
    columns: string
    items: string
  }

  export default class Colcade {
    constructor(element: Element, options: ColcadeOptions)
    destroy(): void
  }
}
