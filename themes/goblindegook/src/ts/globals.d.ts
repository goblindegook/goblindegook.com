declare module 'barba.js' {
  interface Cache {
    data: {
      [key: string]: any
    }
    set: (key: string, val: any) => void
    get: (key: string) => any
    reset: () => void
  }

  type LinkClickedHandler = (element?: HTMLElement, event?: MouseEvent) => void
  type InitStateChangeHandler = (currentStatus?: Status) => void
  type NewPageReadyHandler = (
    currentStatus?: Status,
    prevStatus?: Status,
    container?: HTMLElement,
    newPageRawHTML?: string
  ) => void
  type TransitionCompletedHandler = (
    currentStatus?: Status,
    prevStatus?: Status
  ) => void

  interface Dispatcher {
    readonly events: object
    on: (
      e: string,
      f:
        | LinkClickedHandler
        | InitStateChangeHandler
        | NewPageReadyHandler
        | TransitionCompletedHandler
    ) => void
    off: (
      e: string,
      f:
        | LinkClickedHandler
        | InitStateChangeHandler
        | NewPageReadyHandler
        | TransitionCompletedHandler
    ) => void
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
    history: readonly Status[]
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
    newContainer: HTMLElement
    newContainerLoading: Promise<HTMLElement>
    oldContainer: HTMLElement
    done: () => void
    extend: <T extends Transition>(t: Partial<T>) => T
    start: () => Promise<void>
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
    extend: <T extends View>(t: Partial<T>) => T
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

declare module 'quicklink' {
  interface TimeoutOptions {
    timeout?: number
  }

  interface IdleDeadline {
    didTimeout: boolean
  }

  interface Options {
    el?: HTMLElement
    limit?: number
    throttle?: number
    timeout?: number
    timeoutFn?: (
      fn: (deadline: IdleDeadline) => void,
      options: TimeoutOptions
    ) => void
    priority?: boolean
    origins?: string[]
    ignores?: RegExp | string[] | ((url: string) => boolean)
    onError?: (error: Error) => void
  }

  export function listen(options?: Options): () => void
  export function prefetch(
    urls: string | string[],
    isPriority?: boolean
  ): Promise<void>
}
