// FlyonUiProvider.tsx
'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { FlyonUiContext } from './FlyonUiContext'

async function loadFlyonUI() {
  await import('flyonui/flyonui')
}

export function FlyonUiProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = React.useState(false)

  const path = usePathname()
  const initializedRef = React.useRef(false)

  // 1️⃣ Load FlyonUI once
  React.useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    void loadFlyonUI()
  }, [])

  // 2️⃣ Observe HSOverlay availability + re-init on route change
  React.useEffect(() => {
    let cancelled = false

    const tryAutoInit = () => {
      if (cancelled) return false

      if (window.HSOverlay?.autoInit) {
        window.HSOverlay.autoInit()
        setLoaded(true)
        return true
      }
      return false
    }

    // Try immediately (covers fast loads + route changes)
    if (tryAutoInit()) return

    // Observe assignment to window.HSOverlay
    let currentValue = window.HSOverlay

    Object.defineProperty(window, 'HSOverlay', {
      configurable: true,
      get() {
        return currentValue
      },
      set(value) {
        currentValue = value
        tryAutoInit()
      }
    })

    return () => {
      cancelled = true
    }
  }, [path])

  return (
    <FlyonUiContext.Provider value={{ loaded }}>
      {children}
    </FlyonUiContext.Provider>
  )
}
