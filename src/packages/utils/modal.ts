import { useFlyonUi } from '@/components/FlyonUi/FlyonUiContext'
import type { HSOverlay, ICollectionItem } from 'flyonui/flyonui'

export function useModalById(modalId: string) {
  const { loaded } = useFlyonUi()
  if (loaded) {
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
