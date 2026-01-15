import { fn } from 'storybook/test'
import type { ShipStatus } from '@/prisma/enums'

export const updateShipStatus = fn(
  async (_registry: string, _status: ShipStatus) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
)
