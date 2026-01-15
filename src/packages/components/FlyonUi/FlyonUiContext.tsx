'use client'

import * as React from 'react'

type FlyonUiContextValue = {
  loaded: boolean
}

export const FlyonUiContext = React.createContext<FlyonUiContextValue | null>(
  null
)

export function useFlyonUi() {
  const ctx = React.useContext(FlyonUiContext)
  if (!ctx) {
    throw new Error('useFlyonUi must be used within FlyonUiProvider')
  }
  return ctx
}
