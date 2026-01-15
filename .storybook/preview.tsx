import * as React from 'react'
import { definePreview } from '@storybook/nextjs-vite'
import { sb } from 'storybook/test'
import { ErrorBoundary } from './ErrorBoundary'
import { FlyonUiProvider } from '@/components/FlyonUi'
import addonA11y from '@storybook/addon-a11y'
import addonDocs from '@storybook/addon-docs'

import '../src/app/globals.css'

sb.mock('../src/lib/db.ts')
sb.mock('../src/packages/actions/createShip.ts')
sb.mock('../src/packages/actions/createOfficer.ts')
sb.mock('../src/packages/actions/assignOfficer.ts')
sb.mock('../src/packages/actions/unassignOfficer.ts')
sb.mock('../src/packages/actions/updateShipStatus.ts')

const PreventLinkNavigation = ({
  enabled = true,
  children
}: {
  enabled?: boolean
  children: React.ReactNode
}) => {
  if (!enabled) return children

  return (
    <div
      onClickCapture={(e) => {
        // If something already handled it, respect that
        if (e.defaultPrevented) return

        const target = e.target as HTMLElement
        const anchor = target.closest('a[href]')

        if (!anchor) return

        // Allow modifier keys (new tab, etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

        // 🔑 This blocks navigation but keeps all onClick handlers working
        e.preventDefault()
      }}
    >
      {children}
    </div>
  )
}

export default definePreview({
  decorators: [
    (Story, context) => {
      const isInterceptNavigation = !(
        context.parameters.disablePreventLinkNavigation ?? false
      )
      return (
        <React.Suspense>
          <ErrorBoundary key={Math.random()}>
            <PreventLinkNavigation enabled={isInterceptNavigation}>
              <FlyonUiProvider>
                <Story />
              </FlyonUiProvider>
            </PreventLinkNavigation>
          </ErrorBoundary>
        </React.Suspense>
      )
    }
  ],
  beforeEach: async ({ tags }) => {
    // Wait for FlyonUI to initialize before running tests
    // if (typeof window !== 'undefined') {
    //   await new Promise<void>((resolve) => {
    //     let attempts = 0
    //     const maxAttempts = 40 // 2 seconds max wait

    //     const checkInit = () => {
    //       if (window.flyonUIInitialized) {
    //         resolve()
    //       } else if (attempts++ < maxAttempts) {
    //         setTimeout(checkInit, 50)
    //       } else {
    //         // Timeout - continue anyway
    //         console.warn('FlyonUI initialization timeout - continuing anyway')
    //         resolve()
    //       }
    //     }
    //     checkInit()
    //   })
    // }

    // Disable animations for tests tagged with "test-fn"
    if (tags.includes('test-fn')) {
      const style = document.createElement('style')
      style.id = '__disable_animations__'
      style.innerHTML = `
      *,
      *::before,
      *::after {
        transition: none !important;
        animation: none !important;
        scroll-behavior: auto !important;
      }
    `
      document.head.appendChild(style)
    }
  },
  initialGlobals: {
    viewport: {
      value: undefined
    }
  },
  parameters: {
    nextjs: {
      appDirectory: true
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  addons: [addonA11y(), addonDocs()]
})
