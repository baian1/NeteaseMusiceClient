import ResizeObserver from "./ResizeObserver"

declare global {
  interface Window {
    AMap: any
    test: number
    ResizeObserver: typeof ResizeObserver
  }
}

export {}
