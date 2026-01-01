import type { IStaticMethods, HSOverlay } from 'flyonui/flyonui'

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods
    HSOverlay: typeof HSOverlay
  }
}

export {}
