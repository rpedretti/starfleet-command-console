/// <reference types="@vitest/browser-playwright" />

declare global {
  interface Window {
    flyonUILoaded?: boolean
    flyonUIInitialized?: boolean
  }
}