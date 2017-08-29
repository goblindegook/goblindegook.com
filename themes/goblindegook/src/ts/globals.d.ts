declare module 'barba.js' {
  interface Cache {
    data: {
      [key: string]: any
    },
    set: (key: string, val: any) => void
    get: (key: string) => any
    reset: () => void
  }

  interface Dispatcher {
    readonly events: object
    on: (e: string, f: Function) => void
    off: (e: string, f: Function) => void
    trigger: (e: string) => void
  }

  interface Dom {
    containerClass: string
    currentHTML: string
    dataNameSpace: string
    wrapperId: string
    getWrapper: () => HTMLElement
  }

  interface Status {
    namespace: string
    url: string
  }

  interface HistoryManager {
    history: ReadonlyArray<Status>
    currentStatus: () => Status
    prevStatus: () => Status
  }

  interface Pjax {
    Cache: Cache
    cacheEnabled: boolean
    Dom: Dom
    History: HistoryManager
    ignoreClassLink: string
    transitionProgress: boolean
    getCurrentUrl: () => string
    getTransition: () => Transition
    goTo: (url: string) => void
    init: () => void
    preventCheck: (event: Event, element: HTMLElement) => boolean
    start: () => void
  }

  interface Prefetch {
    ignoreClassLink: string
    init: () => boolean | void
  }

  interface Transition {
    newContainer?: HTMLElement
    newContainerLoading?: Promise<HTMLElement>
    oldContainer?: HTMLElement
    done: () => void
    extend: (t: Partial<Transition>) => Transition
    start: () => void
  }

  interface Utils {
    xhrTimeout: number
    deferred: () => {
      promise: Promise<any>
      reject: Function | null
      resolve: Function | null
    }
    extend: (obj: object, props: object) => object
    getCurrentUrl: () => string
    xhr: (url: string) => Promise<string>
  }

  interface View {
    namespace?: string
    extend: (t: Partial<View>) => View
    init: () => void
    onEnter: () => void
    onEnterCompleted: () => void
    onLeave: () => void
    onLeaveCompleted: () => void
  }

  export const version: string
  export const BaseTransition: Transition
  export const BaseView: View
  export const BaseCache: Cache
  export const Dispatcher: Dispatcher
  export const HistoryManager: HistoryManager
  export const Pjax: Pjax
  export const Prefetch: Prefetch
  export const Utils: Utils
}

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

  export function element (el: HTMLElement, options?: Options): Calc
  export function text (tx: string, options?: Options): number
}

declare module 'insane' {
  interface Token {
    tag: string
    attrs: { [attr: string]: string }
  }

  interface Options {
    allowedAttributes?: { [tag: string]: string[] }
    allowedClasses?: { [tag: string]: string[] }
    allowedSchemes?: string[]
    allowedTags?: string[]
    filter?: (token: Token) => boolean
    transformText?: (text: string) => string
  }

  function insane (html: string, options?: Options, strict?: boolean): string
  
  export = insane
}

declare module 'unfetch' {
  interface Options {
    body?: FormData | JSON | Blob | ArrayBuffer | string
    credentials?: 'include'
    headers?: { [key: string]: string }
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'DELETE'
  }

  interface Headers {
    entries: [string, string][]
    keys: string[]
    get (key: string): string
    has (key: string): boolean
  }

  interface Response {
    ok: boolean
    status: number
    statusText: string
    blob (): Promise<Blob>
    clone (): Response
    json (): Promise<any>
    text (): Promise<string>
  }

  function fetch (url: string, options?: Options): Promise<Response>

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

  function littlefoot (settings?: Settings): void

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
    constructor (settings?: Settings)
    public destroy (): void
    public handleScroll (): void
    public update (): void
  }
}
