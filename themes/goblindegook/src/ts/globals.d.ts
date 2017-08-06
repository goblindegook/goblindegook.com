declare module 'estimate' {
  interface Options {
    spaces: RegExp
    speed: number
  }

  interface Calc {
    progress: number
    remaining: number
    total: number
    initialize: () => void
    update: () => void
  }

  export function element(el: HTMLElement): Calc
  export function element(el: HTMLElement, options: Options): Calc
  export function text(tx: string): number
  export function text(tx: string, options: Options): number
}

declare module 'unfetch' {
  interface Options {
    body?: FormData | JSON | Blob | ArrayBuffer | string
    credentials?: "include"
    headers?: { [key: string]: string }
    method?: "GET" | "POST" | "PUT" | "PATCH" | "HEAD" | "OPTIONS" | "DELETE"
  }

  interface Headers {
    entries: [string, string][]
    keys: string[]
    get(key: string): string
    has(key: string): boolean
  }

  interface Response {
    ok: boolean
    status: number
    statusText: string
    blob(): Promise<Blob>
    clone(): Response
    json(): Promise<any>
    text(): Promise<string>
  }

  function fetch(url: string, options?: Options): Promise<Response>

  export = fetch
}

declare module 'littlefoot' {
  interface Settings {
    activateCallback?: (element: HTMLElement, button: HTMLElement) => any
    activateDelay?: number
    activateOnHover?: boolean
    allowDuplicates?: boolean
    allowMultiple?: boolean
    anchorParentSelector?: string
    anchorPattern?: RegExp,
    buttonTemplate?: string
    contentTemplate?: string
    dismissDelay?: number
    dismissOnUnhover?: boolean
    footnoteParentClass?: string
    footnoteSelector?: string
    hoverDelay?: number
    numberResetSelector?: string
    scope?: string
  }

  function littlefoot(): void
  function littlefoot(settings: Settings): void

  export = littlefoot
}

declare module 'vanilla-lazyload' {
  interface Settings {
    class_error?: string
    class_initial?: string
    class_loaded?: string
    class_loading?: string
    container?: HTMLElement | Window
    data_src?: string
    data_srcset?: string
    elements_selector?: string
    skip_invisible?: boolean
    threshold?: number
    throttle?: number
    callback_error?: (element: HTMLElement) => any
    callback_load?: (element: HTMLElement) => any
    callback_processed?: (count: number) => any
    callback_set?: (element: HTMLElement) => any
  }

  export default class LazyLoad {
    constructor()
    constructor(settings: Settings)
    public destroy(): void
    public handleScroll(): void
    public update(): void
  }
}
