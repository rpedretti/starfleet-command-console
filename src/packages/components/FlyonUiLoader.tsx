// FlyonuiScript.tsx
'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

// Optional third-party libraries
async function loadFlyonUI() {
  await import('flyonui/flyonui')
}

export function FlyonUiLoader() {
  const path = usePathname()

  React.useEffect(() => {
    const initFlyonUI = async () => {
      await loadFlyonUI()
    }

    void initFlyonUI()
  }, [])

  React.useEffect(() => {
    setTimeout(() => {
      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit()
      }
    }, 100)
  }, [path])

  return null
}
