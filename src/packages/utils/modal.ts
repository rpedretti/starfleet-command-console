import type { HSOverlay, ICollectionItem } from 'flyonui/flyonui'

export function getModalById(modalId: string) {
  if (typeof window !== 'undefined' && window.HSOverlay) {
    return (
      (
        window.HSOverlay.getInstance(
          `#${modalId}`,
          true
        ) as ICollectionItem<HSOverlay> | null
      )?.element ?? null
    )
  }

  return null
}
